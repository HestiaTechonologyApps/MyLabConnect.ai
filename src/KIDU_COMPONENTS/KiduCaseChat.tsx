import React, { useState, useRef, useEffect } from 'react';
import '../Styles/KiduStyles/CaseChat.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type MessageSide = 'lab' | 'doc';

export interface ChatMessage {
  id: string;
  side: MessageSide;
  sender: string;
  text: string;
  time: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  meta: string;
  url?: string;
}

export interface CommunicationPanelProps {
  /** Initial chat messages */
  initialMessages?: ChatMessage[];
  /** File attachments shown in Files tab */
  files?: FileAttachment[];
  /** Called when a new message is sent */
  onSend?: (message: string) => void;
  className?: string;
  /** Override header title (default: "Communication") */
  chatLabel?: string;
  /**
   * When true renders Internal / External tabs (doctor view).
   * When false renders Chat / Files tabs (default).
   */
  isDoctorView?: boolean;
  /** Whether the input is enabled (default: true) */
  canSend?: boolean;
  /** Whether download buttons are shown (default: true) */
  canDownload?: boolean;
}

// ─────────────────────────────────────────────
// Default data
// ─────────────────────────────────────────────

const DEFAULT_MESSAGES: ChatMessage[] = [];
const DEFAULT_FILES: FileAttachment[] = [];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const SendIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const ClipIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const FileBoxIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const KiduCaseChat: React.FC<CommunicationPanelProps> = ({
  initialMessages = DEFAULT_MESSAGES,
  files = DEFAULT_FILES,
  onSend,
  className = '',
  chatLabel = 'Communication',
  isDoctorView = false,
  canSend = true,
  canDownload = true,
}) => {
  type TabKey = 'chat' | 'files' | 'internal' | 'external';
  const [activeTab, setActiveTab] = useState<TabKey>(isDoctorView ? 'external' : 'chat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), side: 'doc', sender: 'You', text, time }]);
    setInputValue('');
    onSend?.(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const showChat = isDoctorView
    ? (activeTab === 'internal' || activeTab === 'external')
    : activeTab === 'chat';
  const showFiles = activeTab === 'files';

  const displayMessages = isDoctorView
    ? (activeTab === 'internal' ? [] : messages)
    : messages;

  return (
    <div className={`comm-panel ${className}`} role="region" aria-label="Communication panel">

      {/* Header */}
      <div className="comm-header">
        <span className="comm-title">{chatLabel}</span>
        <div className="online-dot" title="Online" aria-label="Online" />
      </div>

      {/* Tabs */}
      <div className="comm-tabs" role="tablist">
        {isDoctorView ? (
          <>
            <button
              className={`comm-tab${activeTab === 'internal' ? ' active' : ''}`}
              role="tab" aria-selected={activeTab === 'internal'}
              onClick={() => { setActiveTab('internal'); setTimeout(() => inputRef.current?.focus(), 50); }}
            >Internal</button>
            <button
              className={`comm-tab${activeTab === 'external' ? ' active' : ''}`}
              role="tab" aria-selected={activeTab === 'external'}
              onClick={() => { setActiveTab('external'); setTimeout(() => inputRef.current?.focus(), 50); }}
            >External</button>
          </>
        ) : (
          <>
            <button
              className={`comm-tab${activeTab === 'chat' ? ' active' : ''}`}
              role="tab" aria-selected={activeTab === 'chat'}
              onClick={() => { setActiveTab('chat'); setTimeout(() => inputRef.current?.focus(), 50); }}
            >Chat</button>
            <button
              className={`comm-tab${activeTab === 'files' ? ' active' : ''}`}
              role="tab" aria-selected={activeTab === 'files'}
              onClick={() => setActiveTab('files')}
            >Files</button>
          </>
        )}
      </div>

      {/* Chat messages */}
      {showChat && (
        <div className="chat-area" role="log" aria-live="polite" aria-label="Chat messages">
          {displayMessages.length === 0 ? (
            <div className="chat-empty">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <p>No conversation yet</p>
              <span>Start the conversation by sending a message</span>
            </div>
          ) : (
            <>
              <div className="date-divider"><span>Today</span></div>
              {displayMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`chat-msg ${msg.side}`}
                  role="article"
                  aria-label={`${msg.sender}: ${msg.text}`}
                >
                  <span className="msg-sender">{msg.sender}</span>
                  <div className="msg-bubble">{msg.text}</div>
                  <span className="msg-time">{msg.time}</span>
                </div>
              ))}
            </>
          )}
          <div ref={chatEndRef} aria-hidden="true" />
        </div>
      )}

      {/* Files panel */}
      {showFiles && (
        <div className="files-panel" role="list" aria-label="Attached files">
          {files.length === 0 ? (
            <p className="chat-empty-note">No files attached.</p>
          ) : (
            files.map(file => (
              <div key={file.id} className="file-item" role="listitem">
                <div className="file-icon"><FileBoxIcon /></div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">{file.meta}</div>
                </div>
                {canDownload && (
                  <a
                    href={(file as any).url || '#'}
                    download={file.name}
                    className="file-dl"
                    title="Download"
                    aria-label={`Download ${file.name}`}
                  >
                    <DownloadIcon />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Input or view-only */}
      {canSend ? (
        <div className="chat-input-wrap">
          <input
            ref={inputRef}
            className="chat-input"
            type="text"
            placeholder="Type a message…"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Type a message"
          />
          <button className="attach-btn" type="button" aria-label="Attach file">
            <ClipIcon />
          </button>
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            type="button"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      ) : (
        <div className="chat-view-only">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          <span>View only</span>
        </div>
      )}
    </div>
  );
};

export default KiduCaseChat;