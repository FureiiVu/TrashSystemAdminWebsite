import User from "../schemas/user.js";
import cloudinary from "../lib/cloudinary.js";

// Hàm upload file lên Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export const createUser = async (req, res, hashedPassword) => {
  try {
    // 0. Kiểm tra vai trò của người dùng hiện tại
    const userRole = req.userInfo.role;

    if (userRole !== 1) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // 1.1. Lấy dữ liệu từ req.body
    if (!req.files || !req.files.iconFile) {
      return res.status(400).json({ message: "Icon file is required" });
    }

    const { userName, firstName, lastName, email, birthDate, male } = req.body;
    const iconFile = req.files.iconFile;

    // 1.2. Upload ảnh lên Cloudinary
    const iconUrl = await uploadToCloudinary(iconFile);

    // 2. Tạo user mới
    const newUser = new User({
      userName,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      email,
      birthDate,
      male,
      iconUrl,
    });

    // 3. Lưu user vào DB
    await newUser.save();

    // 4. Trả về phản hồi thành công
    res
      .status(201)
      .json({ userId: newUser._id, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error with creating a new user" });
  }
};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {
  try {
    // 0. Kiểm tra vai trò của người dùng hiện tại
    const userRole = req.userInfo.role;

    if (userRole !== 1) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // 1. Lấy userId từ req.body
    const { userId } = req.body;

    // 2. Tìm user trong DB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Xóa user khỏi DB
    await User.findByIdAndDelete(userId);

    // 4. Trả về phản hồi thành công
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal server error with deleting user" });
  }
};
