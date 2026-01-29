# AWS Deployment Guide - Blood Bank Application

## 📋 Overview

This guide covers deploying the Blood Bank Application to AWS using:
- **DynamoDB** for data storage
- **SNS** for notifications
- **EC2** or **Elastic Beanstalk** for application hosting
- **S3** (optional) for file storage

## 🔧 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Python 3.8+** installed
4. **boto3** library installed

```bash
pip install boto3
```

## 📦 AWS Services Setup

### 1. DynamoDB Tables Creation

#### Automatic Setup (Recommended)
Run the provided script to create all required tables:

```bash
cd flask_server
python create_dynamodb_tables.py
```

This creates the following tables:
- `BloodBank_Users` - User accounts
- `BloodBank_Donors` - Donor profiles
- `BloodBank_Hospitals` - Hospital information
- `BloodBank_Inventory` - Blood inventory
- `BloodBank_Requests` - Blood requests
- `BloodBank_DonationHistory` - Donation records

#### Manual Setup (Alternative)
Create tables via AWS Console:
1. Go to DynamoDB → Tables → Create table
2. Use the table schemas from `create_dynamodb_tables.py`
3. Set Read/Write capacity to 5 units each (adjust based on traffic)

### 2. SNS Topic Setup

#### Create SNS Topic for Notifications

```bash
# Create topic
aws sns create-topic --name BloodBank_Notifications --region us-east-1

# Note the TopicArn from output
# Example: arn:aws:sns:us-east-1:123456789012:BloodBank_Notifications
```

#### Subscribe to SNS Topic (Email Notifications)

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:BloodBank_Notifications \
  --protocol email \
  --notification-endpoint your-email@example.com
```

**Important:** Check your email and confirm the subscription!

#### Update SNS Topic ARN

Edit `server_aws.py` and update:
```python
SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:BloodBank_Notifications'
```

### 3. IAM Role Configuration

Create an IAM role with these policies:
- `AmazonDynamoDBFullAccess`
- `AmazonSNSFullAccess`
- `AmazonS3FullAccess` (if using S3 for files)

Attach this role to your EC2 instance or Elastic Beanstalk environment.

## 🚀 Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)

#### Step 1: Install EB CLI

```bash
pip install awsebcli
```

#### Step 2: Initialize Elastic Beanstalk

```bash
cd flask_server
eb init -p python-3.9 blood-bank-app --region us-east-1
```

#### Step 3: Create Environment

```bash
eb create blood-bank-env
```

#### Step 4: Configure Environment

Create `.ebextensions/python.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: server_aws:app
  aws:elasticbeanstalk:application:environment:
    AWS_REGION: us-east-1
```

#### Step 5: Deploy

```bash
eb deploy
```

#### Step 6: Open Application

```bash
eb open
```

### Option 2: EC2 Instance Deployment

#### Step 1: Launch EC2 Instance

1. Launch Ubuntu 22.04 LTS instance
2. Configure security group:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 5000 (Flask - for testing)

#### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3-pip python3-venv -y

# Install nginx
sudo apt install nginx -y
```

#### Step 4: Setup Application

```bash
# Clone or upload your application
cd /home/ubuntu
git clone your-repo-url blood-bank

# Create virtual environment
cd blood-bank/flask_server
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements_aws.txt
```

#### Step 5: Configure Gunicorn

```bash
pip install gunicorn

# Test gunicorn
gunicorn --bind 0.0.0.0:5000 server_aws:app
```

#### Step 6: Create Systemd Service

Create `/etc/systemd/system/bloodbank.service`:

```ini
[Unit]
Description=Blood Bank Flask Application
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/blood-bank/flask_server
Environment="PATH=/home/ubuntu/blood-bank/flask_server/venv/bin"
ExecStart=/home/ubuntu/blood-bank/flask_server/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 server_aws:app

[Install]
WantedBy=multi-user.target
```

#### Step 7: Start Service

```bash
sudo systemctl start bloodbank
sudo systemctl enable bloodbank
sudo systemctl status bloodbank
```

