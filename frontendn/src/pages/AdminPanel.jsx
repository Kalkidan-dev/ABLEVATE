// Directory: src/pages/AdminPanel.jsx
import React from 'react';
import AdminApprovalTable from '../components/admin/AdminApprovalTable';

const AdminPanel = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <AdminApprovalTable />
    </div>
  );
};

export default AdminPanel;