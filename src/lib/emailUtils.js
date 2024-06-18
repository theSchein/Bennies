import client from "@/lib/postmarkClient";

export const sendVerificationEmail = async (email, link) => {
    await client.sendEmailWithTemplate({
        From: "ben@bennies.fun",
        To: email,
        TemplateAlias: "verify",
        TemplateModel: {
            action_url: link,
            support_email: "ben@bennies.fun",
        },
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
            support_email: "ben@bennies.fun",
        },
    });
};

export const sendPasswordResetEmail = async (email, link) => {
    await client.sendEmailWithTemplate({
        From: "ben@bennies.fun",
        To: email,
        TemplateAlias: "password-reset",
        TemplateModel: {
            action_url: link,
            support_email: "ben@bennies.fun",
        },
    });
};

const generateOnboardEmailHtml = (
    data,
    username,
    collectionName,
    collectionLink,
) => {const generateOnboardEmailHtml = (
  data,
  username,
  collectionName,
  collectionLink,
) => {
  const twitterBaseUrl = "https://twitter.com/";
  const discordBaseUrl = "https://discord.com/invite/";
  const telegramBaseUrl = "https://telegram.me/";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Lato', sans-serif; background-color: #E1F0DA; color: #294B29; margin: 0; padding: 0; }
        .header { background-color: #99BC85; padding: 20px; text-align: center; }
        .header img { width: 100px; }
        .content { padding: 20px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; }
        h1 { font-family: 'Comfortaa', sans-serif; color: #294B29; }
        h2 { font-family: 'Comfortaa', sans-serif; color: #294B29; margin-top: 20px; }
        p { font-size: 16px; line-height: 1.5; margin: 15px 0; }
        .body-action { margin: 20px 0; text-align: center; }
        .button { background-color: #294B29; color: #E1F0DA; padding: 15px 30px; text-decoration: none; border-radius: 5px; border: none; outline: none; font-size: 16px; display: inline-block; }
        .button:hover { background-color: #50623A; }
        .attributes { margin: 20px 0; }
        .attributes_content { background-color: #D4E7C5; padding: 15px; border-radius: 5px; }
        .attributes_item { padding: 5px 0; }
        .footer { background-color: #99BC85; padding: 20px; text-align: center; }
        .footer a { color: #294B29; text-decoration: none; }
        .sub { color: #789461; font-size: 12px; }
        .social-links { margin: 20px 0; text-align: center; }
        .social-links table { margin: 0 auto; }
        .social-links td { padding: 0 10px; text-align: center; }
        .social-links img { width: 24px; height: 24px; display: block; margin: 0 auto; }
        .social-links a { color: #294B29; text-decoration: none; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/bennies_logo.png" alt="Bennies Logo">
      </div>
      <div class="content">
        <h1>Hi ${username}!</h1>     
        <p>${data.email_body}</p>     
        <h2>Listing</h2>
        <div class="body-action">
          <a href="${collectionLink}" class="button" target="_blank">${collectionName}</a>
        </div>

        
        ${data.goal ? `<div class="attributes"><h3>Goal</h3><div class="attributes_content">${data.goal}</div></div>` : ""}
        
        <div class="social-links">
          <table>
            <tr>
              ${data.twitter_link ? `<td><a href="${twitterBaseUrl}${data.twitter_link.slice(1)}" target="_blank"><img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/twitter_logo.png" alt="Twitter"><br>${data.twitter_link}</a></td>` : ""}
              ${data.discord_link ? `<td><a href="${discordBaseUrl}${data.discord_link.slice(1)}" target="_blank"><img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/discord_logo.png" alt="Discord"><br>${data.discord_link}</a></td>` : ""}
              ${data.telegram_link ? `<td><a href="${telegramBaseUrl}${data.telegram_link.slice(1)}" target="_blank"><img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/telegram_logo.png" alt="Telegram"><br>${data.telegram_link}</a></td>` : ""}
            </tr>
          </table>
        </div>
        
        ${data.project_website ? `<p><a href="${data.project_website}">Visit our website</a></p>` : ""}
        ${data.marketplace_link ? `<p><a href="${data.marketplace_link}">Marketplace</a></p>` : ""}
        ${data.contact_name && data.contact_info ? `<p>Contact ${data.contact_name} at <a href="mailto:${data.contact_info}">${data.contact_info}</a></p>` : ""}
        ${data.perks ? `<div class="attributes"><h3>Ownership Perks</h3><div class="attributes_content">${data.ip_rights}</div></div>` : ""}
      </div>
      <div class="footer">
        <p class="sub">If you're having trouble with the button above, copy and paste the URL below into your web browser.</p>
        <p class="sub">${collectionLink}</p>
      </div>
    </body>
    </html>
  `;
};
    const twitterBaseUrl = "https://twitter.com/";
    const discordBaseUrl = "https://discord.com/invite/";
    const telegramBaseUrl = "https://telegram.me/";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Lato', sans-serif; background-color: #E1F0DA; color: #294B29; margin: 0; padding: 0; }
          .header { background-color: #99BC85; padding: 20px; text-align: center; }
          .header img { width: 100px; }
          .content { padding: 20px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; }
          h1 { font-family: 'Comfortaa', sans-serif; color: #294B29; }
          h2 { font-family: 'Comfortaa', sans-serif; color: #294B29; margin-top: 20px; }
          p { font-size: 16px; line-height: 1.5; margin: 15px 0; }
          .body-action { margin: 20px 0; text-align: center; }
          .button { background-color: #294B29; color: #E1F0DA; padding: 15px 30px; text-decoration: none; border-radius: 5px; border: none; outline: none; font-size: 16px; display: inline-block; }
          .button:hover { background-color: #50623A; }
          .attributes { margin: 20px 0; }
          .attributes_content { background-color: #D4E7C5; padding: 15px; border-radius: 5px; }
          .attributes_item { padding: 5px 0; }
          .footer { background-color: #99BC85; padding: 20px; text-align: center; }
          .footer a { color: #294B29; text-decoration: none; }
          .sub { color: #789461; font-size: 12px; }
          .social-links { margin: 20px 0; text-align: center; }
          .social-links table { margin: 0 auto; }
          .social-links td { padding: 0 10px; text-align: center; }
          .social-links img { width: 24px; height: 24px; display: block; margin: 0 auto; }
          .social-links a { color: #294B29; text-decoration: none; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/bennies_logo.png" alt="Bennies Logo">
        </div>
        <div class="content">
          <h1>Hi ${username}!</h1>     
          <p>${data.email_body}</p>     
          <h2>Listing</h2>
          <div class="body-action">
            <a href="${collectionLink}" class="button" target="_blank">${collectionName}</a>
          </div>

          
          ${data.goal ? `<div class="attributes"><h3>Goal</h3><div class="attributes_content">${data.goal}</div></div>` : ""}
          
          <div class="social-links">
            <table>
              <tr>
                ${data.twitter_link ? `<td><a href="${twitterBaseUrl}${data.twitter_link.slice(1)}" target="_blank"><img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/twitter_logo.png" alt="Twitter"><br>${data.twitter_link}</a></td>` : ""}
                ${data.discord_link ? `<td><a href="${discordBaseUrl}${data.discord_link.slice(1)}" target="_blank"><img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/discord_logo.png" alt="Discord"><br>${data.discord_link}</a></td>` : ""}
                ${data.telegram_link ? `<td><a href="${telegramBaseUrl}${data.telegram_link.slice(1)}" target="_blank"><img src="https://shuk.nyc3.cdn.digitaloceanspaces.com/logo/telegram_logo.png" alt="Telegram"><br>${data.telegram_link}</a></td>` : ""}
              </tr>
            </table>
          </div>
          
          ${data.project_website ? `<p><a href="${data.project_website}">Visit our website</a></p>` : ""}
          ${data.marketplace_link ? `<p><a href="${data.marketplace_link}">Marketplace</a></p>` : ""}
          ${data.contact_name && data.contact_info ? `<p>Contact ${data.contact_name} at <a href="mailto:${data.contact_info}">${data.contact_info}</a></p>` : ""}
          ${data.perks ? `<div class="attributes"><h3>Perks</h3><div class="attributes_content">${data.perks}</div></div>` : ""}
        </div>
        <div class="footer">
          <p class="sub">If you're having trouble with the button above, copy and paste the URL below into your web browser.</p>
          <p class="sub">${collectionLink}</p>
        </div>
      </body>
      </html>
    `;
};

export const sendOnboardingEmail = async (
    email,
    username,
    collectionName,
    collectionLink,
    emailData,
) => {
    const emailHtml = generateOnboardEmailHtml(
        emailData,
        username,
        collectionName,
        collectionLink,
    );

    try {
        await client.sendEmail({
            From: "ben@bennies.fun",
            To: email,
            Subject: `Welcome to ${collectionName}`,
            HtmlBody: emailHtml,
            TextBody:
                "If you are unable to view this email, please contact support.",
            MessageStream: "outbound",
        });
    } catch (err) {
        console.error("Error sending onboarding email:", err);
    }
};
