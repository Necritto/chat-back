import { DialogEntity } from "../entities/DialogEntity";
import dialogRepository from "../repositories/DialogRepository";
import userService from "./UserService";
import { ObjectIdInterface } from "../interfaces/types";
import cryptoService from "./CryptoService";

class DialogService {
  async createDialog(authorId: string, partners: string[]) {
    const author = await userService.findOne(authorId);
    const partner = await userService.findOne(partners[0]);

    const dialog = new DialogEntity();
    dialog.authorId = authorId;
    dialog.partners = partners;
    dialog.authorName = author!.name;
    dialog.partnerName = partner!.name;
    dialog.messages = [];

    await dialogRepository.save(dialog);

    return dialog;
  }

  async createGroupDialog({
    authorId,
    partners,
    isPrivate,
    dialogTitle,
  }: {
    authorId: string;
    partners: string[];
    isPrivate: boolean;
    dialogTitle: string;
  }) {
    const dialog = new DialogEntity();
    dialog.authorId = authorId;
    dialog.partners = partners;
    dialog.isPrivate = isPrivate;
    if (isPrivate) {
      dialog.link = cryptoService.generatePrivateLink();
    }
    dialog.dialogTitle = dialogTitle;
    dialog.messages = [];

    await dialogRepository.save(dialog);
    return dialog;
  }

  async getCurrentUserDialogs(userId: string) {
    const authorInDialog = await this.find({ authorId: userId });
    const partnerInDialog = await this.find({ partners: userId });

    return (<ObjectIdInterface[]>[]).concat(authorInDialog, partnerInDialog);
  }

  async getAllPublicGroupDialogs(userId: string) {
    const dialogs = await dialogRepository.read();
    return dialogs.filter(
      (dialog) =>
        dialog.authorId !== userId && !dialog.partners.includes(userId) && !dialog.isPrivate && dialog.dialogTitle,
    );
  }

  async update(updateData: Partial<DialogEntity> & { id: string }) {
    const dialog = await this.findOne(updateData.id);
    const updatedDialogs = await dialogRepository.update(updateData);
    return updatedDialogs.filter((dialog) => dialog.id === updateData.id);
  }

  async findOne(findValue: string | Object) {
    return await dialogRepository.findOne(findValue);
  }

  async find(findValue: string | Object) {
    return await dialogRepository.find(findValue);
  }
}

export default new DialogService();
