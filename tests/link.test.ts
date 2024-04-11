import { faker } from "@faker-js/faker";
import app from "../app";
import Link from "../models/linkModel";
import { userLogin } from "./setups/auth.setup";
import supertest from "supertest";

const createLink = async () => {
  const link = {
    title: faker.word.adverb(),
    url: faker.internet.url(),
    user: faker.database.mongodbObjectId(),
    description: faker.lorem.paragraph(),
  };

  const response = await supertest(app)
    .post("/api/v1/links")
    .set("Authorization", `Bearer ${((await userLogin()) as any).token}`)
    .send(link)
    // .field("title", link.title)
    // .field("url", link.url)
    // .field("user", ((await userLogin()) as any).data.data.id)
    // .field("description", link.description)
    .expect(201);

  return response;
};

describe("links", () => {
  beforeEach(async () => {
    await createLink();
  }, 10000);

  describe("get link route", () => {
    describe("given the link do not exist", () => {
      it("should return a 404 error", async () => {
        // expect(true).toBe(true);
        const linkId = "link-123456";

        await supertest(app).get(`/api/v1/links/${linkId}`).expect(404);
      });
    });

    // describe("given the link does exist", async () => {
    //   it("should return a 200 status code and the newly created link", async () => {
    //     // console.log(linkObj);
    //     const { status, body } = await supertest(app)
    //       .get(`/api/v1/links/${linkId}`)
    //       .set("Accept", "application/json")
    //       .set("Authorization", `Bearer ${await userLogin()}`)
    //       .expect(200);
    //     expect(status).toBe(200);
    //   });
    // });
  });
});
