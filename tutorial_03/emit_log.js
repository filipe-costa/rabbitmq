const rmq = require("amqplib/callback_api")


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = "logs"
    const msg = process.argv.slice(2).join(" ") || "Hello World!"

    ch.assertExchange(ex, "fanout", {durable: false});
    ch.publish(ex, "", new Buffer(msg))
    console.log(" [x] Exchange sent '%s'", msg);
  })

})