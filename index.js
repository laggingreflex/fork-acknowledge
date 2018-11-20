const crypto = require('crypto');
const symbol = '__fork-acknowledge__';

const uid = () => crypto.randomBytes(16).toString('base64');

const queue = {};

const on = process => fn => process.on('message', async message => {
  if (!message || message.symbol !== symbol) { return; }
  try {
    message.result = await fn(...message.args);
  } catch (error) {
    message.error = { message: error.message, stack: error.stack };
  }
  process.send(message);
});

const send = process => {
  process.on('message', message => {
    if (!message || message.symbol !== symbol) { return; }
    const { id, result, error } = message;
    if (!queue[id]) return;
    const { resolve, reject } = queue[id];
    delete queue[id];
    if (error) {
      const e = new Error(error.message);
      e.stack = error.stack;
      reject(e);
    } else {
      resolve(result);
    }
  });
  return (...args) => {
    const id = uid();
    process.send({ symbol, id, args });
    return new Promise((resolve, reject) => {
      queue[id] = { resolve, reject };
    });
  };
}

module.exports = process => ({ on: on(process), send: send(process) });
