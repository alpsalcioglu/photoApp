import express from "express";
import * as photoController from "../controllers/photoController.js";

const router = express.Router();

router.route("/").post(photoController.createPhoto).get(photoController.getAllPhotos);
router.route("/:id").get(photoController.getPhoto);
router.route("/:id").delete(photoController.deletePhoto);
router.route("/:id").put(photoController.updatePhoto);
router.route("/profilephoto").post(photoController.createProfilePhoto);




export default router;
