"""
BLOOD – Blood Bank Application (REST API)
Flask REST API backend for React frontend.

Implements user registration, login, blood request creation, donor-requestor matching,
and donation history tracking with AI-powered blood compatibility.

Author: Development Team
Date: 2026
Version: 2.0.0
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

# Import AI engine for blood compatibility
from ai_engine import (
    get_compatible_blood_groups,
    filter_compatible_donors,
    is_compatible,
    get_all_valid_blood_groups,
    match_donors_to_request,
    get_donation_stats
)


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "BLOOD_BANK_SECRET_KEY_2026_SECURE"
jwt = JWTManager(app)

# Enable CORS for React frontend
CORS(app)

# ============================================================================
# IN-MEMORY DATA STORAGE
# ============================================================================

# Users storage: list of user dictionaries
users = [
    {
        "id": 1,
        "name": "Apollo Hospital",
        "email": "hospital@gmail.com",
        "password": generate_password_hash("123456"),
        "role": "hospital",
        "phone": "9876543210",
        "city": "Bangalore"
    },
    {
        "id": 2,
        "name": "Rahul",
        "email": "donor@gmail.com",
        "password": generate_password_hash("123456"),
        "role": "donor",
        "bloodGroup": "O+",
        "phone": "9123456789",
        "city": "Delhi"
    }
]

# Donation history: donor_id -> list of donations
donation_history = {}

# Helper function to generate unique IDs
def generate_unique_id(prefix):
    """Generate unique IDs for donors, hospitals, and requests."""
    return f"{prefix}{str(uuid.uuid4())[:8]}"


# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = next((u for u in users if u["email"] == email), None)

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
    identity=str(user["id"]),     # ✅ STRING
    additional_claims={"role": user["role"]}
)


    return jsonify({
        "token": token,
        "role": user["role"],
        "name": user["name"],
        "email": user["email"],
        "bloodGroup": user.get("bloodGroup", ""),
        "phone": user.get("phone", "")
    })

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    global donor_id
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "donor")  # donor by default
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

    # check if user exists
    if any(u["email"] == email for u in users):
        return jsonify({"error": "User already exists"}), 409

    new_user = {
        "id": len(users) + 1,
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "role": role,
        "phone": phone,
        "bloodGroup": bloodGroup,
        "city": city
    }

    users.append(new_user)

    # If donor, automatically create donor profile
    if role.lower() == "donor":
        donor_profile = {
            "id": donor_id,
            "userId": new_user["id"],
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
        }
        donors.append(donor_profile)
        donor_id += 1

    token = create_access_token(
    identity=str(new_user["id"]), # ✅ STRING
    additional_claims={"role": new_user["role"]}
)


    return jsonify({
        "token": token,
        "role": new_user["role"],
        "name": new_user["name"],
        "email": new_user["email"],
        "bloodGroup": bloodGroup,
        "phone": phone
    }), 201




# -------- DONORS --------


donors = []
donor_id = 2

@app.route("/api/donors/register", methods=["POST"])
@jwt_required()
def register_donor():
    user_id = int(get_jwt_identity())
    role = get_jwt()["role"]

    if role.lower() != "donor":
        return jsonify({"error": "Only donors can register"}), 403

    # prevent duplicate registration
    if any(d.get("userId") == user_id for d in donors):
        return jsonify({"error": "Donor already registered"}), 409

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 422

    required = ["name", "gender", "bloodGroup", "phone", "city"]
    missing = [f for f in required if f not in data]

    if missing:
        return jsonify({
            "error": "Missing fields",
            "missing": missing
        }), 422

    # Validate blood group using AI engine
    blood_group = data["bloodGroup"]
    valid_blood_groups = get_all_valid_blood_groups()
    if blood_group not in valid_blood_groups:
        return jsonify({
            "error": f"Invalid blood group! Valid groups: {', '.join(valid_blood_groups)}"
        }), 400

    donor = {
        "id": len(donors) + 1,
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
    }

    donors.append(donor)
    return jsonify(donor), 201


# -------- DONORS ROUTES --------

@app.route("/api/donors", methods=["GET"])
def get_donors():
    """Get all donors with compatibility info."""
    # Add compatibility info to each donor
    donors_with_info = []
    for donor in donors:
        donor_copy = donor.copy()
        if donor_copy.get("bloodGroup"):
            donor_copy["compatibilityInfo"] = get_donation_stats(donor_copy["bloodGroup"])
        donors_with_info.append(donor_copy)
    return jsonify(donors_with_info)


@app.route("/api/donors/profile/<email>", methods=["GET"])
@jwt_required()
def get_donor_profile(email):
    """Get donor profile with donation history."""
    donor = next((d for d in donors if d.get("email") == email), None)
    if not donor:
        return jsonify({"error": "Donor profile not found"}), 404
    
    # Add donation history
    profile = donor.copy()
    profile["donationHistory"] = donation_history.get(email, [])
    profile["compatibilityInfo"] = get_donation_stats(donor["bloodGroup"]) if donor.get("bloodGroup") else None
    
    return jsonify(profile)


@app.route("/api/donors/<int:id>/record-donation", methods=["PATCH"])
@jwt_required()
def record_donation_route(id):
    """Record a donation for a donor."""
    data = request.get_json()
    
    for donor in donors:
        if donor["id"] == id:
            # Update donor stats
            donor["donationCount"] = donor.get("donationCount", 0) + 1
            donor["lastDonationDate"] = datetime.utcnow().isoformat()
            
            # Record in donation history
            donor_email = donor.get("email", f"donor_{id}")
            if donor_email not in donation_history:
                donation_history[donor_email] = []
            
            donation_record = {
                "requestId": data.get("requestId", ""),
                "bloodGroup": donor["bloodGroup"],
                "requestorEmail": data.get("requestorEmail", ""),
                "requestorName": data.get("requestorName", ""),
                "dateTime": datetime.utcnow().isoformat(),
                "units": data.get("units", 1)
            }
            donation_history[donor_email].append(donation_record)
            
            return jsonify({
                "donor": donor,
                "donation": donation_record
            })
    
    return jsonify({"error": "Donor not found"}), 404


@app.route("/api/donors/<int:id>/toggle", methods=["PATCH"])
def toggle_donor(id):
    """Toggle donor availability."""
    for donor in donors:
        if donor["id"] == id:
            donor["available"] = not donor["available"]
            return jsonify(donor)
    return jsonify({"error": "Donor not found"}), 404


@app.route("/api/donors/<int:id>/unavailable-dates", methods=["PATCH"])
def update_unavailable_dates(id):
    """Update donor unavailable dates."""
    data = request.get_json()
    if not data or "unavailableDates" not in data:
        return jsonify({"error": "Missing unavailableDates field"}), 422
    
    for donor in donors:
        if donor["id"] == id:
            donor["unavailableDates"] = data["unavailableDates"]
            return jsonify(donor)
    return jsonify({"error": "Donor not found"}), 404


# -------- HOSPITALS --------
hospitals = {
    1: {
        "id": 1,
        "name": "Apollo Hospital",
        "email": "apollo@gmail.com",
        "phone": "9876543210",
        "city": "Bangalore",
        "license": "LIC-AP-001",
        "verified": True
    },
    2: {
        "id": 2,
        "name": "Fortis Care",
        "email": "fortis@gmail.com",
        "phone": "9123456789",
        "city": "Delhi",
        "license": "LIC-FT-002",
        "verified": False
    }
}
hospital_id = 3


# -------- INVENTORY --------
inventory = [
    {
        "id": 1,
        "hospitalId": 1,
        "hospitalName": "Apollo Hospital",
        "bloodGroup": "B-",
        "units": 10,
        "expiry": "2025-03-10",
        "updatedAt": "2025-01-24T22:02:00"
    },
    {
        "id": 2,
        "hospitalId": 1,
        "hospitalName": "Apollo Hospital",
        "bloodGroup": "O+",
        "units": 18,
        "expiry": "2025-04-02",
        "updatedAt": "2025-01-23T20:15:00"
    }
]
inventory_id = 3


# -------- REQUESTS --------
blood_requests = [
    {
        "id": 1,
        "hospital": "Metro Blood Bank",
        "phone": "+1 555 200 3000",
        "city": "Los Angeles",
        "bloodGroup": "A-",
        "units": 1,
        "urgency": "LOW",
        "status": "OPEN",
        "createdAt": "2025-01-24T12:33:00"
    }
]
request_id = 2


# -------- HOSPITALS --------
@app.route("/api/hospitals", methods=["GET"])
def get_hospitals():
    return jsonify(list(hospitals.values()))


@app.route("/api/hospitals", methods=["POST"])
def add_hospital():
    global hospital_id
    data = request.json

    hospital = {
        "id": hospital_id,
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "city": data["city"],
        "license": data["license"],
        "verified": False
    }

    hospitals[hospital_id] = hospital
    hospital_id += 1
    return jsonify(hospital), 201


@app.route("/api/hospitals/<int:id>", methods=["PATCH"])
def update_hospital(id):
    if id not in hospitals:
        return jsonify({"error": "Hospital not found"}), 404

    data = request.json
    hospital = hospitals[id]

    hospital["name"] = data.get("name", hospital["name"])
    hospital["email"] = data.get("email", hospital["email"])
    hospital["phone"] = data.get("phone", hospital["phone"])
    hospital["city"] = data.get("city", hospital["city"])
    hospital["license"] = data.get("license", hospital["license"])

    return jsonify(hospital)


@app.route("/api/hospitals/<int:id>/toggle", methods=["PATCH"])
def toggle_hospital(id):
    if id not in hospitals:
        return jsonify({"error": "Hospital not found"}), 404

    hospitals[id]["verified"] = not hospitals[id]["verified"]
    return jsonify(hospitals[id])


@app.route("/api/hospitals/<int:id>", methods=["DELETE"])
def delete_hospital(id):
    if id not in hospitals:
        return jsonify({"error": "Hospital not found"}), 404

    del hospitals[id]
    return jsonify({"message": "Deleted"})


# -------- INVENTORY --------
@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    return jsonify(inventory)


@app.route("/api/inventory", methods=["POST"])
def add_inventory():
    global inventory_id
    data = request.json

    record = {
        "id": inventory_id,
        "hospitalId": data["hospitalId"],
        "hospitalName": data["hospitalName"],
        "bloodGroup": data["bloodGroup"],
        "units": int(data["units"]),
        "expiry": data["expiry"],
        "updatedAt": datetime.utcnow().isoformat()
    }

    inventory.append(record)
    inventory_id += 1
    return jsonify(record), 201


@app.route("/api/inventory/<int:id>", methods=["PATCH"])
def update_inventory(id):
    for item in inventory:
        if item["id"] == id:
            data = request.json
            item["hospitalId"] = data.get("hospitalId", item["hospitalId"])
            item["hospitalName"] = data.get("hospitalName", item["hospitalName"])
            item["bloodGroup"] = data.get("bloodGroup", item["bloodGroup"])
            item["units"] = int(data.get("units", item["units"]))
            item["expiry"] = data.get("expiry", item["expiry"])
            item["updatedAt"] = datetime.utcnow().isoformat()
            return jsonify(item)

    return jsonify({"error": "Inventory not found"}), 404


@app.route("/api/inventory/<int:id>", methods=["DELETE"])
def delete_inventory(id):
    global inventory
    inventory = [i for i in inventory if i["id"] != id]
    return jsonify({"message": "Deleted"})


# -------- REQUESTS --------
@app.route("/api/requests", methods=["GET"])
def get_requests():
    """Get all blood requests with compatible donor information."""
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

@app.route("/api/requests", methods=["POST"])
def add_request():
    global request_id
    data = request.json

    hospital = hospitals.get(data["hospitalId"])

    if not hospital:
        return jsonify({"error": "Hospital not found"}), 400
    
    blood_group = data["bloodGroup"]
    
    # Validate blood group using AI engine
    valid_blood_groups = get_all_valid_blood_groups()
    if blood_group not in valid_blood_groups:
        return jsonify({
            "error": f"Invalid blood group! Valid groups: {', '.join(valid_blood_groups)}"
        }), 400

    req = {
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
    }
    
    # Find matching donors immediately
    matched_donors = match_donors_to_request(req, donors)
    req["matchedDonors"] = matched_donors
    req["matchedDonorsCount"] = len(matched_donors)

    blood_requests.append(req)
    request_id += 1
    return jsonify(req), 201



@app.route("/api/requests/<int:id>", methods=["PATCH"])
def update_request(id):
    for req in blood_requests:
        if req["id"] == id:
            req["status"] = request.json.get("status", req["status"])
            return jsonify(req)

    return jsonify({"error": "Request not found"}), 404


# -------- STATS --------
@app.route("/api/stats")
def stats():
    return jsonify({
        "totalDonors": len(donors),
        "availableDonors": len([d for d in donors if d["available"]]),
        "activeRequests": len([r for r in blood_requests if r["status"] == "OPEN"])
    })


# ============================================================================
# MAIN APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    """
    Run the Flask application in debug mode.
    Access at http://127.0.0.1:5000
    """
    APP_NAME = "BLOOD – Blood Bank Application"
    APP_QUOTE = "Donate Blood, Save Lives"
    
    print(f"\n{'=' * 70}")
    print(f"  {APP_NAME}")
    print(f"  {APP_QUOTE}")
    print(f"{'=' * 70}")
    print(f"\nStarting Flask application in DEBUG mode...")
    print(f"Access the application at: http://127.0.0.1:5000")
    print(f"\nPress Ctrl+C to stop the server.\n")
    
    app.run(debug=True, host='127.0.0.1', port=5000)
