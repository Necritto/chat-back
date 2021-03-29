import express from "express";

export abstract class BaseController {
  protected constructor(private app: express.Express, private urlPrefix = "/api") {}

  requestHandler(method: "post" | "get", url: string, methodHandler: (...args: any[]) => any) {
    this.app[method](`${this.urlPrefix}${url}`, methodHandler.bind(this));
  }
}
