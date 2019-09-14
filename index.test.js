import test from 'ava'

const re = require('./index');

test('parseText()', (t) => {
  t.deepEqual(re.parseText('name'), {name: 'name', dateStr: undefined});
  t.deepEqual(re.parseText('name r 10:00'), {name: 'name', dateStr: '10:00'});
});

test('expandMin()', (t) => {
  t.is(re.expandMin('in 5 mins'), 'in 5 minutes');
  t.is(re.expandMin('in 5 min'), 'in 5 minutes');
});

test('addDefaultTime()', (t) => {
  t.is(re.addDefaultTime('tomorrow'), 'tomorrow 8:00');
  t.is(re.addDefaultTime('next monday'), 'next monday 8:00');
  t.is(re.addDefaultTime('on 15th'), 'on 15th 8:00');

  // exception
  t.is(re.addDefaultTime('11:00'), '11:00');
  t.is(re.addDefaultTime('tomorrow 11:00'), 'tomorrow 11:00');
  t.is(re.addDefaultTime('next monday 11:00'), 'next monday 11:00');
  t.is(re.addDefaultTime('in 5 minutes'), 'in 5 minutes');
});