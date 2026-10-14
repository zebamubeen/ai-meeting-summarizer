import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support up to 50MB for audio uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Server-side initialization of GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Health check endpoint
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    service: 'AI Meeting Summarizer Backend',
    models: {
      transcription: 'gemini-3.5-transcribe',
      summarization: 'gemini-3.8-flash',
    },
  });
});

/**
 * Feature 1: Speech-to-Text Audio Transcription Endpoint
 * Uses 'gemini-3.5-transcribe' for pre-recorded and uploaded audio files.
 */
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/mp3' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({
        error: 'Missing audio data. Please provide an audio file in MP3, WAV, or supported format.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in backend environment variables.',
      });
    }

    // Clean base64 data prefix if present (e.g., data:audio/mp3;base64,...)
    const cleanBase64 = audioBase64.includes(';base64,')
      ? audioBase64.split(';base64,')[1]
      : audioBase64;

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/mp3',
        data: cleanBase64,
      },
    };

    const promptText =
      'Transcribe this meeting audio accurately into clean, well-formatted English text. ' +
      'Include speaker labels (such as "Speaker 1", "Speaker 2", or names if spoken) when possible. ' +
      'Do not omit any discussed tasks, numbers, project milestones, or deadlines.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { parts: [audioPart, { text: promptText }] },
    });

    const transcript = response.text || '';
    if (!transcript.trim()) {
      return res.status(500).json({
        error: 'Transcription produced an empty result. Please check the audio clarity and volume.',
      });
    }

    return res.json({
      success: true,
      transcript: transcript.trim(),
    });
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to transcribe audio. Please verify the audio file and try again.',
    });
  }
});

/**
 * Feature 3 & 4: AI Meeting Summarization & Action Item Extraction Endpoint
 * Uses 'gemini-3.8-flash' with structured JSON response schema.
 */
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript, meetingTitle = 'General Meeting' } = req.body;

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return res.status(400).json({
        error: 'Please provide a non-empty meeting transcript to summarize.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in backend environment variables.',
      });
    }

    const systemInstruction =
      'You are an expert AI Meeting Analyst and Executive Secretary. ' +
      'Analyze the provided meeting transcript with high fidelity and precision. ' +
      'CRITICAL RULES:\n' +
      '1. Create a clear, concise meeting summary capturing the overall purpose and outcome.\n' +
      '2. Identify all key discussion points.\n' +
      '3. Highlight key decisions officially agreed upon.\n' +
      '4. Extract concrete action items discussed in the meeting. For each action item:\n' +
      '   - Task: Clear, actionable description.\n' +
      '   - Assignee: The exact person or team assigned. If no one is mentioned, explicitly state "Unassigned". DO NOT invent names.\n' +
      '   - Deadline: The exact deadline or timeframe if mentioned. If not mentioned, explicitly state "Not specified". DO NOT invent dates.\n' +
      '   - Status: Always set the initial status to "Pending".\n' +
      '   - Priority: Assign "High", "Medium", or "Low" based on urgency mentioned in the transcript.\n' +
      '5. Strictly adhere to facts in the transcript. Do NOT hallucinate or assume unstated commitments.';

    const prompt = `Meeting Title: ${meetingTitle}\n\nTranscript:\n"""\n${transcript}\n"""`;

    let responseText = '';
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                meetingTitle: {
                  type: Type.STRING,
                  description: 'Appropriate title for the meeting',
                },
                meetingDate: {
                  type: Type.STRING,
                  description: 'Date or timeframe mentioned in the meeting, or current discussion context',
                },
                participants: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of participants or speakers identified in the transcript',
                },
                shortSummary: {
                  type: Type.STRING,
                  description: 'A 2-4 sentence executive overview of the meeting and main outcomes',
                },
                keyDiscussionPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of main topics, debates, and points explored during the meeting',
                },
                keyDecisions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific decisions or conclusions mutually reached by the participants',
                },
                actionItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: 'Unique identifier like ACT-1, ACT-2' },
                      task: { type: Type.STRING, description: 'Clear action item description' },
                      assignee: { type: Type.STRING, description: 'Assigned person name or "Unassigned"' },
                      deadline: { type: Type.STRING, description: 'Deadline if mentioned or "Not specified"' },
                      status: { type: Type.STRING, description: 'Initial status "Pending"' },
                      priority: { type: Type.STRING, description: 'High, Medium, or Low' },
                    },
                    required: ['task', 'assignee', 'deadline', 'status'],
                  },
                  description: 'List of extracted action items and tasks',
                },
              },
              required: [
                'meetingTitle',
                'shortSummary',
                'keyDiscussionPoints',
                'keyDecisions',
                'actionItems',
              ],
            },
          },
        });

        responseText = response.text || '{}';
        if (responseText && responseText !== '{}') {
          break; // Success!
        }
      } catch (err: any) {
        console.warn(`Model ${model} call encountered issue:`, err?.message || err);
        lastError = err;
      }
    }

    if (!responseText || responseText === '{}') {
      throw lastError || new Error('Summarization could not be completed.');
    }
    const parsedData = JSON.parse(responseText);

    // Ensure action items have proper IDs and default status
    if (Array.isArray(parsedData.actionItems)) {
      parsedData.actionItems = parsedData.actionItems.map((item: any, index: number) => ({
        id: item.id || `ACT-${index + 1}`,
        task: item.task || 'Unspecified task',
        assignee: item.assignee || 'Unassigned',
        deadline: item.deadline || 'Not specified',
        status: item.status || 'Pending',
        priority: item.priority || 'Medium',
      }));
    } else {
      parsedData.actionItems = [];
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Meeting summarization error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to summarize transcript. Please review the input and try again.',
    });
  }
});

// Setup Vite in Dev or Static files in Production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AI Meeting Summarizer] Server listening on http://0.0.0.0:${PORT}`);
});
