const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      sparse: true, // Allows null or unique values
      trim: true,
    },
    email: {
      type: String,
      sparse: true, // Allows null or unique values
      trim: true,
      lowercase: true,
      validate: [
        {
          validator: function (v) {
            // Perform validation only when email is provided
            if (this.email) {
              // Regular expression for email validation
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }
            // Skip validation when email is not provided
            return true;
          },
          message: (props) => `${props.value} is not a valid email address!`,
        },
      ],
    },
    password: {
      type: String,
      minLength: 6,
    },
    disabled_by_admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
