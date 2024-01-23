// components/alert.js

export default function AlertModal({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-primary p-8 sm:p-10 rounded-lg shadow-lg">
                <p className="mb-4 font-bold">{message}</p>
                <button
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-yellow-950 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-cyan-700 transition duration-300"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}