// components/ui/Modal.jsx
import React, { useEffect } from "react";

function Modal({ isOpen, onClose, children }) {
    // Add event listener to close the modal on pressing the Escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    // Function to handle the click event
    const handleBackdropClick = (event) => {
        // Check if the click is on the backdrop
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={handleBackdropClick} // Add the click event listener to the backdrop
        >
            <div className=" p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
