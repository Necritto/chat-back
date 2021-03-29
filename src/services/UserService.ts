import { UserEntity } from "../entities/UserEntity";
import userRepository from "../repositories/UserRepository";
import cryptoService from "./CryptoService";
import { PureObjectIdInterface } from "../interfaces/types";

class UserService {
  async create(email: string, password: string, name: string) {
    const user = new UserEntity();
    user.email = email;
    user.hashPassword = (await cryptoService.createHash(password)) as string;
    user.name = name;

    await userRepository.save(user);
  }

  async getAll() {
    return await userRepository.read();
  }

  private async update(userData: Partial<UserEntity> & PureObjectIdInterface) {
    return await userRepository.update(userData);
  }

  async validatePassword(password: string, hashPassword: string) {
    const isValid = await cryptoService.comparePasswordAndHash(password, hashPassword);

    if (!isValid) {
      throw new Error("Password incorrect");
    }

    return isValid;
  }

  async updatePassword(userData: { oldPassword: string; newPassword: string }, userId: PureObjectIdInterface) {
    const candidate = await userRepository.findOne(userId);

    if (!candidate) {
      throw new Error("User not found!");
    }

    await this.validatePassword(userData.oldPassword, candidate.hashPassword);

    const hashPassword = await cryptoService.createHash(userData.newPassword);
    await this.update({ hashPassword, id: candidate.id });
  }

  async updateEmail(userData: { id: string; email: string }) {
    return this.update({ id: userData.id, email: userData.email });
  }

  async updateName(userData: { id: string; name: string }) {
    return this.update({ id: userData.id, name: userData.name });
  }

  async delete(findValue: string | Object) {
    return await userRepository.delete(findValue);
  }

  async findOne(findValue: string | Object) {
    return await userRepository.findOne(findValue);
  }

  async find(findValue: string | Object) {
    return await userRepository.find(findValue);
  }
}

export default new UserService();
