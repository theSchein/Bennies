// lib/emailUtils.js
import client from "@/lib/postmarkClient";  

export const sendVerificationEmail = async (email, link) => {
    await client.sendEmail({
        From: "ben@discovry.xyz",
        To: email,
        Subject: "Verify Your Email Address",
        TextBody: `Please verify your email by clicking on this link: ${link}`,
        HtmlBody: `<strong>Please verify your email</strong> by clicking on this link: <a href="${link}">Verify Email</a>`,
        MessageStream: "outbound"
    });
};
