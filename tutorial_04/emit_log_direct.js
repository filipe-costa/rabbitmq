const rmq = require("amqplib/callback_api")


rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = "direct_logs"
    const args = process.argv.slice(2)
    const msg = process.argv.slice(2).join(" ") || "Hello World!"
    var severity = (args.length > 0) ? args[0] : "info"

    ch.assertExchange(ex, "direct", {durable: false});
    ch.publish(ex, severity, new Buffer(msg))
    console.log(" [x] Exchange sent %s: '%s'", severity, msg);
  })

})