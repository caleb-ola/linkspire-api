import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config";
import { CustomRequest } from "../utils/types";
import { createUniqueFileName, extractFileNameFromUrl } from "../utils/casuals";
import BadRequestError from "../Errors/badRequestError";

const awsS3 = new S3Client({
  credentials: {
    accessKeyId: config.BUCKET_ACCESS_KEY,
    secretAccessKey: config.BUCKET_SECRET_KEY,
  },
  region: config.BUCKET_REGION,
});

export const s3UploadV3 = async (
  req: any,
  imgType: string,
  fileName: string | undefined
) => {
  // Get file extention
  const ext = req.file?.mimetype.split("/")[1];

  //   Create a unique filename
  const uniqueName = createUniqueFileName(
    req.file?.originalname,
    ext,
    12,
    imgType
  );

  const pathName = `${imgType}/${uniqueName}`;

  const existingName = fileName && extractFileNameFromUrl(fileName);
  const existingPathName = fileName && `${imgType}/${existingName}`;
  const key = existingPathName || pathName;

  const params = {
    Bucket: config.BUCKET_NAME,
    Key: existingPathName || pathName,
    Body: req.file.buffer,
    contentType: req.file.mimeType,
  };

  try {
    const result = await awsS3.send(new PutObjectCommand(params));
    return { result, key };
  } catch (err: any) {
    throw new BadRequestError(err.message);
  }
};
