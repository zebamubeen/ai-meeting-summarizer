import React from 'react';
import { ActivePage, SampleTranscript } from '../types';
import { SAMPLE_TRANSCRIPTS } from '../data/sampleTranscripts';
import { 
  Mic, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Layers, 
  Zap, 
  Clock, 
  Users, 
  ListOrdered,
  BookOpen,
  ShieldCheck,
  Play
} from 'lucide-react';

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  onLoadSample: (sample: SampleTranscript) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActivePage,
  onLoadSample,
}) => {
  const cseSample = SAMPLE_TRANSCRIPTS[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-linear-to-b from-blue-50/70 via-white to-white rounded-3xl border border-blue-100/60 p-6 md:p-12 shadow-xs">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-sky-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI & NLP Powered Meeting Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Turn Meeting Audio & Transcripts into{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-blue-600 to-sky-500">
              Clear Summaries & Action Items
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload meeting audio or paste raw conversations. Our AI automatically transcribes speech, extracts core discussion points, identifies key decisions, and creates structured action items with assignees and deadlines.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActivePage('summarizer')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Start Summarizer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                onLoadSample(cseSample);
                setActivePage('summarizer');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-medium text-sm border border-blue-200 shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-blue-600" />
              <span>Load College Project Demo</span>
            </button>

            <button
              onClick={() => setActivePage('about')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>CSE Viva & Guide</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 border-t border-blue-100/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-900">Audio + Text</div>
              <div className="text-xs text-slate-500 mt-0.5">MP3, WAV & Transcripts</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600">Zero Guesswork</div>
              <div className="text-xs text-slate-500 mt-0.5">Strict Hallucination Control</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-900">Task Extraction</div>
              <div className="text-xs text-slate-500 mt-0.5">Assignee, Deadline & Status</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600">Instant Export</div>
              <div className="text-xs text-slate-500 mt-0.5">Text, Markdown & JSON</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Core System Features
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Built with modern Natural Language Processing (NLP) and Automatic Speech Recognition (ASR).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Audio to Text */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              1. Audio Speech-to-Text
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Upload recorded MP3 or WAV meeting files or record directly from your microphone. Converted via advanced speech recognition into clean, editable text with speaker turns.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-blue-600">
              Supports MP3, WAV, WebM & Live Mic
            </span>
          </div>

          {/* Card 2: Executive Summary & Key Decisions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              2. AI Summary & Key Points
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              The AI reads the complete conversation flow, isolates essential discussion topics, and extracts major decisions mutually agreed upon by the participants.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-blue-600">
              Concise Overview & Bullet Highlights
            </span>
          </div>

          {/* Card 3: Action Items */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              3. Structured Action Items
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Extracts clear tasks, identified assignees, and deadlines. Automatically defaults status to Pending and prevents hallucination of unmentioned persons or dates.
            </p>
            <span className="inline-flex items-center text-xs font-semibold text-blue-600">
              Interactive Table with Status Tracking
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50/90 rounded-2xl p-6 md:p-10 border border-slate-200/80">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Step-by-Step Architecture
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              How AI Meeting Summarizer Works
            </h2>
            <p className="text-sm text-slate-600">
              Follow this 4-step pipeline designed for transparent processing and student demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Input Audio or Text</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload audio file, record microphone, or paste an existing meeting transcript.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Speech-to-Text</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If audio is provided, speech recognition converts it into an editable transcript.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">NLP Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini AI processes the text using structured JSON schema and NLP extraction.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                4
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Results & Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                View summary, key points, manage action items, and download in TXT, MD, or JSON.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Project Demonstration Banner */}
      <section className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>5th Semester CSE Project Evaluation</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              Ready for College Project Demo & Viva Voce
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Complete with system architecture documentation, Python Flask backend reference (`app.py`), `requirements.txt`, and viva questions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                onLoadSample(cseSample);
                setActivePage('summarizer');
              }}
              className="px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-semibold text-sm transition-colors cursor-pointer text-center"
            >
              Demo College Project Sync
            </button>
            <button
              onClick={() => setActivePage('about')}
              className="px-5 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-medium text-sm border border-blue-500/40 transition-colors cursor-pointer text-center"
            >
              Open Viva Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
