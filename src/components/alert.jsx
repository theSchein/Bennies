// components/alert.js

export default function AlertModal({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-light-tertiary dark:bg-dark-primary text-light-font dark:text-dark-quaternary p-8 sm:p-10 rounded-lg shadow-lg w-3/4 sm:w-1/2 lg:w-1/3">
                <p className="mb-4 font-bold text-center">{message}</p>
                <div className="flex justify-center">
                    <button
                        className="btn w-full sm:w-auto py-2 sm:py-3 font-body"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
