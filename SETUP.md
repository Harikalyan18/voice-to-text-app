# Setup Instructions for Voice-to-Text Desktop App

## 📋 Prerequisites

### Operating System
- **Windows 10/11** (64-bit)
- **macOS 10.15+** (Catalina or newer)
- **Linux** (Ubuntu 20.04+, Fedora 33+, or similar)

### Required Software

#### 1. Node.js (v18 or higher)
**Download from:** https://nodejs.org

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher

### Rust (for Tauri)
Windows:
- winget install --id Rustlang.Rustup

### Platform-Specific Build Tools
Windows:
--> Visual Studio 2022 Build Tools
- Download from: https://visualstudio.microsoft.com/downloads/
- Install the "Desktop development with C++" workload

### Clone with Git
- git clone https://github.com/yourusername/voice-to-text-app.git
- cd voice-to-text-app ( project-folder name )


### Install Dependencies
# Install npm packages
npm install
# This will install:
# - React (frontend framework)
# - Tauri (desktop framework)
# - Axios (HTTP client)
# - Other development dependencies


### Configure Environment Variables
Create .env file from example:
# Copy the example file
cp .env.example .env
# Edit the .env file and add your Deepgram API key


### .env file should contain:
VITE_DEEPGRAM_API_KEY=dg_your_actual_api_key_here

### Get Deepgram API Key
- Sign up for free account:
- Visit: https://console.deepgram.com/signup
- Create API key:
- After login, click "Create API Key"
- Name it "VoiceToText App"
- Copy the key
- Add to .env file:
- Open .env in a text editor
- Replace your_deepgram_api_key_here with your actual key

### Running the application
npm run tauri dev

