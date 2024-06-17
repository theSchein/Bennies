// pages/api/user_profile/updateOnboardingEmail.js
import db from '../../../lib/db';
import { sendOnboardingEmail } from '../../../lib/emailUtils';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const {
        universeId,
        emailBody,
        twitterLink,
        discordLink,
        telegramLink,
        goal,
        contactName,
        contactInfo,
        ipRights,
        projectWebsite,
        marketplaceLink,
        sendTestEmail,
        email,
        isTest
    } = req.body;

    if (!universeId || !emailBody) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const existingEmail = await db.oneOrNone('SELECT * FROM onboarding_emails WHERE universe_id = $1', [universeId]);

        if (existingEmail) {
            await db.none(
                `UPDATE onboarding_emails 
                SET email_body = $1, twitter_link = $2, discord_link = $3, telegram_link = $4, goal = $5, contact_name = $6, contact_info = $7, ip_rights = $8, project_website = $9, marketplace_link = $10, updated_at = NOW() 
                WHERE universe_id = $11`,
                [emailBody, twitterLink, discordLink, telegramLink, goal, contactName, contactInfo, ipRights, projectWebsite, marketplaceLink, universeId]
            );
        } else {
            await db.none(
                `INSERT INTO onboarding_emails (universe_id, email_body, twitter_link, discord_link, telegram_link, goal, contact_name, contact_info, ip_rights, project_website, marketplace_link) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [universeId, emailBody, twitterLink, discordLink, telegramLink, goal, contactName, contactInfo, ipRights, projectWebsite, marketplaceLink]
            );
        }

        if (sendTestEmail || isTest) {
            const emailData = {
                email_body: emailBody,
                twitter_link: twitterLink,
                discord_link: discordLink,
                telegram_link: telegramLink,
                goal,
                contact_name: contactName,
                contact_info: contactInfo,
                ip_rights: ipRights,
                project_website: projectWebsite,
                marketplace_link: marketplaceLink
            };

            try {
                await sendOnboardingEmail(
                    email || 'bencryptoman@gmail.com',
                    'Manager',
                    'Test Collection',
                    'Test Utility',
                    'https://bennies.fun/test',
                    emailData
                );
            } catch (error) {
                console.error('Failed to send test onboarding email:', error);
                return res.status(500).json({ error: 'Failed to send test email' });
            }
        }

        return res.status(200).json({ message: 'Onboarding email updated successfully' });
    } catch (error) {
        console.error('Error updating onboarding email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
