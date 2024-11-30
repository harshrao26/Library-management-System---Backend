import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Librarian", "Member"],
      default: "Member",
    },
    status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
  },
  { timestamps: true }
);




// Method to compare the password during login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Pre-save hook to hash the password before saving it
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // 10 rounds of hashing
  }
  next();
});
export const User = mongoose.model("User", userSchema);


