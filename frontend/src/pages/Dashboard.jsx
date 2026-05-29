import { useState, useEffect } from 'react'
import FileUpload from '../components/FileUpload'
import DocumentTable from '../components/DocumentTable'
import NotificationBell from '../components/NotificationBell'
import { getDocuments } from '../api/axios'

const Dashboard = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDocuments = async () => {
    try {
      const res = await getDocuments()
      setDocuments(res.data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchDocuments() }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
<header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, width: '100%' }}>        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#2563eb', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 16 }}>📄</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 18, color: '#111827' }}>Document Management</span>
        </div>
        <NotificationBell />
      </header>

      <main style={{ width: '100%', padding: 32 }}>
        <FileUpload onUploadComplete={fetchDocuments} />
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Uploaded Documents</h2>
          <DocumentTable documents={documents} loading={loading} />
        </div>
      </main>
    </div>
  )
}

export default Dashboard