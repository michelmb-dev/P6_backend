import multer from "multer";

/* A constant that is used to store the different types of images that can be uploaded. */
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/png": "png",
};

/**
 * Creating a storage object to store the image.
 *
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.split(".")[0]
    callback(null, name + "." + extension);
  },
});

export const multerStorage = multer({ storage: storage }).single("image");
