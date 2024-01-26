// components/alert.js

export default function AlertModal({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-light-tertiary dark:bg-dark-primary text-light-quaternary dark:text-dark-quaternary p-8 sm:p-10 rounded-lg shadow-lg">
                <p className="mb-4 font-bold">{message}</p>
                <button
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-light-primary to-light-quaternary dark:from-dark-secondary dark:to-dark-tertiary text-light-primary dark:text-dark-primary rounded-lg font-body hover:from-yellow-600 hover:to-amber-950 dark:hover:from-yellow-600 dark:hover:to-amber-950 transition duration-300"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
