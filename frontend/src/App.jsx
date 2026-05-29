import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import NotificationsPage from './pages/NotificationsPage'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App