// components/ResendVerificationButton.js
import { useState } from 'react';

function ResendVerificationButton({ email }) {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resendVerificationEmail = () => {
        setIsLoading(true);
        fetch('/api/auth/resendVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => response.json())
        .then(data => {
            setMessage(data.message || data.error);
            setIsLoading(false);
        })
        .catch(error => {
            setMessage('Failed to resend verification email.');
            setIsLoading(false);
        });
    };

    return (
        <div>
            <button onClick={resendVerificationEmail} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResendVerificationButton;
