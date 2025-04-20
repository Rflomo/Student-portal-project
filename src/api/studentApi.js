import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

// Configure axios defaults
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

export const getAllStudents = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError('fetching students', error);
    throw error;
  }
};

export const addStudent = async (student) => {
  try {
    const response = await axios.post(API_URL, student, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError('adding student', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError('deleting student', error);
    throw error;
  }
};

export const updateStudent = async (id, updatedStudent) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedStudent, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError('updating student', error);
    throw error;
  }
};

// Helper function for error handling
const handleApiError = (operation, error) => {
  if (error.response) {
    if (error.response.status === 401) {
      console.error(`Authentication error while ${operation}`);
      window.location.href = '/login';
    } else {
      console.error(`Server error while ${operation}:`, error.response.data);
    }
  } else if (error.request) {
    console.error(`No response received while ${operation}`);
  } else {
    console.error(`Error ${operation}:`, error.message);
  }
};

// Add response interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);