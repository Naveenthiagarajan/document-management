import { useState, useRef } from 'react'
import { Upload, File, CheckCircle, XCircle, Loader } from 'lucide-react'
import { uploadFiles } from '../api/axios'
import { toast } from 'react-toastify'

const FileUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleFiles = (selected) => {
    const arr = Array.from(selected).map(f => ({
      file: f, progress: 0, status: 'pending'
    }))
    setFiles(arr)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    const updated = files.map(f => ({ ...f, status: 'uploading' }))
    setFiles(updated)
    try {
      await uploadFiles(files.map(f => f.file), (e) => {
        const pct = Math.round((e.loaded * 100) / e.total)
        setFiles(prev => prev.map(f => ({ ...f, progress: pct })))
      })
      setFiles(prev => prev.map(f => ({ ...f, progress: 100, status: 'complete' })))
      toast.success('Files uploaded successfully!')
      onUploadComplete()
    } catch {
      setFiles(prev => prev.map(f => ({ ...f, status: 'failed' })))
      toast.error('Upload failed!')
    }
    setUploading(false)
  }

  const statusIcon = (status) => {
    if (status === 'complete') return <CheckCircle size={16} color="green" />
    if (status === 'failed') return <XCircle size={16} color="red" />
    if (status === 'uploading') return <Loader size={16} color="blue" className="spin" />
    return <File size={16} color="gray" />
  }

  const statusColor = (status) => {
    if (status === 'complete') return '#16a34a'
    if (status === 'failed') return '#dc2626'
    if (status === 'uploading') return '#2563eb'
    return '#6b7280'
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 24, border: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Upload Documents</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Drag and drop PDF files or click to browse</p>

      {files.length > 3 && uploading && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#1d4ed8', fontSize: 14 }}>
          Upload in progress — processing {files.length} files in background
        </div>
      )}

      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: '2px dashed #93c5fd', borderRadius: 10, padding: 40, textAlign: 'center', cursor: 'pointer', background: '#f0f9ff' }}
      >
        <Upload size={32} color="#2563eb" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#2563eb', fontWeight: 500 }}>Click to upload <span style={{ color: '#374151' }}>or drag and drop</span></p>
        <p style={{ color: '#9ca3af', fontSize: 13 }}>PDF files only • Max 50MB each</p>
        <input ref={inputRef} type="file" accept=".pdf" multiple hidden onChange={e => handleFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              {statusIcon(f.status)}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span>{f.file.name}</span>
                  <span style={{ color: statusColor(f.status) }}>{f.progress}%</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 4, marginTop: 4 }}>
                  <div style={{ width: `${f.progress}%`, background: statusColor(f.status), height: 4, borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ marginTop: 16, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload