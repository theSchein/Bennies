// components/user_profile/AdminForm.jsx
import { useState } from 'react';
import useAdminForm from '../hooks/useAdminForm';
import AlertModal from '../alert';

function AdminForm({ userId }) {
    const {
        submitHandler,
        modalIsOpen,
        modalMessage,
        closeModal,
    } = useAdminForm(userId);

    const [projectName, setProjectName] = useState('');
    const [contractAddresses, setContractAddresses] = useState(['']);
    const [affiliation, setAffiliation] = useState('');

    const handleContractAddressChange = (index, value) => {
        const newContractAddresses = [...contractAddresses];
        newContractAddresses[index] = value;
        setContractAddresses(newContractAddresses);
    };

    const addContractAddressField = () => {
        setContractAddresses([...contractAddresses, '']);
    };

    return (
        <section className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-light-primary dark:bg-dark-primary p-6 rounded-lg shadow-xl">
                <h1 className="text-center text-4xl font-bold text-light-font dark:text-dark-quaternary mb-6">
                    Which Project do you manage?
                </h1>
                <form
                    onSubmit={(e) => submitHandler(e, { projectName, contractAddresses, affiliation })}
                    className="space-y-6 text-light-font dark:text-dark-quaternary"
                >
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project Name"
                        className="mb-4 w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <div className="mb-4 w-full">
                        {contractAddresses.map((address, index) => (
                            <input
                                key={index}
                                type="text"
                                value={address}
                                onChange={(e) => handleContractAddressChange(index, e.target.value)}
                                placeholder={`Contract Address ${index + 1}`}
                                className="mb-2 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addContractAddressField}
                            className="text-blue-500"
                        >
                            + Add another contract address
                        </button>
                    </div>
                    <input
                        type="text"
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        placeholder="Your Affiliation to the Project"
                        className="mb-4 w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-light-secondary dark:bg-dark-secondary rounded-md shadow-md hover:bg-light-tertiary dark:hover:bg-dark-tertiary text-light-primary dark:text-dark-primary"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
            {modalIsOpen && (
                <AlertModal
                    isOpen={modalIsOpen}
                    message={modalMessage}
                    onClose={closeModal}                />
            )}
        </section>
    );
}

export default AdminForm;
