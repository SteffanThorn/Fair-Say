import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pollHistorySchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
    choice: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    authMethod: {
      type: String,
      enum: ['email', 'gitcoin'],
      default: 'email',
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Fair Say NZ-specific fields
    preferredElectorate: {
      type: String,
      trim: true,
      default: '',
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    pollHistory: [pollHistorySchema],
    // Sybil-resistance: identity verification via IRD or ratespayer number.
    // identityHash = HMAC-SHA256(IDENTITY_SECRET, type:normalizedNumber) — the raw number is never stored.
    isVerified: { type: Boolean, default: false },
    verifiedType: { type: String, enum: ['ird', 'ratespayer'], sparse: true },
    verifiedAt: { type: Date },
    identityHash: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

userSchema.pre('validate', function validateAuth() {
  if (this.authMethod === 'email' && (!this.email || !this.password)) {
    this.invalidate('email', 'Email and password are required for email accounts');
  }
  if (this.authMethod === 'gitcoin' && !this.walletAddress) {
    this.invalidate('walletAddress', 'Wallet address is required for Gitcoin accounts');
  }
});

userSchema.pre('save', async function savePassword() {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
