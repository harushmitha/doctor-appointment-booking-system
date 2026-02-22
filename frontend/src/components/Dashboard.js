import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch user role from backend
  const fetchUserRole = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
      //console.log('User data from backend:', userData);
        return userData.role;
      } else {
        console.error('Failed to fetch user role from backend');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
    
    // If backend call fails, return default role
    return 'PATIENT';
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
       // console.log('JWT Payload:', payload);
          
          const username = payload.sub || payload.username;
          let role = payload.role;
          
          // Always fetch role from backend since JWT doesn't contain it yet
          if (!role) {
          //console.log('No role in token, fetching from backend...');
            role = await fetchUserRole(username);
          }
          
          setUser({
            username: username,
            role: role
          });
          
     //   console.log('User set:', { username, role });
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Dispatch custom event to notify App.js of token change
    window.dispatchEvent(new Event('tokenChanged'));
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to={user.role.toLowerCase()} replace />} 
      />
      <Route 
        path="/admin/*" 
        element={
          user.role === 'ADMIN' ? 
          <AdminDashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to={user.role.toLowerCase()} replace />
        } 
      />
      <Route 
        path="/doctor/*" 
        element={
          user.role === 'DOCTOR' ? 
          <DoctorDashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to={user.role.toLowerCase()} replace />
        } 
      />
      <Route 
        path="/patient/*" 
        element={
          user.role === 'PATIENT' ? 
          <PatientDashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to={user.role.toLowerCase()} replace />
        } 
      />
    </Routes>
  );
};

export default Dashboard;