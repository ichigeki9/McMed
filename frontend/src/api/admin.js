import axios from 'axios'

function authHeader() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const adminFetchCourses = () =>
  axios.get('/api/courses/admin/', { headers: authHeader() }).then(r => r.data)

export const adminCreateCourse = (data) =>
  axios.post('/api/courses/admin/create/', data, { headers: authHeader() })

export const adminFetchCourse = (id) =>
  axios.get(`/api/courses/admin/${id}/`, { headers: authHeader() }).then(r => r.data)

export const adminUpdateCourse = (id, data) =>
  axios.patch(`/api/courses/admin/${id}/`, data, { headers: authHeader() })

export const adminFetchEnrollments = (courseId) => {
  const params = courseId ? `?course=${courseId}` : ''
  return axios.get(`/api/courses/enrollments/list/${params}`, { headers: authHeader() }).then(r => r.data)
}

export const adminDeleteEnrollment = (id) =>
  axios.delete(`/api/courses/enrollments/${id}/`, { headers: authHeader() })