#### Step 8: Configure Nginx

Create `/etc/nginx/sites-available/bloodbank`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable and restart nginx:

```bash
sudo ln -s /etc/nginx/sites-available/bloodbank /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 📝 Configuration Files

### requirements_aws.txt

Create `requirements_aws.txt` with AWS dependencies:

```txt
Flask==3.1.0
Flask-Cors==5.0.0
Flask-JWT-Extended==4.7.1
Werkzeug==3.1.3
boto3==1.34.28
gunicorn==21.2.0
```

### Environment Variables

For production, use environment variables instead of hardcoded values:

```python
import os

AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'change-me')
```

Set in Elastic Beanstalk:
```bash
eb setenv AWS_REGION=us-east-1 SNS_TOPIC_ARN=your-topic-arn JWT_SECRET_KEY=your-secret
```

Set on EC2:
```bash
export AWS_REGION=us-east-1
export SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123:BloodBank_Notifications
```

## 🔒 Security Best Practices

### 1. IAM Permissions
- Use least privilege principle
- Create separate IAM roles for different environments
- Never hardcode AWS credentials

### 2. DynamoDB
- Enable point-in-time recovery
- Set up DynamoDB streams for audit trail
- Use encryption at rest

### 3. Application Security
- Change JWT secret key in production
- Use HTTPS only (configure SSL certificate)
- Enable CORS only for your frontend domain
- Implement rate limiting

### 4. SNS
- Encrypt SNS messages
- Restrict SNS publish permissions
- Use separate topics for different notification types

## 📊 Monitoring & Logging

### CloudWatch Logs

Configure CloudWatch for application logs:

```python
import logging
import watchtower

# Setup CloudWatch handler
cloudwatch_handler = watchtower.CloudWatchLogHandler()
app.logger.addHandler(cloudwatch_handler)
```

### CloudWatch Alarms

Create alarms for:
- DynamoDB read/write capacity
- EC2 CPU utilization
- Application errors
- SNS delivery failures

## 🧪 Testing AWS Deployment

### Test DynamoDB Connection

```bash
python -c "import boto3; print(boto3.resource('dynamodb', region_name='us-east-1').tables.all())"
```

### Test SNS Notifications

```bash
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:BloodBank_Notifications \
  --message "Test notification" \
  --subject "Test"
```

### Health Check

```bash
curl http://your-domain.com/health
```

## 💰 Cost Optimization

### DynamoDB
- Use on-demand pricing for unpredictable workloads
- Enable auto-scaling for provisioned capacity
- Archive old data to S3

### EC2
- Use t3.micro or t3.small for small workloads
- Enable auto-scaling groups
- Use reserved instances for steady workload

### SNS
- SMS costs more than email
- Batch notifications when possible

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to Elastic Beanstalk
        run: |
          pip install awsebcli
          cd flask_server
          eb deploy blood-bank-env
```

## 🆘 Troubleshooting

### Common Issues

1. **DynamoDB Access Denied**
   - Check IAM role permissions
   - Verify table names match code

2. **SNS Not Sending**
   - Confirm subscription is active
   - Check SNS topic ARN
   - Verify IAM permissions

3. **Application Not Starting**
   - Check CloudWatch logs
   - Verify all environment variables set
   - Test locally with AWS credentials

### Debug Mode

Enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📚 Additional Resources

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SNS Documentation](https://docs.aws.amazon.com/sns/)
- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.3.x/deploying/)

## 🎯 Production Checklist

Before going live:

- [ ] DynamoDB tables created with appropriate capacity
- [ ] SNS topic created and subscriptions confirmed
- [ ] IAM roles configured with least privilege
- [ ] JWT secret key changed from default
- [ ] HTTPS configured with valid SSL certificate
- [ ] CORS restricted to frontend domain only
- [ ] CloudWatch alarms configured
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Documentation updated

## 📞 Support

For issues or questions:
- Check CloudWatch logs
- Review this deployment guide
- Contact the development team

---

**Version:** 2.0.0-AWS  
**Last Updated:** January 2026
