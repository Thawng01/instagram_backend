import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "_" + file.originalname);
    },
});

const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
        return cb(new Error("Only jpeg, jpg and png are accepted."), false);
    }

    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
