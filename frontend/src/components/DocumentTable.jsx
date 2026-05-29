import { Download, FileText } from 'lucide-react'
import { downloadFile } from '../api/axios'

const formatSize = (bytes) => {
  if (!bytes) return '-'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (date) => new Date(date).toLocaleString()

const statusStyle = (status) => {
  const map = {
    COMPLETE: { background: '#dcfce7', color: '#16a34a' },
    FAILED: { background: '#fee2e2', color: '#dc2626' },
    UPLOADING: { background: '#dbeafe', color: '#2563eb' },
    PENDING: { background: '#f3f4f6', color: '#6b7280' }
  }
  return map[status] || map.PENDING
}

const DocumentTable = ({ documents, loading }) => {
  if (loading) return <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>Loading documents...</div>

  if (!documents.length) return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
      <p style={{ color: '#9ca3af' }}>No documents uploaded yet</p>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {['Filename', 'Size', 'Type', 'Upload Date', 'Status', 'Action'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '12px 16px' }}>{doc.originalFilename || doc.filename}</td>
              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{formatSize(doc.fileSize)}</td>
              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{doc.fileType}</td>
              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{formatDate(doc.uploadDate)}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ ...statusStyle(doc.status), padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                  {doc.status}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <button onClick={() => downloadFile(doc.id, doc.originalFilename || doc.filename)}
                  style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Download size={14} /> Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DocumentTable