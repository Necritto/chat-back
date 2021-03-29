import { BaseRepository } from "./BaseRepository";
import { MessageEntity } from "../entities/MessageEntity";

class MessageRepository extends BaseRepository<MessageEntity> {}

export default new MessageRepository({ table: "dialogs" });
