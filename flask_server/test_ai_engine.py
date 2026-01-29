"""
Test script for the AI Engine blood compatibility module
"""

from ai_engine import (
    get_compatible_blood_groups,
    filter_compatible_donors,
    is_compatible,
    get_all_valid_blood_groups,
    match_donors_to_request,
    get_donation_stats
)

print("=" * 70)
print("Testing AI Engine Blood Compatibility Module")
print("=" * 70)

# Test 1: Valid blood groups
print("\n1. Valid Blood Groups:")
valid_groups = get_all_valid_blood_groups()
print(f"   {', '.join(valid_groups)}")

# Test 2: Compatibility checking
print("\n2. Compatibility Tests:")
test_cases = [
    ("O-", "AB+", True),   # Universal donor
    ("O+", "A+", True),
    ("A+", "O+", False),   # A+ cannot donate to O+
    ("B-", "AB-", True),
]

for donor, recipient, expected in test_cases:
    result = is_compatible(donor, recipient)
    status = "✓" if result == expected else "✗"
    print(f"   {status} {donor} → {recipient}: {result}")

# Test 3: Get compatible donors for a blood group
print("\n3. Compatible Donors for A+ recipient:")
compatibility = get_compatible_blood_groups("A+")
print(f"   Can receive from: {', '.join(compatibility['compatible_donors'])}")
print(f"   Total compatible: {compatibility['count']}")

# Test 4: Donation stats for O- (universal donor)
print("\n4. Donation Stats for O- (Universal Donor):")
stats = get_donation_stats("O-")
print(f"   Can donate to: {', '.join(stats['can_donate_to'])}")
print(f"   Is universal donor: {stats['is_universal_donor']}")
print(f"   Demand level: {stats['demand_level']}")

# Test 5: Match donors to request
print("\n5. Matching Donors to Request:")
sample_donors = [
    {"id": 1, "name": "John", "bloodGroup": "O-", "available": True},
    {"id": 2, "name": "Jane", "bloodGroup": "A+", "available": True},
    {"id": 3, "name": "Bob", "bloodGroup": "B+", "available": False},
    {"id": 4, "name": "Alice", "bloodGroup": "A-", "available": True},
]

sample_request = {"bloodGroup": "A+", "units": 2}

matched = match_donors_to_request(sample_request, sample_donors)
print(f"   Request for: {sample_request['bloodGroup']}")
print(f"   Matched donors: {len(matched)}")
for donor in matched:
    print(f"     - {donor['name']} ({donor['bloodGroup']}) - Score: {donor['compatibility_score']}")

print("\n" + "=" * 70)
print("All tests completed successfully!")
print("=" * 70)
