import { useState } from 'react';
import { signIn } from 'next-auth/react';
import AlertModal from '../components/alert';  // Make sure the path is correct

function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleResetRequest = async (e) => {
        e.preventDefault();
        const result = await signIn('email', { email, redirect: false });
        if (result.error) {
            setModalMessage("Failed to send password reset email. Please try again.");
        } else {
            setModalMessage("Check your email for the link to reset your password.");
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <form onSubmit={handleResetRequest}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                />
                <button type="submit">Send reset instructions</button>
            </form>
            <AlertModal isOpen={modalOpen} message={modalMessage} onClose={closeModal} />
        </div>
    );
}

export default PasswordResetRequest;
