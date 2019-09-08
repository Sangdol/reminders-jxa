const runJxa = require('run-jxa');

// https://sugarjs.com/dates/#/Parsing
const Sugar = require('sugar-date');
Sugar.Date.extend();  // To use Sugar functions with native JS objects.

function addToReminders(name, dueDate) {
  const reminders = Application('Reminders');
  reminders.includeStandardAdditions = true

  const reminderProps = dueDate ?
    {name, dueDate: new Date(dueDate)} :
    {name};

  const newReminder = reminders.Reminder(reminderProps);
  reminders.lists.byName('Todos').reminders.push(newReminder);

  // TODO return an error message if an error occurs.
  return 'succeed';
}

function parseText(args) {
  const texts = args.split(' r ');
  const name = texts[0];
  let dateStr = (texts.length > 1) ? texts[1] : undefined;

  if (dateStr) {
    dateStr = dateStr.replace(/min(s)*/, 'minutes');
  }

  return {name, dateStr};
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

  const texts = args[0].split(' r ');
  const name = texts[0];
  const date = (texts.length > 1) ? Date.create(texts[1]) : null;

  const result = await runJxa(addToReminders, [name, date]);

  if (result == 'succeed') {
    // TODO add notification
  }
})();

module.exports = { parseText };