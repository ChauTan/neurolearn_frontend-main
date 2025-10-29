import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import fse from 'fs-extra';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function saveTempFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nl-'));
  const filePath = path.join(tmpDir, file.name || 'upload.bin');
  await fs.writeFile(filePath, buffer);
  return filePath;
}

async function uploadToAssemblyAI(filePath: string, apiKey: string): Promise<string> {
  const baseUrl = 'https://api.assemblyai.com';
  const headers = { authorization: apiKey } as const;
  const data = await fse.readFile(filePath);
  const uploadRes = await axios.post(`${baseUrl}/v2/upload`, data, { headers });
  return uploadRes.data.upload_url as string;
}

async function createTranscript(audioUrl: string, apiKey: string): Promise<{ id: string }> {
  const baseUrl = 'https://api.assemblyai.com';
  const headers = { authorization: apiKey } as const;
  const payload = { audio_url: audioUrl, speech_model: 'universal' };
  const res = await axios.post(`${baseUrl}/v2/transcript`, payload, { headers });
  return { id: res.data.id as string };
}

async function pollTranscript(
  id: string,
  apiKey: string,
  timeoutMs = 10 * 60 * 1000
): Promise<{ text: string }> {
  const baseUrl = 'https://api.assemblyai.com';
  const headers = { authorization: apiKey } as const;
  const start = Date.now();
  while (true) {
    const res = await axios.get(`${baseUrl}/v2/transcript/${id}`, { headers });
    const st = res.data.status as string;
    if (st === 'completed') return { text: res.data.text as string };
    if (st === 'error') throw new Error(`Transcription failed: ${res.data.error}`);
    if (Date.now() - start > timeoutMs) throw new Error('Transcription timed out');
    await new Promise(r => setTimeout(r, 3000));
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          error:
            'Use multipart/form-data with fields: audio (file) or audioUrl (string), optional prompt.',
        },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const mode = String(form.get('mode') || '').toLowerCase();
    const file = form.get('audio');
    const audioUrl = form.get('audioUrl');
    const prompt =
      (form.get('prompt') as string) || 'Summarize this lecture concisely with bullet points.';
    const providedTranscript = (form.get('transcript') as string) || '';
    const skipSummary = String(form.get('skipSummary') || '').toLowerCase() === 'true';

    // Enforce plain-text output with minimal special characters
    const outputPolicy =
      'INSTRUCTIONS: Return PLAIN TEXT only. No markdown, no emojis, no bullet symbols, no headers, no special characters beyond basic ASCII punctuation. Keep it concise.';
    const effectivePrompt = `${outputPolicy}\n\n${prompt}`;

    // New: curriculum generation mode (Gemini only, no audio/transcript)
    if (mode === 'curriculum') {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
      }

      const title = String(form.get('title') || '');
      const subtitle = String(form.get('subtitle') || '');
      const description = String(form.get('description') || '');
      const overview = String(form.get('overview') || '');
      const topics = String(form.get('topics') || '');
      const level = String(form.get('level') || '');
      const duration = String(form.get('duration') || '');

      // Optional: include uploaded document text (TXT or text/*) as primary source
      let docText = '';
      try {
        const file = form.get('file') as File | null;
        if (file) {
          const fileName = (file as any)?.name || '';
          const fileType = (file as any)?.type || '';
          const lowerName = typeof fileName === 'string' ? fileName.toLowerCase() : '';
          const isText = typeof fileType === 'string' && fileType.startsWith('text/');
          const isTxtExt = lowerName.endsWith('.txt');
          const isPdf = fileType === 'application/pdf' || lowerName.endsWith('.pdf');
          const isDocx =
            fileType ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            lowerName.endsWith('.docx');

          if (isText || isTxtExt) {
            const raw = await file.text();
            docText = String(raw).slice(0, 20000);
          } else if (isPdf) {
            try {
              const { default: pdfParse } = await import('pdf-parse');
              const buf = Buffer.from(await file.arrayBuffer());
              const parsed = await pdfParse(buf);
              docText = String(parsed.text || '').slice(0, 20000);
            } catch {
              // If pdf-parse fails to load in this environment, ignore PDF content gracefully
            }
          } else if (isDocx) {
            const buf = Buffer.from(await file.arrayBuffer());
            const result = await mammoth.extractRawText({ buffer: buf });
            docText = String(result.value || '').slice(0, 20000);
          }
        }
      } catch {
        /* ignore */
      }

      // Force strict JSON output
      const sys = `You are generating a course curriculum. Respond with STRICT JSON only that matches this TypeScript type, nothing else (no prose):\n\ninterface Curriculum { sections: Array<{ title: string; description?: string; lessons: Array<{ title: string; isFree?: boolean }> }> }\n\nConstraints:\n- 4 to 8 sections depending on duration.\n- 2 to 6 lessons per section.\n- Titles should be concise.\n- Use isFree=true for 1-2 intro lessons.\n- Do not include any fields other than those in the interface.\n`;

      const userCtx = `Title: ${title}\nSubtitle: ${subtitle}\nLevel: ${level}\nTopics: ${topics}\nDuration (minutes): ${duration}\nDescription: ${description}\nOverview: ${overview}${docText ? `\n\nDOCUMENT CONTENT (use as primary source):\n${docText}` : ''}`;

      const geminiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${sys}\n\n${userCtx}` }] }],
          }),
        }
      );
      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 502 });
      }
      const geminiJson = await geminiRes.json();
      let raw = '';
      try {
        const candidates = geminiJson.candidates || [];
        const parts = candidates[0]?.content?.parts || [];
        raw = parts.map((p: any) => p.text).join('\n');
      } catch {
        raw = JSON.stringify(geminiJson);
      }

      // Try parse JSON strictly; fallback to extracting the first JSON object
      const parseStrictJson = (s: string) => {
        try {
          return JSON.parse(s);
        } catch {}
        const m = s.match(/[\[{][\s\S]*[\]}]/);
        if (m) {
          try {
            return JSON.parse(m[0]);
          } catch {}
        }
        return null;
      };
      const curriculum = parseStrictJson(raw);
      if (!curriculum || !Array.isArray(curriculum.sections)) {
        return NextResponse.json(
          { error: 'Invalid curriculum JSON from Gemini', raw },
          { status: 502 }
        );
      }
      return NextResponse.json({ curriculum });
    }

    // New: quiz questions generation mode
    if (mode === 'quiz') {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
      }

      const examTitle = String(form.get('examTitle') || '');
      const difficultyLevel = String(form.get('difficultyLevel') || 'Medium');
      const topic = String(form.get('topic') || examTitle || 'General Knowledge');
      // questionConfigs as JSON string: [{type:'single-choice'|'multiple-choice', count:number}]
      let questionConfigs: Array<{ type: string; count: number }> = [];
      try {
        const raw = String(form.get('questionConfigs') || '[]');
        questionConfigs = JSON.parse(raw);
      } catch {
        questionConfigs = [];
      }

      // Try to read document text if a text file is uploaded
      let docText = '';
      try {
        const file = form.get('file') as File | null;
        if (file) {
          const fileName = (file as any)?.name || '';
          const fileType = (file as any)?.type || '';
          const lowerName = typeof fileName === 'string' ? fileName.toLowerCase() : '';
          const isText = typeof fileType === 'string' && fileType.startsWith('text/');
          const isTxtExt = lowerName.endsWith('.txt');
          const isPdf = fileType === 'application/pdf' || lowerName.endsWith('.pdf');
          const isDocx =
            fileType ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            lowerName.endsWith('.docx');

          if (isText || isTxtExt) {
            const raw = await file.text();
            docText = String(raw).slice(0, 12000);
          } else if (isPdf) {
            try {
              const { default: pdfParse } = await import('pdf-parse');
              const buf = Buffer.from(await file.arrayBuffer());
              const parsed = await pdfParse(buf);
              docText = String(parsed.text || '').slice(0, 12000);
            } catch {
              // ignore parse failure
            }
          } else if (isDocx) {
            const buf = Buffer.from(await file.arrayBuffer());
            const result = await mammoth.extractRawText({ buffer: buf });
            docText = String(result.value || '').slice(0, 12000);
          }
        }
      } catch {
        // ignore doc read errors
      }

      // Build desired count summary
      const totalCount = questionConfigs.reduce((s, q) => s + (Number(q.count) || 0), 0) || 5;

      const sys = `You generate exam questions. Respond with STRICT JSON ONLY, no extra text. Follow this TypeScript interface EXACTLY with required fields and types:\n\ninterface AnswerOptionData { id: string; text: string; }\ninterface QuestionData {\n  id: string;\n  questionNumber: number;\n  title: string;\n  questionType: 'single-choice' | 'multiple-choice';\n  questionImage?: string | null;\n  choicesConfig: { isMultipleAnswer: boolean; isAnswerWithImageEnabled: boolean; };\n  options: AnswerOptionData[];\n  correctAnswerIds: string[];\n  points: string;\n  isRequired: boolean;\n}\n\nReturn: { questions: QuestionData[] }\nConstraints:\n- Generate ${totalCount} questions.\n- Use concise, clear titles.\n- Provide 4 answer options per question.\n- For single-choice: exactly 1 correctAnswerIds. For multiple-choice: 2-3 correctAnswerIds.\n- Use unique string ids for question and options (e.g., 'q1', 'o1', ...).\n- points should be a short string like '1'.\n- isRequired always true.\n- choicesConfig.isAnswerWithImageEnabled = false.\n- questionImage = null.\n- Do not include any fields beyond the interface.`;

      // Provide distribution hint for single vs multiple based on configs
      const dist = questionConfigs.map(c => `${c.type}:${Number(c.count) || 0}`).join(', ');

      const userCtx = `Exam Title: ${examTitle}\nTopic: ${topic}\nDifficulty: ${difficultyLevel}\nDesired distribution: ${dist || 'single-choice:3, multiple-choice:2'}\n\n${docText ? 'DOCUMENT CONTENT (use as primary source):\n' + docText : 'No document provided; rely on topic/title.'}`;

      const geminiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({ contents: [{ parts: [{ text: `${sys}\n\n${userCtx}` }] }] }),
        }
      );
      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 502 });
      }
      const geminiJson = await geminiRes.json();
      let raw = '';
      try {
        const candidates = geminiJson.candidates || [];
        const parts = candidates[0]?.content?.parts || [];
        raw = parts.map((p: any) => p.text).join('\n');
      } catch {
        raw = JSON.stringify(geminiJson);
      }

      const parseStrictJson = (s: string) => {
        try {
          return JSON.parse(s);
        } catch {}
        const m = s.match(/[\[{][\s\S]*[\]}]/);
        if (m) {
          try {
            return JSON.parse(m[0]);
          } catch {}
        }
        return null;
      };
      const parsed = parseStrictJson(raw);
      const questions = parsed?.questions;
      if (!Array.isArray(questions)) {
        return NextResponse.json(
          { error: 'Invalid questions JSON from Gemini', raw },
          { status: 502 }
        );
      }

      // Light validation/normalization to fit UI
      const normalized = questions.map((q: any, idx: number) => {
        const id = String(q?.id ?? `q${idx + 1}`);
        const options = Array.isArray(q?.options)
          ? q.options.map((o: any, oi: number) => ({
              id: String(o?.id ?? `o${oi + 1}`),
              text: String(o?.text ?? `Option ${oi + 1}`),
            }))
          : [];
        const correctAnswerIds = Array.isArray(q?.correctAnswerIds)
          ? q.correctAnswerIds.map((v: any) => String(v))
          : [];
        const isMultiple =
          String(q?.questionType) === 'multiple-choice' ||
          q?.choicesConfig?.isMultipleAnswer === true;
        return {
          id,
          questionNumber: Number(q?.questionNumber ?? idx + 1),
          title: String(q?.title ?? 'Question'),
          questionType: isMultiple ? 'multiple-choice' : 'single-choice',
          questionImage: null,
          choicesConfig: { isMultipleAnswer: !!isMultiple, isAnswerWithImageEnabled: false },
          options,
          correctAnswerIds,
          points: String(q?.points ?? '1'),
          isRequired: true,
        };
      });

      return NextResponse.json({ questions: normalized });
    }

    // Fast path: If transcript is provided, skip AssemblyAI and only use Gemini
    if (providedTranscript) {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
      }

      const geminiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${effectivePrompt}\n\nContext transcript (for Q&A):\n${providedTranscript}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 502 });
      }

      const geminiJson = await geminiRes.json();
      let summary = '';
      try {
        const candidates = geminiJson.candidates || [];
        const parts = candidates[0]?.content?.parts || [];
        summary = parts.map((p: any) => p.text).join('\n');
      } catch {
        summary = JSON.stringify(geminiJson);
      }

      return NextResponse.json({ transcript: providedTranscript, summary });
    }

    const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
    if (!ASSEMBLYAI_API_KEY) {
      return NextResponse.json({ error: 'Server missing ASSEMBLYAI_API_KEY' }, { status: 500 });
    }

    let assemblyAudioUrl: string | null = null;

    // Prefer direct URL to AssemblyAI when provided
    if (typeof audioUrl === 'string' && /^https?:\/\//i.test(audioUrl)) {
      assemblyAudioUrl = audioUrl;
    } else if (file && file instanceof File) {
      // Save and upload the file
      const inputPath = await saveTempFile(file);
      try {
        assemblyAudioUrl = await uploadToAssemblyAI(inputPath, ASSEMBLYAI_API_KEY);
      } catch (e: any) {
        return NextResponse.json(
          { error: 'Upload to AssemblyAI failed', details: e?.message || String(e) },
          { status: 502 }
        );
      }
    } else {
      return NextResponse.json({ error: 'Missing audio file or audioUrl' }, { status: 400 });
    }

    // 2) Create transcript
    let transcriptId: string;
    try {
      const { id } = await createTranscript(assemblyAudioUrl, ASSEMBLYAI_API_KEY);
      transcriptId = id;
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Create transcript failed', details: e?.message || String(e) },
        { status: 502 }
      );
    }

    // 3) Poll until complete
    let transcriptText = '';
    try {
      const { text } = await pollTranscript(transcriptId, ASSEMBLYAI_API_KEY);
      transcriptText = text || '';
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Polling transcript failed', details: e?.message || String(e) },
        { status: 504 }
      );
    }

    // If client only needs transcript (first-time), allow skipping Gemini
    if (skipSummary) {
      return NextResponse.json({ transcript: transcriptText });
    }

    // 4) Summarize with Gemini
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 });
    }

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${effectivePrompt}\n\nTranscript:\n${transcriptText}` }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: 'Gemini API error', details: errText }, { status: 502 });
    }

    const geminiJson = await geminiRes.json();
    let summary = '';
    try {
      const candidates = geminiJson.candidates || [];
      const parts = candidates[0]?.content?.parts || [];
      summary = parts.map((p: any) => p.text).join('\n');
    } catch {
      summary = JSON.stringify(geminiJson);
    }

    return NextResponse.json({ transcript: transcriptText, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
