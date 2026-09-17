jest.mock("../models/Category", () => {
  const Category = jest.fn();
  Category.find = jest.fn();
  Category.findOne = jest.fn();
  Category.insertMany = jest.fn();
  return Category;
});

jest.mock("../lib/validators", () => ({
  validateCreateCategoryReq: jest.fn(),
  validateUpdateCategoryReq: jest.fn(),
}));

jest.mock("../lib/db", () => jest.fn());

const Category = require("../models/Category");
const validators = require("../lib/validators");
const {
  createDefaultCategories,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../server/controllers/categoryController");

describe("categoryController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validators.validateCreateCategoryReq.mockImplementation(() => true);
    validators.validateUpdateCategoryReq.mockImplementation(() => true);
  });

  test("createDefaultCategories prevents duplicate defaults", async () => {
    Category.find.mockResolvedValue([{ _id: "c1" }]);
    await expect(createDefaultCategories()).rejects.toThrow(
      /Default categories already exist/i,
    );
  });

  test("createCategory creates category for user", async () => {
    const save = jest.fn();
    Category.mockImplementationOnce(() => ({ save }));

    const result = await createCategory(
      { _id: "u1" },
      { name: "Food", type: "expense", emoji: "🍛" },
    );

    expect(save).toHaveBeenCalled();
    expect(result.status).toBe(201);
  });

  test("getCategories throws when user missing", async () => {
    await expect(getCategories(null)).rejects.toThrow(/Unauthorized/i);
  });

  test("updateCategory returns 404 when category not found", async () => {
    Category.findOne.mockResolvedValue(null);
    await expect(
      updateCategory({ _id: "u1" }, "c1", { name: "x" }),
    ).rejects.toThrow(/Category not found/i);
  });

  test("deleteCategory blocks default category deletion", async () => {
    Category.findOne.mockResolvedValue({ isDefault: true, deleteOne: jest.fn() });
    await expect(deleteCategory({ _id: "u1" }, "c1")).rejects.toThrow(
      /Default categories cannot be deleted/i,
    );
  });
});
