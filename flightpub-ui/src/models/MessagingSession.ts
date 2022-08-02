import Message from './Message';
import { User } from './User';

export interface MessagingSession {
  id: number;
  status: SessionStatus;
  users: User[];
  messages: Message[];
  wishlistId: number;
}

enum SessionStatus {
  TRIAGE = 0,
  IN_PROGRESS = 1,
  RESOLVED = 2
}
