import mongoose from "mongoose";
import { OrderStatus } from "@thmtickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

type OrderDoc = mongoose.Document & OrderAttrs;

const OrderSchema = new mongoose.Schema<OrderDoc>(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket"
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

const OrderModel = mongoose.model<OrderDoc>("Order", OrderSchema);

export class Order extends OrderModel {
  constructor(attrs: OrderAttrs) {
    super(attrs);
  }
}
