# Add HTTPS to Your Chatbot

## Quick Steps:

1. Go to AWS Elastic Beanstalk Console
2. Click your environment (Parul-chatbot-env)
3. Click **Configuration** → **Load Balancer**
4. Click **Add Listener**
5. Select:
   - Protocol: HTTPS
   - Port: 443
   - SSL Certificate: Request new from ACM (free)
6. Click **Apply**

Now your link will be: https://pubot.ap-south-1.elasticbeanstalk.com/
