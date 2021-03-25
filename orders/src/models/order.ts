import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@thmtickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

type OrderDoc = mongoose.Document & OrderAttrs & { version: number };

const orderSchema = new mongoose.Schema<OrderDoc>(
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const OrderModel = mongoose.model<OrderDoc>("Order", orderSchema);

export class Order extends OrderModel {
  constructor(attrs: OrderAttrs) {
    super(attrs);
  }
}
