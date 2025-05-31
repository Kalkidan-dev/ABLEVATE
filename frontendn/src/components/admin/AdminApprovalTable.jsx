import React from 'react';

const AdminApprovalTable = ({ requests, onApprove, onReject }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Institution</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req, i) => (
          <tr key={i}>
            <td>{req.name}</td>
            <td>{req.email}</td>
            <td>{req.institution}</td>
            <td>
              <button onClick={() => onApprove(req.id)}>Approve</button>
              <button onClick={() => onReject(req.id)}>Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminApprovalTable;
