import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String
    },
    stripeId: {
      required: true,
      type: String
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

const PaymentCls = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export class Payment extends PaymentCls {
  constructor(attrs: PaymentAttrs) {
    super(attrs);
  }
}
