import { useState } from 'react'
import './App.css'

const WEBHOOK_URL =
  'https://outdoorpeople.app.n8n.cloud/webhook/88f986a7-a28d-4899-9258-5112825969be'

// ─── Search Screen ───────────────────────────────────────────────────────────

function SearchScreen({ onResults }) {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = keyword.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: trimmed }),
      })

      const rawText = await res.text()

      console.log('--- Webhook Debug ---')
      console.log('Status:', res.status)
      console.log('Content-Type:', res.headers.get('content-type'))
      console.log('Raw body:', rawText)
      console.log('Body length:', rawText.length)

      onResults({
        keyword: trimmed,
        data: rawText,
        status: res.status,
        ok: res.ok,
        contentType: res.headers.get('content-type') || 'none',
      })
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen search-screen">
      <div className="search-bg" aria-hidden="true">
        <div className="bg-circle c1" />
        <div className="bg-circle c2" />
        <div className="bg-grain" />
      </div>

      <div className="search-content">
        <div className="wordmark">
          <span className="wm-icon">◈</span>
          <span className="wm-text">Outdoor Search</span>
        </div>

        <h1 className="search-headline">
          Find what you're<br />
          <em>looking for.</em>
        </h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <input
              type="text"
              className="search-input"
              placeholder="Enter a keyword…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className={`search-btn ${loading ? 'loading' : ''}`}
              disabled={loading || !keyword.trim()}
            >
              {loading ? <span className="spinner" /> : 'Search'}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠</span> {error}
            </div>
          )}
        </form>

        <p className="search-hint">
          Results are fetched live via your n8n webhook.
        </p>
      </div>
    </div>
  )
}

// ─── Results Screen ──────────────────────────────────────────────────────────

function ResultsScreen({ result, onBack }) {
  const { keyword, data, status, ok, contentType } = result

  return (
    <div className="screen results-screen">
      <div className="results-sidebar">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="wordmark">
          <span className="wm-icon">◈</span>
          <span className="wm-text">Outdoor Search</span>
        </div>
        <div className="query-label">
          <span className="ql-eyebrow">Search query</span>
          <span className="ql-keyword">"{keyword}"</span>
        </div>
      </div>

      <div className="results-main">
        <div className="results-header">
          <h2 className="results-title">Results</h2>
          <span className="results-badge">Webhook response</span>
        </div>

        <div className="debug-panel">
          <span className="debug-row"><strong>Status:</strong> {status} {ok ? '✅' : '❌'}</span>
          <span className="debug-row"><strong>Content-Type:</strong> {contentType}</span>
          <span className="debug-row"><strong>Body length:</strong> {data.length} chars</span>
        </div>

        <div className="results-body">
          {data.length === 0 ? (
            <div className="empty-state">
              ⚠ The webhook returned an empty response. Check that your n8n workflow is published and the Respond to Webhook node has content configured.
            </div>
          ) : (
            <div className="raw-text">{data}</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── App Root ────────────────────────────────────────────────────────────────

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="app">
      {result ? (
        <ResultsScreen result={result} onBack={() => setResult(null)} />
      ) : (
        <SearchScreen onResults={setResult} />
      )}
    </div>
  )
}
