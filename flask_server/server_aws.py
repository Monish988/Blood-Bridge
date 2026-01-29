"""
BLOOD – Blood Bank Application (AWS Deployment Version)
Flask REST API backend with AWS DynamoDB and SNS integration.

Implements user registration, login, blood request creation, donor-requestor matching,
and donation history tracking with AI-powered blood compatibility.

AWS Services Used:
- DynamoDB: Data storage (Users, Donors, Hospitals, Inventory, Requests)
- SNS: Notifications for critical events
- (Optional) S3: File storage for documents/certificates

Author: Development Team
Date: 2026
Version: 2.0.0-AWS
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Import AI engine for blood compatibility
from ai_engine import (
    get_compatible_blood_groups,
    filter_compatible_donors,
    is_compatible,
    get_all_valid_blood_groups,
    match_donors_to_request,
    get_donation_stats
)


# ============================================================================
# AWS CONFIGURATION
# ============================================================================

# AWS Region Configuration
AWS_REGION = 'us-east-1'

# Initialize AWS Clients
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
sns_client = boto3.client('sns', region_name=AWS_REGION)

# DynamoDB Table Names
USERS_TABLE = 'BloodBank_Users'
DONORS_TABLE = 'BloodBank_Donors'
HOSPITALS_TABLE = 'BloodBank_Hospitals'
INVENTORY_TABLE = 'BloodBank_Inventory'
REQUESTS_TABLE = 'BloodBank_Requests'
DONATION_HISTORY_TABLE = 'BloodBank_DonationHistory'

# DynamoDB Table Objects
users_table = dynamodb.Table(USERS_TABLE)
donors_table = dynamodb.Table(DONORS_TABLE)
hospitals_table = dynamodb.Table(HOSPITALS_TABLE)
inventory_table = dynamodb.Table(INVENTORY_TABLE)
requests_table = dynamodb.Table(REQUESTS_TABLE)
donation_history_table = dynamodb.Table(DONATION_HISTORY_TABLE)

# SNS Topic ARN (Replace with your actual SNS Topic ARN)
SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:BloodBank_Notifications'


# ============================================================================
# FLASK APPLICATION SETUP
# ============================================================================

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "BLOOD_BANK_SECRET_KEY_2026_SECURE"
jwt = JWTManager(app)

# Enable CORS for React frontend
CORS(app)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_unique_id(prefix):
    """Generate unique IDs for donors, hospitals, and requests."""
    return f"{prefix}{str(uuid.uuid4())[:8]}"


def send_sns_notification(subject, message):
    """
    Send SNS notification for critical events.
    
    Args:
        subject (str): Notification subject
        message (str): Notification message
    """
    try:
        sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=subject,
            Message=message
        )
        print(f"✓ SNS Notification sent: {subject}")
    except ClientError as e:
        print(f"✗ Error sending SNS notification: {e}")
    except Exception as e:
        print(f"✗ SNS Error: {e}")


def python_to_dynamodb(obj):
    """Convert Python types to DynamoDB compatible types."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: python_to_dynamodb(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [python_to_dynamodb(v) for v in obj]
    return obj


