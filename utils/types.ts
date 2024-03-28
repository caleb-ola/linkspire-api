import { Request } from "express";

export interface CustomRequest extends Request {
  currentUser?: any;
  userInfo?: any;
}

export interface userLoginInfo {
  os: string;
  device: string;
  browser: string;
  time: string;
  location?: string;
}
