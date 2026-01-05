import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { PoweredBy } from './PoweredBy';
import type { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  currentQuestion: number;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onGenerateReport: () => void;
}

const MULTIPLE_CHOICE_QUESTIONS = {
  10: {
    prompt: 'Which best describes your AI readiness level?',
    options: [
      { key: 'A', label: 'Beginner', desc: 'Just starting to learn about AI' },
      { key: 'B', label: 'Intermediate', desc: 'Some basic understanding' },
      { key: 'C', label: 'Advanced', desc: 'Dedicated team, some AI implementations' },
      { key: 'D', label: 'Expert', desc: 'AI is core to our strategy' },
    ],
  },
  11: {
    prompt: 'What is your primary goal with AI?',
    options: [
      { key: 'A', label: 'Experimentation', desc: 'Learn and run small pilots' },
      { key: 'B', label: 'Tool Adoption', desc: 'Solve specific problems' },
      { key: 'C', label: 'Strategic Transformation', desc: 'Long-term competitive advantage' },
    ],
  },
};

export function ChatInterface({ 
  messages, 
  currentQuestion, 
  isLoading, 
  onSendMessage,
  onGenerateReport 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!isLoading) {
      onSendMessage(option);
    }
  };

  // Detect if we should show multiple choice
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const showMultipleChoice = lastAssistantMessage && (
    (lastAssistantMessage.content.includes('self-assessed AI readiness level') && currentQuestion === 9) ||
    (lastAssistantMessage.content.includes('primary goal of your interest') && currentQuestion === 10)
  );

  const questionConfig = currentQuestion === 9 ? MULTIPLE_CHOICE_QUESTIONS[10] : 
                         currentQuestion === 10 ? MULTIPLE_CHOICE_QUESTIONS[11] : null;

  // Check if assessment is complete
  const isComplete = messages.some(m => 
    m.role === 'assistant' && m.content.includes('I now have all the information')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-minerva-black via-minerva-charcoal to-minerva-black flex flex-col">
      {/* Header */}
      <header className="bg-minerva-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-minerva-red to-minerva-red-dark rounded-xl flex items-center justify-center shadow-lg shadow-minerva-red/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold">AI Business Consultant</h1>
              <p className="text-gray-500 text-sm">Minerva Consultores</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium">Question {Math.min(currentQuestion + 1, 14)} of 14</p>
              <p className="text-gray-500 text-xs">
                {currentQuestion < 3 ? 'Business Context' :
                 currentQuestion < 6 ? 'Data & Technology' :
                 currentQuestion < 10 ? 'Organizational Capability' :
                 'Strategy & Priorities'}
              </p>
            </div>
            <div className="w-14 h-14 relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#C41E3A"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(currentQuestion / 14) * 151} 151`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                {Math.round((currentQuestion / 14) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.filter(m => m.role !== 'user' || m.content !== "Hello, I'm ready to start the AI readiness assessment.").map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-minerva-red to-minerva-red-dark rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-minerva-gray/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Multiple Choice Options */}
      {showMultipleChoice && questionConfig && !isLoading && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questionConfig.options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleOptionSelect(`${option.key}) ${option.label}`)}
                  className="text-left p-4 bg-minerva-gray/30 hover:bg-minerva-red/10 border border-gray-800 hover:border-minerva-red/50 rounded-xl transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-minerva-red/20 text-minerva-red rounded-lg flex items-center justify-center font-bold text-sm group-hover:bg-minerva-red group-hover:text-white transition-colors">
                      {option.key}
                    </span>
                    <div>
                      <p className="text-white font-medium">{option.label}</p>
                      <p className="text-gray-500 text-sm">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Button */}
      {isComplete && !isLoading && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={onGenerateReport}
              className="w-full flex items-center justify-center gap-2 btn-minerva py-4 rounded-xl"
            >
              Generate My AI Readiness Report
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      {!showMultipleChoice && !isComplete && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                disabled={isLoading}
                className="flex-1 bg-minerva-gray/50 border border-gray-800 focus:border-minerva-red/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-minerva disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </form>
            <div className="mt-3 text-center">
              <PoweredBy />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-minerva-gray' 
          : 'bg-gradient-to-br from-minerva-red to-minerva-red-dark'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-gray-400" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className={`max-w-[80%] ${
        isUser 
          ? 'bg-minerva-red text-white rounded-2xl rounded-br-md' 
          : 'bg-minerva-gray/50 text-gray-100 rounded-2xl rounded-bl-md'
      } px-4 py-3`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
