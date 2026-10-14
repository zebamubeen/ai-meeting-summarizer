/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivePage, MeetingSummaryResult, ActionItem, SampleTranscript } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SummarizerView } from './components/SummarizerView';
import { ResultsView } from './components/ResultsView';
import { AboutView } from './components/AboutView';
import { SAMPLE_TRANSCRIPTS } from './data/sampleTranscripts';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [transcript, setTranscript] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [results, setResults] = useState<MeetingSummaryResult | null>(null);

  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [isLoadingTranscription, setIsLoadingTranscription] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Feature 1: Speech-to-Text Transcription API Handler
  const handleTranscribeAudio = async (audioBase64: string, mimeType: string) => {
    try {
      setIsLoadingTranscription(true);
      setErrorMessage(null);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64,
          mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Audio transcription failed. Please check audio format.');
      }

      setTranscript(data.transcript);
      showToast('Audio transcribed successfully! You can now review the text.');
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMessage(err.message || 'Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoadingTranscription(false);
    }
  };

  // Feature 3 & 4: Meeting Summarization & Action Item Extraction API Handler
  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      setErrorMessage('Please upload audio or paste a meeting transcript first.');
      return;
    }

    try {
      setIsLoadingSummary(true);
      setErrorMessage(null);

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          meetingTitle: meetingTitle.trim() || 'General Meeting',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate meeting summary.');
      }

      const generatedResult: MeetingSummaryResult = {
        ...data.data,
        generatedAt: new Date().toLocaleString(),
        originalTranscriptLength: transcript.length,
      };

      setResults(generatedResult);
      setActivePage('results');
      showToast('Meeting summary and action items generated successfully!');
    } catch (err: any) {
      console.error('Summarization error:', err);
      setErrorMessage(err.message || 'Failed to generate summary. Please check your transcript.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Update Action Item Status (Pending / In Progress / Completed)
  const handleUpdateActionStatus = (id: string, newStatus: ActionItem['status']) => {
    if (!results) return;

    setResults({
      ...results,
      actionItems: results.actionItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      ),
    });
  };

  // Load a pre-defined sample transcript
  const handleLoadSample = (sample: SampleTranscript) => {
    setTranscript(sample.transcript);
    setMeetingTitle(sample.title);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        hasResults={results !== null}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePage === 'home' && (
          <HomeView
            setActivePage={setActivePage}
            onLoadSample={handleLoadSample}
          />
        )}

        {activePage === 'summarizer' && (
          <SummarizerView
            transcript={transcript}
            setTranscript={setTranscript}
            meetingTitle={meetingTitle}
            setMeetingTitle={setMeetingTitle}
            onGenerateSummary={handleGenerateSummary}
            isLoadingSummary={isLoadingSummary}
            isLoadingTranscription={isLoadingTranscription}
            onTranscribeAudio={handleTranscribeAudio}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {activePage === 'results' && (
          <ResultsView
            results={results}
            onUpdateActionStatus={handleUpdateActionStatus}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">AI Meeting Summarizer</span>
            <span>•</span>
            <span>CSE 5th Semester Major Project</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActivePage('home')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('summarizer')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Summarizer
            </button>
            <button
              onClick={() => setActivePage('about')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              About & Viva Guide
            </button>
          </div>

          <div>
            Built with React, Express & Google Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}
