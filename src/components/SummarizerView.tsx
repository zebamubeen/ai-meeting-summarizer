import React, { useState, useRef, useEffect } from 'react';
import { SampleTranscript } from '../types';
import { SAMPLE_TRANSCRIPTS } from '../data/sampleTranscripts';
import { 
  Upload, 
  Mic, 
  Square, 
  Play, 
  Trash2, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Check, 
  Clock, 
  RefreshCw, 
  HelpCircle,
  Volume2
} from 'lucide-react';

interface SummarizerViewProps {
  transcript: string;
  setTranscript: (text: string) => void;
  meetingTitle: string;
  setMeetingTitle: (title: string) => void;
  onGenerateSummary: () => Promise<void>;
  isLoadingSummary: boolean;
  isLoadingTranscription: boolean;
  onTranscribeAudio: (audioBase64: string, mimeType: string) => Promise<void>;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  transcript,
  setTranscript,
  meetingTitle,
  setMeetingTitle,
  onGenerateSummary,
  isLoadingSummary,
  isLoadingTranscription,
  onTranscribeAudio,
  errorMessage,
  setErrorMessage,
}) => {
  // Input mode: 'audio' | 'transcript'
  const [activeTab, setActiveTab] = useState<'audio' | 'transcript'>('audio');

  // Audio file states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioUrl]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 25MB recommended
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('Audio file size exceeds 25MB limit. Please upload a smaller audio clip.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Auto populate title if empty
    if (!meetingTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setMeetingTitle(cleanName);
    }
  };

  // Convert File to Base64 and transcribe
  const handleUploadAudio = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an audio file (MP3 or WAV) first.');
      return;
    }

    try {
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        await onTranscribeAudio(base64String, selectedFile.type || 'audio/mp3');
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read the audio file on the device.');
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing audio file.');
    }
  };

  // Start live microphone recording
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([audioBlob], `Live_Meeting_Recording_${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        setSelectedFile(recordedFile);
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(URL.createObjectURL(audioBlob));

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage('Microphone access was denied or not supported by this browser.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Handle sample selection
  const handleLoadSample = (sample: SampleTranscript) => {
    setTranscript(sample.transcript);
    setMeetingTitle(sample.title);
    setErrorMessage(null);
  };

  // Text metrics
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;
  const estimatedReadingTime = Math.ceil(wordCount / 130);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Title & Instructions */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Meeting Input & Transcription
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Upload recorded audio (MP3/WAV) or paste a meeting conversation. Review the generated transcript and click <strong>Generate Summary</strong> to extract key decisions and action items.
        </p>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-3 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Notice:</span> {errorMessage}
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-red-400 hover:text-red-700 text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Meeting Title Input */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <label htmlFor="meeting-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Meeting Title (Optional)
        </label>
        <input
          id="meeting-title"
          type="text"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          placeholder="e.g. 5th Semester CSE Project Sync, Product Sprint, Client Strategy Review"
          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Dual Input Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center space-x-2 py-3 px-5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'audio'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Feature 1: Upload or Record Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center space-x-2 py-3 px-5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'transcript'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Feature 2: Enter or Edit Transcript</span>
          {transcript && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1" />
          )}
        </button>
      </div>

      {/* TAB 1: AUDIO UPLOAD & RECORDING */}
      {activeTab === 'audio' && (
        <div className="bg-white p-6 rounded-b-2xl border-x border-b border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box A: Upload Audio File */}
            <div className="space-y-4 p-5 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 text-center flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mp3, audio/wav, audio/m4a, audio/webm, audio/ogg, .mp3, .wav, .m4a, .webm"
                onChange={handleFileChange}
                className="hidden"
                id="audio-file-input"
              />

              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  Select Meeting Audio
                </h3>
                <p className="text-xs text-slate-500">
                  Supported formats: <strong>MP3</strong>, <strong>WAV</strong>, M4A, WebM (Max 25MB)
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Choose Audio File
              </button>

              {selectedFile && (
                <div className="w-full mt-2 p-3 bg-white rounded-lg border border-blue-200 text-left text-xs space-y-1">
                  <div className="font-medium text-slate-900 truncate">
                    📄 {selectedFile.name}
                  </div>
                  <div className="text-slate-500">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Format: {selectedFile.type || 'audio'}
                  </div>
                </div>
              )}
            </div>

            {/* Box B: Record Live Microphone */}
            <div className="space-y-4 p-5 rounded-xl border border-slate-200 bg-slate-50/50 text-center flex flex-col items-center justify-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xs transition-all ${
                isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-200 text-slate-700'
              }`}>
                <Mic className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  Or Record Live Meeting
                </h3>
                <p className="text-xs text-slate-500">
                  {isRecording 
                    ? `Recording in progress... (${formatTime(recordingSeconds)})` 
                    : 'Use your microphone to capture a live conversation'
                  }
                </p>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Recording ({formatTime(recordingSeconds)})</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio Player Preview & Action Button */}
          {audioUrl && (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Audio Preview Player</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setAudioUrl(null);
                  }}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                  title="Remove selected audio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <audio src={audioUrl} controls className="w-full h-10" />
            </div>
          )}

          {/* Convert Audio to Text Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Converts spoken speech to structured text with AI speech recognition before summarization.
            </div>

            <button
              type="button"
              onClick={handleUploadAudio}
              disabled={!selectedFile || isLoadingTranscription}
              className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                !selectedFile || isLoadingTranscription
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {isLoadingTranscription ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transcribing Audio...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Audio & Transcribe</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSCRIPT DISPLAY & EDITING */}
      <div className={`space-y-4 ${activeTab === 'audio' ? 'pt-4' : ''}`}>
        {/* Sample Transcripts Picker */}
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Sample Transcript for Testing:</span>
            </span>
            <span className="text-[11px] text-blue-700 hidden sm:inline">
              1-Click Demo for Presentation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_TRANSCRIPTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className="p-3 text-left bg-white hover:bg-blue-100/60 border border-blue-200/80 rounded-xl transition-all shadow-2xs group cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                  {sample.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                  <span>{sample.category}</span>
                  <span className="text-blue-600 font-medium">Load →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editable Transcript Textarea Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <label htmlFor="transcript-area" className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Meeting Transcript (Editable)</span>
              </label>
              <p className="text-xs text-slate-500">
                You can review, edit, or paste your conversation directly below before generating the summary.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setTranscript('')}
                disabled={!transcript}
                className="px-2.5 py-1 text-slate-500 hover:text-red-600 disabled:opacity-30 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            id="transcript-area"
            rows={10}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here, or click one of the sample buttons above to load demonstration text..."
            className="w-full p-4 text-sm font-mono text-slate-800 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
          />

          {/* Transcript Stats Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
            <div className="flex items-center space-x-4">
              <span><strong>{wordCount}</strong> words</span>
              <span><strong>{charCount}</strong> characters</span>
              <span className="hidden sm:inline">Approx. reading time: ~{estimatedReadingTime} min</span>
            </div>

            <div className="text-xs text-blue-700 font-medium">
              Ready for AI Natural Language Processing
            </div>
          </div>
        </div>

        {/* Big Generate Summary Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={!transcript.trim() || isLoadingSummary || isLoadingTranscription}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-bold text-base transition-all cursor-pointer ${
              !transcript.trim() || isLoadingSummary || isLoadingTranscription
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-linear-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {isLoadingSummary ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI Analyzing & Generating Summary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Generate Summary & Action Items</span>
              </>
            )}
          </button>
        </div>

        {/* Loading status progress description */}
        {(isLoadingSummary || isLoadingTranscription) && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>
                {isLoadingTranscription ? 'Converting Audio Speech to Text' : 'NLP Analysis in Progress'}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {isLoadingTranscription 
                ? 'Gemini 3.5 Transcribe is analyzing audio frequencies and generating speaker-attributed text...'
                : 'Gemini 3.8 Flash is isolating decisions, parsing assignments, and checking deadlines without hallucination...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
