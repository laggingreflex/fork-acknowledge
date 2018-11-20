const crypto = require('crypto');
const symbol = '__fork-acknowledge__';

const send = (process, opts = {}) => (...args) => {
  const id = crypto.randomBytes(16).toString('base64');
  const promise = { id };
  let off;
  const on = message => {
    if (!message || message.symbol !== symbol) { return; }
    const { id, result, error } = message;
    if (promise.id !== id) return;
    delete promise[id];
    if (error) {
      const e = new Error(error.message);
      e.stack = error.stack;
      promise.reject(e);
    } else {
      promise.resolve(result);
    }
    off();
  };
  process.on('message', on);
  off = () => process.off('message', on);
  process.send({ symbol, id, args });
  return new Promise((resolve, reject) => {
    Object.assign(promise, { resolve, reject });
  });
}

const on = (process, opts = {}) => fn => {
  const on = async message => {
    if (!message || message.symbol !== symbol) { return; }
    try {
      message.result = await fn(...message.args);
    } catch (error) {
      message.error = { message: error.message, stack: error.stack };
    }
    process.send(message);
  };
  process.on('message', on);
  return () => process.off('message', on);
};

module.exports = (process, opts) => ({ send: send(process, opts), on: on(process, opts) });
