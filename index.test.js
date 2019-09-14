import test from 'ava'

const re = require('./index');

test('parseText()', (t) => {
  t.deepEqual(re.parseText('name'), {name: 'name', dateStr: undefined});
  t.deepEqual(re.parseText('name r in 5 mins'), {name: 'name', dateStr: 'in 5 minutes'});
  t.deepEqual(re.parseText('name r in 5 min'), {name: 'name', dateStr: 'in 5 minutes'});
});

test('addDefaultTime()', (t) => {
  t.is(re.addDefaultTime(''), '');
  t.is(re.addDefaultTime('tomorrow'), 'tomorrow 8:00');
  t.is(re.addDefaultTime('next monday'), 'next monday 8:00');
  t.is(re.addDefaultTime('on 15th'), 'on 15th 8:00');

  // exception
  t.is(re.addDefaultTime('11:00'), '11:00');
  t.is(re.addDefaultTime('tomorrow 11:00'), 'tomorrow 11:00');
  t.is(re.addDefaultTime('next monday 11:00'), 'next monday 11:00');
  t.is(re.addDefaultTime('in 5 minutes'), 'in 5 minutes');
});