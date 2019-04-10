const rmq = require("amqplib/callback_api")


console.log("Waiting for messages...")

rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const queue = "task_queue"
    ch.assertQueue(queue, {durable: true})
    ch.prefetch(1)
    ch.consume(queue, (msg) => {
      const secs = msg.content.toString().split(".").length - 1
      console.log("Received message from publisher: %s", msg.content.toString())
      setTimeout(() => {
        console.log("[x] Done")
        ch.ack(msg)
      }, secs * 1000)
    }, {noAck: false})
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500)
})