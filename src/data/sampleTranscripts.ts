import { SampleTranscript } from '../types';

export const SAMPLE_TRANSCRIPTS: SampleTranscript[] = [
  {
    id: 'college-cse-project',
    title: 'CSE Project Development & Task Allocation',
    category: 'College Project (5th Sem CSE)',
    durationApprox: '15 mins',
    participants: ['Rahul (Team Lead)', 'Priya (UI/Frontend)', 'Aman (Backend & DB)', 'Sneha (QA & Testing)'],
    transcript: `Meeting: 5th Semester CSE Major Project Review
Date: October 14, 2026
Team: Rahul (Lead), Priya, Aman, Sneha

Rahul: Welcome everyone to our project sprint review. As we know, our final college evaluation by the HOD and external examiner is scheduled for next Friday, October 24th. Today we need to lock down our module responsibilities, ensure our system architecture is solid, and set clear milestones.

Priya: Yes, from the frontend side, I have set up the initial wireframes for our AI Meeting Summarizer. The responsive navbar and cards are structured. My task is to complete the website design, polish the UI using Tailwind CSS, and make sure the action items table is interactive by Monday, October 20th.

Rahul: Excellent Priya. Aman, how are things on the backend and database integration?

Aman: I have finalized the API routes for audio upload and summarization. My priority action item is to prepare the database schema and finalize the API integration with the Gemini LLM. I will have the database ready and seeded with test data by Wednesday, October 22nd.

Sneha: Once Aman and Priya deploy the connected build, I will take charge of quality assurance. My action item is to test the application end-to-end, conduct edge-case testing for unsupported audio formats, and verify summary accuracy before the evaluation. I will complete testing by Thursday, October 23rd.

Rahul: Great. For my action item, I will assemble the final project report documentation, write the viva voce presentation slides, and prepare the demo audio samples by October 22nd.

Key decision reached: We officially agree to freeze new features by October 21st so we have three full days purely dedicated to testing and mock viva presentations. Let's execute!`,
  },
  {
    id: 'product-sprint-launch',
    title: 'FinTech App Q4 Mobile Release & Security Audit',
    category: 'Industry Agile Sprint',
    durationApprox: '22 mins',
    participants: ['David (PM)', 'Elena (Security Lead)', 'Marcus (Mobile Dev)', 'Sarah (DevOps)'],
    transcript: `David: Thanks for joining the Q4 release readiness meeting. Today is Tuesday, and our target production deployment date is November 10th. Let's cover our blockers.

Elena: From security and compliance, the penetration test found two minor OAuth token refresh edge-cases. My task is to run the automated vulnerability scan and approve the final security audit report by Friday, November 6th.

David: Got it. Marcus, what about the iOS and Android biometric login flow?

Marcus: Biometric authentication is fully integrated on iOS and Android. My action item is to resolve the biometric fallback bug on older Android 12 devices by November 4th.

David: Perfect. Sarah, what is the infrastructure readiness for peak traffic?

Sarah: DevOps has auto-scaling configured on the Kubernetes cluster. My action item is to perform the 50,000 concurrent user load test and verify database read-replicas by November 5th.

David: Fantastic. Key decision: We agreed that biometric fallback must pass before signing off on production rollout. If load testing passes 45,000 RPS, we proceed with 100% rollout.`,
  },
  {
    id: 'client-agency-kickoff',
    title: 'Hospitality Brand Redesign & SEO Strategy',
    category: 'Client Strategy & Marketing',
    durationApprox: '18 mins',
    participants: ['Ananya (Account Manager)', 'Vikram (Lead Designer)', 'Carlos (Client Representative)'],
    transcript: `Ananya: Hi Carlos and Vikram. Today's kickoff is to align on the Grand Horizon Hotels website redesign and search optimization deliverables.

Carlos: Our primary objective is to improve mobile booking conversions by at least 25% and ensure fast load times across luxury resort pages.

Vikram: Understood Carlos. My action item is to deliver high-fidelity Figma mockups for the checkout flow and room suite gallery by October 30th.

Ananya: And from the marketing and SEO side, my action item is to compile the competitor keyword gap analysis and technical SEO checklist by November 2nd.

Carlos: Key decision: We decided to keep the classic navy and gold color scheme rather than switching to minimalist monochrome, to maintain our heritage luxury brand identity. Next status sync is scheduled for November 3rd.`,
  },
];
