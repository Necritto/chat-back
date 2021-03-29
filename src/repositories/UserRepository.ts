import { BaseRepository } from "./BaseRepository";
import { UserEntity } from "../entities/UserEntity";

class UserRepository extends BaseRepository<UserEntity> {}

export default new UserRepository({ table: "users" });
