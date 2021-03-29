import express from "express";
import { Server } from "socket.io";

import dialogService from "../services/DialogService";
import { route } from "../utils/decorators/route";
import { auth } from "../utils/decorators/auth";
import { UserEntity } from "../entities/UserEntity";
import { BaseController } from "./BaseController";
import socketManager from "./SocketManager";

export class DialogsController extends BaseController {
  constructor(app: express.Express, private io: Server) {
    super(app);

    this.requestHandler("post", "/dialogs/create", this.createDialog);
    this.requestHandler("post", "/dialogs/group", this.createGroupDialog);
    this.requestHandler("post", "/dialogs/update", this.updateDialogPartners);
    this.requestHandler("post", "/dialogs/checkPrivateDialogLink", this.checkPrivateDialogLink);
    this.requestHandler("get", "/dialogs/currentDialogs", this.getCurrentUserDialogs);
    this.requestHandler("get", "/dialogs/groupDialogs", this.getAllPublicGroupDialogs);
  }

  @auth
  @route
  async createDialog({
    body: { authorId, partners },
  }: {
    body: {
      authorId: string;
      partners: string[];
    };
  }) {
    const dialog = await dialogService.createDialog(authorId, partners);

    if (dialog) {
      const sockets = await socketManager.getSocketsIdForDialog(authorId, partners);
      await socketManager.createDialog(sockets, dialog);
    }
  }

  @auth
  @route
  async createGroupDialog({
    body: { authorId, partners, isPrivate, dialogTitle },
  }: {
    body: {
      authorId: string;
      partners: string[];
      isPrivate: boolean;
      dialogTitle: string;
    };
  }) {
    const dialog = await dialogService.createGroupDialog({ authorId, partners, isPrivate, dialogTitle });
    const sockets = await socketManager.getSocketsIdForDialog(dialog.authorId, dialog.partners);
    await socketManager.createDialog(sockets, dialog);
  }

  @auth
  @route
  async getCurrentUserDialogs({ user }: { user: UserEntity }) {
    const dialogs = await dialogService.getCurrentUserDialogs(user.id);
    return { data: dialogs };
  }

  @auth
  @route
  async getAllPublicGroupDialogs({ user }: { user: UserEntity }) {
    const dialogs = await dialogService.getAllPublicGroupDialogs(user.id);
    return { data: dialogs };
  }

  @auth
  @route
  async updateDialogPartners({ body }: { body: { id: string; partners: string[] } }) {
    const updatedDialog = await dialogService.update(body);
    const sockets = await socketManager.getSocketsIdForDialog(updatedDialog[0].authorId, updatedDialog[0].partners);
    await socketManager.updateDialog(sockets, updatedDialog[0]);
  }

  @auth
  @route
  async checkPrivateDialogLink({ body: { link } }: { body: { link: string } }) {
    const dialog = await dialogService.findOne({ link });
    return { data: dialog };
  }
}
