import asynchandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import { User } from "../Models/User.Model.js";
import uploadOnCloudinary from "../Utils/Cloudinary.js";
import ApiResponse from "../Utils/ApiResponse.js";

const registerUser = asynchandler(async (req, res) => {
  // 1. Extract user input (username, email, password, avatar, etc.) from the request body
  // 2. Validate required fields (non-empty, correct formats, etc.)
  // 3. Check for existing user by username and email to avoid duplicates
  // 4. If avatar image is provided, upload it to Cloudinary and store the URL
  //    - If not provided, assign a default avatar image
  // 5. Create a new user object and insert it into the database
  // 6. Exclude sensitive fields (e.g., password, refreshToken) from the returned user object
  // 7. Verify that the user was successfully created in the database
  // 8. Return a structured response containing the user details (without sensitive data)

  const { userName, email, fullName, password } = req.body;
  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar image is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export { registerUser };