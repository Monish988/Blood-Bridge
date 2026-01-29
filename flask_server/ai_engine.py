"""
AI Engine for Blood Bank Application
Handles blood group compatibility logic and donor-request matching.

This module provides functions for:
- Blood group compatibility checking
- Finding compatible blood groups for donation
- Filtering compatible donors for requests
- Validating blood group data

Blood Compatibility Rules:
- O- is universal donor (can donate to all)
- AB+ is universal receiver (can receive from all)
- A+ can receive from: A+, A-, O+, O-
- A- can receive from: A-, O-
- B+ can receive from: B+, B-, O+, O-
- B- can receive from: B-, O-
- AB+ can receive from: all groups
- AB- can receive from: A-, B-, AB-, O-
- O+ can receive from: O+, O-
- O- can receive from: O-
"""

# Valid blood groups
VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

# Blood compatibility matrix: recipient -> list of compatible donor blood groups
COMPATIBILITY_MATRIX = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"]
}


def get_all_valid_blood_groups():
    """
    Get list of all valid blood groups.
    
    Returns:
        list: List of valid blood group strings
    """
    return VALID_BLOOD_GROUPS.copy()


def is_valid_blood_group(blood_group):
    """
    Check if a blood group is valid.
    
    Args:
        blood_group (str): Blood group to validate
    
    Returns:
        bool: True if valid, False otherwise
    """
    return blood_group in VALID_BLOOD_GROUPS


def is_compatible(donor_blood_group, recipient_blood_group):
    """
    Check if a donor's blood group is compatible with a recipient's blood group.
    
    Args:
        donor_blood_group (str): Blood group of the donor
        recipient_blood_group (str): Blood group of the recipient
    
    Returns:
        bool: True if compatible, False otherwise
    """
    if not is_valid_blood_group(donor_blood_group) or not is_valid_blood_group(recipient_blood_group):
        return False
    
    compatible_donors = COMPATIBILITY_MATRIX.get(recipient_blood_group, [])
    return donor_blood_group in compatible_donors


def get_compatible_blood_groups(recipient_blood_group):
    """
    Get all blood groups that can donate to a specific recipient blood group.
    
    Args:
        recipient_blood_group (str): Blood group of the recipient
    
    Returns:
        dict: Dictionary with compatibility information
    """
    if not is_valid_blood_group(recipient_blood_group):
        return {
            "recipient": recipient_blood_group,
            "valid": False,
            "compatible_donors": [],
            "message": "Invalid blood group"
        }
    
    compatible_donors = COMPATIBILITY_MATRIX.get(recipient_blood_group, [])
    
    return {
        "recipient": recipient_blood_group,
        "valid": True,
        "compatible_donors": compatible_donors,
        "count": len(compatible_donors),
        "is_universal_receiver": recipient_blood_group == "AB+",
        "is_rare_recipient": recipient_blood_group in ["AB-", "B-", "A-", "O-"]
    }


def get_can_donate_to(donor_blood_group):
    """
    Get all blood groups that a specific donor can donate to.
    
    Args:
        donor_blood_group (str): Blood group of the donor
    
    Returns:
        list: List of blood groups the donor can donate to
    """
    if not is_valid_blood_group(donor_blood_group):
        return []
    
    can_donate_to = []
    for recipient_bg, compatible_donors in COMPATIBILITY_MATRIX.items():
        if donor_blood_group in compatible_donors:
            can_donate_to.append(recipient_bg)
    
    return can_donate_to


def filter_compatible_donors(recipient_blood_group, donors_list):
    """
    Filter a list of donors to find those compatible with a recipient blood group.
    
    Args:
        recipient_blood_group (str): Blood group needed
        donors_list (list): List of donor dictionaries with 'bloodGroup' key
    
    Returns:
        list: List of compatible donors
    """
    if not is_valid_blood_group(recipient_blood_group):
        return []
    
    compatible_blood_groups = COMPATIBILITY_MATRIX.get(recipient_blood_group, [])
    
    compatible_donors = [
        donor for donor in donors_list
        if donor.get("bloodGroup") in compatible_blood_groups
    ]
    
    return compatible_donors


def get_compatibility_score(donor_blood_group, recipient_blood_group):
    """
    Get a compatibility score between donor and recipient.
    Higher score means better match.
    
    Args:
        donor_blood_group (str): Blood group of the donor
        recipient_blood_group (str): Blood group of the recipient
    
    Returns:
        int: Compatibility score (0-100)
    """
    if not is_compatible(donor_blood_group, recipient_blood_group):
        return 0
    
    # Exact match gets highest score
    if donor_blood_group == recipient_blood_group:
        return 100
    
    # O- is universal donor, but less preferred if not exact match
    if donor_blood_group == "O-":
        return 70
    
    # O+ is common donor
    if donor_blood_group == "O+":
        return 80
    
    # Other compatible matches
    return 85


def get_donation_stats(donor_blood_group):
    """
    Get statistics about how valuable a donor's blood group is.
    
    Args:
        donor_blood_group (str): Blood group of the donor
    
    Returns:
        dict: Statistics about the blood group
    """
    if not is_valid_blood_group(donor_blood_group):
        return {"valid": False, "message": "Invalid blood group"}
    
    can_donate_to_list = get_can_donate_to(donor_blood_group)
    
    is_universal = donor_blood_group == "O-"
    is_rare = donor_blood_group in ["AB-", "B-", "A-", "O-"]
    
    return {
        "blood_group": donor_blood_group,
        "valid": True,
        "can_donate_to": can_donate_to_list,
        "can_donate_to_count": len(can_donate_to_list),
        "is_universal_donor": is_universal,
        "is_rare": is_rare,
        "demand_level": "Critical" if is_universal else "High" if is_rare else "Normal"
    }


def match_donors_to_request(blood_request, available_donors):
    """
    Match and rank donors for a specific blood request.
    
    Args:
        blood_request (dict): Request with 'bloodGroup' key
        available_donors (list): List of available donors with 'bloodGroup' and 'available' keys
    
    Returns:
        list: List of matched donors sorted by compatibility score
    """
    recipient_blood_group = blood_request.get("bloodGroup")
    
    if not is_valid_blood_group(recipient_blood_group):
        return []
    
    # Filter compatible and available donors
    matched_donors = []
    for donor in available_donors:
        if not donor.get("available", False):
            continue
        
        donor_blood_group = donor.get("bloodGroup")
        if is_compatible(donor_blood_group, recipient_blood_group):
            score = get_compatibility_score(donor_blood_group, recipient_blood_group)
            matched_donors.append({
                **donor,
                "compatibility_score": score,
                "exact_match": donor_blood_group == recipient_blood_group
            })
    
    # Sort by compatibility score (descending)
    matched_donors.sort(key=lambda x: x["compatibility_score"], reverse=True)
    
    return matched_donors
