//Backend Localhost running Url 
const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // API returns plain token string, not JSON
      const token = await response.text();
      return { token };
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  register: async (username, password, role = 'PATIENT') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
};

export const doctorAPI = {
  getAllDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  addDoctor: async (name, specialization) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, specialization }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add doctor');
      }
      
      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
};

export const appointmentAPI = {
  getAllAppointments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  bookAppointment: async (doctorId, patientName, date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${doctorId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ patientName, date }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      
      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
};
