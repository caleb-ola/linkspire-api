import crypto from "crypto";
import slugify from "slugify";
import config from "../config";

export const createRandomUsername = (username: string, length: number = 6) => {
  const randomSuffix = crypto.randomBytes(length).toString("hex");
  const formattedUsername = username.toLowerCase().replace(/\s/g, "_");
  return `${formattedUsername}${randomSuffix}`;
};

export const slugifyString = (text: string) => {
  const result = slugify(text, { lower: true, trim: true });
  return result;
};

export const createUniqueFileName = (
  name: string,
  ext: string,
  byte: number = 12,
  imgType: string
) => {
  const hash = crypto.randomBytes(byte).toString("hex");

  const avatarName = `img-${imgType}-${hash}-${slugifyString(
    name
  )}-${Date.now()}.${ext}`;
  return avatarName;
};

export const extractFileNameFromUrl = (url: string) => {
  // Split the url into an array
  const urlParts = url.split("/");

  // Get the filename from the url
  const fileName = urlParts[urlParts.length - 1];

  // Remove addtional query parameters and suffixes
  const removedFileNameQueries = fileName.split("?")[0];

  // Remove addtional suffixes
  // const removedFileNameSuffixes = fileName.split("-")[0];

  return removedFileNameQueries;
};
export const convertSpacesToHyphen = (str: string) => {
  return str.replace(/\s+/g, "-");
};

export const generateUniqueShortUrl = (alias: string, id: string) => {
  const randomString = crypto.randomBytes(5).toString("hex");
  const shortId = id.slice(id.length - 5, id.length);

  const shortUrl = `${config.APP_URL}/${alias}/${randomString}${shortId}`;
  return shortUrl;
};
