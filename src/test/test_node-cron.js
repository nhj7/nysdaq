var cron = require('node-cron');

cron.schedule('* * * * * *', () => {
  console.log('running a task every minute 1');
});

cron.schedule('*/3 * * * * *', () => {
    console.log('running a task every minute 2');
});