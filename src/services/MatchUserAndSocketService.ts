import matchUserAndSocketRepository from "../repositories/MatchUserAndSocketRepository";
import { MatchUserAndSocketEntity } from "../entities/MatchUserAndSocketEntity";

class MatchUserAndSocketService {
  async createSocketConnection(userId: string, socketId: string) {
    const userConnection = new MatchUserAndSocketEntity();
    userConnection.userId = userId;
    userConnection.socketId = socketId;

    await matchUserAndSocketRepository.save(userConnection);
  }

  async findCurrentUserSocket(socketId: string) {
    return await matchUserAndSocketRepository.find({ socketId });
  }

  async findUserSockets(userId: string) {
    return await matchUserAndSocketRepository.find({ userId });
  }

  async findPartnersSockets(partners: string[]) {
    const partnersSockets = [];
    for (const partner of partners) {
      const socket = await matchUserAndSocketRepository.find({ userId: partner });
      partnersSockets.push(...socket);
    }

    return partnersSockets;
  }
}

export default new MatchUserAndSocketService();
