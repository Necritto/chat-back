import express from "express";
import { Server } from "socket.io";

import { route } from "../utils/decorators/route";
import messageService from "../services/MessageService";
import { auth } from "../utils/decorators/auth";
import socketManager from "./SocketManager";
import dialogService from "../services/DialogService";

export class MessagesController {
  constructor(private app: express.Express, private io: Server) {
    app.post(`/api/messages/create`, this.create.bind(this));
    app.post(`/api/messages/currentMessages`, this.getCurrentDialogMessages.bind(this));
  }

  @auth
  @route
  async create({
    body: { dialogId, authorId, text },
  }: {
    body: {
      dialogId: string;
      authorId: string;
      text: string;
    };
  }) {
    const message = await messageService.create(dialogId, authorId, text);
    const dialog = await dialogService.findOne(dialogId);
    const sockets = await socketManager.getSocketsIdForDialog(dialog.authorId, dialog.partners);
    await socketManager.createMessage(sockets, message);
  }

  @auth
  @route
  async getCurrentDialogMessages({ body }: { body: { dialogId: string } }) {
    const messages = await messageService.getCurrentDialogMessages(body.dialogId);
    return {
      data: messages,
    };
  }
}
