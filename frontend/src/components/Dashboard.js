function Dashboard() {
    const role = localStorage.getItem('role');
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Welcome, {role}</h1>
        {role === 'student' && <p>You can view and enroll in courses.</p>}
        {role === 'instructor' && <p>You can upload lessons.</p>}
        {role === 'admin' && <p>You can manage users and courses.</p>}
      </div>
    );
  }
  
  export default Dashboard;