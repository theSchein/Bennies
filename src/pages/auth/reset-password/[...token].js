import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function ResetPassword() {
    const router = useRouter();
    const { token } = router.query; // Assuming token is correctly formed in [...token].js
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        if (token && token.length) {
            const fullToken = token.join('/'); // Join all parts to form the full token
            fetch(`/api/auth/validateToken?token=${encodeURIComponent(fullToken)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.isValid) {
                        setIsValidToken(true);
                    } else {
                        setMessage("Invalid or expired token.");
                    }
                })
                .catch(() => setMessage("Failed to validate token."));
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isValidToken) {
            setMessage("Invalid or expired token.");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        const fullToken = token.join('/'); // Ensure the token is properly formatted
        const response = await fetch('/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: fullToken, newPassword: password }),
        });

        const data = await response.json();
        if (data.message === "Password successfully reset") {
            setMessage("Your password has been successfully reset. Redirecting to homepage...");
            setTimeout(() => router.push('/'), 5000); // Redirect after 5 seconds
        } else {
            setMessage(data.message || "Failed to reset password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary">
            <div className="p-9 max-w-lg w-full bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-light-quaternary dark:text-dark-quaternary mb-4">Set New Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full p-3 border border-light-quaternary dark:border-dark-quaternary rounded-lg focus:outline-none focus:ring-2 focus:ring-light-primary"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full p-3 border border-light-quaternary dark:border-dark-quaternary rounded-lg focus:outline-none focus:ring-2 focus:ring-light-primary"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn">
                        Reset Password
                    </button>
                </form>
                {message && <p className="mt-4 bold italic text-center text-light-quaternary dark:text-dark-primary">{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
