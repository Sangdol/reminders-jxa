const runJxa = require('run-jxa');

// https://sugarjs.com/dates/#/Parsing
const Sugar = require('sugar-date');
Sugar.Date.extend();  // To use Sugar functions with native JS objects.

// https://github.com/chbrown/osx-notifier
const notify = require('osx-notifier');

function addToReminders(name, remindMeDate) {
  try {
    const reminders = Application('Reminders');
    reminders.includeStandardAdditions = true

    const reminderProps = remindMeDate ?
      {name, remindMeDate: new Date(remindMeDate)} :
      {name};

    const newReminder = reminders.Reminder(reminderProps);
    reminders.lists.byName('Todos').reminders.push(newReminder);

    return 'succeed';
  } catch (e) {
    return e.message;
  }
}

function parseText(args) {
  const texts = args.split(' r ');
  const name = texts[0];
  let dateStr = (texts.length > 1) ? texts[1] : undefined;


  return {name, dateStr};
}

function parseDate(dateStr) {
  if (!dateStr) return null;

  let date = Date.create(dateStr);
  if (date.toString() == 'Invalid Date') {
    notify({
      type: 'fail',
      title: `Fail to parse the date string.`,
      message: dateStr,
      group: 'reminders-jxa'
    });
    return null
  } else {
    return date;
  }
}

function expandMin(dateStr) {
  return dateStr.replace(/min(s)*/, 'minutes');
}

function addDefaultTime(dateStr) {
  if (dateStr.startsWith('in') || dateStr.includes(':')) return dateStr;

  const defaultTime = '8:00';

  return `${dateStr} ${defaultTime}`;
}

function adjustDateStr(dateStr) {
  if (!dateStr) return dateStr;

  dateStr = expandMin(dateStr);
  dateStr = addDefaultTime(dateStr);
  return dateStr;
}

(async () => {
  const args = process.argv.slice(2);
  const usage = `
  Usage: node index.js 'name r time and date'

  e.g.,
  node index.js 'run'
  node index.js 'run r 11:00'
  node index.js 'run r tomorrow 11:00'
  node index.js 'run r 11th 11:00'
  `;

  if (args.length == 0) {
    console.log(usage);
    process.exit();
  }

  const {name, dateStr} = parseText(args[0]);
  const date = parseDate(adjustDateStr(dateStr));

  const result = await runJxa(addToReminders, [name, date]);
  console.log(result);

  if (result == 'succeed') {
    notify({
      type: 'pass',
      title: `New Todo: ${name}`,
      message: date ? date.full() : 'Yeah!',
      group: 'reminders-jxa'
    });
  } else {
    notify({
      type: 'fail',
      title: 'Failed to add a new reminder.',
      message: result,
      group: 'reminders-jxa'
    });
  }
})();

module.exports = { parseText, expandMin, addDefaultTime };