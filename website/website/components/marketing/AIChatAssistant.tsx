'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { generateYugaReply, formatGeminiErrorForLog, userFacingGeminiError } from '@/lib/yugaGemini';

const COURSE_SUGGESTIONS = [
  "Tell me about Snowflake course",
  "Placement record in 2024?",
  "Agentic AI curriculum",
  "SAP ABAP batch timings",
  "Highest salary package?",
  "Where is your Bangalore office?"
];

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: 'Hi, I am Vox from Softivox Tech. I can help you pick a program, compare batches, or reach admissions. Which technology are you exploring?'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (overrideText?: string) => {
    const userText = (overrideText || input).trim();
    if (!userText || loading) return;

    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userText}]);
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey?.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'AI chat is not configured for this build. Add NEXT_PUBLIC_GEMINI_API_KEY to website/website/.env.local (dev), or GEMINI_API_KEY / VITE_GEMINI_API_KEY in the repo root .env, then run next build or npm run build:hosting and redeploy.',
          },
        ]);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const botText = await generateYugaReply(ai, userText);
      setMessages((prev) => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error('[Yuga Gemini]', formatGeminiErrorForLog(error));
      setMessages((prev) => [...prev, { role: 'bot', text: userFacingGeminiError(error) }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowTooltip(false);
  };

  return (
    <>
      {/* Floating Message Above Icon */}
      {!isOpen && showTooltip && (
        <div className="fixed bottom-28 right-8 z-50 animate-float pointer-events-none sm:pointer-events-auto">
          <div className="relative group">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-3">
              <div className="rounded-xl bg-brand p-2">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-[0.2em] text-brand">AI Advisor</p>
                <p className="text-sm font-black text-slate-900 leading-tight">Get Free Career Counseling</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                className="ml-2 p-1 text-slate-300 hover:text-slate-500 transition-colors pointer-events-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/80 backdrop-blur-xl rotate-45 border-r border-b border-white/50" />
          </div>
        </div>
      )}

      {/* Floating Toggle */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-brand text-white shadow-lift transition-all hover:scale-110 active:scale-95 group"
      >
        <div className="absolute inset-0 translate-y-full bg-brand-600 transition-transform duration-300 group-hover:translate-y-0" />
        <div className="relative z-10">
          {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        </div>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/50 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-brand" />
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[95vw] md:w-[450px] h-[650px] max-h-[80vh] bg-white rounded-[2.5rem] shadow-[0_30px_120px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/25">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div>
                <h4 className="font-black leading-none text-slate-900">Vox · Softivox Tech</h4>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Counseling Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-800">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[88%] p-4 rounded-3xl flex gap-3 shadow-sm ${
                  m.role === 'user' 
                  ? 'rounded-tr-none bg-brand text-white' 
                  : 'rounded-tl-none border border-slate-100 bg-white text-slate-700'
                }`}>
                  {m.role === 'bot' && <Bot className="mt-0.5 h-5 w-5 shrink-0 text-brand" />}
                  <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Expert Thinking</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions Layer */}
          <div className="px-6 py-3 bg-white border-t border-slate-50 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex gap-2">
              {COURSE_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:border-brand/25 hover:bg-brand-50 hover:text-brand-800"
                >
                  <Sparkles className="w-3 h-3" />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t bg-white">
            <div className="relative flex items-center gap-3">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Snowflake, AI, SAP..."
                className="w-full rounded-2xl border-none bg-slate-100 px-6 py-4 text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/25"
              />
              <button 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-xl shadow-brand/20 transition-all hover:bg-brand-600 disabled:opacity-50"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="mt-4 text-[10px] text-center text-slate-400 font-medium">
              Softivox Tech career desk · Bengaluru
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
