import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Info } from 'lucide-react'
import { getNotifications, markAllAsRead } from '../api/axios'

const typeIcon = (type) => {
  if (type === 'SUCCESS') return <CheckCircle size={16} color="#16a34a" />
  if (type === 'ERROR') return <XCircle size={16} color="#dc2626" />
  return <Info size={16} color="#2563eb" />
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getNotifications().then(r => setNotifications(r.data))
  }, [])

  const handleMarkAll = async () => {
    await markAllAsRead()
    getNotifications().then(r => setNotifications(r.data))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <span style={{ fontWeight: 600, fontSize: 18 }}>All Notifications</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Notifications</h2>
            <button onClick={handleMarkAll} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13 }}>
              Mark all as read
            </button>
          </div>
          {notifications.map(n => (
            <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6', background: n.isRead ? 'white' : '#eff6ff' }}>
              {typeIcon(n.type)}
              <div>
                <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>{n.message}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#2563eb', fontWeight: 500 }}>Unread</span>}
            </div>
          ))}
          {notifications.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 24 }}>No notifications yet</p>}
        </div>
      </main>
    </div>
  )
}

export default NotificationsPage