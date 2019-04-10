const rmq = require("amqplib/callback_api")


console.log("Waiting for messages...")

rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const queue = "task_queue"
    ch.assertQueue(queue, {durable: false})
    ch.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;
    
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
      }, secs * 1000);
    }, {noAck: true});
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500)
})