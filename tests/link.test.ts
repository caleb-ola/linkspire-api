import { faker } from "@faker-js/faker";
import app from "../app";
import Link from "../models/linkModel";
import { userLogin } from "./setups/auth.setup";
import supertest from "supertest";

let data;

const createLink = async () => {
  const data = {
    title: faker.word.adverb(),
    url: faker.internet.url(),
    user: faker.database.mongodbObjectId(),
    description: faker.lorem.paragraph(),
  };

  const response = await supertest(app)
    .post("/api/v1/links")
    .set("Authorization", `Bearer ${((await userLogin()) as any).token}`)
    .send(data)
    // .field("title", link.title)
    // .field("url", link.url)
    // .field("user", ((await userLogin()) as any).data.data.id)
    // .field("description", link.description)
    .expect(201);
  return response;
};

describe("links", () => {
  describe("Retrieve all links", () => {
    beforeEach(async () => {
      await createLink();
    }, 10000);

    it("should return a 200 status code", async () => {
      await supertest(app)
        .get(`/api/v1/links`)
        .set("Authorization", `Bearer ${((await userLogin()) as any).token}`)
        .expect(200);
    });
  });

  describe("Retrieve single link by id", () => {
    beforeEach(async () => {
      await createLink();
    }, 10000);
    it("should return a 404 error", async () => {
      // expect(true).toBe(true);
      const linkId = "link-123456";
      await supertest(app).get(`/api/v1/links/${linkId}`).expect(404);
    });
  });

  describe("Create link route", () => {
    let link: any;
    beforeEach(async () => {
      link = await createLink();
    });

    it("Should return 201 on successful creation", () => {
      expect(link.status).toBe(201);
    });

    it("should have a status of success", () => {
      expect(link._body.status).toBe("success");
    });

    it("should have certain fields", () => {
      expect(link._body.data.data).toHaveProperty("title");
      expect(link._body.data.data).toHaveProperty("user");
      expect(link._body.data.data).toHaveProperty("url");
      expect(link._body.data.data).toHaveProperty("description");
    });
  });
});
