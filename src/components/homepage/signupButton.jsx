// components/homepage/SignupButton.jsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Modal from "../ui/Modal";
import AuthForm from "../auth/authForm";

export default function SignupButton() {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            setIsModalOpen(false); // Close the modal if user is already signed in
        }
    }, [session]);

    const handleButtonClick = () => {
        if (session) {
            router.push("/profile");
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="mt-4 w-full">
            <button
                onClick={handleButtonClick}
                className="px-8 py-4 btn w-full text-2xl font-bold"
            >
                {session ? `Welcome, ${session.user.name}` : "Sign Up!"}
            </button>
            {!session && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <AuthForm />
                </Modal>
            )}
        </div>
    );
}
