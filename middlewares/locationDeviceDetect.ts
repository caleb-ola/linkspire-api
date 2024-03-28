import { Request, RequestHandler } from "express";
import geoip from "geoip-lite";
import AsyncHandler from "../utils/asyncHandler";
import maxmind, { CityResponse } from "maxmind";
import DeviceDetector from "node-device-detector";
import { DateTime } from "luxon";
import { CustomRequest, userLoginInfo } from "../utils/types";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const locationDeviceDetect: RequestHandler = AsyncHandler(
  async (req: CustomRequest, res, next) => {
    const lookup = await maxmind.open<CityResponse>(
      `${__dirname}/../resources/GeoLite2-City.mmdb`
    );

    const userAgent = req.headers["user-agent"] as string;
    const detect = detector.detect(userAgent);

    const ipAddress = req.ip as string;
    const location = lookup.get(ipAddress);

    const info = {
      time: DateTime.now().toLocaleString(DateTime.DATETIME_FULL),
      os: detect.os.name,
      browser: detect.client.name,
      device: detect.device.brand || detect.device.type,
    };
    let locationInfo;
    if (location) {
      locationInfo = {
        location: `${location.country?.names.en}/${location.city?.names.en}`,
      };
    }

    // console.log({ ipAddress }, detector.detect(userAgent));
    const allInfo: userLoginInfo = { ...info, ...locationInfo };
    req.userInfo = allInfo;

    next();
  }
);

export default locationDeviceDetect;
