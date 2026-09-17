require("./mongoSetup");

const { invokeRoute } = require("./helpers/route-test");
const { createUser, authCookieForUser, createCategory } = require("./helpers");
const { GET: categoriesGet } = require("../app/api/categories/route");
const { POST: categoryCreatePost } = require("../app/api/categories/create/route");
const { POST: createDefaultPost } = require("../app/api/categories/create-default/route");
const {
  PATCH: categoryPatch,
  DELETE: categoryDelete,
} = require("../app/api/categories/[id]/route");

describe("category Route Handlers", () => {
  test("POST /api/categories/create-default requires internal key", async () => {
    const failRes = await invokeRoute(createDefaultPost, {
      method: "POST",
      url: "http://localhost:3000/api/categories/create-default",
    });
    expect(failRes.status).toBe(403);

    const okRes = await invokeRoute(createDefaultPost, {
      method: "POST",
      url: "http://localhost:3000/api/categories/create-default",
      headers: { "x-internal-key": process.env.INTERNAL_KEY },
    });
    expect(okRes.status).toBe(201);
  });

  test("POST /api/categories/create creates category", async () => {
    const user = await createUser();
    const res = await invokeRoute(categoryCreatePost, {
      method: "POST",
      url: "http://localhost:3000/api/categories/create",
      cookies: authCookieForUser(user),
      body: { name: "Transport", type: "expense", emoji: "🚗" },
    });

    expect(res.status).toBe(201);
    expect(res.body.category.name).toBe("Transport");
  });

  test("GET /api/categories returns categories", async () => {
    const user = await createUser();
    await createCategory(user, { name: "Food" });
    const res = await invokeRoute(categoriesGet, {
      method: "GET",
      url: "http://localhost:3000/api/categories",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  test("PATCH /api/categories/:id updates category", async () => {
    const user = await createUser();
    const category = await createCategory(user, { name: "Old Name" });
    const res = await invokeRoute(categoryPatch, {
      method: "PATCH",
      url: `http://localhost:3000/api/categories/${category._id}`,
      cookies: authCookieForUser(user),
      params: { id: String(category._id) },
      body: { name: "New Name" },
    });

    expect(res.status).toBe(200);
    expect(res.body.category.name).toBe("New Name");
  });

  test("DELETE /api/categories/:id deletes category", async () => {
    const user = await createUser();
    const category = await createCategory(user, { name: "Temp", isDefault: false });
    const res = await invokeRoute(categoryDelete, {
      method: "DELETE",
      url: `http://localhost:3000/api/categories/${category._id}`,
      cookies: authCookieForUser(user),
      params: { id: String(category._id) },
    });

    expect(res.status).toBe(200);
  });
});
