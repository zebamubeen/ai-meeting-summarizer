import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Sparkles,
  Server,
  FileCode2,
  Workflow
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const vivaQuestions = [
    {
      q: 'Q1. What is the core problem that AI Meeting Summarizer solves?',
      a: 'In academic, software, and corporate meetings, participants spend up to 20-30% of their time manually writing minutes of meeting (MoM) and often misplace commitments or deadlines. AI Meeting Summarizer automates this entire pipeline by using Automatic Speech Recognition (ASR) to convert audio into text and Natural Language Processing (NLP) to extract an executive summary, key decisions, and a structured action items table with assignees and deadlines.',
    },
    {
      q: 'Q2. What is the difference between Extractive and Abstractive Summarization?',
      a: 'Extractive summarization picks verbatim sentences directly from the source text and stitches them together, often resulting in disjointed summaries. In contrast, Abstractive summarization (which our system uses via Gemini LLM) interprets the semantic meaning of the transcript and synthesizes fluent, original sentences that accurately summarize the discussion just like a human executive secretary.',
    },
    {
      q: 'Q3. How does the system extract Action Items without hallucinating names or dates?',
      a: 'We use strict prompt constraints and structured JSON schema enforcement. The model is explicitly instructed: "Extract concrete action items. If an assignee is not explicitly mentioned, assign Unassigned. If a deadline is not explicitly mentioned, assign Not specified. Do NOT invent names, tasks, or dates." This prevents hallucination and guarantees factual consistency with the transcript.',
    },
    {
      q: 'Q4. What is Automatic Speech Recognition (ASR) and which model is used for audio?',
      a: 'ASR is the process of converting spoken acoustic waveforms into textual representations. Our system utilizes Gemini 3.5 Transcribe (multimodal audio transcription), which handles frequency spectrogram analysis, recognizes speaker pauses and turns, and returns an accurate English transcript from MP3, WAV, and WebM audio files.',
    },
    {
      q: 'Q5. Why do we set the initial status of action items to "Pending"?',
      a: 'In standard task lifecycle management (such as Jira, Trello, or Agile Kanban boards), newly identified tasks are unfulfilled commitments. Setting the initial status to "Pending" enables team members to interactively transition the task to "In Progress" and "Completed" as work progresses.',
    },
    {
      q: 'Q6. Why are API keys stored in backend environment variables instead of frontend code?',
      a: 'Storing API keys in frontend client bundles exposes them to the public browser inspection tools (DevTools Network / Sources tab), allowing unauthorized users to steal credentials. By hosting the AI calls behind server-side endpoints (/api/transcribe and /api/summarize), the API key remains secure on the server and is never transmitted to the browser.',
    },
    {
      q: 'Q7. How does the application support both Node.js Express and Python Flask?',
      a: 'The application runs live with an Express + Vite full-stack server. In addition, for college evaluations that specifically mandate Python, the repository includes a complete `python_flask_backend/app.py` and `requirements.txt` implementing the identical REST endpoints using the official Google GenAI Python SDK.',
    },
    {
      q: 'Q8. What is Structured Output and why is responseSchema crucial for this project?',
      a: 'Rather than receiving unconstrained raw markdown or conversational text, responseSchema instructs the LLM to output valid JSON strictly conforming to our defined schema (meetingTitle, shortSummary, keyDiscussionPoints, keyDecisions, actionItems). This eliminates JSON parsing crashes and ensures reliable UI rendering.',
    },
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>CSE 5th Semester Major Project Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          About AI Meeting Summarizer
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Comprehensive project report, architectural pipeline, technology breakdown, and viva voce guide for university evaluations.
        </p>
      </div>

      {/* Project Overview Card */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>1. Project Abstract & Objectives</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          The <strong>AI Meeting Summarizer</strong> is an end-to-end intelligent web application designed to bridge the gap between verbal discussions and actionable task management. In modern academic and software engineering environments, meetings often yield lengthy transcripts where key decisions and individual action items are buried in casual dialogue.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          This system provides dual-entry input: users can either upload audio recordings (MP3 or WAV) to be transcribed via AI speech-to-text, or paste pre-existing transcripts. A high-parameter Large Language Model (LLM) performs NLP abstractive summarization and Named Entity Extraction to isolate discussion topics, formal decisions, and a categorized action item registry with assignees, deadlines, and task statuses.
        </p>
      </section>

      {/* 3-Tier System Architecture */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Workflow className="w-5 h-5 text-blue-600" />
          <span>2. System Architecture & Data Flow</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Layer 1 */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="font-bold text-blue-900 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Presentation Layer (Client)</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>React 19 SPA with TypeScript</li>
              <li>Tailwind CSS styling (blue-white theme)</li>
              <li>Lucide Icons & interactive components</li>
              <li>Audio player & microphone recorder</li>
              <li>Local export to TXT, MD & JSON</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Application Layer (Backend)</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Node.js + Express (`server.ts`)</li>
              <li>Alternative: Python Flask (`app.py`)</li>
              <li>REST endpoints: <code>/api/transcribe</code> & <code>/api/summarize</code></li>
              <li>50MB base64 payload handling</li>
              <li>Secure environment variable management</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2">
            <div className="font-bold text-sky-900 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>AI & NLP Foundation Layer</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li><strong>Gemini 3.5 Transcribe</strong>: Multimodal speech-to-text</li>
              <li><strong>Gemini 3.8 Flash</strong>: Fast NLP reasoning & task parsing</li>
              <li>Structured JSON output enforcement</li>
              <li>Zero-shot system instruction tuning</li>
              <li>Strict anti-hallucination constraints</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technologies Used Table */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <span>3. Technologies & Tools Used</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Technology</th>
                <th className="px-4 py-3">Role in System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-2.5 font-medium">Frontend Framework</td>
                <td className="px-4 py-2.5">React 19 + TypeScript</td>
                <td className="px-4 py-2.5">Component hierarchy, reactive state, type safety</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Styling</td>
                <td className="px-4 py-2.5">Tailwind CSS v4</td>
                <td className="px-4 py-2.5">Blue/white responsive card theme and typography</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Backend Server</td>
                <td className="px-4 py-2.5">Express.js (Node.js) & Python Flask</td>
                <td className="px-4 py-2.5">Serves REST API, handles audio buffers, protects secrets</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Speech-to-Text</td>
                <td className="px-4 py-2.5">Gemini 3.5 Transcribe</td>
                <td className="px-4 py-2.5">Audio transcription from MP3/WAV/WebM to text</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">NLP & Extraction</td>
                <td className="px-4 py-2.5">Gemini 3.8 Flash</td>
                <td className="px-4 py-2.5">Abstractive summarization and action items extraction</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Icons</td>
                <td className="px-4 py-2.5">Lucide React</td>
                <td className="px-4 py-2.5">Modern, clean vector iconography</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* College Project Viva Voce Guide */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>4. Viva Voce Defense Guide (Top Questions Asked by Examiners)</span>
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
            CSE 5th Sem Prep
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Click any question below to reveal textbook-grade answers to help you ace your internal and external project evaluations.
        </p>

        <div className="space-y-3 pt-2">
          {vivaQuestions.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-900 pr-4">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Local Setup Instructions Box */}
      <section className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl shadow-md space-y-4">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-white">
          <Terminal className="w-5 h-5 text-sky-400" />
          <span>5. How to Run Locally for Demonstration</span>
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div>
            <p className="font-semibold text-white mb-1">Option A: Running Full-Stack Node.js (Live App)</p>
            <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-300">
              # 1. Install dependencies<br />
              npm install<br />
              # 2. Add your GEMINI_API_KEY to .env file<br />
              # 3. Start development server<br />
              npm run dev
            </div>
          </div>

          <div>
            <p className="font-semibold text-white mb-1">Option B: Running Python Flask Backend (Available in repo)</p>
            <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-emerald-300">
              # 1. Install Python requirements<br />
              pip install -r requirements.txt<br />
              # 2. Run Flask backend<br />
              python python_flask_backend/app.py
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
