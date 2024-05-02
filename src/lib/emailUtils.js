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

export const sendWelcomeEmail = async (email, username) => {
    const baseUrl = process.env.BASE_URL;
    const welcomeLink = `${baseUrl}/`; 

    await client.sendEmail({
        From: "ben@discovry.xyz",
        To: email,
        Subject: "Welcome to Discovry!",
        TextBody: `Hi ${username}, welcome to Discovry! Start exploring now: ${welcomeLink}`,
        HtmlBody: `<strong>Hi ${username},</strong><p>Welcome to Discovry!</p><p>SI am so happy to have you. Start exploring now: <a href="${welcomeLink}">Explore</a></p>`,
        MessageStream: "outbound"
    });
};
