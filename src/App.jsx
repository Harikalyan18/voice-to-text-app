
import React, { useState } from 'react'
import AudioRecorder from './components/AudioRecorder'
import './App.css'

function App() {
  const [transcriptions, setTranscriptions] = useState([])
  const [error, setError] = useState('')

  const handleTranscription = (text) => {
    if (text.trim()) {
      const newTranscription = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      }
      setTranscriptions(prev => [newTranscription, ...prev])
    }
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setTimeout(() => {
      setError('')
    }, 5000)
  }

  const handleCopyAll = () => {
    const allText = transcriptions.map(t => t.text).join('\n\n')
    if (allText) {
      navigator.clipboard.writeText(allText)
        .then(() => {
          alert('All transcriptions copied to clipboard!')
        })
        .catch(err => {
          setError('Failed to copy: ' + err.message)
        })
    }
  }

  const handleExport = () => {
    if (transcriptions.length === 0) return

    const exportData = transcriptions.map(t =>
      `[${t.date} ${t.timestamp}]\n${t.text}\n${'-'.repeat(50)}`
    ).join('\n\n')

    const blob = new Blob([exportData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcriptions.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all transcriptions?')) {
      setTranscriptions([])
    }
  }

  const handleDelete = (id) => {
    setTranscriptions(prev => prev.filter(item => item.id !== id))
  }

  const handleCopyItem = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Text copied to clipboard!')
      })
      .catch(err => {
        setError('Failed to copy: ' + err.message)
      })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎤 Voice to Text Transcriber</h1>
          <p className="subtitle">AI-powered speech recognition with Deepgram</p>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button
              onClick={() => setError('')}
              className="error-close"
            >
              ✕
            </button>
          </div>
        )}

        <div className="app-content">
          <div className="recorder-container">
            <AudioRecorder
              onTranscription={handleTranscription}
              onError={handleError}
            />
          </div>

          <div className="history-container">
            <div className="history-header">
              <h2>Transcription History</h2>
              {transcriptions.length > 0 && (
                <div className="history-actions">
                  <button
                    onClick={handleCopyAll}
                    className="history-button copy-all"
                  >
                    Copy All
                  </button>
                  <button
                    onClick={handleExport}
                    className="history-button export"
                  >
                    Export
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="history-button clear-all"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {transcriptions.length === 0 ? (
              <div className="empty-history">
                <div className="empty-icon">📝</div>
                <h3>No transcriptions yet</h3>
                <p>Your transcriptions will appear here</p>
              </div>
            ) : (
              <div className="transcriptions-list">
                {transcriptions.map((item) => (
                  <div key={item.id} className="transcription-card">
                    <div className="card-header">
                      <span className="card-time">
                        {item.timestamp}
                      </span>
                      <div className="card-actions">
                        <button
                          onClick={() => handleCopyItem(item.text)}
                          className="card-button copy"
                          title="Copy"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="card-button delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="card-text">{item.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Voice to Text Transcriber</strong> •
            Built with <strong>Tauri</strong> + <strong>Deepgram AI</strong>
          </p>
          <p className="footer-links">
            <a
              href="https://deepgram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Deepgram API Key
            </a>
            <span> • </span>
            <a
              href="https://tauri.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tauri Documentation
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App