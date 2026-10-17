import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Globe
} from 'lucide-react';
import type { AskResponse } from '../types';
import { api } from '../services/api';

interface AssistantPanelProps {
  initialPrompt?: string;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ initialPrompt = '' }) => {
  const [question, setQuestion] = useState(initialPrompt);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskResponse | null>(null);

  const suggestedQuestions = [
    'What are the eligibility conditions for PM-KISAN cash transfer?',
    'How does Ayushman Bharat PM-JAY provide 5 lakh hospitalization?',
    'What documents are required to apply for Mudra loan for a small shop?',
    'Can college students get tuition fee grants under NSP Post-Matric scheme?',
    'Who is eligible for Ladli Behna Yojana in Madhya Pradesh?',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.askQuestion(q, language);
      setResponse(res);
      setQuestion(q);
    } catch (err: any) {
      setError(err.message || 'Failed to generate grounded answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Grounded RAG Assistant</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ask JanSahayak Scheme Navigator
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Ask questions in plain English or Hindi. Answers are strictly grounded in indexed government gazettes,
          operational guidelines, and official portals.
        </p>

        {/* Language selector */}
        <div className="mt-4 inline-flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg transition-smooth ${
              language === 'en' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 rounded-lg transition-smooth ${
              language === 'hi' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Suggested prompts */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleAsk(sq)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-smooth text-left"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-4 mb-8 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-500">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here (e.g. 'Can I get PM-KISAN if I rent land?' or 'Which schemes help pregnant women?')..."
          className="w-full text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-400">
            Press Enter to submit • Shift+Enter for newline
          </span>
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-smooth shadow-xs"
          >
            {loading ? (
              <span>Retrieving & Grounding...</span>
            ) : (
              <>
                <span>Ask Navigator</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm mb-6 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <strong>Inquiry Failed:</strong> {error}
            </div>
          </div>
          <button
            onClick={() => handleAsk()}
            className="px-3 py-1 bg-white border border-rose-300 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-100 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Response card */}
      {response && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Metadata pill bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-500">Model:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                {response.model_used}
              </span>
              {response.degraded_mode && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium border border-amber-300">
                  Degraded Mode (Offline Synthesis)
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {response.citations.length} Verified Source {response.citations.length === 1 ? 'Citation' : 'Citations'}
            </span>
          </div>

          {/* Warning notice if any */}
          {response.confidence_warning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              {response.confidence_warning}
            </div>
          )}

          {/* Grounded answer text */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-800 whitespace-pre-line">
            {response.answer}
          </div>

          {/* Validated Source Citations */}
          {response.citations && response.citations.length > 0 && (
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Supporting Official Source Citations</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {response.citations.map((cite, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-blue-700 font-mono">
                          {cite.citation_label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {cite.scheme_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {cite.source_title}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <a
                        href={cite.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 hover:text-amber-800 font-bold inline-flex items-center space-x-1"
                      >
                        <span>Open Official Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            {response.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
