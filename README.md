# fork-acknowledge

Get acknowledgements back from messages sent to forked processes

## Install

```
npm i fork-acknowledge
```

## Usage

* **`parent`**

  ```js
  const { fork } = require('child_process')
  const fack = require('fork-acknowledge')

  const child = fork(...);
  const { send } = fack(child);

  const result = await send('message');
          └────────────────────────────────────────┐
  ```

* **`child`**

  ```js
  const fack = require('fork-acknowledge')         │
                                                   │
  const { on } = fack(process);                    │
                                                   │
  on(async message => {                            │
    return 'result' ───────────────────────────────┘
  });
  ```

### API

```js
const {send, on} = fack(process)
```

* **`process`** `[process]` - [process], or a ([forked]) [child_process] used to send, or on which to listen for, messages.

* **`send`** `[function]` - Function to send messages to **`process`**

  ```js
  const promise = send(...args)
  ```

  * **`promise`** `[promise]` - Resolves (or rejects) when the corresponding¹ **`on`** method on the **`process`** returns (or throws).
  * **`promise.off`** `[function]` - Special function attached to the promise, to remove the `process.on()` event listener created by **`send`**, which otherwise is automatically removed upon the **`promise`**'s resolution/rejection.
  * **`args`** `[array]` - Message arguments to be sent.

* **`on`** `[function]` - Function to receive messages from **`process`**

  ```js
  const off = on(fn)
  ```

  * **`off`** `[function]` - Function to remove the event listener after which **`fn`** will no longer be called.
  * **`fn`** `[function]` - Function that gets called when a message is received. It's the return value (or error in case it throws) of this function that's used to resolve or reject the corresponding¹ **`promise`**. Correspondence is maintained by sending/receiving a unique id (generated using [crypto]).

[child_process]: https://nodejs.org/api/child_process.html
[forked]: https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
[process]: https://nodejs.org/api/process.html
[crypto]: https://nodejs.org/api/crypto.html
