import { ObjectIdInterface, ObjectInterface } from "../types";

export interface FileSystemRepositoryEditorInterface {
  append: (data: Object) => void;
  read: () => Promise<ObjectIdInterface[]>;
  update: (data: ObjectIdInterface) => void;
  delete: (findValue: string | ObjectInterface) => void;
  find: (findField: string | Object) => Promise<ObjectIdInterface[]>;
  findOne: (findField: string | Object) => Promise<ObjectIdInterface>;
}
