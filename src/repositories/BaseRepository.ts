import { promises as fs } from "fs";
import path from "path";

import { ObjectIdInterface, ObjectInterface } from "../interfaces/types";
import { FileSystemRepositoryEditor } from "../systemLibs/FileSystemRepositoryEditor/FileSystemRepositoryEditor";
import jsonSerializer from "../systemLibs/Serializer/JsonSerializer";

export abstract class BaseRepository<Entity> {
  constructor(private options: { repositoryEditor?: FileSystemRepositoryEditor; table?: string }) {
    this.init();
  }

  private repositoryEditor?: FileSystemRepositoryEditor;

  private init() {
    if (this.options.table) {
      return (this.repositoryEditor = new FileSystemRepositoryEditor({
        fs,
        mainPath: path.join(__dirname, "..", "..", "db"),
        table: this.options.table,
        serializer: jsonSerializer,
      }));
    }

    return (this.repositoryEditor = this.options.repositoryEditor);
  }

  async save(data: ObjectIdInterface) {
    await this.repositoryEditor!.append(data);
  }

  async read(): Promise<Entity[]> {
    return (await this.repositoryEditor!.read()) as any;
  }

  async update(data: ObjectIdInterface): Promise<Entity[]> {
    return (await this.repositoryEditor!.update(data)) as any;
  }

  async delete(findValue: string | ObjectInterface) {
    await this.repositoryEditor!.delete(findValue);
  }

  async find(findValue: string | Object): Promise<Entity[]> {
    return (await this.repositoryEditor!.find(findValue)) as any;
  }

  async findOne(findValue: string | Object): Promise<Entity> {
    return (await this.repositoryEditor!.findOne(findValue)) as any;
  }
}
