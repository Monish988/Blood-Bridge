"""
BLOOD – Blood Bank Application (AWS Version)
Flask REST API with DynamoDB + SNS
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from decimal import Decimal
import boto3
import uuid
import threading
from botocore.exceptions import ClientError

# AI Engine
from ai_engine import (
    get_compatible_blood_groups,
    get_all_valid_blood_groups,
    match_donors_to_request,
    get_donation_stats
)

# ============================================================================
# AWS CONFIG
# ============================================================================

AWS_REGION = "us-east-1"
SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:890742572638:aws_capstone_topic:05efcb7f-c78e-444d-ad83-d472769c8c73"

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
sns = boto3.client("sns", region_name=AWS_REGION)

users_table = dynamodb.Table("BloodBank_Users")
donors_table = dynamodb.Table("BloodBank_Donors")
hospitals_table = dynamodb.Table("BloodBank_Hospitals")
inventory_table = dynamodb.Table("BloodBank_Inventory")
requests_table = dynamodb.Table("BloodBank_Requests")
donation_history_table = dynamodb.Table("BloodBank_DonationHistory")

# ============================================================================
# APP SETUP
# ============================================================================

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "BLOOD_BANK_SECRET_KEY_2026"
jwt = JWTManager(app)

CORS(app)

# ============================================================================
# HELPERS
# ============================================================================

def to_ddb(obj):
    if isinstance(obj, float):
        return Decimal(str(obj))
    if isinstance(obj, dict):
        return {k: to_ddb(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_ddb(v) for v in obj]
    return obj

def from_ddb(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    if isinstance(obj, dict):
        return {k: from_ddb(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [from_ddb(v) for v in obj]
    return obj

def sns_async(subject, message):
    def task():
        try:
            sns.publish(TopicArn=SNS_TOPIC_ARN, Subject=subject, Message=message)
        except Exception as e:
            print("SNS ERROR:", e)
    threading.Thread(target=task, daemon=True).start()

def json_body():
    if not request.is_json:
        return None
    return request.get_json()

# ============================================================================
# AUTH
# ============================================================================

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = json_body()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role", "donor")

    if not all([email, password, name]):
        return jsonify({"error": "Missing fields"}), 400

    if users_table.get_item(Key={"email": email}).get("Item"):
        return jsonify({"error": "User exists"}), 409

    user_id = str(uuid.uuid4())

    user = to_ddb({
        "id": user_id,
        "email": email,
        "name": name,
        "password": generate_password_hash(password),
        "role": role,
        "bloodGroup": data.get("bloodGroup", ""),
        "phone": data.get("phone", ""),
        "city": data.get("city", ""),
        "createdAt": datetime.utcnow().isoformat()
    })

    users_table.put_item(Item=user)

    if role == "donor":
        donors_table.put_item(Item=to_ddb({
            "id": str(uuid.uuid4()),
            "userId": user_id,
            "email": email,
            "name": name,
            "bloodGroup": data.get("bloodGroup"),
            "available": False,
            "verified": False,
            "donationCount": 0,
            "createdAt": datetime.utcnow().isoformat()
        }))

    token = create_access_token(identity=user_id, additional_claims={"role": role})

    sns_async("New User", f"{name} registered as {role}")

    return jsonify({"token": token, "role": role}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = json_body()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    res = users_table.get_item(Key={"email": email})
    user = res.get("Item")

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    user = from_ddb(user)
    token = create_access_token(identity=user["id"], additional_claims={"role": user["role"]})

    sns_async("Login", f"{user['name']} logged in")

    return jsonify({"token": token, "role": user["role"]})

# ============================================================================
# DONORS
# ============================================================================

@app.route("/api/donors", methods=["GET"])
def get_donors():
    donors = donors_table.scan().get("Items", [])
    donors = from_ddb(donors)

    for d in donors:
        if d.get("bloodGroup"):
            d["compatibilityInfo"] = get_donation_stats(d["bloodGroup"])

    return jsonify(donors)

@app.route("/api/donors/<id>/toggle", methods=["PATCH"])
def toggle_donor(id):
    res = donors_table.get_item(Key={"id": id})
    if "Item" not in res:
        return jsonify({"error": "Not found"}), 404

    donor = from_ddb(res["Item"])
    donor["available"] = not donor.get("available", False)

    donors_table.put_item(Item=to_ddb(donor))
    return jsonify(donor)

# ============================================================================
# HOSPITALS
# ============================================================================

@app.route("/api/hospitals", methods=["POST"])
def add_hospital():
    data = json_body()
    hospital = to_ddb({
        "id": str(uuid.uuid4()),
        "name": data["name"],
        "city": data["city"],
        "phone": data["phone"],
        "verified": False,
        "createdAt": datetime.utcnow().isoformat()
    })

    hospitals_table.put_item(Item=hospital)
    sns_async("Hospital Added", data["name"])
    return jsonify(from_ddb(hospital)), 201

@app.route("/api/hospitals", methods=["GET"])
def hospitals():
    return jsonify(from_ddb(hospitals_table.scan().get("Items", [])))

# ============================================================================
# REQUESTS
# ============================================================================

@app.route("/api/requests", methods=["POST"])
def create_request():
    data = json_body()
    blood_group = data["bloodGroup"]

    if blood_group not in get_all_valid_blood_groups():
        return jsonify({"error": "Invalid blood group"}), 400

    donors = from_ddb(donors_table.scan().get("Items", []))
    matched = match_donors_to_request(data, donors)

    req = to_ddb({
        "id": str(uuid.uuid4()),
        "hospital": data["hospital"],
        "bloodGroup": blood_group,
        "units": data["units"],
        "urgency": data["urgency"],
        "status": "OPEN",
        "matchedDonors": matched,
        "createdAt": datetime.utcnow().isoformat()
    })

    requests_table.put_item(Item=req)

    sns_async("URGENT BLOOD REQUEST", f"{blood_group} | {data['urgency']}")
    return jsonify(from_ddb(req)), 201

@app.route("/api/requests", methods=["GET"])
def get_requests():
    return jsonify(from_ddb(requests_table.scan().get("Items", [])))

# ============================================================================
# STATS
# ============================================================================

@app.route("/api/stats")
def stats():
    donors = from_ddb(donors_table.scan().get("Items", []))
    requests = from_ddb(requests_table.scan().get("Items", []))

    return jsonify({
        "totalDonors": len(donors),
        "availableDonors": len([d for d in donors if d.get("available")]),
        "activeRequests": len([r for r in requests if r.get("status") == "OPEN"])
    })

# ============================================================================
# HEALTH
# ============================================================================

@app.route("/health")
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})

# ============================================================================
# ENTRY
# ============================================================================

if __name__ == "__main__":
    print("Blood Bank API running on AWS")
    app.run(host="0.0.0.0", port=5000)
