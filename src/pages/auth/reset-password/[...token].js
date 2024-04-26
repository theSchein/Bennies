import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function ResetPassword() {
    const router = useRouter();
    const { token } = router.query; // token will be an array if using [...token].js
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

        const fullToken = token.join('/'); // Join all parts to form the full token
        const response = await fetch('/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: fullToken, newPassword: password }),
        });

        const data = await response.json();
        setMessage(data.message || data.error);
    };

    return (
        <div>
            <h1>Set New Password</h1>
            {message ? (
                <p>{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;
