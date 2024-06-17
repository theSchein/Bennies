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

export const sendPasswordResetEmail = async (email, link) => {
    await client.sendEmailWithTemplate({
        From: "ben@bennies.fun",
        To: email,
        TemplateAlias: "password-reset",
        TemplateModel: {
            action_url: link,
            support_email: "ben@bennies.fun"
        }
    });
};

const generateOnboardEmailHtml = (data, username) => {
    return `
        <html>
        <body>
            <h1>Welcome to ${data.universe_id}</h1>
            <p>Dear ${username},</p>
            <p>${data.email_body}</p>
            ${data.goal ? `<p><strong>Goal:</strong> ${data.goal}</p>` : ''}
            ${data.twitter_link ? `<p><a href="${data.twitter_link}">Follow us on Twitter</a></p>` : ''}
            ${data.discord_link ? `<p><a href="${data.discord_link}">Join our Discord</a></p>` : ''}
            ${data.telegram_link ? `<p><a href="${data.telegram_link}">Join our Telegram</a></p>` : ''}
            ${data.project_website ? `<p><a href="${data.project_website}">Visit our website</a></p>` : ''}
            ${data.marketplace_link ? `<p><a href="${data.marketplace_link}">Marketplace</a></p>` : ''}
            ${data.contact_name && data.contact_info ? `<p>Contact ${data.contact_name} at <a href="mailto:${data.contact_info}">${data.contact_info}</a></p>` : ''}
            ${data.ip_rights ? `<p><strong>IP Rights:</strong> ${data.ip_rights}</p>` : ''}
        </body>
        </html>
    `;
};

export const sendOnboardingEmail = async (email, username, collectionName, collectionUtility, collectionLink, emailData) => {
    const emailHtml = generateOnboardEmailHtml(emailData, username);

    try {
        await client.sendEmail({
            From: "ben@bennies.fun",
            To: email,
            Subject: `Welcome to ${collectionName}`,
            HtmlBody: emailHtml,
            TextBody: "If you are unable to view this email, please contact support.",
            MessageStream: "outbound"
        });

        console.log(`Onboarding email sent to ${email}`);
    } catch (err) {
        console.error('Error sending onboarding email:', err);
    }
};
