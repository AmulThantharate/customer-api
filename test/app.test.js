
const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

test("GET / returns application information", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.application, "customer-api");
  assert.equal(data.version, "1.0.0");
});

test("GET /customers returns customer list", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(
    `http://127.0.0.1:${port}/customers`
  );
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.length, 3);
});

