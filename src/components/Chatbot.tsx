import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Minus,
  RotateCcw,
  Sparkles,
  Bot,
  ExternalLink,
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';
import { LogoMark } from './LogoMark';
import {
  ChatMessage,
  ChatAction,
  LeadContext,
  processUserMessage,
  getCurrentTimestamp
} from '../services/chatService';
import { QUICK_SUGGESTIONS, AGENCY_KNOWLEDGE } from '../data/chatbotKnowledge';

interface ChatbotProps {
  onOpenContact: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: `Hello! I am the **${AGENCY_KNOWLEDGE.agencyName}** AI Assistant.\n\nI can explain our custom web platforms, official Meta WhatsApp Cloud API automation, and autonomous AI systems. How can I help your business today?`,
  timestamp: getCurrentTimestamp(),
  actions: [
    { type: 'quick_reply', label: '⚡ What services do you build?', payload: 'What services do you build?' },
    { type: 'quick_reply', label: '💬 WhatsApp Automation', payload: 'How does WhatsApp Automation work?' },
    { type: 'quick_reply', label: '🤖 Autonomous AI Agents', payload: 'Tell me about Autonomous AI Agents' },
    { type: 'quick_reply', label: '📅 Start a Project Inquiry', payload: 'I want to start a project' }
  ]
};

