import { Publisher, Subjects, TicketUpdatedEvent } from "@thmtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
