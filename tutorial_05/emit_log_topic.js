const rmq = require("amqplib/callback_api")


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = "topic_logs"

    const args = process.argv.slice(2)

    const msg = process.argv.slice(2).join(" ") || "Hello World!"

    const severity = (args.length > 0) ? args[0] : "info"

    ch.assertExchange(ex, "topic", {durable: false});

    ch.publish(ex, severity, new Buffer(msg))

    console.log(" [x] Exchange sent %s: '%s'", severity, msg);
  })

})