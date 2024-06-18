import React, { useState, useEffect } from 'react';
import AlertModal from '../alert';
import useOnboardingEmailForm from '../hooks/useOnboardingEmailForm';

function OnboardingEmailForm({ universeId }) {
    const {
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
        perks,
        setPerks,
        projectWebsite,
        setProjectWebsite,
        marketplaceLink,
        setMarketplaceLink,
        sendTestEmail,
        setSendTestEmail,
        modalMessage,
        isAlertOpen,
        handleFormSubmit,
        closeAlert
    } = useOnboardingEmailForm(universeId);

    const [lockedFields, setLockedFields] = useState({
        emailBody: true,
        twitterLink: true,
        discordLink: true,
        telegramLink: true,
        goal: true,
        contactName: true,
        contactInfo: true,
        perks: true,
        projectWebsite: true,
        marketplaceLink: true,
    });

    const unlockField = (field) => {
        setLockedFields((prevState) => ({ ...prevState, [field]: false }));
    };

    return (
        <section className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-6 bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
                <h1 className="text-center text-4xl font-bold text-light-font dark:text-dark-quaternary mb-6">
                    Edit Onboarding Email
                </h1>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleFormSubmit(e, {
                        universeId,
                        emailBody,
                        twitterLink,
                        discordLink,
                        telegramLink,
                        goal,
                        contactName,
                        contactInfo,
                        perks,
                        projectWebsite,
                        marketplaceLink,
                        sendTestEmail
                    });
                }} className="space-y-6 text-light-font dark:text-dark-quaternary">
                    <div>
                        <label htmlFor="emailBody" className="block text-sm font-medium">
                            Email Body
                        </label>
                        <textarea
                            id="emailBody"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            onClick={() => lockedFields.emailBody && unlockField('emailBody')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.emailBody ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            rows="5"
                            readOnly={lockedFields.emailBody}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="twitterLink" className="block text-sm font-medium">
                            Twitter Handle
                        </label>
                        <div className="flex items-center">
                            <span className="px-2">@</span>
                            <input
                                type="text"
                                id="twitterLink"
                                value={twitterLink}
                                onChange={(e) => setTwitterLink(e.target.value)}
                                onClick={() => lockedFields.twitterLink && unlockField('twitterLink')}
                                className={`mt-1 block w-full p-2 border ${lockedFields.twitterLink ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                                readOnly={lockedFields.twitterLink}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="discordLink" className="block text-sm font-medium">
                            Discord Handle
                        </label>
                        <div className="flex items-center">
                            <span className="px-2">@</span>
                            <input
                                type="text"
                                id="discordLink"
                                value={discordLink}
                                onChange={(e) => setDiscordLink(e.target.value)}
                                onClick={() => lockedFields.discordLink && unlockField('discordLink')}
                                className={`mt-1 block w-full p-2 border ${lockedFields.discordLink ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                                readOnly={lockedFields.discordLink}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="telegramLink" className="block text-sm font-medium">
                            Telegram Handle
                        </label>
                        <div className="flex items-center">
                            <span className="px-2">@</span>
                            <input
                                type="text"
                                id="telegramLink"
                                value={telegramLink}
                                onChange={(e) => setTelegramLink(e.target.value)}
                                onClick={() => lockedFields.telegramLink && unlockField('telegramLink')}
                                className={`mt-1 block w-full p-2 border ${lockedFields.telegramLink ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                                readOnly={lockedFields.telegramLink}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium">
                            Goal of the Community
                        </label>
                        <textarea
                            id="goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onClick={() => lockedFields.goal && unlockField('goal')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.goal ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            rows="3"
                            readOnly={lockedFields.goal}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="contactName" className="block text-sm font-medium">
                            Point of Contact Name
                        </label>
                        <input
                            type="text"
                            id="contactName"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            onClick={() => lockedFields.contactName && unlockField('contactName')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.contactName ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            readOnly={lockedFields.contactName}
                        />
                    </div>
                    <div>
                        <label htmlFor="contactInfo" className="block text-sm font-medium">
                            Point of Contact Info (number, email, handle)
                        </label>
                        <input
                            type="text"
                            id="contactInfo"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            onClick={() => lockedFields.contactInfo && unlockField('contactInfo')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.contactInfo ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            readOnly={lockedFields.contactInfo}
                        />
                    </div>
                    <div>
                        <label htmlFor="perks" className="block text-sm font-medium">
                            Ownership Perks
                        </label>
                        <textarea
                            id="perks"
                            value={perks}
                            onChange={(e) => setPerks(e.target.value)}
                            onClick={() => lockedFields.perks && unlockField('perks')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.perks ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            rows="3"
                            readOnly={lockedFields.perks}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="projectWebsite" className="block text-sm font-medium">
                            Project Website
                        </label>
                        <input
                            type="text"
                            id="projectWebsite"
                            value={projectWebsite}
                            onChange={(e) => setProjectWebsite(e.target.value)}
                            onClick={() => lockedFields.projectWebsite && unlockField('projectWebsite')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.projectWebsite ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            readOnly={lockedFields.projectWebsite}
                        />
                    </div>
                    <div>
                        <label htmlFor="marketplaceLink" className="block text-sm font-medium">
                            Secondary Marketplace Link
                        </label>
                        <input
                            type="text"
                            id="marketplaceLink"
                            value={marketplaceLink}
                            onChange={(e) => setMarketplaceLink(e.target.value)}
                            onClick={() => lockedFields.marketplaceLink && unlockField('marketplaceLink')}
                            className={`mt-1 block w-full p-2 border ${lockedFields.marketplaceLink ? 'border-gray-300 bg-gray-200' : 'border-gray-300'} rounded`}
                            readOnly={lockedFields.marketplaceLink}
                        />
                    </div>
                    <div>
                        <label htmlFor="sendTestEmail" className="block text-sm font-medium">
                            Send Test Email
                        </label>
                        <input
                            type="checkbox"
                            id="sendTestEmail"
                            checked={sendTestEmail}
                            onChange={(e) => setSendTestEmail(e.target.checked)}
                            className="mt-1"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-light-secondary dark:bg-dark-secondary rounded-md shadow-md hover:bg-light-tertiary dark:hover:bg-dark-tertiary text-light-primary dark:text-dark-primary"
                    >
                        Update Email
                    </button>
                </form>
            </div>
            {isAlertOpen && (
                <AlertModal isOpen={isAlertOpen} message={modalMessage} onClose={closeAlert} />
            )}
        </section>
    );
}

export default OnboardingEmailForm;
