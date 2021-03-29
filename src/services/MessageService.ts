import { v4 } from "uuid";

import dialogService from "./DialogService";
import userService from "./UserService";
import { MessageEntity } from "../entities/MessageEntity";

class MessageService {
  async create(dialogId: string, authorId: string, text: string) {
    const dialog = await dialogService.findOne({ id: dialogId });
    const author = await userService.findOne({ id: authorId });

    const message = new MessageEntity();
    message.id = v4();
    message.dialogId = dialogId;
    message.authorId = authorId;
    message.text = text;
    message.messageDate = `${new Date()}`;
    message.authorName = author.name;

    dialog.lastMessage = message;
    dialog.messages.push(message as any);

    await dialogService.update(dialog);
    return message;
  }

  async getCurrentDialogMessages(dialogId: string) {
    const currentDialog = await dialogService.findOne({ id: dialogId });
    return currentDialog.messages;
  }
}

export default new MessageService();
