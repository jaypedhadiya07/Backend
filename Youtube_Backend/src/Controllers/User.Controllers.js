import asynchandler from "../Utils/asyncHandler.js";

const registerUser = asynchandler(async (req, res) => {
  return res.status(200).json({
    message: "User registered successfully",
  });
});

export { registerUser };