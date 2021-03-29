import express from "express";

import { UserEntity } from "../../entities/UserEntity";
import { RequestInterface } from "../../interfaces/types";
import { responseHelper } from "../helpers/responseHelper";
import { StatusCodes } from "../statusCodes";
import { BaseError } from "../baseError";

export const route = (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (req: express.Request, res: express.Response, user?: UserEntity) {
    try {
      const options: RequestInterface = { body: req.body, params: req.params, query: req.query, user };
      const result = await originalMethod.call(this, options);

      if (result) {
        return responseHelper({ res, data: result.data });
      }

      return responseHelper({ res });
    } catch (err) {
      if (err instanceof BaseError) {
        return responseHelper({ res, statusCode: err.statusCode, message: err.errorMessage });
      }

      console.log(err);
      return responseHelper({ res, statusCode: StatusCodes.SERVER_ERROR, message: err.message });
    }
  };
};
