import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";

it("return a 404 when puchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asd",
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it("return a 401 when puchasing an order that does not belong to the user", async () => {
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    version: 0
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asd",
      orderId: order.id
    })
    .expect(401);
});

it("return a 404 when puchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 10,
    status: OrderStatus.Cancelled,
    version: 0
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "asd",
      orderId: order.id
    })
    .expect(400);
});
