import express from "express";
import { Server } from "socket.io";

import userService from "../services/UserService";
import { StatusCodes } from "../utils/statusCodes";
import { route } from "../utils/decorators/route";
import { auth } from "../utils/decorators/auth";
import { BaseError } from "../utils/baseError";
import cryptoService from "../services/CryptoService";
import { ObjectIdInterface } from "../interfaces/types";
import { UserEntity } from "../entities/UserEntity";
import { BaseController } from "./BaseController";
import matchUserAndSocketService from "../services/MatchUserAndSocketService";
import socketManager from "./SocketManager";

export class UsersController extends BaseController {
  constructor(app: express.Express, private io: Server) {
    super(app);

    this.requestHandler("post", "/auth/register", this.register);
    this.requestHandler("post", "/auth/login", this.login);
    this.requestHandler("post", "/auth/changePassword", this.changePassword);
    this.requestHandler("post", "/auth/getUser", this.getCurrentUser);
    this.requestHandler("get", "/auth/interlocutors", this.getAllInterlocutors);
  }

  @route
  async getCurrentUser({ body: { token, socketId } }: { body: { token: string; socketId: string } }) {
    const userId = await cryptoService.decodeToken(token).id;
    const currentUser = await userService.findOne(userId);
    await matchUserAndSocketService.createSocketConnection(userId, socketId);

    return { data: { user: currentUser } };
  }

  @route
  async register({
    body: { email, password, name },
  }: {
    body: {
      email: string;
      password: string;
      name: string;
    };
  }) {
    const candidate = await userService.findOne({ email });

    if (candidate) {
      throw new BaseError(StatusCodes.CONFLICT, "UserEntity with this email already exists!");
    }

    await userService.create(email, password, name);
  }

  @route
  async login({ body: { email, password } }: { body: { email: string; password: string } }) {
    const candidate = await userService.findOne({ email });

    if (!candidate) {
      throw new Error("User not found!");
    }

    await userService.validatePassword(password, candidate.hashPassword);

    const token = cryptoService.generateToken({ id: candidate.id });

    return { data: { token } };
  }

  @auth
  @route
  async changePassword({
    body,
    user,
  }: {
    body: {
      id: string;
      newPassword: string;
      oldPassword: string;
    };
    user: UserEntity;
  }) {
    return await userService.updatePassword(body, { id: user.id });
  }

  @auth
  @route
  async changeEmail({
    body,
  }: {
    body: {
      id: string;
      email: string;
    };
  }) {
    return await userService.updateEmail(body);
  }

  @auth
  @route
  async changeName({
    body,
  }: {
    body: {
      id: string;
      name: string;
    };
  }) {
    return await userService.updateName(body);
  }

  @auth
  @route
  async getAllInterlocutors({ user }: { user: UserEntity }) {
    const users = await userService.getAll();
    const interlocutors = users.filter((item: ObjectIdInterface) => item.id !== user.id);

    return { data: interlocutors };
  }
}
