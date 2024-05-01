// pages/verify-email/[...token].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function VerifyEmail() {
    const router = useRouter();
    const { token } = router.query; // Assuming token is correctly formed in [...token].js
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            fetch(`/api/auth/verifyEmail?token=${token}`)
                .then(res => res.json())
                .then(data => {
                    setMessage(data.message || data.error);
                    if (data.message) {
                        // Redirect to home or login page after a delay
                        setTimeout(() => {
                            router.push('/'); // or wherever you want to direct the user
                        }, 5000); // 5 seconds delay
                    }
                })
                .catch(err => {
                    setMessage('Failed to verify email. Please try again.');
                });
        }
    }, [token, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-lg">
                <h1 className="text-lg font-bold">Email Verification</h1>
                {message ? (
                    <p>{message}</p>
                ) : (
                    <p>Verifying your email address, please wait...</p>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
