import app from "../app";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe("links", () => {
  let linkId;
  let letuserId = "hfbsjfv123234kjvkjh"
  beforeEach(async () => {
    const link = {
      title: "CJ's Linkedin",
      url: "https://linkedin.com",
      user:
    }
  });

  describe("get link route", () => {
    describe("given the link do not exist", () => {
      it("should return a 404 error", async () => {
        // expect(true).toBe(true);
        const linkId = "link-123456";

        await supertest(app).get(`/api/v1/links/${linkId}`).expect(404);
      });
    });

    describe("given the link does exist", () => {
      it("should return a 200 status code and the newly created link", async () => {});
    });
  });
});
