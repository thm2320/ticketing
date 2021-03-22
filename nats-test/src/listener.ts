import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreateListener } from "./events/ticket-created-listener";

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

  new TicketCreateListener(stan).listen();
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
