function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    baseCurrency: user.baseCurrency,
    theme: user.theme,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  toPublicUser,
};
