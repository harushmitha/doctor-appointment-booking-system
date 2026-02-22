import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorAPI, appointmentAPI } from '../services/api';

const PatientDashboard = ({ user, onLogout }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    date: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.split('/').pop();
    return ['appointments', 'doctors'].includes(path) ? path : 'appointments';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/patient/${tab}`);
  };

  const fetchDashboardData = async () => {
    if (!user) return; // Don't fetch if user is not available yet
    
    try {
    //console.log('Fetching dashboard data...');
      const [doctorsData, appointmentsData] = await Promise.all([
        doctorAPI.getAllDoctors(),
        appointmentAPI.getAllAppointments()
      ]);

    //console.log('Doctors data:', doctorsData);
   // console.log('Appointments data:', appointmentsData);

      setDoctors(doctorsData);
      // Filter appointments for current user (in real app, this would be done on backend)
      const userAppointments = appointmentsData.filter(apt => 
        apt.patientName.toLowerCase().includes(user.username.toLowerCase())
      );
    //console.log('User appointments:', userAppointments);
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    if (!user) {
      toast.error('User information not available');
      return;
    }
    setSelectedDoctor(doctor);
    setBookingData({ patientName: user.username, date: '' });
    setShowBooking(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      console.log('Booking appointment with data:', {
        doctorId: selectedDoctor.id,
        patientName: bookingData.patientName,
        date: bookingData.date
      });
      
      await appointmentAPI.bookAppointment(
        selectedDoctor.id,
        bookingData.patientName,
        bookingData.date
      );
      toast.success('Appointment booked successfully');
      setShowBooking(false);
      setSelectedDoctor(null);
      setBookingData({ patientName: '', date: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment: ' + error.message);
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => new Date(apt.date) >= today);
  };

  const getPastAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => new Date(apt.date) < today);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading patient dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Patient Dashboard</h1>
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
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => handleTabChange('appointments')}
        >
          My Appointments
        </button>
        <button 
          className={activeTab === 'doctors' ? 'active' : ''}
          onClick={() => handleTabChange('doctors')}
        >
          Find Doctors
        </button>
      </nav>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="appointments" replace />} />
          <Route path="/appointments" element={
            <AppointmentsSection 
              appointments={appointments}
              getUpcomingAppointments={getUpcomingAppointments}
              getPastAppointments={getPastAppointments}
            />
          } />
          <Route path="/doctors" element={
            <DoctorsSection 
              doctors={doctors}
              showBooking={showBooking}
              setShowBooking={setShowBooking}
              selectedDoctor={selectedDoctor}
              bookingData={bookingData}
              setBookingData={setBookingData}
              handleBookAppointment={handleBookAppointment}
              handleSubmitBooking={handleSubmitBooking}
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

// Appointments Section Component
const AppointmentsSection = ({ appointments, getUpcomingAppointments, getPastAppointments }) => (
  <div className="appointments-section">
    <div className="appointments-overview">
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div className="stat-content">
          <h3>{getUpcomingAppointments().length}</h3>
          <p>Upcoming Appointments</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        </div>
        <div className="stat-content">
          <h3>{getPastAppointments().length}</h3>
          <p>Completed Appointments</p>
        </div>
      </div>
    </div>

    <div className="appointments-list-section">
      <h2>Upcoming Appointments</h2>
      {getUpcomingAppointments().length > 0 ? (
        <div className="appointments-list">
          {getUpcomingAppointments().map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-date">
                <span className="date">{new Date(appointment.date).getDate()}</span>
                <span className="month">
                  {new Date(appointment.date).toLocaleDateString('en', { month: 'short' })}
                </span>
              </div>
              <div className="appointment-details">
                <h3>{appointment.doctor.name}</h3>
                <p>{appointment.doctor.specialization}</p>
                <span className="appointment-time">{appointment.date}</span>
              </div>
              <div className="appointment-status">
                <span className="status-badge upcoming">Upcoming</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3>No upcoming appointments</h3>
          <p>Book an appointment with a doctor to get started</p>
        </div>
      )}

      {getPastAppointments().length > 0 && (
        <>
          <h2>Past Appointments</h2>
          <div className="appointments-list">
            {getPastAppointments().map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-date">
                  <span className="date">{new Date(appointment.date).getDate()}</span>
                  <span className="month">
                    {new Date(appointment.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                </div>
                <div className="appointment-details">
                  <h3>{appointment.doctor.name}</h3>
                  <p>{appointment.doctor.specialization}</p>
                  <span className="appointment-time">{appointment.date}</span>
                </div>
                <div className="appointment-status">
                  <span className="status-badge completed">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);

// Doctors Section Component
const DoctorsSection = ({ 
  doctors, 
  showBooking, 
  setShowBooking, 
  selectedDoctor, 
  bookingData, 
  setBookingData, 
  handleBookAppointment, 
  handleSubmitBooking 
}) => (
  <div className="doctors-section">
    <div className="section-header">
      <h2>Available Doctors</h2>
      <p>Find and book appointments with our qualified doctors</p>
    </div>

    {showBooking && selectedDoctor && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Book Appointment with {selectedDoctor.name}</h3>
            <button 
              onClick={() => setShowBooking(false)}
              className="close-btn"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmitBooking} className="modal-form">
            <div className="doctor-info-card">
              <h4>{selectedDoctor.name}</h4>
              <p>{selectedDoctor.specialization}</p>
            </div>
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                value={bookingData.patientName}
                onChange={(e) => setBookingData({...bookingData, patientName: e.target.value})}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="form-group">
              <label>Appointment Date</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowBooking(false)}>
                Cancel
              </button>
              <button type="submit">Book Appointment</button>
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
            <button 
              onClick={() => handleBookAppointment(doctor)}
              className="book-btn"
            >
              Book Appointment
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PatientDashboard;