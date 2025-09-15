# Text-to-Speech Implementation

This document describes the text-to-speech functionality implemented in the Buddha AI frontend application using Google Cloud Text-to-Speech API.

## 🎯 Features

- **Streaming Audio**: Real-time text-to-speech with progress tracking
- **Base64 Audio**: Alternative method for complete audio data
- **Multiple Voices**: Support for various languages and voice options
- **Customizable Settings**: Adjustable speaking rate, pitch, and volume
- **Health Monitoring**: API health check functionality
- **Progress Indicators**: Visual feedback during audio generation

## 🏗️ Architecture

### Frontend Components

1. **TextToSpeechService** (`service/text-to-speech.ts`)
   - Main service class handling all TTS operations
   - Supports both streaming and base64 methods
   - Manages authentication and API communication

2. **MainChatBubble** (`components/v2/chat/main-chat-bubble.tsx`)
   - Integrated TTS functionality in chat messages
   - Progress indicator during reading
   - Stop/start reading controls

3. **TextReader** (`components/text-reader.tsx`)
   - Standalone TTS component
   - Accepts text prop for reading

4. **Test Page** (`app/test-tts/page.tsx`)
   - Comprehensive testing interface
   - Voice and language selection
   - Audio settings configuration

## 🔧 API Endpoints

### 1. Stream Audio
```bash
POST /api/v1/tts/stream
```

**Request Body:**
```json
{
  "text": "Hello, this is a test of streaming text-to-speech!",
  "voice_name": "en-US-Standard-A",
  "language_code": "en-US",
  "audio_encoding": "MP3",
  "speaking_rate": 1.0,
  "pitch": 0.0,
  "volume_gain_db": 0.0,
  "chunked": true
}
```

**Response:** Streaming audio data

### 2. Base64 Audio
```bash
POST /api/v1/tts/base64
```

**Response:**
```json
{
  "audio_base64": "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT...",
  "content_type": "audio/mpeg",
  "text_length": 45
}
```

### 3. Get Available Voices
```bash
GET /api/v1/tts/voices?language_code=en-US
```

**Response:**
```json
{
  "voices": [
    "en-US-Standard-A",
    "en-US-Standard-B",
    "en-US-Standard-C",
    "en-US-Standard-D"
  ],
  "language_code": "en-US",
  "count": 4
}
```

### 4. Health Check
```bash
GET /api/v1/tts/health
```

## 💻 Usage Examples

### Basic Streaming Usage
```typescript
import { textToSpeechService } from '@/service/text-to-speech';

// Simple text reading
textToSpeechService.playAudioStream(
  "Hello, this is a test message",
  {
    voice_name: 'en-US-Standard-A',
    language_code: 'en-US',
    speaking_rate: 1.0
  },
  () => console.log("Started reading"),
  (progress) => console.log(`Progress: ${progress}%`),
  () => console.log("Finished reading"),
  (error) => console.error("Error:", error)
);
```

### Base64 Audio Usage
```typescript
// Get base64 audio data
const audioData = await textToSpeechService.getBase64Audio(
  "Hello, this is a test message",
  {
    voice_name: 'en-US-Standard-A',
    language_code: 'en-US'
  }
);

// Play base64 audio
textToSpeechService.playBase64Audio(
  "Hello, this is a test message",
  { voice_name: 'en-US-Standard-A' },
  () => console.log("Started"),
  () => console.log("Finished"),
  (error) => console.error("Error:", error)
);
```

### Get Available Voices
```typescript
// Get voices for a specific language
const voices = await textToSpeechService.getAvailableVoices('en-US');
console.log('Available voices:', voices.voices);
```

### Health Check
```typescript
// Check API health
const isHealthy = await textToSpeechService.checkHealth();
console.log('API Health:', isHealthy);
```

## 🎨 Component Integration

### In Chat Messages
The TTS functionality is integrated into chat message bubbles with:
- Read button with progress indicator
- Stop/start functionality
- Visual feedback during reading

### Standalone Component
```tsx
import { TextReader } from '@/components/text-reader';

<TextReader text="This text will be read aloud" />
```

## 🌍 Supported Languages

- **English (US)**: `en-US`
- **Vietnamese**: `vi-VN`
- **Spanish**: `es-ES`
- **French**: `fr-FR`
- **German**: `de-DE`
- **Japanese**: `ja-JP`
- **Korean**: `ko-KR`
- **Chinese**: `zh-CN`

## ⚙️ Configuration

### Environment Variables
```bash
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (handled via JWT tokens)
# Tokens are stored in localStorage or cookies
```

### Authentication
The service automatically retrieves authentication tokens from:
1. `localStorage.getItem('buddha-token')`
2. Cookies with name `buddha-token`

## 🧪 Testing

### Test Page
Visit `/test-tts` to access the comprehensive testing interface with:
- Text input area
- Language and voice selection
- Audio settings (rate, pitch, volume)
- Streaming vs Base64 method selection
- Progress indicators
- Health status monitoring

### Manual Testing
```bash
# Test streaming endpoint
curl -X POST http://localhost:8000/api/v1/tts/stream \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is streaming text-to-speech!",
    "voice_name": "en-US-Standard-A",
    "language_code": "en-US",
    "audio_encoding": "MP3",
    "chunked": true
  }' \
  --output audio.mp3

# Test health endpoint
curl -X GET http://localhost:8000/api/v1/tts/health \
  -H "Authorization: Bearer your_jwt_token"
```

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure JWT token is valid and not expired
   - Check token storage in localStorage/cookies

2. **API Connection Issues**
   - Verify backend API is running
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Use health check endpoint to verify API status

3. **Audio Playback Issues**
   - Ensure browser supports audio playback
   - Check browser autoplay policies
   - Verify audio format compatibility

4. **Voice Selection Issues**
   - Verify language code is supported
   - Check available voices for selected language
   - Ensure voice name is valid

### Debug Information
- Check browser console for detailed error messages
- Use the test page to verify API connectivity
- Monitor network requests in browser dev tools

## 📝 Translation Keys

The following translation keys are used:
- `chat.actions.read`: "Read" button text
- `chat.actions.noTextToRead`: "No text to read" error
- `chat.actions.readFailed`: "Failed to read text" error

## 🔄 Future Enhancements

- [ ] Voice preview functionality
- [ ] Custom voice upload support
- [ ] Batch text processing
- [ ] Audio format conversion
- [ ] Offline voice support
- [ ] Voice cloning capabilities
- [ ] Real-time voice synthesis
- [ ] Multi-language simultaneous reading 