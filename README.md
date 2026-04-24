# 🎓 Placement Portal

A comprehensive, full-stack Placement Management System built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). This platform streamlines the recruitment process for students, employers, and administrators.

---

## 🚀 Features

### For Students
- **Smart Dashboard:** View job opportunities and application statuses.
- **Easy Applications:** Apply for jobs with a single click.
- **Selection Celebration:** Premium "Job Secured" interface for successfully placed students.
- **Profile Management:** Manage resumes and personal details.

### For Employers
- **Job Management:** Post, edit, and delete job listings.
- **Applicant Tracking:** View and manage applications (Select/Reject).
- **Automated Notifications:** Notify candidates about their application status.

### For Administrators
- **Insights:** Monitor overall placement statistics.
- **User Management:** Manage student and employer accounts.
- **System Control:** Oversee the entire recruitment workflow.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS3 (Custom Glassmorphism UI), React Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (with Mongoose ODM).
- **Authentication:** JWT (JSON Web Tokens) & HTTP-only Cookies.
- **File Uploads:** Cloudinary (for resumes/images).
- **Notifications:** Automated Email system.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js installed.
- MongoDB Atlas account or local MongoDB.
- Cloudinary account (for file storage).

### 1. Clone the Repository
```bash
git clone https://github.com/SudhanhuAgasti/Placement-Portal.git
cd Placement-Portal
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `config/config.env` file and add your credentials:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_uri
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET_KEY=your_secret_key
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=5
   CLOUDINARY_CLIENT_NAME=your_name
   CLOUDINARY_CLIENT_API=your_api_key
   CLOUDINARY_CLIENT_SECRET=your_secret
   SMTP_SERVICE=gmail
   SMTP_MAIL=your_email
   SMTP_PASSWORD=your_app_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📸 Screenshots

*(Coming Soon - Add your project screenshots here)*

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developed By
**Sudhanshu Kumar Agasti**
- [GitHub](https://github.com/SudhanhuAgasti)
- [LinkedIn](https://www.linkedin.com/in/sudhanshuagasti/) (Update with your link)
- YOU CAN SEE IT NOW HERE !!
