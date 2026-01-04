import axios from 'axios'

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || process.env.REACT_APP_DEEPGRAM_API_KEY
const DEEPGRAM_BASE_URL = 'https://api.deepgram.com/v1/listen'

export async function transcribeAudio(audioBlob) {
    try {
        if (!DEEPGRAM_API_KEY) {
            throw new Error('Deepgram API key is not configured')
        }

        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.webm')

        const response = await axios.post(DEEPGRAM_BASE_URL, formData, {
            headers: {
                'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                'Content-Type': 'multipart/form-data',
            },
            params: {
                model: 'nova-2',
                punctuate: true,
                smart_format: true,
                language: 'en-US'
            }
        })

        return response.data.results.channels[0].alternatives[0].transcript
    } catch (error) {
        console.error('Transcription error:', error)
        if (error.response?.status === 401) {
            throw new Error('Invalid API key. Please check your Deepgram API key configuration.')
        }
        throw new Error('Failed to transcribe audio: ' + error.message)
    }
}

export async function createDeepgramStream() {
    return new Promise((resolve, reject) => {
        if (!DEEPGRAM_API_KEY) {
            reject(new Error('Deepgram API key is not configured'))
            return
        }

        const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
            'token',
            DEEPGRAM_API_KEY
        ])

        socket.onopen = () => {
            console.log('Deepgram WebSocket connected')
            resolve(socket)
        }

        socket.onerror = (error) => {
            console.error('WebSocket error:', error)
            reject(new Error('Failed to connect to Deepgram'))
        }
    })
}
