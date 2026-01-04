
import React, { useState, useEffect, useRef } from 'react'
import { transcribeAudio, createDeepgramStream } from '../services/deepgram'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import './AudioRecorder.css'

function AudioRecorder({ onTranscription, onError }) {

    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY || process.env.REACT_APP_DEEPGRAM_API_KEY

    const [transcript, setTranscript] = useState('')
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamingText, setStreamingText] = useState('')
    const [useStreaming, setUseStreaming] = useState(true)

    const {
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        cancelRecording,
        clearRecording
    } = useAudioRecorder()

    const socketRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioStreamRef = useRef(null)

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const handleStartRecording = async () => {
        if (!apiKey) {
            onError('Deepgram API key is not configured. Please add VITE_DEEPGRAM_API_KEY to your environment variables.')
            return
        }

        try {
            onError('')
            setTranscript('')
            setStreamingText('')

            if (useStreaming) {
                await startStreamingTranscription()
            } else {
                await startRecording()
            }
        } catch (error) {
            onError(error.message)
        }
    }

    const startStreamingTranscription = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            })

            audioStreamRef.current = stream
            setIsStreaming(true)

            const socket = await createDeepgramStream(apiKey)
            socketRef.current = socket

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            })
            mediaRecorderRef.current = mediaRecorder

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.channel?.alternatives?.[0]?.transcript) {
                        const newText = data.channel.alternatives[0].transcript
                        if (data.is_final) {
                            setTranscript(prev => prev + ' ' + newText)
                            setStreamingText('')
                            if (onTranscription) {
                                onTranscription(newText)
                            }
                        } else {
                            setStreamingText(newText)
                        }
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err)
                }
            }

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                    socket.send(event.data)
                }
            }

            mediaRecorder.start(250)

        } catch (error) {
            throw error
        }
    }

    // const handleStopRecording = async () => {
    //     if (useStreaming) {
    //         stopStreamingTranscription()
    //     } else {
    //         stopRecording()
    //         await handleTranscribe()
    //     }
    // }

    const handleStopRecording = async () => {
        if (useStreaming) {
            stopStreamingTranscription()
        } else {
            try {
                // Wait for stopRecording to complete and get the blob
                const blob = await stopRecording()
                if (blob) {
                    await handleTranscribe(blob)
                }
            } catch (error) {
                onError('Failed to stop recording: ' + error.message)
            }
        }
    }

    const stopStreamingTranscription = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
        }
        if (socketRef.current) {
            socketRef.current.close()
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop())
            audioStreamRef.current = null
        }
        setIsStreaming(false)
    }

    // const handleTranscribe = async () => {
    //     if (!audioBlob) return

    //     setIsTranscribing(true)
    //     try {
    //         const text = await transcribeAudio(audioBlob, apiKey)
    //         setTranscript(text)
    //         if (onTranscription) {
    //             onTranscription(text)
    //         }
    //     } catch (error) {
    //         onError(error.message)
    //     } finally {
    //         setIsTranscribing(false)
    //     }
    // }

    const handleTranscribe = async (blob = null) => {
        const audioBlobToTranscribe = blob || audioBlob
        if (!audioBlobToTranscribe) return

        setIsTranscribing(true)
        try {
            const text = await transcribeAudio(audioBlobToTranscribe, apiKey)
            setTranscript(text)
            if (onTranscription) {
                onTranscription(text)
            }
        } catch (error) {
            onError(error.message)
        } finally {
            setIsTranscribing(false)
        }
    }

    const handleCopyText = () => {
        const textToCopy = transcript || streamingText
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('Text copied to clipboard!')
                })
                .catch(err => {
                    onError('Failed to copy text: ' + err.message)
                })
        }
    }

    const handleClearText = () => {
        setTranscript('')
        setStreamingText('')
        clearRecording()
    }

    return (
        <div className="audio-recorder">
            <div className="mode-toggle">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={useStreaming}
                        onChange={(e) => setUseStreaming(e.target.checked)}
                        disabled={isRecording || isStreaming}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">Real-time Streaming</span>
                </label>
                <span className="mode-hint">
                    {useStreaming ? 'See results as you speak' : 'See results after recording'}
                </span>
            </div>

            <div className="controls">
                <button
                    onClick={isRecording || isStreaming ? handleStopRecording : handleStartRecording}
                    disabled={isTranscribing || !apiKey}
                    className={`record-button ${isRecording || isStreaming ? 'recording' : ''}`}
                >
                    {isTranscribing ? 'Processing...' :
                        isRecording || isStreaming ? 'Stop Recording' : 'Start Recording'}
                    {(isRecording || isStreaming) && <div className="recording-indicator"></div>}
                </button>

                <div className="secondary-controls">
                    <button
                        onClick={handleCopyText}
                        disabled={(!transcript && !streamingText) || isRecording || isStreaming || isTranscribing}
                        className="action-button copy-button"
                    >
                        Copy Text
                    </button>
                    <button
                        onClick={handleClearText}
                        disabled={(!transcript && !streamingText) || isRecording || isStreaming || isTranscribing}
                        className="action-button clear-button"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="transcript-section">
                <div className="transcript-header">
                    <h3>Transcription</h3>
                    {(transcript || streamingText) && (
                        <span className="char-count">
                            {(transcript + ' ' + streamingText).trim().length} characters
                        </span>
                    )}
                </div>

                <div className="transcript-display">
                    {transcript || streamingText ? (
                        <>
                            <div className="final-text">{transcript}</div>
                            {streamingText && (
                                <div className="streaming-text">{streamingText}</div>
                            )}
                        </>
                    ) : (
                        <div className="placeholder">
                            {useStreaming
                                ? 'Start speaking to see real-time transcription...'
                                : 'Record audio to see transcription here...'}
                        </div>
                    )}
                </div>

                {isTranscribing && (
                    <div className="transcribing-indicator">
                        <div className="spinner"></div>
                        Transcribing...
                    </div>
                )}
            </div>

            <div className="recording-status">
                {(isRecording || isStreaming) && (
                    <div className="status-indicator">
                        <div className="pulse"></div>
                        <span className="status-text">
                            Recording... Speak into your microphone
                        </span>
                    </div>
                )}
            </div>

            <div className="instructions">
                <h4>How to use:</h4>
                <ol>
                    <li>Toggle real-time streaming for instant results</li>
                    <li>Click "Start Recording" and speak clearly</li>
                    <li>Click "Stop Recording" when finished</li>
                    <li>Copy or clear the transcription as needed</li>
                </ol>
            </div>
        </div>
    )
}

export default AudioRecorder