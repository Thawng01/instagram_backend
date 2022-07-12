import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "salaichinaw@gmail.com",
        pass: "rzussjbgbhdouywp",
    },
});
