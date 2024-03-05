import * as dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

interface ENV {
  NODE_ENV: string;
  PORT: number;

  DATABASE: string;
  DATABASE_PASSWORD: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_EXPIRES_IN: number;

  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_PORT: number;
  EMAIL_HOST: string;

  BREVO_HOST: string;
  BREVO_PORT: number;
  BREVO_USERNAME: string;
  BREVO_PASSWORD: string;
  BREVO_KEY: string;

  BUCKET_NAME: string;
  BUCKET_ACCESS_KEY: string;
  BUCKET_SECRET_KEY: string;
  BUCKET_REGION: string;
  BUCKET_LOCATION: string;

  APP_NAME: string;
  APP_EMAIL_FROM: string;
  APP_URL: string;
}

const Config = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: +(process.env.PORT as string),

    DATABASE: process.env.DATABASE as string,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,

    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    JWT_COOKIE_EXPIRES_IN: +(process.env.JWT_COOKIE_EXPIRES_IN as string),

    EMAIL_USERNAME: process.env.EMAIL_USERNAME as string,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
    EMAIL_PORT: +(process.env.EMAIL_PORT as string),
    EMAIL_HOST: process.env.EMAIL_HOST as string,

    BREVO_HOST: process.env.BREVO_HOST as string,
    BREVO_PORT: +(process.env.BREVO_PORT as string),
    BREVO_USERNAME: process.env.BREVO_USERNAME as string,
    BREVO_PASSWORD: process.env.BREVO_PASSWORD as string,
    BREVO_KEY: process.env.BREVO_KEY as string,

    BUCKET_NAME: process.env.BUCKET_NAME as string,
    BUCKET_ACCESS_KEY: process.env.BUCKET_ACCESS_KEY as string,
    BUCKET_SECRET_KEY: process.env.BUCKET_SECRET_KEY as string,
    BUCKET_REGION: process.env.BUCKET_REGION as string,
    BUCKET_LOCATION: process.env.BUCKET_LOCATION as string,

    APP_NAME: process.env.APP_NAME as string,
    APP_EMAIL_FROM: process.env.APP_EMAIL_FROM as string,
    APP_URL: process.env.APP_URL as string,
  };
};

const sanitizeConfig = (config: ENV): ENV => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Cannot locate key ${key} in config.env`);
    }
  }
  return config;
};

const config = sanitizeConfig(Config());

export default config;
