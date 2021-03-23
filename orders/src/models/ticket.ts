import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
}

export type TicketDoc = mongoose.Document & TicketAttrs;

const TicketSchema = new mongoose.Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
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

const TicketModel = mongoose.model<TicketDoc>("Ticket", TicketSchema);

export class Ticket extends TicketModel {
  constructor(attrs: TicketAttrs) {
    super(attrs);
  }
}
