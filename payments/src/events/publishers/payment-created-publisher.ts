import { Subjects, Publisher, PaymentCreatedEvent } from "@thmtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
