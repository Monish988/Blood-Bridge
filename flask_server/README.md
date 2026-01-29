# Blood Bank Application - Backend (Flask)

## Overview
This is the Flask REST API backend for the Blood Bank Management System. It provides authentication, donor management, hospital management, inventory tracking, and blood request management with AI-powered blood compatibility matching.

## Features

### 🔐 Authentication
- JWT-based authentication
- User registration for donors and hospitals
- Secure password hashing with Werkzeug

### 🩸 AI-Powered Blood Compatibility
- Automatic blood group compatibility checking
- Smart donor-request matching
- Blood group validation
- Compatibility scoring for optimal matches
- Universal donor/receiver identification

### 📊 Core Functionality
- **Donors**: Registration, profile management, availability tracking, donation history
- **Hospitals**: Hospital management, verification system
- **Inventory**: Blood stock tracking with expiry dates
- **Requests**: Blood request creation with automatic donor matching
- **Stats**: Dashboard statistics for active requests, donors, and availability

## Installation

### Prerequisites
- Python 3.8+
- pip or pip3

### Setup

1. **Navigate to the flask_server directory:**
   ```bash
   cd flask_server
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python server.py
   ```

The server will start at `http://127.0.0.1:5000`

## AI Engine

### Blood Compatibility Module (`ai_engine.py`)

The AI engine provides intelligent blood compatibility matching based on medical standards:

#### Blood Compatibility Rules
- **O-**: Universal donor (can donate to all blood groups)
- **AB+**: Universal receiver (can receive from all blood groups)
- **A+** can receive from: A+, A-, O+, O-
- **A-** can receive from: A-, O-
- **B+** can receive from: B+, B-, O+, O-
- **B-** can receive from: B-, O-
- **AB-** can receive from: A-, B-, AB-, O-
- **O+** can receive from: O+, O-
- **O-** can receive from: O-

#### Key Functions

```python
# Check if donor can donate to recipient
is_compatible(donor_blood_group, recipient_blood_group)

# Get all compatible donors for a blood group
get_compatible_blood_groups(recipient_blood_group)

# Filter compatible donors from a list
filter_compatible_donors(recipient_blood_group, donors_list)

# Match and rank donors for a request
match_donors_to_request(blood_request, available_donors)

# Get donation statistics for a blood group
get_donation_stats(donor_blood_group)
```

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

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

### Donors

#### GET `/api/donors`
Get all donors with compatibility info

#### POST `/api/donors/register`
Register as a donor (requires JWT token)
```json
{
  "name": "John Doe",
  "gender": "Male",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "city": "New York"
}
```

#### GET `/api/donors/profile/<email>`
Get donor profile with donation history (requires JWT token)

#### PATCH `/api/donors/<id>/toggle`
Toggle donor availability

#### PATCH `/api/donors/<id>/record-donation`
Record a donation for tracking (requires JWT token)

### Hospitals

#### GET `/api/hospitals`
Get all hospitals

#### POST `/api/hospitals`
Add a new hospital

#### PATCH `/api/hospitals/<id>`
Update hospital information

#### PATCH `/api/hospitals/<id>/toggle`
Toggle hospital verification status

#### DELETE `/api/hospitals/<id>`
Delete a hospital

### Inventory

#### GET `/api/inventory`
Get all blood inventory items

#### POST `/api/inventory`
Add new blood inventory item

#### PATCH `/api/inventory/<id>`
Update inventory item

#### DELETE `/api/inventory/<id>`
Delete inventory item

### Blood Requests

#### GET `/api/requests`
Get all blood requests with matched donors
- Automatically includes compatibility info
- Lists matched available donors
- Provides donor count for each request

#### POST `/api/requests`
Create a new blood request
```json
{
  "hospitalId": 1,
  "bloodGroup": "A+",
  "units": 2,
  "urgency": "HIGH",
  "phone": "1234567890"
}
```

#### PATCH `/api/requests/<id>`
Update request status

### Statistics

#### GET `/api/stats`
Get dashboard statistics
```json
{
  "totalDonors": 10,
  "availableDonors": 7,
  "activeRequests": 3
}
```

## Testing

Run the AI engine test suite:
```bash
python test_ai_engine.py
```

This will verify:
- Blood group validation
- Compatibility checking
- Donor matching
- Donation statistics
- Universal donor/receiver identification

## Data Structure

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "donor",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "city": "New York"
}
```

### Donor Profile
```json
{
  "id": 1,
  "userId": 1,
  "name": "John Doe",
  "gender": "Male",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "city": "New York",
  "email": "john@example.com",
  "available": true,
  "verified": false,
  "donationCount": 5,
  "lastDonationDate": "2026-01-15T10:30:00",
  "compatibilityInfo": {
    "blood_group": "O+",
    "can_donate_to": ["O+", "A+", "B+", "AB+"],
    "is_universal_donor": false,
    "demand_level": "Normal"
  }
}
```

### Blood Request
```json
{
  "id": 1,
  "hospitalId": 1,
  "hospital": "Apollo Hospital",
  "city": "Bangalore",
  "phone": "9876543210",
  "bloodGroup": "A+",
  "units": 2,
  "urgency": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-01-29T10:00:00",
  "compatibilityInfo": {
    "recipient": "A+",
    "compatible_donors": ["A+", "A-", "O+", "O-"],
    "count": 4
  },
  "matchedDonors": [...],
  "matchedDonorsCount": 5
}
```

## Security Features

- **Password Hashing**: Uses Werkzeug's secure password hashing
- **JWT Tokens**: Secure token-based authentication
- **CORS Protection**: Configured for React frontend
- **Input Validation**: Validates blood groups and required fields
- **Role-Based Access**: Separates donor and hospital functionality

## Configuration

### Secret Key
Update the secret key in production:
```python
app.config["JWT_SECRET_KEY"] = "BLOOD_BANK_SECRET_KEY_2026_SECURE"
```

### CORS
CORS is enabled for all origins. In production, restrict to specific domains:
```python
CORS(app, origins=["https://your-frontend-domain.com"])
```

## Development

### Adding New Features

1. **New Endpoint**: Add route decorator and function in `server.py`
2. **AI Logic**: Extend functions in `ai_engine.py`
3. **Data Model**: Update in-memory data structures at the top of `server.py`

### Debug Mode

The server runs in debug mode by default, providing:
- Auto-reload on code changes
- Detailed error messages
- Interactive debugger (PIN: shown in console)

## Production Deployment

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn server:app
```

## Default Test Accounts

### Hospital Account
- Email: `hospital@gmail.com`
- Password: `123456`
- Role: Hospital

### Donor Account
- Email: `donor@gmail.com`
- Password: `123456`
- Role: Donor
- Blood Group: O+

## Troubleshooting

### Server won't start
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is already in use
- Ensure Python version is 3.8+

### Authentication issues
- Verify JWT token is being sent in Authorization header
- Check token hasn't expired
- Ensure user role matches endpoint requirements

### Blood group errors
- Verify blood group format (e.g., "A+", "O-")
- Check against valid blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-

## Contributing

When contributing to the backend:

1. Test all API endpoints after changes
2. Run the AI engine test suite
3. Update this README if adding new features
4. Ensure backward compatibility with the React frontend

## License

Copyright © 2026 Blood Bank Development Team. All rights reserved.

## Version

**Version 2.0.0** - AI-Powered Blood Compatibility with REST API
