import {
  ExpirationCompleteEvent,
  Subjects,
  Publisher
} from "@thmtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