def dynamodb_to_python(obj):
    """Convert DynamoDB types to Python types."""
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    elif isinstance(obj, dict):
        return {k: dynamodb_to_python(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [dynamodb_to_python(v) for v in obj]
    return obj


# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route("/api/auth/login", methods=["POST"])
def login():
    """User login with DynamoDB."""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        # Get user from DynamoDB
        response = users_table.get_item(Key={'email': email})
        
        if 'Item' not in response:
            return jsonify({"error": "Invalid credentials"}), 401
        
        user = dynamodb_to_python(response['Item'])
        
        if not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Create JWT token
        token = create_access_token(
            identity=str(user["id"]),
            additional_claims={"role": user["role"]}
        )

        # Send notification
        send_sns_notification(
            "User Login",
            f"User {user['name']} ({user['role']}) logged in at {datetime.utcnow().isoformat()}"
        )

        return jsonify({
            "token": token,
            "role": user["role"],
            "name": user["name"],
            "email": user["email"],
            "bloodGroup": user.get("bloodGroup", ""),
            "phone": user.get("phone", "")
        })
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/auth/signup", methods=["POST"])
def signup():
    """User registration with DynamoDB."""
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "donor")
    phone = data.get("phone", "")
    bloodGroup = data.get("bloodGroup", "") if role == "donor" else ""
    city = data.get("city", "")

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # Validate blood group for donors using AI engine
    if role.lower() == "donor" and bloodGroup:
        valid_blood_groups = get_all_valid_blood_groups()
        if bloodGroup not in valid_blood_groups:
            return jsonify({
                "error": f"Invalid blood group! Valid groups: {', '.join(valid_blood_groups)}"
            }), 400

    try:
        # Check if user exists
        response = users_table.get_item(Key={'email': email})
        if 'Item' in response:
            return jsonify({"error": "User already exists"}), 409

        # Create new user
        user_id = len(users_table.scan()['Items']) + 1
        new_user = python_to_dynamodb({
            "id": user_id,
            "name": name,
            "email": email,
            "password": generate_password_hash(password),
            "role": role,
            "phone": phone,
            "bloodGroup": bloodGroup,
            "city": city,
            "createdAt": datetime.utcnow().isoformat()
        })

        users_table.put_item(Item=new_user)

        # If donor, automatically create donor profile
        if role.lower() == "donor":
            donor_profile = python_to_dynamodb({
                "id": user_id,
                "userId": user_id,
                "name": name,
                "gender": data.get("gender", ""),
                "bloodGroup": bloodGroup,
                "phone": phone,
                "city": city,
                "email": email,
                "available": False,
                "verified": False,
                "unavailableDates": [],
                "donationCount": 0,
                "lastDonationDate": None,
                "createdAt": datetime.utcnow().isoformat(),
                "compatibilityInfo": get_donation_stats(bloodGroup) if bloodGroup else None
            })
            donors_table.put_item(Item=donor_profile)

        # Send notification
        send_sns_notification(
            "New User Registration",
            f"New {role} registered: {name} ({email}) from {city}"
        )

        # Create token
        token = create_access_token(
            identity=str(user_id),
            additional_claims={"role": role}
        )

        return jsonify({
            "token": token,
            "role": role,
            "name": name,
            "email": email,
            "bloodGroup": bloodGroup,
            "phone": phone
        }), 201

    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


# ============================================================================
# DONOR ROUTES
# ============================================================================

@app.route("/api/donors/register", methods=["POST"])
@jwt_required()
def register_donor():
    """Register donor profile in DynamoDB."""
    user_id = int(get_jwt_identity())
    role = get_jwt()["role"]

    if role.lower() != "donor":
        return jsonify({"error": "Only donors can register"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 422

    required = ["name", "gender", "bloodGroup", "phone", "city"]
    missing = [f for f in required if f not in data]

    if missing:
        return jsonify({"error": "Missing fields", "missing": missing}), 422

    # Validate blood group
    blood_group = data["bloodGroup"]
    valid_blood_groups = get_all_valid_blood_groups()
    if blood_group not in valid_blood_groups:
        return jsonify({
            "error": f"Invalid blood group! Valid groups: {', '.join(valid_blood_groups)}"
        }), 400

    try:
        # Check for duplicate
        response = donors_table.scan(
            FilterExpression='userId = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        if response['Items']:
            return jsonify({"error": "Donor already registered"}), 409

        # Create donor profile
        donor_id = len(donors_table.scan()['Items']) + 1
        donor = python_to_dynamodb({
            "id": donor_id,
            "userId": user_id,
            "name": data["name"],
            "gender": data["gender"],
            "bloodGroup": blood_group,
            "phone": data["phone"],
            "city": data["city"],
            "email": data.get("email", ""),
            "available": False,
            "verified": False,
            "unavailableDates": [],
            "donationCount": 0,
            "lastDonationDate": None,
            "createdAt": datetime.utcnow().isoformat(),
            "compatibilityInfo": get_donation_stats(blood_group)
        })

        donors_table.put_item(Item=donor)
        
        # Send notification
        send_sns_notification(
            "New Donor Registration",
            f"Donor {data['name']} registered with blood group {blood_group}"
        )

        return jsonify(dynamodb_to_python(donor)), 201

    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/donors", methods=["GET"])
def get_donors():
    """Get all donors with compatibility info from DynamoDB."""
    try:
        response = donors_table.scan()
        donors = dynamodb_to_python(response['Items'])
        
        # Add compatibility info to each donor
        donors_with_info = []
        for donor in donors:
            donor_copy = donor.copy()
            if donor_copy.get("bloodGroup"):
                donor_copy["compatibilityInfo"] = get_donation_stats(donor_copy["bloodGroup"])
            donors_with_info.append(donor_copy)
        
        return jsonify(donors_with_info)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/donors/profile/<email>", methods=["GET"])
@jwt_required()
def get_donor_profile(email):
    """Get donor profile with donation history from DynamoDB."""
    try:
        # Get donor by email
        response = donors_table.scan(
            FilterExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        
        if not response['Items']:
            return jsonify({"error": "Donor profile not found"}), 404
        
        donor = dynamodb_to_python(response['Items'][0])
        
        # Get donation history
        history_response = donation_history_table.scan(
            FilterExpression='donorEmail = :email',
            ExpressionAttributeValues={':email': email}
        )
        
        profile = donor.copy()
        profile["donationHistory"] = dynamodb_to_python(history_response.get('Items', []))
        profile["compatibilityInfo"] = get_donation_stats(donor["bloodGroup"]) if donor.get("bloodGroup") else None
        
        return jsonify(profile)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/donors/<int:id>/record-donation", methods=["PATCH"])
@jwt_required()
def record_donation_route(id):
    """Record a donation for a donor in DynamoDB."""
    data = request.get_json()
    
    try:
        # Get donor
        response = donors_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Donor not found"}), 404
        
        donor = dynamodb_to_python(response['Item'])
        
        # Update donor stats
        donor["donationCount"] = donor.get("donationCount", 0) + 1
        donor["lastDonationDate"] = datetime.utcnow().isoformat()
        
        donors_table.put_item(Item=python_to_dynamodb(donor))
        
        # Record in donation history
        donation_id = str(uuid.uuid4())
        donation_record = python_to_dynamodb({
            "id": donation_id,
            "donorEmail": donor.get("email", f"donor_{id}"),
            "donorName": donor["name"],
            "requestId": data.get("requestId", ""),
            "bloodGroup": donor["bloodGroup"],
            "requestorEmail": data.get("requestorEmail", ""),
            "requestorName": data.get("requestorName", ""),
            "dateTime": datetime.utcnow().isoformat(),
            "units": data.get("units", 1)
        })
        
        donation_history_table.put_item(Item=donation_record)
        
        # Send notification
        send_sns_notification(
            "Blood Donation Recorded",
            f"Donor {donor['name']} donated {data.get('units', 1)} unit(s) of {donor['bloodGroup']} blood"
        )
        
        return jsonify({
            "donor": donor,
            "donation": dynamodb_to_python(donation_record)
        })
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/donors/<int:id>/toggle", methods=["PATCH"])
def toggle_donor(id):
    """Toggle donor availability in DynamoDB."""
    try:
        response = donors_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Donor not found"}), 404
        
        donor = dynamodb_to_python(response['Item'])
        donor["available"] = not donor.get("available", False)
        
        donors_table.put_item(Item=python_to_dynamodb(donor))
        
        return jsonify(donor)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/donors/<int:id>/unavailable-dates", methods=["PATCH"])
def update_unavailable_dates(id):
    """Update donor unavailable dates in DynamoDB."""
    data = request.get_json()
    if not data or "unavailableDates" not in data:
        return jsonify({"error": "Missing unavailableDates field"}), 422
    
    try:
        response = donors_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Donor not found"}), 404
        
        donor = dynamodb_to_python(response['Item'])
        donor["unavailableDates"] = data["unavailableDates"]
        
        donors_table.put_item(Item=python_to_dynamodb(donor))
        
        return jsonify(donor)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


# ============================================================================
# HOSPITAL ROUTES
# ============================================================================

@app.route("/api/hospitals", methods=["GET"])
def get_hospitals():
    """Get all hospitals from DynamoDB."""
    try:
        response = hospitals_table.scan()
        hospitals = dynamodb_to_python(response['Items'])
        return jsonify(hospitals)
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/hospitals", methods=["POST"])
def add_hospital():
    """Add a new hospital to DynamoDB."""
    data = request.json

    try:
        hospital_id = len(hospitals_table.scan()['Items']) + 1
        hospital = python_to_dynamodb({
            "id": hospital_id,
            "name": data["name"],
            "email": data["email"],
            "phone": data["phone"],
            "city": data["city"],
            "license": data["license"],
            "verified": False,
            "createdAt": datetime.utcnow().isoformat()
        })

        hospitals_table.put_item(Item=hospital)
        
        # Send notification
        send_sns_notification(
            "New Hospital Registration",
            f"Hospital {data['name']} registered in {data['city']}"
        )
        
        return jsonify(dynamodb_to_python(hospital)), 201
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/hospitals/<int:id>", methods=["PATCH"])
def update_hospital(id):
    """Update hospital information in DynamoDB."""
    try:
        response = hospitals_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        hospital = dynamodb_to_python(response['Item'])

        hospital["name"] = data.get("name", hospital["name"])
        hospital["email"] = data.get("email", hospital["email"])
        hospital["phone"] = data.get("phone", hospital["phone"])
        hospital["city"] = data.get("city", hospital["city"])
        hospital["license"] = data.get("license", hospital["license"])

        hospitals_table.put_item(Item=python_to_dynamodb(hospital))
        
        return jsonify(hospital)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/hospitals/<int:id>/toggle", methods=["PATCH"])
def toggle_hospital(id):
    """Toggle hospital verification status in DynamoDB."""
    try:
        response = hospitals_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Hospital not found"}), 404

        hospital = dynamodb_to_python(response['Item'])
        hospital["verified"] = not hospital.get("verified", False)

        hospitals_table.put_item(Item=python_to_dynamodb(hospital))
        
        return jsonify(hospital)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/hospitals/<int:id>", methods=["DELETE"])
def delete_hospital(id):
    """Delete a hospital from DynamoDB."""
    try:
        hospitals_table.delete_item(Key={'id': id})
        return jsonify({"message": "Deleted"})
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


# ============================================================================
# INVENTORY ROUTES
# ============================================================================

@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    """Get all inventory items from DynamoDB."""
    try:
        response = inventory_table.scan()
        inventory = dynamodb_to_python(response['Items'])
        return jsonify(inventory)
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/inventory", methods=["POST"])
def add_inventory():
    """Add new inventory item to DynamoDB."""
    data = request.json

    try:
        inventory_id = len(inventory_table.scan()['Items']) + 1
        record = python_to_dynamodb({
            "id": inventory_id,
            "hospitalId": data["hospitalId"],
            "hospitalName": data["hospitalName"],
            "bloodGroup": data["bloodGroup"],
            "units": int(data["units"]),
            "expiry": data["expiry"],
            "updatedAt": datetime.utcnow().isoformat()
        })

        inventory_table.put_item(Item=record)
        
        return jsonify(dynamodb_to_python(record)), 201
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/inventory/<int:id>", methods=["PATCH"])
def update_inventory(id):
    """Update inventory item in DynamoDB."""
    try:
        response = inventory_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Inventory not found"}), 404

        data = request.json
        item = dynamodb_to_python(response['Item'])
        
        item["hospitalId"] = data.get("hospitalId", item["hospitalId"])
        item["hospitalName"] = data.get("hospitalName", item["hospitalName"])
        item["bloodGroup"] = data.get("bloodGroup", item["bloodGroup"])
        item["units"] = int(data.get("units", item["units"]))
        item["expiry"] = data.get("expiry", item["expiry"])
        item["updatedAt"] = datetime.utcnow().isoformat()
        
        inventory_table.put_item(Item=python_to_dynamodb(item))
        
        return jsonify(item)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/inventory/<int:id>", methods=["DELETE"])
def delete_inventory(id):
    """Delete inventory item from DynamoDB."""
    try:
        inventory_table.delete_item(Key={'id': id})
        return jsonify({"message": "Deleted"})
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


# ============================================================================
# BLOOD REQUEST ROUTES
# ============================================================================

@app.route("/api/requests", methods=["GET"])
def get_requests():
    """Get all blood requests with compatible donor information from DynamoDB."""
    try:
        response = requests_table.scan()
        blood_requests = dynamodb_to_python(response['Items'])
        
        # Get all donors for matching
        donors_response = donors_table.scan()
        donors = dynamodb_to_python(donors_response['Items'])
        
        # Enrich requests with compatible donor matching
        requests_with_matches = []
        for req in blood_requests:
            req_copy = req.copy()
            
            # Add blood group compatibility info
            if req_copy.get("bloodGroup"):
                req_copy["compatibilityInfo"] = get_compatible_blood_groups(req_copy["bloodGroup"])
                
                # Find matching donors
                matched_donors = match_donors_to_request(req_copy, donors)
                req_copy["matchedDonors"] = matched_donors
                req_copy["matchedDonorsCount"] = len(matched_donors)
            
            requests_with_matches.append(req_copy)
        
        return jsonify(requests_with_matches)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/requests", methods=["POST"])
def add_request():
    """Create a new blood request in DynamoDB with AI-powered donor matching."""
    data = request.json

    try:
        # Get hospital info
        hospital_response = hospitals_table.get_item(Key={'id': data["hospitalId"]})
        if 'Item' not in hospital_response:
            return jsonify({"error": "Hospital not found"}), 400
        
        hospital = dynamodb_to_python(hospital_response['Item'])
        blood_group = data["bloodGroup"]
        
        # Validate blood group using AI engine
        valid_blood_groups = get_all_valid_blood_groups()
        if blood_group not in valid_blood_groups:
            return jsonify({
                "error": f"Invalid blood group! Valid groups: {', '.join(valid_blood_groups)}"
            }), 400

        # Create request ID
        request_id = len(requests_table.scan()['Items']) + 1

        req = python_to_dynamodb({
            "id": request_id,
            "hospitalId": hospital["id"],
            "hospital": hospital["name"],
            "city": hospital["city"],
            "phone": data.get("phone", ""),
            "bloodGroup": blood_group,
            "units": int(data["units"]),
            "urgency": data["urgency"],
            "status": "OPEN",
            "createdAt": datetime.utcnow().isoformat(),
            "compatibilityInfo": get_compatible_blood_groups(blood_group)
        })
        
        # Get all donors for matching
        donors_response = donors_table.scan()
        donors = dynamodb_to_python(donors_response['Items'])
        
        # Find matching donors immediately
        matched_donors = match_donors_to_request(dynamodb_to_python(req), donors)
        req["matchedDonors"] = python_to_dynamodb(matched_donors)
        req["matchedDonorsCount"] = len(matched_donors)

        requests_table.put_item(Item=req)
        
        # Send critical notification
        send_sns_notification(
            f"URGENT: Blood Request - {data['urgency']}",
            f"Hospital: {hospital['name']}\nBlood Group: {blood_group}\nUnits: {data['units']}\nUrgency: {data['urgency']}\nMatched Donors: {len(matched_donors)}"
        )
        
        return jsonify(dynamodb_to_python(req)), 201
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


@app.route("/api/requests/<int:id>", methods=["PATCH"])
def update_request(id):
    """Update blood request status in DynamoDB."""
    try:
        response = requests_table.get_item(Key={'id': id})
        if 'Item' not in response:
            return jsonify({"error": "Request not found"}), 404

        req = dynamodb_to_python(response['Item'])
        req["status"] = request.json.get("status", req["status"])
        
        requests_table.put_item(Item=python_to_dynamodb(req))
        
        # Send notification on status change
        if req["status"] == "FULFILLED":
            send_sns_notification(
                "Blood Request Fulfilled",
                f"Request for {req['bloodGroup']} blood at {req['hospital']} has been fulfilled"
            )
        
        return jsonify(req)
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


# ============================================================================
# STATISTICS ROUTE
# ============================================================================

@app.route("/api/stats")
def stats():
    """Get dashboard statistics from DynamoDB."""
    try:
        donors_response = donors_table.scan()
        donors = dynamodb_to_python(donors_response['Items'])
        
        requests_response = requests_table.scan()
        blood_requests = dynamodb_to_python(requests_response['Items'])
        
        return jsonify({
            "totalDonors": len(donors),
            "availableDonors": len([d for d in donors if d.get("available", False)]),
            "activeRequests": len([r for r in blood_requests if r.get("status") == "OPEN"])
        })
    
    except ClientError as e:
        print(f"DynamoDB Error: {e}")
        return jsonify({"error": "Database error"}), 500


# ============================================================================
# HEALTH CHECK ROUTE
# ============================================================================

@app.route("/health")
def health_check():
    """Health check endpoint for AWS load balancer."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Blood Bank API",
        "version": "2.0.0-AWS"
    })


# ============================================================================
# MAIN APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    """
    Run the Flask application for AWS deployment.
    For production, use Gunicorn or AWS Elastic Beanstalk.
    """
    APP_NAME = "BLOOD – Blood Bank Application (AWS)"
    APP_QUOTE = "Donate Blood, Save Lives"
    
    print(f"\n{'=' * 70}")
    print(f"  {APP_NAME}")
    print(f"  {APP_QUOTE}")
    print(f"{'=' * 70}")
    print(f"\nStarting Flask application for AWS deployment...")
    print(f"AWS Region: {AWS_REGION}")
    print(f"DynamoDB Tables: {USERS_TABLE}, {DONORS_TABLE}, {HOSPITALS_TABLE}")
    print(f"Access the application at: http://0.0.0.0:5000")
    print(f"\nPress Ctrl+C to stop the server.\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
