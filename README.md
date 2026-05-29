# document-management

# document-management

# Document Management Dashboard

A full-stack Document Management Dashboard built with Spring Boot, React, and MySQL.
Users can upload company PDF documents, track upload progress in real time, and receive
notifications when background processing completes.

---

## Tech Stack

**Frontend**
- React 18 (Vite)
- Axios
- React Router DOM
- STOMP.js + SockJS (WebSocket)
- React Toastify
- Lucide React (icons)
- Livvic font (Google Fonts)

**Backend**
- Java 17
- Spring Boot 4.0.6
- Spring Data JPA
- Spring WebSocket (STOMP)
- Lombok
- Maven

**Database**
- MySQL 8

---

## Features

### Feature 1 — File Upload (Individual & Bulk)
- Drag and drop or click to select PDF files (single or multiple)
- Real-time per-file progress bar with filename and percentage
- Status badges: Pending, Uploading, Complete, Failed
- Files stored on local disk, metadata saved in MySQL
- Uploaded files appear in documents table with download option

### Feature 2 — Smart Notifications for Bulk Uploads
- 3 or fewer files: individual progress bars shown normally
- More than 3 files: blue banner shown immediately —
  "Upload in progress — processing X files in background"
- Real-time WebSocket notification sent when all files are processed
- Notification received even if user navigated away from upload page

### Feature 3 — Notification Center
- Bell icon in header with live unread count badge
- Click bell to open dropdown with last 10 notifications
- Each notification shows message, type icon, time ago, read/unread state
- Mark individual notification as read or mark all as read
- Notifications fetched from backend (not localStorage)
- Persists across page refreshes

---

## Project Structure

document-management/
├── src/
│   ├── main/
│   │   ├── java/com/sws/document_management/
│   │   │   ├── controller/
│   │   │   │   ├── DocumentController.java
│   │   │   │   └── NotificationController.java
│   │   │   ├── model/
│   │   │   │   ├── Document.java
│   │   │   │   └── Notification.java
│   │   │   ├── repository/
│   │   │   │   ├── DocumentRepository.java
│   │   │   │   └── NotificationRepository.java
│   │   │   ├── service/
│   │   │   │   ├── DocumentService.java
│   │   │   │   └── NotificationService.java
│   │   │   ├── websocket/
│   │   │   │   └── WebSocketConfig.java
│   │   │   └── DocumentManagementApplication.java
│   │   └── resources/
│   │       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── DocumentTable.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── NotificationsPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── uploads/         ← uploaded files stored here (gitignored)
├── pom.xml
└── README.md

---

## Database Schema

```sql
CREATE DATABASE document_management;
USE document_management;

CREATE TABLE documents (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  filename      VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  file_size     BIGINT,
  file_type     VARCHAR(50),
  status        ENUM('PENDING','UPLOADING','COMPLETE','FAILED') DEFAULT 'PENDING',
  upload_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_path     VARCHAR(500)
);

CREATE TABLE notifications (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  message    TEXT NOT NULL,
  type       ENUM('SUCCESS','ERROR','INFO') DEFAULT 'INFO',
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Setup & Run Locally

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8
- Maven

### Step 1 — Clone the repository
```bash
git clone https://github.com/Naveenthiagarajan/document-management.git
cd document-management
```

### Step 2 — Setup MySQL
```sql
CREATE DATABASE document_management;
```

### Step 3 — Configure environment

Open `src/main/resources/application.properties` and update:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 4 — Run the backend
```bash
./mvnw spring-boot:run
```
Backend runs on: http://localhost:8080

### Step 5 — Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

---

## API Endpoints

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/documents/upload | Upload one or more PDF files |
| GET | /api/documents | Get all uploaded documents |
| GET | /api/documents/download/{id} | Download a document by ID |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | Get all notifications |
| GET | /api/notifications/unread-count | Get unread count |
| PUT | /api/notifications/{id}/read | Mark one as read |
| PUT | /api/notifications/mark-all-read | Mark all as read |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| ws://localhost:8080/ws | WebSocket connection endpoint |
| /topic/notifications | Subscribe for real-time notifications |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| spring.datasource.url | jdbc:mysql://localhost:3306/document_management | MySQL URL |
| spring.datasource.username | root | MySQL username |
| spring.datasource.password | - | MySQL password |
| file.upload-dir | uploads | Local file storage directory |
| server.port | 8080 | Backend server port |

---

## Git Commit History

This project follows a commit-every-15-minutes discipline:
- `feat: initial Spring Boot project setup with MySQL config`
- `feat: Spring Boot backend complete with all APIs working`
- `feat: React frontend complete with upload UI and notification bell`
- `feat: add all frontend components pages hooks and api`
- `feat: fix sockjs global error, frontend fully working with file upload`

---

## Author

**Naveenthiagarajan**
GitHub: https://github.com/Naveenthiagarajan/document-management