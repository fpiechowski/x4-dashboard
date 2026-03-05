import React, { useState, useEffect } from 'react'
import { KeyBindings, KeyBinding } from '../types/gameData'

interface Props {
  onClose: () => void
  onTestKey: (action: string) => void
}

const NOTE = `Key format (Windows SendKeys):
  {F1}–{F12}  Function keys      ^a  Ctrl+A
  {ESC}       Escape             +a  Shift+A
  {ENTER}     Enter              %a  Alt+A
  {SPACE}     Spacebar           {UP} {DOWN} {LEFT} {RIGHT}
  a–z, 0–9    Regular keys`

export function KeyBindingsModal({ onClose, onTestKey }: Props) {
  const [bindings, setBindings] = useState<Record<string, KeyBinding>>({})
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tested, setTested] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/keybindings')
      .then(r => r.json())
      .then((data: KeyBindings) => {
        setBindings(data.bindings || {})
        // Initialize draft with current keys
        const d: Record<string, string> = {}
        for (const [action, b] of Object.entries(data.bindings || {})) {
          d[action] = b.key
        }
        setDraft(d)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load key bindings from server.')
        setLoading(false)
      })
  }, [])

  function handleSave() {
    setSaving(true)
    setError('')

    // Build updated bindings object
    const updated: Record<string, Partial<KeyBinding>> = {}
    for (const action of Object.keys(bindings)) {
      updated[action] = { key: draft[action] || bindings[action]?.key || '' }
    }

    fetch('/api/keybindings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bindings: updated }),
    })
      .then(r => r.json())
      .then(() => {
        setSaving(false)
        onClose()
      })
      .catch((e) => {
        setError(`Save failed: ${e.message}`)
        setSaving(false)
      })
  }

  function handleTest(action: string) {
    setTested(action)
    onTestKey(action)
    setTimeout(() => setTested(null), 800)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">⚙ Key Bindings</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <pre className="modal-note">{NOTE}</pre>

          {error && (
            <div style={{ color: 'var(--c-red)', fontSize: '11px', marginBottom: '12px',
                          padding: '6px 8px', border: '1px solid rgba(255,23,68,0.3)' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="offline-hint">Loading…</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '10px 1fr 140px 60px',
                            fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                            color: 'var(--c-text-dim)', marginBottom: '6px', gap: '8px',
                            paddingBottom: '6px', borderBottom: '1px solid var(--c-border-dim)' }}>
                <span />
                <span>Action</span>
                <span>Key Combo</span>
                <span>Test</span>
              </div>

              {Object.entries(bindings).map(([action, binding]) => (
                <div key={action} className="binding-row">
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: draft[action] ? 'var(--c-green)' : 'var(--c-text-dim)',
                    alignSelf: 'center',
                    boxShadow: draft[action] ? 'var(--glow-green)' : 'none',
                  }} />
                  <div>
                    <div className="binding-label">{binding.label}</div>
                    <div className="binding-desc">{binding.description}</div>
                  </div>
                  <input
                    className="binding-input"
                    value={draft[action] ?? binding.key}
                    onChange={e => setDraft(d => ({ ...d, [action]: e.target.value }))}
                    placeholder="e.g. {F1}"
                    spellCheck={false}
                  />
                  <button
                    className="binding-test-btn"
                    onClick={() => handleTest(action)}
                    style={tested === action ? {
                      borderColor: 'var(--c-green)',
                      color: 'var(--c-green)',
                    } : undefined}
                  >
                    {tested === action ? '✓' : 'Test'}
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-save" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving…' : '✓ Save Bindings'}
          </button>
        </div>
      </div>
    </div>
  )
}
