import { MessageEntity } from "./MessageEntity";

export class DialogEntity {
  id!: string;
  authorId!: string;
  authorName!: string;
  partnerName!: string;
  isPrivate!: boolean;
  link!: string;
  partners!: string[];
  dialogTitle!: string;
  messages!: string[];
  lastMessage!: MessageEntity;
}
