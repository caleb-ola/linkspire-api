import { faker } from "@faker-js/faker";
import User from "../../models/userModel";
import supertest from "supertest";
import app from "../../app";

export const userLogin = async () => {
  const userData = {
    name: faker.person.fullName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    bio: faker.lorem.paragraph(),
    avatar: faker.image.avatar(),
    role: "admin",
    gender: "male",
    isVerified: true,
    password: "qwerty",
  };

  await User.create(userData);

  const response: any = await supertest(app)
    .post("/api/v1/auth/login")
    .set("User-Agent", faker.internet.userAgent())
    .send({
      email: userData.email,
      password: userData.password,
    });

  return response._body;
};
