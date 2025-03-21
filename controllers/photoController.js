import Photo from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import User from "../models/userModel.js";

const createPhoto = async (req, res) => {

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: "photoApp"
        }
    );

    try {
        await Photo.create({
            name: req.body.name,
            description: req.body.description,
            user: res.locals.user._id,
            url: result.secure_url,
            image_id: result.public_id
        });
        fs.unlinkSync(req.files.image.tempFilePath);
        res.status(201).redirect("/users/dashboard");
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const getAllPhotos = async (req, res) => {
    try {
        const photos = res.locals.user ? await Photo.find({ user: { $ne: res.locals.user._id } }).sort({ uploadedAt: -1 }) : await Photo.find({}).sort({ uploadedAt: -1 });

        res.status(200).render("photos", {
            photos,
            link: "photos"
        });





    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
}

const getPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById({ _id: req.params.id }).populate("user");
        let isOwner = false;

        if (res.locals.user) {
            isOwner = photo.user.equals(res.locals.user._id);
        }

        res.status(200).render("photo", {
            photo,
            link: "photos",
            isOwner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
}
const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        const photoId = photo.image_id;

        await cloudinary.uploader.destroy(photoId);
        await Photo.findOneAndDelete({ _id: req.params.id });
        res.status(200).redirect("/users/dashboard");
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
}
const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)

        if (req.files) {
            const photoId = photo.image_id;
            await cloudinary.uploader.destroy(photoId);

            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                {
                    use_filename: true,
                    folder: "photoApp"
                }
            );

            photo.url = result.secure_url;
            photo.image_id = result.public_id;

            fs.unlinkSync(req.files.image.tempFilePath);
        }

        photo.name = req.body.name;
        photo.description = req.body.description;

        photo.save();

        res.status(200).redirect(`/photos/${req.params.id}`);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            error
        });
    }
}

const createProfilePhoto = async (req, res) => {

    try {



        const user = await User.findById({ _id: res.locals.user._id });
        const isCustomPhoto = user.photoUrl && !user.photoUrl.includes("photoAppPP/tmp-2-1742582735185_lxbhtv.webp");

        if (isCustomPhoto) {

            const oldPhotoPublicId = user.photoUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`photoAppPP/${oldPhotoPublicId}`);
        }

        const photoResult = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename: true,
                folder: "photoAppPP"
            }
        );


        user.photoUrl = photoResult.secure_url;
        await user.save();

        fs.unlinkSync(req.files.image.tempFilePath);

        res.status(201).redirect("/users/dashboard");

    } catch (error) {
        console.error("Profile photo update error:", error);
        res.status(500).send("Error updating profile photo.");
    }



};

export { createPhoto, getAllPhotos, getPhoto, deletePhoto, updatePhoto, createProfilePhoto };