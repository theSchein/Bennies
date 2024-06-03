// components/hooks/useOnboardingEmailForm.js
import { useState, useEffect } from 'react';

const useOnboardingEmailForm = (universeId) => {
    const [emailBody, setEmailBody] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [discordLink, setDiscordLink] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [goal, setGoal] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [ipRights, setIpRights] = useState('');
    const [projectWebsite, setProjectWebsite] = useState('');
    const [marketplaceLink, setMarketplaceLink] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {
        const fetchOnboardingEmail = async () => {
            try {
                const response = await fetch(`/api/user_profile/getOnboardingEmail?universeId=${universeId}`);
                const data = await response.json();
                if (data) {
                    setEmailBody(data.email_body);
                    setTwitterLink(data.twitter_link);
                    setDiscordLink(data.discord_link);
                    setTelegramLink(data.telegram_link);
                    setGoal(data.goal);
                    setContactName(data.contact_name);
                    setContactInfo(data.contact_info);
                    setIpRights(data.ip_rights);
                    setProjectWebsite(data.project_website);
                    setMarketplaceLink(data.marketplace_link);
                }
            } catch (error) {
                console.error('Error fetching onboarding email:', error);
            }
        };

        if (universeId) {
            fetchOnboardingEmail();
        }
    }, [universeId]);

    const handleFormSubmit = async (e, formData) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/user_profile/updateOnboardingEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setModalMessage('Onboarding email updated successfully.');
            } else {
                setModalMessage('Failed to update onboarding email.');
            }
        } catch (error) {
            console.error('Error updating onboarding email:', error);
            setModalMessage('An error occurred. Please try again.');
        }

        setIsAlertOpen(true);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
    };

    return {
        emailBody,
        setEmailBody,
        twitterLink,
        setTwitterLink,
        discordLink,
        setDiscordLink,
        telegramLink,
        setTelegramLink,
        goal,
        setGoal,
        contactName,
        setContactName,
        contactInfo,
        setContactInfo,
        ipRights,
        setIpRights,
        projectWebsite,
        setProjectWebsite,
        marketplaceLink,
        setMarketplaceLink,
        modalMessage,
        isAlertOpen,
        handleFormSubmit,
        closeAlert
    };
};

export default useOnboardingEmailForm;
