import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: "" },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

      phone: { type: Number, default: 0 },  // Made optional for Google login
    address: { type: String, default: "" }, // Made optional for Google login
    bio: { type: String, default: "" }, // About me


    // Email verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpire: { type: Date },

    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },


    // Social links
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },

    // Notifications toggles
    notifications: {
      email: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      privacy: { type: Boolean, default: true },
    },

    // Activity / Stats
    role: { type: String, default: "user" },
    lastLogin: { type: Date, default: Date.now },
    orders: { type: Number, default: 0 },
    profileCompletion: { type: Number, default: 0 },

    // Cart data
    cartData: { type: Object, default: {} },

    // Password change tracking
    passwordUpdatedAt: { type: Date },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
