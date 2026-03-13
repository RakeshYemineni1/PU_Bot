# Clean Project - Final Steps

## Current Status:
✅ All project files are in: d:\Projects\AI_HelpDesk_ChatBot\
✅ Old chatbot subfolder can be deleted manually

## Manual Cleanup Steps:

### 1. Close Everything
- Close this terminal
- Close VS Code or any editor
- Close any file explorer windows

### 2. Delete Old Folders (Manually)
Navigate to: d:\Projects\AI_HelpDesk_ChatBot\
Delete these folders:
- chatbot\ (old duplicate)
- node_modules\ (if exists)

### 3. Initialize Git in Clean Directory

Open NEW terminal in: d:\Projects\AI_HelpDesk_ChatBot\

```bash
# Remove old git
rmdir /S /Q .git

# Initialize fresh git
git init

# Add all files
git add .

# Commit
git commit -m "Clean project structure"

# Set remote
git remote add origin https://github.com/RakeshYemineni1/PU_Bot.git

# Force push (clean history)
git push -f origin master
```

### 4. Verify on GitHub
Go to: https://github.com/RakeshYemineni1/PU_Bot

You should see at root:
- .github/
- backend/
- frontend/
- package.json
- README.md
- etc.

### 5. Add GitHub Secrets
https://github.com/RakeshYemineni1/PU_Bot/settings/secrets/actions

Add:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY  
- GEMINI_API_KEY

### 6. Deploy
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin master
```

---

## Final Structure:
```
AI_HelpDesk_ChatBot/
├── .github/workflows/deploy.yml
├── .ebextensions/nodecommand.config
├── backend/
├── frontend/
├── package.json
└── README.md
```

Clean and ready for AWS deployment!
