import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorAPI, appointmentAPI } from '../services/api';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0
  });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.split('/').pop();
    return ['overview', 'doctors', 'appointments'].includes(path) ? path : 'overview';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/admin/${tab}`);
  };

  const fetchDashboardData = async () => {
    try {
      const [doctorsData, appointmentsData] = await Promise.all([
        doctorAPI.getAllDoctors(),
        appointmentAPI.getAllAppointments()
      ]);

      setDoctors(doctorsData);
      setAppointments(appointmentsData);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(
        apt => apt.date === today
      ).length;

      setStats({
        totalDoctors: doctorsData.length,
        totalAppointments: appointmentsData.length,
        todayAppointments
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await doctorAPI.addDoctor(newDoctor.name, newDoctor.specialization);
      toast.success('Doctor added successfully');
      setNewDoctor({ name: '', specialization: '' });
      setShowAddDoctor(false);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to add doctor');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.username}</p>
          </div>
          <div className="header-right">
            <button onClick={onLogout} className="logout-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'doctors' ? 'active' : ''}
          onClick={() => handleTabChange('doctors')}
        >
          Doctors
        </button>
        <button 
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => handleTabChange('appointments')}
        >
          Appointments
        </button>
      </nav>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="/overview" element={<OverviewSection stats={stats} appointments={appointments} />} />
          <Route path="/doctors" element={
            <DoctorsSection 
              doctors={doctors} 
              showAddDoctor={showAddDoctor}
              setShowAddDoctor={setShowAddDoctor}
              newDoctor={newDoctor}
              setNewDoctor={setNewDoctor}
              handleAddDoctor={handleAddDoctor}
            />
          } />
          <Route path="/appointments" element={<AppointmentsSection appointments={appointments} />} />
        </Routes>
      </main>
    </div>
  );
};

// Overview Section Component
const OverviewSection = ({ stats, appointments }) => (
  <div className="overview-section">
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="stat-content">
          <h3>{stats.totalDoctors}</h3>
          <p>Total Doctors</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="stat-content">
          <h3>{stats.totalAppointments}</h3>
          <p>Total Appointments</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div className="stat-content">
          <h3>{stats.todayAppointments}</h3>
          <p>Today's Appointments</p>
        </div>
      </div>
    </div>

    <div className="recent-activity">
      <h2>Recent Appointments</h2>
      <div className="appointments-list">
        {appointments.slice(0, 5).map(appointment => (
          <div key={appointment.id} className="appointment-item">
            <div className="appointment-info">
              <h4>{appointment.patientName}</h4>
              <p>Dr. {appointment.doctor.name} - {appointment.doctor.specialization}</p>
              <span className="appointment-date">{appointment.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Doctors Section Component
const DoctorsSection = ({ doctors, showAddDoctor, setShowAddDoctor, newDoctor, setNewDoctor, handleAddDoctor }) => (
  <div className="doctors-section">
    <div className="section-header">
      <h2>Doctors Management</h2>
      <button 
        onClick={() => setShowAddDoctor(true)}
        className="add-btn"
      >
        Add Doctor
      </button>
    </div>

    {showAddDoctor && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Add New Doctor</h3>
            <button 
              onClick={() => setShowAddDoctor(false)}
              className="close-btn"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleAddDoctor} className="modal-form">
            <div className="form-group">
              <label>Doctor Name</label>
              <input
                type="text"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                placeholder="Enter doctor's name"
                required
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                placeholder="Enter specialization"
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowAddDoctor(false)}>
                Cancel
              </button>
              <button type="submit">Add Doctor</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="doctors-grid">
      {doctors.map(doctor => (
        <div key={doctor.id} className="doctor-card">
          <div className="doctor-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="doctor-info">
            <h3>{doctor.name}</h3>
            <p>{doctor.specialization}</p>
            <span className="doctor-id">ID: {doctor.id}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Appointments Section Component
const AppointmentsSection = ({ appointments }) => (
  <div className="appointments-section">
    <h2>All Appointments</h2>
    <div className="appointments-table">
      <div className="table-header">
        <span>Patient</span>
        <span>Doctor</span>
        <span>Specialization</span>
        <span>Date</span>
      </div>
      {appointments.map(appointment => (
        <div key={appointment.id} className="table-row">
          <span>{appointment.patientName}</span>
          <span>{appointment.doctor.name}</span>
          <span>{appointment.doctor.specialization}</span>
          <span>{appointment.date}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;