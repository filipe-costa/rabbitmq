const rmq = require("amqplib/callback_api")

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

rmq.connect("amqp://localhost", (err, conn) => {
  conn.createChannel((err, ch) => {

    ch.assertQueue("", {exclusive: true}, (err, q) => {
      const {queue} = q
      const correlationId = generateUuid()
      const num = parseInt(args[0])

      console.log(' [x] Requesting fib(%d)', num)

      ch.consume(queue, (msg) => {
        if(msg.properties.correlationId === correlationId){
          console.log(' [.] Got %s', msg.content.toString());
          // setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true})

      ch.sendToQueue(
        "rpc_queue",
        new Buffer(num.toString()),
        {correlationId, replyTo: queue}
        )
    })
  })
})

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString()
}