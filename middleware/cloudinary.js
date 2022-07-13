import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: "dcamukk7a",
    api_key: "573375933639265",
    api_secret: "DjD6QZ0jqVI4eJ8bJadcx66IaRc",
    secure: true,
});

export const uploads = (file, res) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(file, (err, result) => {
            if (err) return res.status(500).send("Something failed");
            resolve(result.secure_url);
        });
    });
};
