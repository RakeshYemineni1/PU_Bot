# AWS Deployment Guide - Simple & Easy

## 🚀 Quick Deployment with AWS Elastic Beanstalk + GitHub Actions

This is the **simplest** way to deploy your chatbot to AWS with automatic CI/CD.

---

## 📋 Prerequisites

1. **AWS Account** - [Sign up here](https://aws.amazon.com/)
2. **GitHub Account** - [Sign up here](https://github.com/)
3. **Git installed** on your computer

---

## 🔧 Step 1: Setup AWS

### 1.1 Create IAM User for Deployment

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Add users**
3. Username: `github-deployer`
4. Select: **Access key - Programmatic access**
5. Click **Next: Permissions**
6. Click **Attach existing policies directly**
7. Search and select:
   - `AdministratorAccess-AWSElasticBeanstalk`
   - `AWSElasticBeanstalkFullAccess`
8. Click **Next** → **Create user**
9. **SAVE** the credentials:
   - Access Key ID
   - Secret Access Key

### 1.2 Create Elastic Beanstalk Application

1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click **Create Application**
3. Fill in:
   - **Application name:** `parul-chatbot`
   - **Platform:** Node.js
   - **Platform branch:** Node.js 18 running on 64bit Amazon Linux 2
   - **Application code:** Sample application (we'll deploy via GitHub)
4. Click **Create application**
5. Wait for environment creation (5-10 minutes)
6. Note the **Environment name** (e.g., `parul-chatbot-env`)

---

## 🔐 Step 2: Setup GitHub Repository

### 2.1 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `parul-chatbot`
3. Make it **Private** or **Public**
4. Click **Create repository**

### 2.2 Add AWS Credentials to GitHub Secrets

1. Go to your repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:

**Secret 1:**
- Name: `AWS_ACCESS_KEY_ID`
- Value: (paste your Access Key ID from Step 1.1)

**Secret 2:**
- Name: `AWS_SECRET_ACCESS_KEY`
- Value: (paste your Secret Access Key from Step 1.1)

### 2.3 Add Gemini API Key

**Secret 3:**
- Name: `GEMINI_API_KEY`
- Value: (your Gemini API key)

---

## 📤 Step 3: Push Code to GitHub

Open terminal in your project folder:

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/parul-chatbot.git

# Push to GitHub
git push -u origin main
```

---

## 🎯 Step 4: Configure Environment Variables in AWS

1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click your application → Click your environment
3. Click **Configuration** → **Software** → **Edit**
4. Scroll to **Environment properties**
5. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** (your Gemini API key)
6. Click **Apply**

---

## ✅ Step 5: Deploy!

### Automatic Deployment (CI/CD)

Every time you push to `main` branch, GitHub Actions will automatically deploy!

```bash
# Make any change
git add .
git commit -m "Deploy to AWS"
git push origin main
```

### Check Deployment Status

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the deployment progress
4. Wait for green checkmark ✅

---

## 🌐 Step 6: Access Your Chatbot

1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click your environment
3. Copy the **URL** (e.g., `parul-chatbot-env.eba-xxxxx.us-east-1.elasticbeanstalk.com`)
4. Open in browser!

---

## 🔄 Update Workflow File (If Needed)

If your environment name is different, update `.github/workflows/deploy.yml`:

```yaml
environment_name: YOUR_ENVIRONMENT_NAME  # Change this
region: us-east-1  # Change if you used different region
```

---

## 📊 Monitor Your Application

### View Logs
1. Go to Elastic Beanstalk Console
2. Click your environment
3. Click **Logs** → **Request Logs** → **Last 100 Lines**

### View Health
1. Click **Health** tab
2. Monitor CPU, Memory, Network

---

## 💰 Cost Estimate

**Free Tier (First 12 months):**
- Elastic Beanstalk: Free
- EC2 t2.micro: 750 hours/month free
- **Estimated cost: $0/month** (within free tier)

**After Free Tier:**
- ~$15-20/month for t2.micro instance

---

## 🛠️ Troubleshooting

### Deployment Failed?
1. Check GitHub Actions logs
2. Check AWS Elastic Beanstalk logs
3. Verify environment variables are set

### Application Not Working?
1. Check if GEMINI_API_KEY is set in AWS
2. Check backend logs in Elastic Beanstalk
3. Verify Node.js version is 18.x

### Need to Rollback?
1. Go to Elastic Beanstalk Console
2. Click **Application versions**
3. Select previous version
4. Click **Deploy**

---

## 🎉 That's It!

Your chatbot is now:
- ✅ Deployed on AWS
- ✅ Auto-deploys on every push
- ✅ Scalable and production-ready
- ✅ Has CI/CD pipeline

---

## 📝 Quick Commands Reference

```bash
# Deploy new changes
git add .
git commit -m "Your message"
git push origin main

# Check deployment status
# Go to: https://github.com/YOUR_USERNAME/parul-chatbot/actions

# View live app
# Go to: YOUR_ELASTIC_BEANSTALK_URL
```

---

## 🆘 Need Help?

1. Check GitHub Actions logs
2. Check AWS Elastic Beanstalk logs
3. Verify all secrets are set correctly
4. Ensure Node.js version is 18.x

---

**Deployment Time:** ~15 minutes
**Cost:** Free (with AWS Free Tier)
**Difficulty:** Easy ⭐⭐☆☆☆
