import path from "path";
import { v4 } from "uuid";
import { promises as FS } from "fs";

import { FileSystemRepositoryEditorInterface } from "interfaces/repositoryEditor/fileSystemReposytoryEditor";
import { ObjectIdInterface, ObjectInterface } from "../../interfaces/types";
import { SerializerInterface } from "../../interfaces/serializer/serializer";

interface files {
  fs: typeof FS;
  mainPath: string;
  table: string;
  serializer: SerializerInterface;
}

export class FileSystemRepositoryEditor implements FileSystemRepositoryEditorInterface {
  constructor(private options: files) {}

  private pathToFile = path.join(`${this.options.mainPath}\\${this.options.table}.json`);
  private cache: ObjectIdInterface[] = null!;

  private static findToKeys(findValue: ObjectInterface, target: ObjectIdInterface[], method: "find" | "filter") {
    if (findValue) {
      return target[method]((item: ObjectIdInterface) =>
        Object.keys(findValue).every((key) => findValue[key] === item[key]),
      );
    }
    return [];
  }

  private static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  async read() {
    if (this.cache) {
      return FileSystemRepositoryEditor.deepClone(this.cache);
    }

    const content = await this.options.fs.readFile(this.pathToFile, this.options.serializer.readOptions("utf8"));

    this.cache = this.options.serializer.deserialize(content);
    return FileSystemRepositoryEditor.deepClone(this.cache);
  }

  private async save(data: ObjectIdInterface[]) {
    this.cache = null!;
    await this.options.fs.writeFile(this.pathToFile, this.options.serializer.serialize(data));
  }

  async append(data: Object) {
    const dataToSave = await this.read();
    (data as ObjectIdInterface).id = v4();
    dataToSave.push(<ObjectIdInterface>data);
    await this.save(dataToSave);
  }

  async update(updateData: ObjectIdInterface) {
    const previouslyData = await this.read();
    const index = previouslyData.findIndex((candidate: ObjectIdInterface) => candidate.id === updateData.id);

    if (!index.toString()) {
      throw new Error("Element for update not found!");
    }

    const dataToUpdate = previouslyData[index];
    Object.keys(updateData)
      .filter((key) => key !== "id")
      .forEach((key) => (dataToUpdate[key] = updateData[key]));

    previouslyData[index] = dataToUpdate;
    await this.save(previouslyData);
    return previouslyData;
  }

  async delete(findValue: string | ObjectInterface) {
    const dataToDelete = await this.read();

    if (typeof findValue === "string") {
      const newData = dataToDelete.filter((candidate: ObjectIdInterface) => candidate.id !== findValue);
      return await this.save(newData);
    }

    const newData = dataToDelete.filter((item: ObjectIdInterface) =>
      Object.keys(findValue).every((key) => findValue[key] !== item[key]),
    );
    return await this.save(newData);
  }

  async find(findValue: string | Object) {
    const data = await this.read();

    if (typeof findValue === "string") {
      return [data.find((item: { id: string }) => item.id === findValue)] as ObjectIdInterface[];
    }

    const [key] = Object.keys(findValue);

    if (data[0] && Array.isArray(data[0][key])) {
      return data.filter((item) => {
        if (item[key]) {
          return item[key].some((value: any) => value === (<any>findValue)[key]) as ObjectIdInterface[];
        }
        return false;
      });
    }

    return FileSystemRepositoryEditor.findToKeys(findValue, data, "filter") as ObjectIdInterface[];
  }

  async findOne(findValue: string | Object) {
    const data = await this.read();

    if (typeof findValue === "string") {
      return data.find((item: { id: string }) => item.id === findValue) as ObjectIdInterface;
    }

    return FileSystemRepositoryEditor.findToKeys(findValue, data, "find") as ObjectIdInterface;
  }
}
