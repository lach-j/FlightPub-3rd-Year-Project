import { User } from './User';

export default interface Message {
  user: User;
  content: string;
  dateSent: Date;
}
