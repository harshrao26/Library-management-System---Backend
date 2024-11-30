import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    const { secretKey, name, email, phone, password } = req.body;

    // Verify the secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: "Invalid secret key" });
    }

    // Validate the required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if an Admin already exists
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }


    // Create and save the Admin user
    const adminUser = new User({
      name,
      email,
      phone,
      password,
      role: "Admin",
      status: "Approved",
    });

    await adminUser.save();
    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering Admin:", error); 
    res
      .status(500)
      .json({ message: "Error registering Admin", error: error.message });
  }
};


// Admin Login Logic
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Admin login attempt:", { email });

    // Check if the user exists and is an Admin
    const adminUser = await User.findOne({ email });
    console.log("Found admin user:", adminUser); 

    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the user is an Admin
    if (adminUser.role !== "Admin") {
      console.log("Access denied, not an admin:", adminUser.role);
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Check if the Admin is approved
    if (adminUser.status !== "Approved") {
      console.log("Admin not approved:", adminUser.status);
      return res.status(403).json({ message: "Admin not approved by system" });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, adminUser.password);
    

    console.log("Password match result:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT for Admin
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    console.log("Generated token:", token); 

    // Respond with the token and success message
    res.status(200).json({
      message: "Admin logged in successfully",
      token,
    });
  } catch (error) {
    console.log("Error during login:", error); 
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};




// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    

    // Create and save user
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: role || "Member", 
      status: "Pending", 
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please wait for admin approval.",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });


    console.log(user);


    if (!user) {
      console.log("User not found:", email); 
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch); 
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is approved
    if (user.status !== "Approved") {
      console.log("User not approved:", user.status); 
      return res
        .status(403)
        .json({ message: "User not approved by admin yet" });
    }

   
    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log("Error logging in:", error); 
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};



// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

 

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};


// Delete a member (Admin-only access)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id; 

    // Ensure the logged-in user is an Admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Find the user by ID
    const member = await User.findById(userId);

    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user to delete is a Member and not an Admin or Librarian
    if (member.role === "Admin" || member.role === "Librarian") {
      return res
        .status(400)
        .json({ message: "Cannot delete Admin or Librarian users" });
    }

    // Delete the user (Member)
    await member.deleteOne(); 

    res.status(200).json({
      message: "Member deleted successfully",
      deletedMember: {
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res
      .status(500)
      .json({ message: "Error deleting member", error: error.message });
  }
};



// Register helper
export const register = registerUser;

// Login helper
export const login = loginUser;

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};


export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      
    // Check if the user is already approved
    if (user.status === "Approved") {
      return res.status(400).json({ message: "User is already approved" });
    }

    // Update user status to 'Approved'
    user.status = "Approved";
    await user.save();

    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving user", error: error.message });
  }
};



export const registerLibrarian = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

     if (!name || !email || !phone || !password) {
       return res.status(400).json({ message: "All fields are required" });
     }

   

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }


    // Create a new Librarian
    const librarian = new User({
      name,
      email,
      phone,
      password,
      role: "Librarian", 
      status: "Approved",
    });

    // Save the Librarian to the database
    await librarian.save();

    res.status(201).json({
      message: "Librarian registered successfully",
      librarian: {
        id: librarian._id,
        name: librarian.name,
        email: librarian.email,
        role: librarian.role,
      },
    });
  } catch (error) {
    console.error("Error registering librarian:", error);
    res
      .status(500)
      .json({ message: "Error registering librarian", error: error.message });
  }
};

export const loginLibrarian = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const librarian = await User.findOne({ email });

    if (!librarian) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user has the Librarian role
    if (librarian.role !== "Librarian") {
      return res
        .status(403)
        .json({ message: "Access denied: Librarians only" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, librarian.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: librarian._id, role: librarian.role }, // Include user ID and role in the payload
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Librarian logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Error logging in librarian:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
