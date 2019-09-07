const runJxa = require('run-jxa');
const Sugar = require('sugar-date');
Sugar.Date.extend();

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

(async () => {
  const args = process.argv.slice(2);
  const texts = args[0].split(' r ');
  const name = texts[0];
  const date = (texts.length > 1) ? Date.create(texts[1]) : null;
  const result = await runJxa(addToReminders, [name, date]);

  if (result == 'succeed') {
    // TODO add notification
  }
})();
