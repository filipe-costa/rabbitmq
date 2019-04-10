const rmq = require("amqplib/callback_api")


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const queue = "hello"
    ch.assertQueue(queue, {durable: false})
    ch.sendToQueue(queue, Buffer.from("Hello World"))
    console.log("Message sent")
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500)
})