export interface SerializerInterface {
  readOptions<T>(options: T): T;
  serialize<T>(data: T): string;
  deserialize(data: string): any;
}
