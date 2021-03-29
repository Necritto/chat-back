class JsonSerializer {
  readOptions<T>(options: T): T {
    return options;
  }

  serialize<T>(data: T): string {
    return JSON.stringify(data);
  }

  deserialize(data: string): any {
    return JSON.parse(data);
  }
}

export default new JsonSerializer();
