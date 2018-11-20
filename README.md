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

