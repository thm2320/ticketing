import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

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

it("returns a 201 with valid inputs", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: price,
    status: OrderStatus.Created,
    version: 0
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id
    })
    .expect(201);

  /* const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(10 * 100);
  expect(chargeOptions.currency).toEqual("usd"); */

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  expect(payment).not.toBeNull();
});
