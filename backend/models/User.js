import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email"
      ]
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [10, "Password must be at least 10 characters long"]
    },
    phone: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[0-9+\-\s()]+$/.test(v);
        },
        message: "Phone number contains invalid characters"
      }
    },
    address: { 
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"]
    },
    role: { 
      type: String, 
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin"
      }, 
      default: "user" 
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    isActive: {
      type: Boolean,
      default: true
    },
    
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,

    activeToken: String 
  },
  { 
    timestamps: true,
    versionKey: '__v'
  }
);

userSchema.index({ email: 1, isActive: 1 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 12); 
    } catch (error) {
      return next(error);
    }
  }
  
  if (this.isModified("lastLogin")) {
    this.loginAttempts = 0; 
    this.lockUntil = undefined;
  }
  
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; 
  }
  
  return this.updateOne(updates);
};

userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const customError = new Error(`${field} already exists`);
    customError.name = 'DuplicateError';
    next(customError);
  } else {
    next(error);
  }
});

userSchema.post('init', function() {
  this.constructor.createIndexes();
});

export default mongoose.model("User", userSchema);