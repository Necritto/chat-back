import { Server, Socket } from "socket.io";

import { MessageEntity } from "../entities/MessageEntity";
import { DialogEntity } from "../entities/DialogEntity";
import matchUserAndSocketService from "../services/MatchUserAndSocketService";

class SocketManager {
  private users: Record<string, Socket> = {};

  connection(io: Server) {
    io.on("connection", async (socket: Socket) => {
      Object.assign(this.users, { [socket.id]: socket });
    });
  }

  async getCurrentUserSocket(socketId: string) {
    const matchUserAndSocket = await matchUserAndSocketService.findCurrentUserSocket(socketId);
    const currentUserSocketId = matchUserAndSocket[0].socketId;

    return this.users[currentUserSocketId];
  }

  async getUserSocketsId(userId: string) {
    const matchUserAndSocket = await matchUserAndSocketService.findUserSockets(userId);
    return matchUserAndSocket.map((item) => item.socketId);
  }

  async getPartnersSocketsId(partners: string[]) {
    const matchUserAndSocket = await matchUserAndSocketService.findPartnersSockets(partners);
    return matchUserAndSocket.map((item) => item.socketId);
  }

  async createMessage(socketsId: string[], message: MessageEntity) {
    const partnerSockets = [];
    for (let socketId of socketsId) {
      partnerSockets.push(await this.getCurrentUserSocket(socketId));
    }

    partnerSockets.forEach((socket) => socket && socket.emit("message", message));
  }

  async createDialog(socketsId: string[], dialog: DialogEntity) {
    const partnerSockets = [];
    for (let socketId of socketsId) {
      partnerSockets.push(await this.getCurrentUserSocket(socketId));
    }
    partnerSockets.forEach((socket) => socket && socket.emit("dialog", dialog));
  }

  async getSocketsIdForDialog(userId: string, partners: string[]) {
    const authorSocketId = await this.getUserSocketsId(userId);
    const partnersSocketId = await this.getPartnersSocketsId(partners);
    return [...authorSocketId, ...partnersSocketId];
  }

  async updateDialog(socketsId: string[], dialog: DialogEntity) {
    const sockets = [];
    for (const socket of socketsId) {
      sockets.push(await this.getCurrentUserSocket(socket));
    }
    sockets.forEach((socket) => socket && socket.emit("updateDialog", dialog));
  }
}

export default new SocketManager();
