import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentAPI } from '../services/api';

const DoctorDashboard = ({ user, onLogout }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    upcomingAppointments: 0,
    totalPatients: 0
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.split('/').pop();
    return ['appointments', 'patients', 'schedule'].includes(path) ? path : 'appointments';
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
    navigate(`/dashboard/doctor/${tab}`);
  };

  const fetchDashboardData = async () => {
    try {
      const appointmentsData = await appointmentAPI.getAllAppointments();
      
      // Filter appointments for this doctor (in real app, this would be done on backend)
      const doctorAppointments = appointmentsData.filter(apt => 
        apt.doctor.name.toLowerCase().includes(user.username.toLowerCase()) ||
        apt.doctor.name.toLowerCase().includes('dr.')
      );
      
      setAppointments(doctorAppointments);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = doctorAppointments.filter(apt => apt.date === today).length;
      const upcomingAppointments = doctorAppointments.filter(apt => 
        new Date(apt.date) > new Date()
      ).length;
      const uniquePatients = new Set(doctorAppointments.map(apt => apt.patientName)).size;

      setStats({
        todayAppointments,
        upcomingAppointments,
        totalPatients: uniquePatients
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => new Date(apt.date) > today);
  };

  const getPastAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => new Date(apt.date) < today);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading doctor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Doctor Dashboard</h1>
            <p>Welcome back, Dr. {user.username}</p>
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
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => handleTabChange('appointments')}
        >
          Appointments
        </button>
        <button 
          className={activeTab === 'patients' ? 'active' : ''}
          onClick={() => handleTabChange('patients')}
        >
          Patients
        </button>
        <button 
          className={activeTab === 'schedule' ? 'active' : ''}
          onClick={() => handleTabChange('schedule')}
        >
          Schedule
        </button>
      </nav>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="appointments" replace />} />
          <Route path="/appointments" element={
            <AppointmentsSection 
              stats={stats}
              getTodayAppointments={getTodayAppointments}
              getUpcomingAppointments={getUpcomingAppointments}
              formatDate={formatDate}
            />
          } />
          <Route path="/patients" element={
            <PatientsSection 
              appointments={appointments}
              formatDate={formatDate}
            />
          } />
          <Route path="/schedule" element={
            <ScheduleSection 
              appointments={appointments}
              formatDate={formatDate}
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

// Appointments Section Component
const AppointmentsSection = ({ stats, getTodayAppointments, getUpcomingAppointments, formatDate }) => (
  <div className="appointments-section">
    <div className="stats-grid">
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
          <h3>{stats.upcomingAppointments}</h3>
          <p>Upcoming Appointments</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="stat-content">
          <h3>{stats.totalPatients}</h3>
          <p>Total Patients</p>
        </div>
      </div>
    </div>

    <div className="appointments-list-section">
      <h2>Today's Appointments</h2>
      {getTodayAppointments().length > 0 ? (
        <div className="appointments-list">
          {getTodayAppointments().map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-time">
                <span className="time">
                  {new Date(appointment.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="appointment-details">
                <h3>{appointment.patientName}</h3>
                <p>Appointment Date: {formatDate(appointment.date)}</p>
              </div>
              <div className="appointment-actions">
                <button className="action-btn primary">View Details</button>
                <button className="action-btn secondary">Complete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <h3>No appointments today</h3>
          <p>You have no scheduled appointments for today</p>
        </div>
      )}

      {getUpcomingAppointments().length > 0 && (
        <>
          <h2>Upcoming Appointments</h2>
          <div className="appointments-list">
            {getUpcomingAppointments().slice(0, 5).map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-date">
                  <span className="date">{new Date(appointment.date).getDate()}</span>
                  <span className="month">
                    {new Date(appointment.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                </div>
                <div className="appointment-details">
                  <h3>{appointment.patientName}</h3>
                  <p>{formatDate(appointment.date)}</p>
                </div>
                <div className="appointment-status">
                  <span className="status-badge upcoming">Scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);

// Patients Section Component
const PatientsSection = ({ appointments, formatDate }) => (
  <div className="patients-section">
    <h2>Patient List</h2>
    <div className="patients-list">
      {[...new Set(appointments.map(apt => apt.patientName))].map((patientName, index) => {
        const patientAppointments = appointments.filter(apt => apt.patientName === patientName);
        const lastAppointment = patientAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        return (
          <div key={index} className="patient-card">
            <div className="patient-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="patient-info">
              <h3>{patientName}</h3>
              <p>Total Appointments: {patientAppointments.length}</p>
              <p>Last Visit: {formatDate(lastAppointment.date)}</p>
            </div>
            <div className="patient-actions">
              <button className="action-btn primary">View History</button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Schedule Section Component
const ScheduleSection = ({ appointments, formatDate }) => (
  <div className="schedule-section">
    <h2>Schedule Overview</h2>
    <div className="schedule-calendar">
      <div className="calendar-header">
        <h3>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
      </div>
      <div className="schedule-list">
        {appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).map(appointment => (
          <div key={appointment.id} className="schedule-item">
            <div className="schedule-date">
              <span className="date">{new Date(appointment.date).getDate()}</span>
              <span className="month">
                {new Date(appointment.date).toLocaleDateString('en', { month: 'short' })}
              </span>
            </div>
            <div className="schedule-details">
              <h4>{appointment.patientName}</h4>
              <p>{formatDate(appointment.date)}</p>
            </div>
            <div className="schedule-status">
              <span className={`status-badge ${new Date(appointment.date) > new Date() ? 'upcoming' : 'completed'}`}>
                {new Date(appointment.date) > new Date() ? 'Scheduled' : 'Completed'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DoctorDashboard;