const rmq = require("amqplib/callback_api")


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = "logs"
    const msg = process.argv.slice(2).join(" ") || "Hello World!"

    ch.assertExchange(ex, "fanout", {durable: false});
    ch.assertQueue("", {exclusive: true}, (err, q) => {
      const {queue} = q
      console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue)
      ch.bindQueue(queue, ex, "")

      ch.consume(queue, (msg) => {
        if(msg && msg.content) {
          console.log("[x] %s", msg.content.toString())
        }
      }, {noAck: true})
    })
  })

})