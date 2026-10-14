/**
 * Data structures for AI Meeting Summarizer
 * Designed for clarity, type safety, and student project evaluation.
 */

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority?: 'High' | 'Medium' | 'Low';
}

export interface MeetingSummaryResult {
  meetingTitle: string;
  meetingDate?: string;
  participants?: string[];
  shortSummary: string;
  keyDiscussionPoints: string[];
  keyDecisions: string[];
  actionItems: ActionItem[];
  generatedAt?: string;
  originalTranscriptLength?: number;
}

export type ActivePage = 'home' | 'summarizer' | 'results' | 'about';

export interface SampleTranscript {
  id: string;
  title: string;
  category: string;
  durationApprox: string;
  participants: string[];
  transcript: string;
}
