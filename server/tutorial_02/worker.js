const rmq = require("amqplib/callback_api")


console.log("Waiting for messages...")

rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const queue = "task_queue"
    ch.assertQueue(queue, {durable: true})
    ch.consume(queue, (msg) => {
      console.log("Received message from publisher: %s", msg.content.toString())
    }, {noAck: true})
  })

  setTimeout(() => {
    conn.close()
  }, 500)
})