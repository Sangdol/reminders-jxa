import test from 'ava'

const re = require('./index');

test('Text parse', (t) => {
  t.deepEqual(re.parseText('name'), {name: 'name', dateStr: undefined});
  t.deepEqual(re.parseText('name r in 5 mins'), {name: 'name', dateStr: 'in 5 minutes'});
  t.deepEqual(re.parseText('name r in 5 min'), {name: 'name', dateStr: 'in 5 minutes'});
});