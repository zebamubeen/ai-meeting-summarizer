# AI Meeting Summarizer

An end-to-end AI and NLP web application developed for **5th Semester Computer Science & Engineering (CSE) Major/Mini Project Evaluation**.

The system converts spoken meeting audio into text using Automatic Speech Recognition (ASR), processes transcripts using Large Language Models (LLM), and synthesizes an executive summary, key discussion points, formal decisions, and an interactive action items table with assignees and deadlines.

---

## 1. Project Goal & Problem Statement

In academic, software engineering, and corporate meetings:
* Participants spend up to 25% of meeting time taking notes instead of engaging.
* Verbal commitments, deadlines, and assigned responsibilities are frequently forgotten.
* Manual documentation ("Minutes of Meeting - MoM") is time-consuming and subjective.

**Solution:** **AI Meeting Summarizer** automates the entire pipeline:
1. **Audio Speech-to-Text:** Converts MP3/WAV/WebM audio recordings or live microphone input into clean, structured text.
2. **Abstractive NLP Summarization:** Summarizes discussion context without verbatim copy-pasting.
3. **Structured Task Extraction:** Identifies assigned tasks, persons responsible, and deadlines with strict anti-hallucination rules (initial status set to `Pending`).
4. **Export Deliverables:** One-click copy, plus downloads in TXT, Markdown, and JSON.

---

## 2. Project Architecture & Pipeline

```
[ User Input ]
   ├── Meeting Audio (MP3 / WAV / WebM / Live Mic)
   └── Raw Text Transcript (Paste or Sample Load)
           │
           ▼
[ Speech-to-Text Layer (ASR) ]
   └── Gemini 3.5 Transcribe
       Converts audio frequencies to textual transcript with speaker turns
           │
           ▼
[ Natural Language Processing Layer (NLP) ]
   └── Gemini 3.8 Flash + Structured JSON Schema
       • Executive Summary Generation (Abstractive)
       • Key Points Isolation
       • Consensus Decision Extraction
       • Action Item & Named Entity Recognition (Assignee, Deadline)
           │
           ▼
[ Interactive Presentation Dashboard ]
   ├── Section 1: Executive Meeting Summary
   ├── Section 2: Key Discussion Points & Consensus Decisions
   ├── Section 3: Action Items Table (Status: Pending / In Progress / Completed)
   └── Export Toolbar (Copy, Download .TXT, .MD, .JSON, Print/PDF)
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons | Responsive, modern blue-and-white theme |
| **Full-Stack Server** | Express.js / Node.js (`server.ts`) | Handles 50MB audio buffers, routes API calls securely |
| **Alternative Backend** | Python Flask (`python_flask_backend/app.py`) | Provided for college syllabi requiring Python |
| **Speech-to-Text AI** | `gemini-3.5-transcribe` | Multimodal audio-to-text recognition |
| **NLP Reasoning AI**| `gemini-3.8-flash` | Abstractive summarization & structured JSON extraction |

---

## 4. Project Folder Structure

```
├── .env.example                  # Environment variables template
├── README.md                     # College evaluation & architecture guide
├── requirements.txt              # Python dependencies for Flask backend
├── package.json                  # Node.js dependencies and run scripts
├── server.ts                     # Full-stack Express backend with Gemini endpoints
├── index.html                    # Application entry point
├── python_flask_backend/
│   └── app.py                    # Standalone Python Flask backend
├── src/
│   ├── App.tsx                   # Main state container & router
│   ├── main.tsx                  # React DOM initialization
│   ├── index.css                 # Tailwind CSS styling
│   ├── types.ts                  # TypeScript interfaces for meetings & tasks
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky header with blue-white theme & badges
│   │   ├── HomeView.tsx          # Hero banner, feature highlights & workflow
│   │   ├── SummarizerView.tsx    # Audio upload, mic recorder, transcript editor
│   │   ├── ResultsView.tsx       # 3-section output with interactive table & export
│   │   └── AboutView.tsx         # CSE project report & Viva Voce Q&A cheat sheet
│   └── data/
│       └── sampleTranscripts.ts  # Pre-loaded scenarios (e.g. CSE Project Sync)
```

---

## 5. How to Run Locally

### Option A: Node.js + Express (Default Live Stack)

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your API Key:**
   Copy `.env.example` to `.env` and set your key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Python Flask Backend (For Python-Specific Evaluation)

1. **Install Python virtual environment and dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Set your environment variable:**
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key-here"  # On Windows: set GEMINI_API_KEY="..."
   ```

3. **Run the Flask server:**
   ```bash
   python python_flask_backend/app.py
   ```
   Flask backend will start on `http://127.0.0.1:5000`.

---

## 6. Sample Input & Expected Output (For Demonstration)

### Input Transcript (From CSE Project Sync Sample):
> *Rahul: Welcome everyone to our sprint review. Our final college evaluation is next Friday, October 24th...*
> *Priya: My task is to complete the website design, polish the UI using Tailwind CSS by Monday, October 20th.*
> *Aman: My action item is to prepare the database schema and finalize API integration by Wednesday, October 22nd.*
> *Sneha: My action item is to test the application end-to-end by Thursday, October 23rd.*
> *Key decision: Freeze new features by October 21st for mock viva.*

### AI-Generated Output:
* **Meeting Summary:** The team convened for their 5th semester project review, finalized module responsibilities for the AI Meeting Summarizer, established deadlines ahead of the October 24th evaluation, and agreed to freeze feature development for testing.
* **Key Discussion Points:** Website frontend design, database schema preparation, API integration, and end-to-end testing schedule.
* **Key Decisions Made:** All new feature additions are frozen by October 21st to dedicate time to testing and mock vivas.
* **Action Items Table:**
  | Task Description | Assigned Person | Deadline | Initial Status |
  | :--- | :--- | :--- | :--- |
  | Complete website design and polish UI | Priya | October 20th | Pending |
  | Prepare database schema and finalize API | Aman | October 22nd | Pending |
  | Test application end-to-end and edge cases | Sneha | October 23rd | Pending |
  | Assemble project report and viva slides | Rahul | October 22nd | Pending |

---

## 7. Viva Voce Defense Questions & Answers

1. **Why use Gemini 3.5 Transcribe over conventional Web Speech API?**
   * The browser Web Speech API is dependent on local OS engines, struggles with meeting-length audio files, and does not retain multi-speaker turn nuances. `gemini-3.5-transcribe` processes full audio buffers server-side with high accuracy across noisy backgrounds.

2. **How does the system ensure zero hallucinations for action items?**
   * The system prompt enforces strict ground-truth constraints: `If no assignee is mentioned, set "Unassigned". If no deadline is mentioned, set "Not specified". Do NOT invent tasks or names.` Furthermore, `responseSchema` forces structured schema adherence.

3. **What is the significance of the initial "Pending" status?**
   * Tasks discussed in meetings are unfulfilled commitments. Defaulting to "Pending" provides a workflow starting point where users can interactively update tasks to "In Progress" or "Completed" directly in the dashboard.

---

## 8. License & Academic Attribution
Developed as an open academic demonstration under Apache-2.0 License.
