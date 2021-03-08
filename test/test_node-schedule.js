var cron = require('node-schedule');

cron.scheduleJob('* * * * * *', () => {
  console.log('running a task every minute 1');
});

cron.scheduleJob('*/3 * * * * *', () => {
    console.log('running a task every minute 1');
  });