import { Publisher, OrderCancelledEvent, Subjects } from "@thmtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
