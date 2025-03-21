import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const { Schema } = mongoose;
const passlength = 4;
const userSchema = new Schema({
    username: { type: String, required: [true, "Username area is required!"], lowercase: true, validate: [validator.isAlphanumeric, "Only Alphanumeric characters!"] },
    email: {
        type: String, required: [true, "Email area is required!"], unique: true, validate: [validator.isEmail, "Valid email format is required! "]
    },
    password: { type: String, required: [true, "Password area is required!"], minlength: [passlength, `Password should be at least ${passlength} characters!`] },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followings: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    photoUrl: { type: String, default: "https://res.cloudinary.com/dbn2fj7f0/image/upload/v1742582736/photoAppPP/tmp-2-1742582735185_lxbhtv.webp" }
}, {
    versionKey: false,
    timestamps: true
}
);

userSchema.pre("save", function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
    });
});

const User = mongoose.model("User", userSchema);

export default User;