const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { isEmail, isStrongPassword } = require('validator');

const UserSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: [true, "Full Name is required"],
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "Email is required"],
            unique: [true, "This email is taken"],
            validate: [isEmail, "Email shuld be a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validate: [isStrongPassword, "Password is too weak"],
        },
        role: {
            type: String,
            enum: ['¥user¥', '¥admin¥'],
            default: '¥user¥'
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        access_token: {
            type: String,
        },
        password_changed_at: Date,
        password_reset_token: String,
        password_reset_expires: Date,
    },
    { timestamps: true }
);


// ==================== Password Hashing ====================
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// ==================== Password Matching ====================
UserSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password);
}


// ==================== Generating Reset Password Token ====================
UserSchema.methods.generate_reset_password_token = async function () {
    const reset_token = crypto.randomBytes(32).toString("hex");
    this.password_reset_token = crypto.createHash('sha256').update(reset_token).digest("hex");
    this.password_reset_expires = Date.now() + 10 * 60 * 1000;
    return reset_token;
}


module.exports = mongoose.model('users', UserSchema);