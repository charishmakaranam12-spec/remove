import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  X, 
  Minimize2, 
  Maximize2, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink,
  Settings,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface N8nChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  stagedDocumentText?: string;
  stagedCaseName?: string;
}

export const DEFAULT_N8N_WEBHOOK = 'https://charishma321.app.n8n.cloud/webhook/8196a360-cb57-43fc-ab0c-924bf73aa21b/chat';

export const N8nChatbot: React.FC<N8nChatbotProps> = ({
  isOpen,
  onClose,
  stagedDocumentText,
  stagedCaseName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-initial',
        sender: 'bot',
        text: 'Hello! I am your **AI Missing Information Detective** connected to your live **n8n Agentic Workflow**.\n\nI am ready to review any documents, forms, applications, or dataset records to uncover what is **missing**, **uncertain**, or **inconsistent**.\n\nYou can ask questions or click below to analyze your staged case!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(() => `n8n-session-${Date.now()}`);
  const [webhookUrl, setWebhookUrl] = useState<string>(DEFAULT_N8N_WEBHOOK);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      // First try via local server / Vercel proxy to avoid browser CORS blocks
      const response = await fetch('/api/n8n/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          sessionId: sessionId,
          webhookUrl: webhookUrl
        })
      });

      if (!response.ok) {
        // Fallback: direct browser fetch to webhook
        const directResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sendMessage',
            sessionId: sessionId,
            chatInput: messageContent
          })
        });

        if (!directResponse.ok) {
          throw new Error(`n8n webhook error: ${response.status} / ${directResponse.status}`);
        }

        const directData = await directResponse.json();
        const botReply = directData.output || directData.response || directData.text || JSON.stringify(directData);

        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }

      const data = await response.json();
      const botReply = data.output || 'No response text returned from n8n workflow.';

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error('Failed to communicate with n8n chatbot:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Could not reach your n8n workflow (${err.message || 'Network error'}). Please make sure your n8n workflow is activated and accessible at: ${webhookUrl}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendStagedCase = () => {
    if (!stagedDocumentText) return;
    const prompt = `Please run your Missing Information Detective pipeline on this application:\n\n${stagedDocumentText}`;
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    setSessionId(`n8n-session-${Date.now()}`);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: 'Session reset! I am ready for a new document or case.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden ${
        isExpanded 
          ? 'inset-4 sm:inset-10' 
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[640px] max-h-[85vh]'
      }`}
    >
      {/* Chatbot Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Bot className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                n8n AI Detective Chatbot
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
              charishma321.app.n8n.cloud
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Webhook Settings"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={handleClearChat}
            title="Reset Chat Session"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="hidden sm:inline-flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            title="Close Chat"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Optional Webhook Settings Drawer */}
      {showSettings && (
        <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>n8n Webhook Configuration</span>
            <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Endpoint URL:</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-1.5 text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <span>Session ID: <code className="text-slate-300">{sessionId}</code></span>
            <button
              onClick={() => {
                setWebhookUrl(DEFAULT_N8N_WEBHOOK);
                setShowSettings(false);
              }}
              className="text-indigo-400 hover:underline"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
            >
              {isBot && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isBot
                    ? msg.isError
                      ? 'bg-rose-950/60 border border-rose-800 text-rose-200'
                      : 'bg-slate-900 border border-slate-800/90 text-slate-200'
                    : 'bg-indigo-600 text-white rounded-br-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div 
                  className={`text-[9px] mt-1 font-mono ${
                    isBot ? 'text-slate-500' : 'text-indigo-200 text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 mt-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-mono text-[11px] text-slate-400">n8n Detective is reasoning...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Prompts */}
      <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {stagedDocumentText && (
          <button
            onClick={handleSendStagedCase}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Analyze {stagedCaseName || 'Current Case'}</span>
          </button>
        )}
        <button
          onClick={() => handleSendMessage("What missing information would you look for in a personal loan application?")}
          disabled={isLoading}
          className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 whitespace-nowrap transition-colors"
        >
          Loan Checklist Gaps
        </button>
        <button
          onClick={() => handleSendMessage("How do you differentiate between missing and uncertain information?")}
          disabled={isLoading}
          className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 whitespace-nowrap transition-colors"
        >
          Audit Principles
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask your n8n detective or paste application text..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-0.5">
          <span>Powered by n8n LangChain Chat Trigger</span>
          <span className="font-mono text-emerald-400">Online</span>
        </div>
      </div>
    </div>
  );
};
