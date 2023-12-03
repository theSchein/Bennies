import { useState } from 'react'

export default function WaitlistForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Post data to API endpoint
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            // Handle success scenario
            alert("You've been added to the waitlist!");
        } else {
            // Handle error scenario
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="mt-10 bg-primary p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl max-w-md w-full">
            <h3 className="font-subheading text-xl sm:text-2xl lg:text-2xl mb-4 text-secondary text-center">
                Join Waitlist for Beta
            </h3>
            <form onSubmit={handleSubmit}>
                <input className="w-full p-2 sm:p-3 mb-3 border-2 border-cyan-500 rounded-lg"
                       type="text"
                       placeholder="Name"
                       value={name}
                       onChange={(e) => setName(e.target.value)} />
                <input className="w-full p-2 sm:p-3 mb-3 border-2 border-cyan-500 rounded-lg"
                       type="email"
                       placeholder="Email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)} />
                <button type="submit"
                        className="w-full py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-yellow-950 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-cyan-700 transition duration-300">
                    Submit
                </button>
            </form>
        </div>
    );
}
