import { v4 } from "uuid";
import bcrypt from "bcrypt";

class CryptoService {
  async createHash(password: string) {
    try {
      return await bcrypt.hash(password, 10);
    } catch (e) {
      console.log(e.message);
    }
  }

  async comparePasswordAndHash(inputPassword: string, hashPassword: string) {
    try {
      return await bcrypt.compare(inputPassword, hashPassword!);
    } catch (e) {
      console.log(e.message);
    }
  }

  generatePrivateLink() {
    return Buffer.from(v4()).toString("base64");
  }

  generateToken(obj: Object) {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
  }

  decodeToken(str: string) {
    if (!str) throw new Error("Unable to decode");
    return JSON.parse(Buffer.from(str, "base64").toString());
  }
}

export default new CryptoService();
