// lib/emailUtils.js
import client from "@/lib/postmarkClient";  

export const sendVerificationEmail = async (email, link) => {
    await client.sendEmailWithTemplate({
        From: "ben@bennies.fun",
        To: email,
        TemplateAlias: "verify",
        TemplateModel: {
            action_url: link,
            support_email: "ben@bennies.fun"
        }
    });
};

export const sendWelcomeEmail = async (email, username) => {
    const baseUrl = process.env.BASE_URL;
    const welcomeLink = `${baseUrl}/`; 

    await client.sendEmailWithTemplate({
        From: "ben@bennies.fun",
        To: email,
        TemplateAlias: "welcome",
        TemplateModel: {
            name: username,
            action_url: welcomeLink,
            support_email: "ben@bennies.fun"
          }
    });
};
