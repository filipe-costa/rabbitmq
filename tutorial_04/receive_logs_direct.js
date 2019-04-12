const rmq = require("amqplib/callback_api")

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = "direct_logs"

    ch.assertExchange(ex, "direct", {durable: false});
    ch.assertQueue("", {exclusive: true}, (err, q) => {
      const {queue} = q
      
      console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue)

      args.forEach((severity) => {
        ch.bindQueue(queue, ex, severity)
      })

      ch.consume(queue, (msg) => {
        if(msg && msg.content) {
          console.log("[x] %s", msg.content.toString())
        }
      }, {noAck: true})
    })
  })

})