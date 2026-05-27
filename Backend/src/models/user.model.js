import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
//before saving a document ,hash the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return ;
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const userModel = mongoose.model("User", userSchema);
export default userModel;

