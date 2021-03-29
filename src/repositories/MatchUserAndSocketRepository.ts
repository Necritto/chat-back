import { BaseRepository } from "./BaseRepository";
import { MatchUserAndSocketEntity } from "../entities/MatchUserAndSocketEntity";

class MatchUserAndSocketRepository extends BaseRepository<MatchUserAndSocketEntity> {}

export default new MatchUserAndSocketRepository({ table: "matchUserAndSocket" });
