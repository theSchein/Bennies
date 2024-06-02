// components/admin/projectAdminApplications.jsx
import { useState, useEffect } from 'react';

export default function ProjectAdminApplications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('/api/admin/getPendingApplications');
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    const handleApprove = async (applicationId) => {
        try {
            const response = await fetch('/api/admin/approveApplication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId }),
            });

            if (response.ok) {
                setApplications((prev) =>
                    prev.filter((app) => app.application_id !== applicationId)
                );
            } else {
                console.error('Failed to approve application');
            }
        } catch (error) {
            console.error('Error approving application:', error);
        }
    };

    const handleDeny = async (applicationId) => {
        try {
            const response = await fetch('/api/admin/denyApplication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId }),
            });

            if (response.ok) {
                setApplications((prev) =>
                    prev.filter((app) => app.application_id !== applicationId)
                );
            } else {
                console.error('Failed to deny application');
            }
        } catch (error) {
            console.error('Error denying application:', error);
        }
    };

    return (
        <div>
            <h2>Pending Project Admin Applications</h2>
            {applications.length === 0 ? (
                <p>No pending applications</p>
            ) : (
                <ul>
                    {applications.map((app) => (
                        <li key={app.application_id} className="mb-4">
                            <h3>{app.project_name}</h3>
                            <p>Affiliation: {app.affiliation}</p>
                            <p>Contract Addresses: {app.contract_addresses.join(', ')}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleApprove(app.application_id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDeny(app.application_id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                                >
                                    Deny
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