export const Chatbot: React.FC<ChatbotProps> = ({ onOpenContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadContext, setLeadContext] = useState<LeadContext>({ step: 'idle' });
  const [hasNewMessagePing, setHasNewMessagePing] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      // Auto-focus input on desktop
      if (window.innerWidth > 640) {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }
  }, [isOpen, isMinimized, messages, isTyping]);

  // Handle ESC key to minimize or close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessagePing(false);
  };

  const handleReset = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: getCurrentTimestamp()
      }
    ]);
    setLeadContext({ step: 'idle' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    setInputValue('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: getCurrentTimestamp()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Small natural processing pause (400ms - 700ms) for comfortable UX
      await new Promise((r) => setTimeout(r, 450));

      const { reply, actions, updatedLead } = await processUserMessage(
        query,
        messages,
        leadContext
      );

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: getCurrentTimestamp(),
        actions
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLeadContext(updatedLead);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: `I apologize, but I encountered a momentary connection issue. You can reach our engineering team directly via WhatsApp or by scheduling a discovery session.`,
          timestamp: getCurrentTimestamp(),
          actions: [
            {
              type: 'open_whatsapp',
              label: '💬 Connect on WhatsApp',
              payload: `https://wa.me/${AGENCY_KNOWLEDGE.officialWhatsAppNumber}?text=${encodeURIComponent(
                'Hello GROWECH SOLUTION, I am contacting you from the website chatbot.'
              )}`
            },
            { type: 'open_contact', label: '📅 Request Technical Consultation' }
          ]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'open_contact') {
      onOpenContact();
    } else if (action.type === 'open_whatsapp') {
      const url = action.payload || `https://wa.me/${AGENCY_KNOWLEDGE.officialWhatsAppNumber}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'quick_reply') {
      handleSendMessage(action.payload || action.label);
    }
  };

  // Helper to render markdown-like formatted text securely
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Headings (###)
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold font-display text-ember mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }

      // Blockquotes (>)
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-ember/60 pl-2.5 py-0.5 my-1.5 text-[11px] text-zinc-300 italic bg-white/[0.02] rounded-r"
          >
            {renderInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        );
      }

      // Bullet points (• or -)
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const itemText = line.trim().replace(/^[•\-]\s*/, '');
        return (
          <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-zinc-300 my-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ember/80 mt-1.5 flex-shrink-0" />
            <span>{renderInlineMarkdown(itemText)}</span>
          </li>
        );
      }

      // Empty spacing lines
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-[11px] leading-relaxed text-zinc-200">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Inline bold parsing
  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Launcher Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative flex items-center"
            >
              {/* Teaser pill for initial invitation */}
              {hasNewMessagePing && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={handleOpenChat}
                  className="hidden md:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-obsidian-900/90 border border-ember/30 shadow-glow-sm cursor-pointer hover:border-ember transition-colors backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-zinc-200">
                    Ask GROWECH AI Concierge
                  </span>
                  <ChevronRight className="w-3 h-3 text-ember" />
                </motion.div>
              )}

              {/* Glowing Pulse Ring behind launcher */}
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-ember via-tangerine to-ember opacity-70 blur-md animate-pulse pointer-events-none" />

              {/* Main Button */}
              <button
                onClick={handleOpenChat}
                aria-label="Open GROWECH AI Assistant"
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-obsidian-950 border border-white/20 hover:border-ember text-white shadow-2xl flex items-center justify-center group overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {/* Internal gradient shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-ember/20 via-transparent to-white/10 opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* 3D Branded Mark / Bot Icon */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                  <LogoMark className="w-full h-full" glow={false} />
                </div>

                {/* Live Online Badge Indicator */}
                <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-obsidian-950 border-2 border-obsidian-950 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 'auto' : '100%'
            }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            role="dialog"
            aria-modal="true"
            aria-label="GROWECH AI Assistant Window"
            className={`fixed z-40 flex flex-col bg-obsidian-900/95 border border-white/15 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden transition-all duration-200 ${
              isMinimized
                ? 'bottom-5 right-5 sm:bottom-6 sm:right-6 w-80 sm:w-88'
                : 'inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 w-auto sm:w-[410px] h-[82vh] max-h-[640px]'
            }`}
          >
            {/* Top Ambient Ember Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-ember/25 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-obsidian-950/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-obsidian-900 border border-white/15 flex items-center justify-center p-1.5 shadow-inner">
                  <LogoMark className="w-full h-full" glow={false} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-obsidian-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold font-display tracking-wide text-white uppercase">
                      {AGENCY_KNOWLEDGE.agencyName}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-ember/20 text-ember border border-ember/30">
                      AI Concierge
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Sub-second Architecture</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Reset Chat */}
                <button
                  onClick={handleReset}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  aria-label="Close assistant"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Content (Hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Messages Viewport */}
                <div
                  data-lenis-prevent="true"
                  className="flex-1 p-4 overflow-y-auto space-y-4 overscroll-contain"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 text-xs ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-ember/90 to-tangerine/90 text-white rounded-tr-none shadow-md shadow-ember/20'
                            : 'bg-obsidian-950/80 border border-white/10 text-zinc-200 rounded-tl-none backdrop-blur-sm'
                        }`}
                      >
                        {msg.sender === 'assistant' ? (
                          renderFormattedText(msg.text)
                        ) : (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        )}
                      </div>

                      {/* Action Chips beneath Assistant message */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                          {msg.actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              onClick={() => handleActionClick(act)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all active:scale-95 ${
                                act.type === 'open_whatsapp'
                                  ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 shadow-sm'
                                  : act.type === 'open_contact'
                                  ? 'bg-gradient-to-r from-ember to-tangerine text-white shadow-glow-sm hover:brightness-110'
                                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 hover:border-white/20'
                              }`}
                            >
                              {act.type === 'open_contact' && <Calendar className="w-3 h-3" />}
                              {act.type === 'open_whatsapp' && <ExternalLink className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <div className="w-6 h-6 rounded-full bg-obsidian-950 border border-white/10 flex items-center justify-center p-1">
                        <LogoMark className="w-full h-full" glow={false} />
                      </div>
                      <div className="flex items-center gap-1.5 bg-obsidian-950/80 border border-white/10 px-3 py-2 rounded-2xl rounded-tl-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-ember animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips (Available when history is short) */}
                {messages.length <= 3 && !isTyping && (
                  <div
                    data-lenis-prevent="true"
                    className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar bg-obsidian-950/40"
                  >
                    {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion.replace(/^[^\w]+/, '').trim())}
                        className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors whitespace-nowrap"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Bar */}
                <div className="p-3 border-t border-white/10 bg-obsidian-950/90 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="relative flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about websites, WhatsApp, AI agents..."
                      className="w-full bg-obsidian-900 border border-white/15 focus:border-ember rounded-xl py-2.5 pl-3.5 pr-10 text-xs sm:text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      aria-label="Send message"
                      className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-ember to-tangerine hover:from-ember-600 hover:to-tangerine text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-2 px-1">
                    <span>Grounded in GROWECH architecture</span>
                    <span>Zero hardcoded keys</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
