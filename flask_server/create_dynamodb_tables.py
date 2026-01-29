"""
DynamoDB Table Creation Script for Blood Bank Application

This script creates all required DynamoDB tables for the Blood Bank application.
Run this script once before deploying the application to AWS.

Usage:
    python create_dynamodb_tables.py

Prerequisites:
    - AWS CLI configured with appropriate credentials
    - boto3 library installed
"""

import boto3
from botocore.exceptions import ClientError

# AWS Configuration
AWS_REGION = 'us-east-1'

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb', region_name=AWS_REGION)

# Table definitions
TABLES = [
    {
        'TableName': 'BloodBank_Users',
        'KeySchema': [
            {'AttributeName': 'email', 'KeyType': 'HASH'}  # Partition key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'email', 'AttributeType': 'S'},
            {'AttributeName': 'id', 'AttributeType': 'N'}
        ],
        'GlobalSecondaryIndexes': [
            {
                'IndexName': 'id-index',
                'KeySchema': [
                    {'AttributeName': 'id', 'KeyType': 'HASH'}
                ],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            }
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    },
    {
        'TableName': 'BloodBank_Donors',
        'KeySchema': [
            {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'id', 'AttributeType': 'N'},
            {'AttributeName': 'email', 'AttributeType': 'S'}
        ],
        'GlobalSecondaryIndexes': [
            {
                'IndexName': 'email-index',
                'KeySchema': [
                    {'AttributeName': 'email', 'KeyType': 'HASH'}
                ],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            }
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    },
    {
        'TableName': 'BloodBank_Hospitals',
        'KeySchema': [
            {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'id', 'AttributeType': 'N'}
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    },
    {
        'TableName': 'BloodBank_Inventory',
        'KeySchema': [
            {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'id', 'AttributeType': 'N'}
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    },
    {
        'TableName': 'BloodBank_Requests',
        'KeySchema': [
            {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'id', 'AttributeType': 'N'}
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    },
    {
        'TableName': 'BloodBank_DonationHistory',
        'KeySchema': [
            {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'donorEmail', 'AttributeType': 'S'}
        ],
        'GlobalSecondaryIndexes': [
            {
                'IndexName': 'donorEmail-index',
                'KeySchema': [
                    {'AttributeName': 'donorEmail', 'KeyType': 'HASH'}
                ],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            }
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    }
]


def create_table(table_config):
    """Create a single DynamoDB table."""
    try:
        table = dynamodb.create_table(**table_config)
        print(f"✓ Creating table: {table_config['TableName']}...")
        
        # Wait for table to be created
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=table_config['TableName'])
        
        print(f"✓ Table {table_config['TableName']} created successfully!")
        return True
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"⚠ Table {table_config['TableName']} already exists. Skipping...")
            return True
        else:
            print(f"✗ Error creating table {table_config['TableName']}: {e}")
            return False


def delete_table(table_name):
    """Delete a DynamoDB table (use with caution!)."""
    try:
        dynamodb.delete_table(TableName=table_name)
        print(f"✓ Deleted table: {table_name}")
        return True
    except ClientError as e:
        print(f"✗ Error deleting table {table_name}: {e}")
        return False


def list_tables():
    """List all DynamoDB tables."""
    try:
        response = dynamodb.list_tables()
        tables = response.get('TableNames', [])
        
        print(f"\n{'=' * 70}")
        print(f"Existing DynamoDB Tables in {AWS_REGION}:")
        print(f"{'=' * 70}")
        
        if tables:
            for table in tables:
                print(f"  • {table}")
        else:
            print("  No tables found.")
        
        print(f"{'=' * 70}\n")
        
        return tables
        
    except ClientError as e:
        print(f"✗ Error listing tables: {e}")
        return []


def main():
    """Main function to create all tables."""
    print(f"\n{'=' * 70}")
    print(f"  Blood Bank Application - DynamoDB Table Creation")
    print(f"  AWS Region: {AWS_REGION}")
    print(f"{'=' * 70}\n")
    
    # List existing tables
    existing_tables = list_tables()
    
    # Create tables
    print(f"Creating {len(TABLES)} DynamoDB tables...\n")
    
    success_count = 0
    for table_config in TABLES:
        if create_table(table_config):
            success_count += 1
        print()  # Empty line for readability
    
    # Summary
    print(f"{'=' * 70}")
    print(f"  Summary: {success_count}/{len(TABLES)} tables created successfully")
    print(f"{'=' * 70}\n")
    
    # List tables again to confirm
    list_tables()
    
    print("✓ DynamoDB table setup complete!")
    print("\nNext steps:")
    print("  1. Create SNS topic: aws sns create-topic --name BloodBank_Notifications")
    print("  2. Subscribe to SNS topic with your email")
    print("  3. Update SNS_TOPIC_ARN in server_aws.py")
    print("  4. Deploy your application\n")


if __name__ == '__main__':
    main()
