import { Publisher, Subjects, TicketCreatedEvent } from "@thmtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // subject:Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated; //better definition
}
