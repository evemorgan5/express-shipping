"use strict";
// Need to mock before importing app
let shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");
const { SHIPIT_API_KEY } = require("../shipItApi");
/** POST /
 * - takes in {productId, name, addr, zipcode}
 * Checks post request is successful
 * - Returns {shipped: number}
 * - Else: bad request error message
 */


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct
      .mockReturnValue(1);


    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6789",
    });
    expect(resp.body).toEqual({ shipped: 1 });
  });
  test("invalid input", async function () {
    const resp = await request(app).post("/shipments").send({
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6789",
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([`instance requires property \"productId\"`]);
  });
  test("invalid input", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: 10,
      addr: "100 Test St",
      zipcode: "12345-6789",
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([`instance.name is not of a type(s) string`]);
  });
  test("invalid input", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      zipcode: "12345-6789",
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([`instance requires property \"addr\"`]);
  });
  test("invalid input", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([`instance requires property \"zipcode\"`]);
  });
  test("invalid input", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: 1000,
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([`instance.addr is not of a type(s) string`, `instance requires property \"zipcode\"`]);
  });
});
