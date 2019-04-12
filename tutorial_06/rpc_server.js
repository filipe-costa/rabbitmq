const rmq = require("amqplib/callback_api")

rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const queue = "rpc_queue"

    ch.assertQueue(queue, {durable: false})

    ch.prefetch(1)

    console.log("[x] Awaiting RPC requests")

    ch.consume(queue, (msg) => {

      const num = parseInt(msg.content.toString())

      console.log("[.] fib(%d)", num)

      const result = fibonacci(num)

      ch.sendToQueue(
        msg.properties.replyTo,
        newBufer(result.toString()),
        {correlationId: msg.properties.correlationId}
      )

      ch.ack(msg)

    })
  })
})

function fibonacci(num){
  if(num === 0 || num === 1){
    return num
  }

  return fibonacci(num - 1) + fibonacci(num - 2)
}