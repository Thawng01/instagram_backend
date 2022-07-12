import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.ClOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
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
