const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const fetchTeachers = async (token) => {
  const response = await fetch(`${BASE_URL}/api/teachers`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const createTeacher = async (teacherData, token) => {
  const response = await fetch(`${BASE_URL}/api/teachers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(teacherData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const updateTeacher = async (teacherId, teacherData, token) => {
  const response = await fetch(`${BASE_URL}/api/teachers/${teacherId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(teacherData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const deleteTeacher = async (teacherId, token) => {
  const response = await fetch(`${BASE_URL}/api/teachers/${teacherId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};