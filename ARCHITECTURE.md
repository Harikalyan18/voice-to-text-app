
## Component Architecture

### 1. Frontend Layer (React)

#### App.jsx (Root Component)
- **Responsibility**: Application shell and state management
- **State Managed**:
  - Transcription history array
  - Error messages
  - UI state
- **Features**:
  - Tab navigation (Recorder/History)
  - Error display
  - History management

#### AudioRecorder.jsx (Core Component)
- **Responsibility**: Main recording and transcription interface
- **State Managed**:
  - Recording status
  - Transcription text
  - Streaming state
  - API key status
- **Features**:
  - Recording controls
  - Mode toggling (streaming/batch)
  - Text display
  - Copy/clear actions

### 2. Service Layer

#### deepgram.js (API Service)
- **Responsibility**: Communication with Deepgram API
- **Methods**:
  - `transcribeAudio(audioBlob)`: Batch transcription via HTTP
  - `createDeepgramStream()`: Real-time streaming via WebSocket
- **Features**:
  - API key validation
  - Error handling
  - Connection management

### 3. Custom Hook Layer

#### useAudioRecorder.js
- **Responsibility**: Audio recording logic abstraction
- **State Managed**:
  - Recording status
  - Audio chunks
  - Media stream
- **Methods**:
  - `startRecording()`: Initialize microphone and recorder
  - `stopRecording()`: Stop and process recording
  - `cancelRecording()`: Clean up resources
- **Features**:
  - Microphone permission handling
  - Audio format configuration
  - Resource cleanup

## Data Flow

## Key Technical Decisions

### 1. Frontend-Only Architecture
**Decision**: No backend server
**Rationale**:
- Simpler deployment
- Better privacy (audio stays on user's device until API)
- Direct API communication reduces latency

### 2. Environment-Based Configuration
**Decision**: API key in .env file
**Rationale**:
- Security: Key not exposed in code
- Flexibility: Easy to change without code modification
- Environment-specific: Different keys for dev/prod

### 3. Dual Transcription Modes
**Decision**: Streaming + Batch modes
**Rationale**:
- **Streaming**: Immediate feedback, better UX
- **Batch**: Higher accuracy, better for longer recordings
- **User Choice**: Different scenarios require different approaches


## Performance Considerations

### 1. Audio Quality vs. File Size
- **Sample Rate**: 16000Hz (optimal for speech)
- **Channels**: Mono (1 channel)
- **Format**: WebM with Opus codec
- **Bitrate**: ~16kbps

### 2. Network Optimization
- **Chunk Size**: 250ms intervals
- **Compression**: Opus codec for efficient transmission
- **Connection**: WebSocket for real-time, HTTP for batch

### 3. Memory Management
- **Chunk Recycling**: Audio chunks processed and released
- **Blob Cleanup**: Object URLs revoked when no longer needed
- **Stream Cleanup**: Microphone released when not recording

## Security Considerations

### 1. API Key Security
- **Storage**: In .env file (not committed to git)
- **Transmission**: HTTPS/SSL for all API calls
- **Validation**: Key format validation before use

### 2. Data Privacy
- **Local Processing**: Audio processed on user's device
- **API Transmission**: Only audio sent to Deepgram
- **No Storage**: Audio not stored on external servers

### 3. Permission Model
- **Explicit Consent**: User must grant microphone access
- **Browser Security**: Leverages browser's permission system
- **Clear Indicators**: Visual feedback when recording

## Testing Strategy

### Manual Testing Performed
1. Microphone access on all platforms
2. Recording start/stop functionality
3. Transcription accuracy with various accents
4. Error handling for network issues
5. History persistence

## Scalability Considerations

### Current Limitations
1. Single API key configuration
2. Local storage limits
3. No user accounts
4. No collaborative features


## Dependencies

### Core Dependencies
- **React 18**: UI framework
- **Tauri 1.x**: Desktop framework
- **Deepgram API**: Speech recognition

### Development Dependencies
- **Vite**: Build tool and dev server

