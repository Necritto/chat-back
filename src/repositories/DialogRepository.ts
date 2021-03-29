import { BaseRepository } from "./BaseRepository";
import { DialogEntity } from "../entities/DialogEntity";

class DialogRepository extends BaseRepository<DialogEntity> {}

export default new DialogRepository({ table: "dialogs" });
