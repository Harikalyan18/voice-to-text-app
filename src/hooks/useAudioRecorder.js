import { useState, useRef, useEffect, useCallback } from 'react'

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState(null)
    const [audioUrl, setAudioUrl] = useState('')
    const [stream, setStream] = useState(null)

    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const stopRecordingPromiseRef = useRef(null)

    const startRecording = async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            })

            const mediaRecorder = new MediaRecorder(userStream, {
                mimeType: 'audio/webm;codecs=opus'
            })

            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []
            stopRecordingPromiseRef.current = null
            setStream(userStream)

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.start()
            setIsRecording(true)

            return userStream
        } catch (error) {
            console.error('Error starting recording:', error)
            throw new Error('Could not access microphone. Please check permissions.')
        }
    }

    const stopRecording = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                // Store the promise reference
                stopRecordingPromiseRef.current = { resolve, reject }

                // Set up the onstop handler
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type: 'audio/webm;codecs=opus'
                    })
                    const audioUrl = URL.createObjectURL(audioBlob)
                    setAudioBlob(audioBlob)
                    setAudioUrl(audioUrl)

                    // Resolve the promise with the blob
                    if (stopRecordingPromiseRef.current) {
                        stopRecordingPromiseRef.current.resolve(audioBlob)
                        stopRecordingPromiseRef.current = null
                    }

                    if (stream) {
                        stream.getTracks().forEach(track => track.stop())
                        setStream(null)
                    }
                }

                mediaRecorderRef.current.stop()
                setIsRecording(false)
            } else {
                reject(new Error('No active recording to stop'))
            }
        })
    }, [stream])

    const cancelRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }

        setIsRecording(false)
        setAudioBlob(null)
        audioChunksRef.current = []
    }

    const clearRecording = () => {
        setAudioBlob(null)
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
            setAudioUrl('')
        }
    }

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [audioUrl, stream])

    return {
        isRecording,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording, // Now returns a Promise
        cancelRecording,
        clearRecording
    }
}