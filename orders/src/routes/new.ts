import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from "@thmtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Valid TicketId must be provided")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not reserved
    // Run query to look at orders. Find and order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from theat means the ticket *is* reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    });
    if (existingOrder) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate the expiration date for this order

    // Build the order and save it to the database

    // Publish an event saying that an order was created

    res.send({});
  }
);

export { router as newOrderRouter };