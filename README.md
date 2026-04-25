# Blood Bridge - Blood Bank Management System

A web application for managing blood donations, hospital inventories, and donor-request matching.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Blood Compatibility Logic](#blood-compatibility-logic)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [AWS Deployment](#aws-deployment)
- [Project Structure](#project-structure)
- [Default Test Accounts](#default-test-accounts)
- [Contributing](#contributing)

---

## Features

### Authentication & User Management
- JWT-based authentication
- Role-based access control (Donors, Hospitals, Requestors)
- User registration
- Password hashing with Werkzeug

### Blood Compatibility
- Blood group compatibility checking
- Donor-request matching
- Blood group validation

### Donor Management
- Donor registration and profile management
- Availability tracking and scheduling
- Unavailable dates management
- Donation history tracking

### Hospital Management
- Hospital registration
- Blood inventory management
- Blood request creation
- Donor matching for requests
- Request status tracking

### Blood Requests
- Create requests with blood group, units, and urgency
- Donor matching
- Request status management (Open, Accepted, Fulfilled)
- SNS notifications for requests (AWS version)

### Dashboard & Analytics
- Statistics overview
- Active requests tracking
- Available donors count
- Blood inventory tracking
- Donation history

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Flask
- Flask-CORS
- Flask-JWT-Extended
- Werkzeug
- Python

### AWS Services
- DynamoDB
- SNS
- EC2 / Elastic Beanstalk
- S3
- CloudWatch

---

## Architecture

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
│  │              Blood Compatibility Logic               │  │
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

## Blood Compatibility Logic

### Blood Compatibility Matrix

The system implements standard blood compatibility rules:

| Recipient | Can Receive From |
|-----------|------------------|
| **O-** | O- |
| **O+** | O+, O- |
| **A-** | A-, O- |
| **A+** | A+, A-, O+, O- |
| **B-** | B-, O- |
| **B+** | B+, B-, O+, O- |
| **AB-** | A-, B-, AB-, O- |
| **AB+** | All blood groups |

**Special Cases:**
- **O-** is the universal donor
- **AB+** is the universal receiver

### Features

1. **Compatibility Checking**
   ```python
   is_compatible("O+", "A+")  # Returns: True
   is_compatible("A+", "O+")  # Returns: False
   ```

2. **Donor Matching**
   - Exact blood group matches are prioritized
   - Compatible matches are scored based on preference
   - Filters by available donors

3. **Donation Statistics**
   - Shows how many blood groups a donor can donate to
   - Identifies universal donors
   - Calculates demand level

4. **Request Enhancement**
   - Finds compatible donors
   - Shows donor count for each request

---

## Installation

### Prerequisites
- Node.js
- Python
- Git

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

## Running the Application

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

## API Documentation

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
Create blood request with donor matching

#### PATCH `/api/requests/<id>`
Update request status

### Statistics

#### GET `/api/stats`
Get dashboard statistics

For complete API documentation, see [flask_server/README.md](flask_server/README.md)

---

## AWS Deployment

The application supports AWS deployment with DynamoDB and SNS.

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

## Project Structure

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
│   ├── ai_engine.py            # Blood compatibility logic
│   ├── create_dynamodb_tables.py  # AWS setup script
│   ├── test_ai_engine.py       # Engine tests
│   ├── requirements.txt        # Local dependencies
│   ├── requirements_aws.txt    # AWS dependencies
│   ├── README.md               # Backend documentation
│   └── AWS_DEPLOYMENT_GUIDE.md # AWS setup guide
├── public/                     # Static assets
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── README.md                   # This file
```

---

## Default Test Accounts

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

## Testing

### Test Engine
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

## Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- CORS configuration
- Role-based access control
- Input validation
- Blood group validation
- Protected routes

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/name`)
5. Open a Pull Request

---

## License

Copyright 2026 Blood Bank Development Team.

---

## Troubleshooting

### Server won't start
- Verify dependencies are installed
- Check if port 5000/5173 is already in use
- Ensure Python version is 3.8+

### Authentication issues
- Verify JWT token is sent in the Authorization header
- Check if the token has expired
- Ensure user role matches endpoint requirements

### Blood group errors
- Verify blood group format (e.g., "A+", "O-")
- Check against valid blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-

For more help, check:
- [Backend README](flask_server/README.md)
- [AWS Deployment Guide](flask_server/AWS_DEPLOYMENT_GUIDE.md)

---

## Roadmap

- Mobile app (React Native)
- Real-time notifications (WebSockets)
- Analytics dashboard
- Multi-language support
- SMS notifications
- Appointment scheduling
- Integration with hospital management systems
- Demand prediction
