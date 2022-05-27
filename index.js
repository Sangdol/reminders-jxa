const runJxa = require('run-jxa');

// https://sugarjs.com/dates/#/Parsing
const Sugar = require('sugar-date');
Sugar.Date.extend();  // To use Sugar functions with native JS objects.

// https://github.com/chbrown/osx-notifier
const notify = require('osx-notifier');

function addToReminders(listName, name, remindMeDate) {
  try {
    const reminders = Application('Reminders');
    reminders.includeStandardAdditions = true

    const reminderProps = remindMeDate ?
      {name, remindMeDate: new Date(remindMeDate)} :
      {name};

    const newReminder = reminders.Reminder(reminderProps);
    reminders.lists.byName(listName).reminders.push(newReminder);

    return 'succeeded';
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

  // If it takes 'Mon' on Tue it regards it as yesterday.
  // For a reminder, a user always want to set it for the future.
  if (date < Date.now()) {
    date = date.addDays(7);
  }

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

function eveningToTime(dateStr) {
  const eveningTime = '20:00'
  return dateStr.replace('evening', eveningTime);
}

function addDefaultTime(dateStr) {
  if (dateStr.startsWith('in') || dateStr.includes(':')) return dateStr;

  const defaultTime = '8:00';

  return `${dateStr} ${defaultTime}`;
}

function adjustDateStr(dateStr) {
  if (!dateStr) return dateStr;

  console.log(`Initial dateStr: ${dateStr}`);

  dateStr = expandMin(dateStr);
  dateStr = eveningToTime(dateStr);
  dateStr = addDefaultTime(dateStr);

  console.log(`Final dateStr: ${dateStr}`);

  return dateStr;
}

(async () => {
  const args = require('minimist')(process.argv.slice(2));
  const text = args.text
  const listName = args.list || 'Todos';

  console.log(`Adding ${text} to ${listName}`);

  const usage = `
  Usage: node index.js 'name r time and date'

  e.g.,
  node index.js --text 'run'
  node index.js --text 'run r 11:00'
  node index.js --text 'run r tomorrow 11:00'
  node index.js --text 'run r 11th 11:00'
  node index.js --text 'run r 11th 11:00' --list English
  `;

  if (args.length == 0) {
    console.log(usage);
    process.exit();
  }

  const {name, dateStr} = parseText(text);
  const date = parseDate(adjustDateStr(dateStr));

  // Send notification first as it takes long to wait.
  notify({
    type: 'pass',
    title: `New Todo: ${name}`,
    message: date ? date.full() : 'Yeah!',
    group: 'reminders-jxa'
  });

  const result = await runJxa(addToReminders, [listName, name, date]);
  console.log(result);

  if (result != 'succeeded') {
    notify({
      type: 'fail',
      title: 'Failed to add a new reminder.',
      message: result,
      group: 'reminders-jxa'
    });
  }
})();

module.exports = { parseText, expandMin, eveningToTime, addDefaultTime };
