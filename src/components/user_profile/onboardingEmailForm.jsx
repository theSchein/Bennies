// components/user_profile/OnboardingEmailForm.jsx
import React from 'react';
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
        ipRights,
        setIpRights,
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

    return (
        <section className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-6 bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-xl overflow-y-auto" style={{ maxHeight: '80vh' }}>
                <h1 className="text-center text-4xl font-bold text-light-font dark:text-dark-quaternary mb-6">
                    Edit Onboarding Email
                </h1>
                <form onSubmit={(e) => handleFormSubmit(e, { universeId, emailBody, twitterLink, discordLink, telegramLink, goal, contactName, contactInfo, ipRights, projectWebsite, marketplaceLink, sendTestEmail })} className="space-y-6 text-light-font dark:text-dark-quaternary">
                    <div>
                        <label htmlFor="emailBody" className="block text-sm font-medium">
                            Email Body
                        </label>
                        <textarea
                            id="emailBody"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="twitterLink" className="block text-sm font-medium">
                            Twitter Link
                        </label>
                        <input
                            type="text"
                            id="twitterLink"
                            value={twitterLink}
                            onChange={(e) => setTwitterLink(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="discordLink" className="block text-sm font-medium">
                            Discord Link
                        </label>
                        <input
                            type="text"
                            id="discordLink"
                            value={discordLink}
                            onChange={(e) => setDiscordLink(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="telegramLink" className="block text-sm font-medium">
                            Telegram Link
                        </label>
                        <input
                            type="text"
                            id="telegramLink"
                            value={telegramLink}
                            onChange={(e) => setTelegramLink(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium">
                            Goal of the Community
                        </label>
                        <textarea
                            id="goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            rows="3"
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
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="ipRights" className="block text-sm font-medium">
                            IP Rights
                        </label>
                        <textarea
                            id="ipRights"
                            value={ipRights}
                            onChange={(e) => setIpRights(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            rows="3"
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
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
