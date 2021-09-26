import User from "../models/user.model";
const authUser = async (req, res, next) => {
  const { deviceModelId } = req.body;
  if (!deviceModelId) throw new Error("deviceModelId not found");

  let user = await User.findOne({ deviceModelId });
  if (!user) {
    user = await User.create({ deviceModelId });
  }

  req.user = user;
  next();
};

export { authUser };
