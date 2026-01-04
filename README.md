# Voice-to-Text Desktop App with Tauri + Deepgram

A cross-platform desktop application for real-time speech-to-text transcription using Tauri and Deepgram API.

## Project Overview

This is a cross-platform desktop application built with Tauri and React that converts speech to text using Deepgram's AI-powered transcription. The app provides real-time voice input capabilities with seamless integration into the user's workflow.

## Features

### Core Features Implemented
- **Push-to-Talk Voice Input**: Single button for start/stop recording
- **Real-Time Transcription**: Streaming audio to Deepgram with immediate text feedback
- **Microphone Access**: High-quality audio capture with permission handling
- **Text Display & Management**: Clean interface for viewing and managing transcriptions
- **Recording Controls**: Visual feedback with recording indicators
- **Error Handling**: Graceful handling of network issues, API errors, and permission denials


### Additional Features
- **Dual Mode**: Real-time streaming and batch transcription modes
- **History Management**: Save, copy, and export transcription history
- **Clipboard Integration**: One-click copy of transcribed text
- **Export Functionality**: Save transcriptions as text files
- **Responsive Design**: Works on various screen sizes


### User Interface
- Clean, modern UI with visual feedback
- Toggle between streaming and recording modes
- Copy text with one click
- Character count and status indicators
- Responsive design for different screen sizes

## Technical Stack

### **Frontend**
- **React 18** with functional components and hooks
- **CSS3** with modern flexbox/grid layouts
- **Vite** for fast development and building

### **Desktop Framework**
- **Tauri 1.x**: Cross-platform desktop app framework (Rust-based)
- **Native System Integration**: File system access, clipboard, window management

### **Speech Recognition**  
- **Deepgram API**: State-of-the-art speech-to-text with low latency
- **WebSocket Streaming**: Real-time transcription as you speak
- **Batch Processing**: Alternative mode for higher accuracy

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+ (for Tauri)
- Deepgram API key (free at [deepgram.com](https://deepgram.com))
- Windows: Visual Studio Build Tools
- macOS: Xcode Command Line Tools
- Linux: gcc and other dev tools

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd voice-to-text-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your Deepgram API key

# Start development
npm run tauri dev

# Build for production
npm run tauri build