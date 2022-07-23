Reminders JXA
===

Quickly and easily add items to your macOS Reminders lists.

Installation
===

```sh
npm install
```

Usage
===

### Adding an item to the default list

By default, the application adds a new item to the `Todos` list.

For example,
```sh
node index.js --text 'run'
```

### Adding an item to the default list with a date string

`r` is used as a separator between a text and a date string.

For example,
```sh
node index.js --text 'run r 11:00'
node index.js --text 'run r tomorrow 11:00'
node index.js --text 'run r 11th 11:00'
node index.js --text 'run r in 5 minutes'

# 08:00 is the default time when there's no time specified
node index.js --text 'run r tomorrow'
```

[sugarjs](https://sugarjs.com) is used to parse a date string.
You can find more date format examples in
[the sugarjs Parsing section](https://sugarjs.com/dates/#/Parsing)

### Adding an item to a specific list

You can use a `--list` argument to specify the list name.

For example,
```sh
node index.js --text 'run r 11th 11:00' --list Work
```

Alfred integration
===

If you're an [Alfred Powerpack](https://www.alfredapp.com/powerpack/) user, you can add items via Alfred by creating your own workflow.

Check out [the Alfred Run Script Action page](https://www.alfredapp.com/help/workflows/actions/run-script/) for more information.

License
===

MIT
