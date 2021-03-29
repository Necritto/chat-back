import express from "express";

import userService from "../../services/UserService";
import cryptoService from "../../services/CryptoService";

export const auth = (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (req: express.Request, res: express.Response) {
    try {
      const { query } = req;

      if (!query.token) {
        return;
      }

      const token = cryptoService.decodeToken(query.token);

      if (!token) {
        return;
      }

      const user = await userService.findOne({ id: token.id });

      return originalMethod.call(this, req, res, user);
    } catch (e) {
      console.log(e.message);
    }
  };
};
