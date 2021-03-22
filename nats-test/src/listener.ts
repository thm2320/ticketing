import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() //will deliver all events from seq 1 to now when the listener start up
    .setDurableName("accounting-service");

  const subscription = stan.subscribe(
    "ticket:created",
    "queue-group-name", // work will with setDurableName (not to receive the duplicated data )
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT");
  stan.close();
});
process.on("SIGIERM", () => {
  // not work in windows using "rs"
  console.log("SIGIERM");
  stan.close();
});
