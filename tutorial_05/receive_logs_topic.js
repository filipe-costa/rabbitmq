const rmq = require("amqplib/callback_api")

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = "topic_logs"

    ch.assertExchange(ex, "topic", {durable: false});

    ch.assertQueue("", {exclusive: true}, (err, q) => {
      const {queue} = q
      
      console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue)

      args.forEach((key) => {
        ch.bindQueue(queue, ex, key)
      })

      ch.consume(queue, (msg) => {
        console.log("[x] %s: '%s'", msg.fields.routingKey, msg.content.toString())
      }, {noAck: true})
    })
  })

})