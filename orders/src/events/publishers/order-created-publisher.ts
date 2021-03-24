import { Publisher, OrderCreatedEvent, Subjects } from "@thmtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
