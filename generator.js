var faker = require("faker");
var CronJob = require("cron").CronJob;
var queue = "fakequeue";
var open = require("amqplib").connect("amqp://guest:guest@35.242.245.169:5672");

const job = new CronJob("0 */2 * * * *", function () {
  var randomEmail = faker.internet.email();
  console.log(randomEmail);

  open
    .then(function (conn) {
      return conn.createChannel();
    })
    .then(function (ch) {
      return ch.assertQueue(queue).then(function (ok) {
        console.log(ok);
        return ch.sendToQueue(queue, Buffer.from(randomEmail));
      });
    })
    .catch(console.warn);
});
console.log("After job instantiation");
job.start();
