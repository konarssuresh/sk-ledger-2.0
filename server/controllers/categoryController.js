const connectDb = require("../../lib/db");
const Category = require("../../models/Category");
const defaultCategories = require("../config/defaultCategories");
const { AppError, NotFoundError, UnauthorizedError } = require("../../lib/errors");
const {
  validateCreateCategoryReq,
  validateUpdateCategoryReq,
} = require("../../lib/validators");

async function createDefaultCategories() {
  await connectDb();
  const existingCategories = await Category.find({ isDefault: true });
  if (existingCategories.length > 0) {
    throw new AppError("Default categories already exist");
  }

  await Category.insertMany(defaultCategories);
  return {
    status: 201,
    body: { message: "Default categories created successfully" },
  };
}

async function createCategory(user, body) {
  await connectDb();
  validateCreateCategoryReq({ body });
  const { name, emoji, type } = body;

  const category = new Category({
    name,
    emoji,
    type,
    userId: user._id,
  });

  await category.save();
  return {
    status: 201,
    body: { message: "Category created successfully", category },
  };
}

async function updateCategory(user, id, body) {
  await connectDb();
  validateUpdateCategoryReq({ body });
  const { name, emoji, type } = body;

  const category = await Category.findOne({ _id: id, userId: user._id });
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  if (name !== undefined) category.name = name;
  if (emoji !== undefined) category.emoji = emoji;
  if (type !== undefined) category.type = type;

  await category.save();
  return {
    status: 200,
    body: { message: "Category updated successfully", category },
  };
}

async function getCategories(user) {
  await connectDb();
  if (!user || !user._id) {
    throw new UnauthorizedError("Unauthorized");
  }

  const categories = await Category.find({
    $or: [{ isDefault: true }, { userId: user._id }],
  })
    .sort({ type: 1, name: 1 })
    .lean();

  return { status: 200, body: { categories } };
}

async function deleteCategory(user, id) {
  await connectDb();
  const category = await Category.findOne({ _id: id, userId: user._id });
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  if (category.isDefault) {
    throw new AppError("Default categories cannot be deleted");
  }

  await category.deleteOne();
  return { status: 200, body: { message: "Category deleted successfully" } };
}

module.exports = {
  createDefaultCategories,
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};
