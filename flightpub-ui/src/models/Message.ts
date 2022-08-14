import { User } from './User';

export default interface Message {
  id?: number;
  user: User;
  content: string;
  dateSent: Date;
}
