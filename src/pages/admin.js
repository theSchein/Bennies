// pages/admin.js
// TODO: password protect this page
import ProjectAdminApplications from "@/components/admin/projectAdminApplications";

export default function AdminPage() {


    return (
        <div>
            <h1>Admin Dashboard</h1>

            <div>
                <h2>Manage Project Admin Applications</h2>
                <ProjectAdminApplications />
            </div>

        </div>
    );
}
