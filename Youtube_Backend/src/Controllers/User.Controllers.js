import asynchandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import { User } from "../Models/User.Model.js";
import uploadOnCloudinary from "../Utils/Cloudinary.js";
import ApiResponse from "../Utils/ApiResponse.js";
import JWt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access Token"
    );
  }
};

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

const loginUser = asynchandler(async (req, res) => {
  // req boby => data
  // username or email
  // find user by username or email
  // password check
  // access token refresh token
  // send cookie

  const { userName, email, password } = req.body;
  // if (!userName & !email) alternative option
  if (!(userName || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging in");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logOutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedRefreshToken = JWt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changePassword = asynchandler(async (req, res) => {
  console.log(req.user._id);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from the old password"
    );
  }

  const user = await User.findById(req.user?._id);

  console.log(user);

  if (!user) {
    throw new ApiError(404, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiError(200, {}, "Password changed successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Current user fetched successfully"));
});

const updateAccountDetails = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateAvatarImage = asynchandler(async (req, res) => {
  const avatarImageLocalPath = req.file?.path;

  if (!avatarImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const avatar = uploadOnCloudinary(avatarImageLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error uploading avatar image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
});

const updateCoverImage = asynchandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const cover = uploadOnCloudinary(coverImageLocalPath);

  if (!cover.url) {
    throw new ApiError(400, "Error uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        cover: cover.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "cover updated successfully"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatarImage,
  updateCoverImage,
};