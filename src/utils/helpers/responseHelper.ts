import express from "express";

interface OptionsInterface {
  res: express.Response;
  statusCode?: number;
  message?: string;
  data?: any;
}

export function responseHelper(options: OptionsInterface) {
  return options.res.status((options.statusCode = 200)).json({
    message: options.message,
    data: options.data,
  });
}
