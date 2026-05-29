import { useState, useEffect, useRef } from 'react'
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/axios'
import useWebSocket from '../hooks/useWebSocket'

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const typeIcon = (type) => {
  if (type === 'SUCCESS') return <CheckCircle size={14} color="#16a34a" />
  if (type === 'ERROR') return <XCircle size={14} color="#dc2626" />
  return <Info size={14} color="#2563eb" />
}

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const ref = useRef()

  const fetchAll = async () => {
    const [n, u] = await Promise.all([getNotifications(), getUnreadCount()])
    setNotifications(n.data)
    setUnread(u.data)
  }

  useWebSocket((n) => {
    setNotifications(prev => [n, ...prev])
    setUnread(prev => prev + 1)
  })

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkAll = async () => {
    await markAllAsRead()
    fetchAll()
  }

  const handleMarkOne = async (id) => {
    await markAsRead(id)
    fetchAll()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 8 }}>
        <Bell size={22} color="#374151" />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: 2, right: 2, background: '#dc2626', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: 40, width: 320, background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
            <button onClick={handleMarkAll} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all as read</button>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: 24, fontSize: 13 }}>No notifications yet</p>
            )}
            {notifications.slice(0, 10).map(n => (
              <div key={n.id} onClick={() => handleMarkOne(n.id)}
                style={{ display: 'flex', gap: 10, padding: '10px 16px', borderBottom: '1px solid #f9fafb', cursor: 'pointer', background: n.isRead ? 'white' : '#eff6ff' }}>
                <div style={{ marginTop: 2 }}>{typeIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, margin: 0, color: '#374151' }}>{n.message}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <div style={{ width: 8, height: 8, background: '#2563eb', borderRadius: '50%', marginTop: 4 }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell