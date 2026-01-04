# Voice-to-Text Desktop App with Tauri + Deepgram

A functional clone of Wispr Flow that provides voice-to-text transcription with desktop integration.

## Project Overview

This is a cross-platform desktop application built with Tauri and React that converts speech to text using Deepgram's AI-powered transcription. The app provides real-time voice input capabilities with seamless integration into the user's workflow.

## Features

### Core Features Implemented
1. **Push-to-Talk Voice Input** - Start/stop recording with visual feedback
2. **Dual Transcription Modes**:
   - Real-time streaming (WebSocket)
   - Record-and-transcribe (REST API)
3. **Microphone Access** - High-quality audio capture with noise suppression
4. **Text Display & Copy** - Clear transcription display with character count
5. **Desktop Integration** - Global shortcuts, system tray, and clipboard integration
6. **Error Handling** - Graceful handling of API errors, network issues, and permissions

### User Interface
- Clean, modern UI with visual feedback
- Toggle between streaming and recording modes
- Copy text with one click
- Character count and status indicators
- Responsive design for different screen sizes

## Technical Stack

| Technology | Purpose |
|
| **Tauri 1.5** | Cross-platform desktop framework (Rust backend) |
| **React 18** | Frontend UI with hooks for state management |
| **Deepgram API** | Real-time speech-to-text transcription |
| **WebRTC** | Microphone access and audio streaming |
| **CSS3** | Modern styling with animations and responsive design |

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Rust and Cargo (for Tauri)
- Deepgram API key (free at [deepgram.com](https://deepgram.com))

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd voice-to-text-app
