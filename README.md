
# 🩸 BLOOD – Blood Bank Management System

> **Donate Blood, Save Lives**

A full-stack blood donation management platform connecting blood donors, hospitals, and inventory systems with AI-powered blood compatibility matching.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.1-black?logo=flask)
![Python](https://img.shields.io/badge/Python-3.8+-3776ab?logo=python)
![AWS](https://img.shields.io/badge/AWS-Ready-orange?logo=amazon-aws)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [AI Blood Compatibility Engine](#-ai-blood-compatibility-engine)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [AWS Deployment](#-aws-deployment)
- [Project Structure](#-project-structure)
- [Default Test Accounts](#-default-test-accounts)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & User Management
- JWT-based secure authentication
- Role-based access control (Donors, Hospitals, Requestors)
- User registration with blood group validation
- Password encryption with Werkzeug

### 🩸 AI-Powered Blood Compatibility
- **Automatic blood group compatibility checking**
- **Smart donor-request matching with scoring**
- Blood group validation using medical standards
- Universal donor/receiver identification
- Compatibility statistics and insights

### 👥 Donor Management
- Donor registration and profile management
- Availability tracking and scheduling
- Unavailable dates management
- Donation history tracking
- Blood group compatibility information
- Verified donor system

### 🏥 Hospital Management
- Hospital registration and verification
- Blood inventory management with expiry tracking
- Blood request creation with urgency levels
- Automatic donor matching for requests
- Request status tracking

### 📊 Blood Requests
- Create requests with blood group, units, and urgency
- Real-time compatible donor matching
- AI-ranked donor recommendations
- Request status management (Open, Accepted, Fulfilled)
- SNS notifications for critical requests (AWS version)

### 📈 Dashboard & Analytics
- Real-time statistics
- Active requests overview
- Available donors count
- Blood inventory tracking
- Donation history visualization

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7.3** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Flask 3.1** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-JWT-Extended** - JWT authentication
- **Werkzeug** - Password hashing
- **Python 3.8+** - Backend language

### AWS Services (Production)
- **DynamoDB** - NoSQL database
- **SNS** - Push notifications
- **EC2 / Elastic Beanstalk** - Application hosting
- **S3** - File storage (optional)
- **CloudWatch** - Monitoring and logging

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │  Donors  │  │Hospitals │  │ Requests │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┴─────────────┴─────────────┘          │
│                         │                                   │
│                    Axios API Client                        │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JSON)
                         │
┌────────────────────────┴────────────────────────────────────┐
│               Flask Backend (JWT Auth)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           AI Blood Compatibility Engine              │  │
│  │  • Blood group validation                            │  │
│  │  • Donor-request matching                            │  │
│  │  • Compatibility scoring                             │  │
│  │  • Universal donor detection                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│         ┌───────────────┴───────────────┐                  │
│         │                               │                  │
│    ┌────▼─────┐                  ┌──────▼──────┐          │
│    │ Local    │                  │  DynamoDB   │          │
│    │In-Memory │    OR            │   (AWS)     │          │
│    │ Storage  │                  │             │          │
│    └──────────┘                  └─────────────┘          │
│                                        │                   │
│                                  ┌─────▼──────┐           │
│                                  │    SNS     │           │
│                                  │Notifications│          │
│                                  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Blood Compatibility Engine

### Blood Compatibility Matrix

Our AI engine implements medical-grade blood compatibility rules:

| Recipient | Can Receive From |
|-----------|------------------|
| **O-** | O- |
| **O+** | O+, O- |
| **A-** | A-, O- |
| **A+** | A+, A-, O+, O- |
| **B-** | B-, O- |
| **B+** | B+, B-, O+, O- |
| **AB-** | A-, B-, AB-, O- |
| **AB+** | All blood groups (Universal Receiver) |

**Special Cases:**
- **O-** is the universal donor (can donate to all groups)
- **AB+** is the universal receiver (can receive from all groups)

### AI Features

1. **Compatibility Checking**
   ```python
   is_compatible("O+", "A+")  # Returns: True
   is_compatible("A+", "O+")  # Returns: False
   ```

2. **Smart Donor Matching**
   - Exact blood group matches get highest score (100)
   - Compatible matches scored by medical preference (70-85)
   - Available donors only
   - Sorted by compatibility score

3. **Donation Statistics**
   - Shows how many blood groups a donor can help
   - Identifies universal donors
   - Marks rare blood groups (A-, B-, AB-, O-)
   - Calculates demand level

4. **Request Enhancement**
   - Automatic compatible donor discovery
   - Real-time donor count for each request
   - Compatibility information display

---

## 🚀 Installation

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BB
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173/`

### 3. Backend Setup

```bash
# Navigate to backend
cd flask_server

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python server.py
```

The backend will be available at `http://127.0.0.1:5000/`

---

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd flask_server
source ../venv/bin/activate  # If using project root venv
python server.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Access the app:** `http://localhost:5173/`

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Run backend with Gunicorn
cd flask_server
gunicorn server:app
```

---

## 📚 API Documentation

### Base URL
- **Local:** `http://localhost:5000`
- **Production:** Your deployed URL

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donor",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "city": "New York"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Donor Endpoints

#### GET `/api/donors`
Get all donors with compatibility info

#### POST `/api/donors/register`
Register donor profile (requires JWT)

#### GET `/api/donors/profile/<email>`
Get donor profile with donation history

#### PATCH `/api/donors/<id>/toggle`
Toggle donor availability

#### PATCH `/api/donors/<id>/record-donation`
Record a donation

### Hospital Endpoints

#### GET `/api/hospitals`
Get all hospitals

#### POST `/api/hospitals`
Add new hospital

### Inventory Endpoints

#### GET `/api/inventory`
Get blood inventory

#### POST `/api/inventory`
Add inventory item

### Request Endpoints

#### GET `/api/requests`
Get all requests with matched donors

#### POST `/api/requests`
Create blood request with automatic donor matching

#### PATCH `/api/requests/<id>`
Update request status

### Statistics

#### GET `/api/stats`
Get dashboard statistics

For complete API documentation, see [flask_server/README.md](flask_server/README.md)

---

## ☁️ AWS Deployment

This application is AWS-ready with full DynamoDB and SNS integration!

### Quick Deploy

1. **Create DynamoDB tables:**
   ```bash
   cd flask_server
   python create_dynamodb_tables.py
   ```

2. **Create SNS topic:**
   ```bash
   aws sns create-topic --name BloodBank_Notifications
   ```

3. **Deploy to Elastic Beanstalk:**
   ```bash
   eb init -p python-3.9 blood-bank-app
   eb create blood-bank-env
   eb deploy
   ```

For detailed AWS deployment instructions, see [flask_server/AWS_DEPLOYMENT_GUIDE.md](flask_server/AWS_DEPLOYMENT_GUIDE.md)

---

## 📁 Project Structure

```
BB/
├── src/                          # React frontend source
│   ├── Components/              # React components
│   │   ├── DashBoard/          # Dashboard components
│   │   ├── Donor/              # Donor management
│   │   ├── Hospitals/          # Hospital components
│   │   ├── Inventory/          # Inventory management
│   │   └── BloodRequests/      # Request components
│   ├── context/                # React Context (Auth)
│   ├── pages/                  # Page components
│   ├── routes/                 # Route configuration
│   ├── services/               # API services
│   └── main.jsx                # App entry point
├── flask_server/               # Backend server
│   ├── server.py               # Local development server
│   ├── server_aws.py           # AWS production server
│   ├── ai_engine.py            # Blood compatibility AI
│   ├── create_dynamodb_tables.py  # AWS setup script
│   ├── test_ai_engine.py       # AI engine tests
│   ├── requirements.txt        # Local dependencies
│   ├── requirements_aws.txt    # AWS dependencies
│   ├── README.md               # Backend documentation
│   └── AWS_DEPLOYMENT_GUIDE.md # AWS setup guide
├── public/                     # Static assets
├── .github/                    # GitHub configuration
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── README.md                   # This file
```

---

## 👤 Default Test Accounts

### Hospital Account
- **Email:** `hospital@gmail.com`
- **Password:** `123456`
- **Role:** Hospital

### Donor Account
- **Email:** `donor@gmail.com`
- **Password:** `123456`
- **Role:** Donor
- **Blood Group:** O+

---

## 🧪 Testing

### Test AI Engine
```bash
cd flask_server
python test_ai_engine.py
```

### Run Frontend Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- CORS protection
- Role-based access control
- Input validation
- Blood group validation
- Protected routes

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Copyright © 2026 Blood Bank Development Team. All rights reserved.

---

## 🆘 Troubleshooting

### Server won't start
- Verify all dependencies are installed
- Check if port 5000/5173 is already in use
- Ensure Python version is 3.8+

### Authentication issues
- Verify JWT token is being sent in Authorization header
- Check token hasn't expired
- Ensure user role matches endpoint requirements

### Blood group errors
- Verify blood group format (e.g., "A+", "O-")
- Check against valid blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-

For more help, check:
- [Backend README](flask_server/README.md)
- [AWS Deployment Guide](flask_server/AWS_DEPLOYMENT_GUIDE.md)

---

## 📞 Support

For issues or questions:
- Check the documentation
- Review CloudWatch logs (AWS deployment)
- Contact the development team

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Blood donation appointment scheduling
- [ ] Integration with hospital management systems
- [ ] Machine learning for demand prediction

---

## 🌟 Acknowledgments

- Built with React, Flask, and AWS
- Inspired by the need to save lives through efficient blood donation management
- Special thanks to all contributors and blood donors worldwide

---

**Made with ❤️ for saving lives**

**Version 2.0.0** | January 2026
