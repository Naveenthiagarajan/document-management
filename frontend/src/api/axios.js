import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080' })

export const uploadFiles = (files, onUploadProgress) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  return api.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  })
}

export const getDocuments = () => api.get('/api/documents')
export const getNotifications = () => api.get('/api/notifications')
export const getUnreadCount = () => api.get('/api/notifications/unread-count')
export const markAsRead = (id) => api.put(`/api/notifications/${id}/read`)
export const markAllAsRead = () => api.put('/api/notifications/mark-all-read')

export const downloadFile = async (id, filename) => {
  const response = await api.get(`/api/documents/download/${id}`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export default api