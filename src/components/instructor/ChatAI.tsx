'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

// Render assistant answers with basic structure parsing for nicer UI
function AnswerRenderer({ text }: { text: string }) {
  // Split text into lines first
  const lines = useMemo(() => text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0), [text]);

  // Detect inline ordered list within a single paragraph like: "Intro... 1. Item one. 2. Item two. 3. Item three."
  const inlineOrdered = useMemo(() => {
    // Need at least 1. and 2. to consider as list
    if (!/\b1\.\s/.test(text) || !/\b2\.\s/.test(text)) return null;
    // Capture each numbered item greedily until next number or end
    const re = /(\d+)\.\s([^]+?)(?=(?:\s\d+\.\s)|$)/g;
    const items: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const body = m[2].trim().replace(/[;,.]+$/, '').trim();
      if (body) items.push(body);
    }
    if (items.length < 2) return null;
    const firstIdx = text.search(/\b1\.\s/);
    const lead = text.slice(0, firstIdx).trim();
    return { lead, items } as { lead: string; items: string[] } | null;
  }, [text]);

  // Parse into blocks: QA pairs, lists, ordered lists, paragraphs
  const blocks = useMemo(() => {
    type Block =
      | { type: 'qa'; q: string; a: string }
      | { type: 'list'; items: string[] }
      | { type: 'olist'; items: string[]; lead?: string }
      | { type: 'p'; text: string };

    // If inline ordered list detected, short-circuit with lead + ordered list
    if (inlineOrdered) {
      const outInline: Block[] = [];
      if (inlineOrdered.lead) outInline.push({ type: 'p', text: inlineOrdered.lead });
      outInline.push({ type: 'olist', items: inlineOrdered.items });
      return outInline;
    }

    const out: Block[] = [];
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      // Q/A detection
      if (/^Q:\s*/i.test(l)) {
        const q = l.replace(/^Q:\s*/i, '').trim();
        let a = '';
        if (i + 1 < lines.length && /^A:\s*/i.test(lines[i + 1])) {
          a = lines[i + 1].replace(/^A:\s*/i, '').trim();
          i += 2;
        } else {
          i += 1;
        }
        out.push({ type: 'qa', q, a });
        continue;
      }

      // Unordered list detection (consume consecutive list items)
      if (/^[-*]\s+/.test(l)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s+/, '').trim());
          i += 1;
        }
        out.push({ type: 'list', items });
        continue;
      }

      // Ordered list by lines detection (1. 2. ...)
      if (/^\d+\.\s+/.test(l)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, '').trim());
          i += 1;
        }
        out.push({ type: 'olist', items });
        continue;
      }

      // Paragraph (merge consecutive non-empty, non-list, non-Q/A lines into one paragraph)
      const p: string[] = [l];
      i += 1;
      while (
        i < lines.length &&
        !/^Q:\s*/i.test(lines[i]) &&
        !/^A:\s*/i.test(lines[i]) &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i])
      ) {
        p.push(lines[i]);
        i += 1;
      }
      out.push({ type: 'p', text: p.join(' ') });
    }
    return out;
  }, [lines, inlineOrdered]);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((b, idx) => {
        if (b.type === 'qa') {
          return (
            <div key={idx} className="bg-white/70 rounded-xl p-3 text-sm border border-[#E5E7EB]">
              {b.q && (
                <div className="mb-2">
                  <span className="inline-flex items-center gap-2 font-medium text-[#111827]">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#4F46E5]">Q</span>
                    {b.q}
                  </span>
                </div>
              )}
              {b.a && (
                <div className="leading-relaxed text-[#111827]">
                  <span className="inline-block text-[10px] px-2 py-0.5 mr-2 rounded-full bg-[#E5F7EE] text-[#10B981] align-top">A</span>
                  <span>{b.a}</span>
                </div>
              )}
            </div>
          );
        }
        if (b.type === 'list') {
          return (
            <ul key={idx} className="list-disc pl-5 text-sm text-[#111827]">
              {b.items.map((it, i2) => (
                <li key={i2} className="mb-1">{it}</li>
              ))}
            </ul>
          );
        }
        if (b.type === 'olist') {
          return (
            <ol key={idx} className="list-decimal pl-5 text-sm text-[#111827]">
              {b.items.map((it, i2) => (
                <li key={i2} className="mb-1">{it}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={idx} className="text-sm text-[#111827] leading-relaxed">{b.text}</p>
        );
      })}
    </div>
  );
}

export default function ChatAI() {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [prompt, setPrompt] = useState<string>('Summarize this lecture concisely with bullet points.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [cachedTranscript, setCachedTranscript] = useState<string>("");
  const [showFeatures, setShowFeatures] = useState<boolean>(true);
  const lastAudioUrlRef = useRef<string>("");
  const transcribeJobRef = useRef<string>("");
  const [, setAutoTxLoading] = useState<boolean>(false);
  // Cache transcripts per video URL to avoid redundant transcriptions
  const transcriptCacheRef = useRef<Map<string, string>>(new Map());

  const startAutoTranscribe = useCallback(async (url: string) => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    // If cached already, reuse and skip API
    const cached = transcriptCacheRef.current.get(url);
    if (cached) {
      setCachedTranscript(cached);
      return;
    }
    const jobId = `${Date.now()}:${Math.random().toString(36).slice(2)}`;
    transcribeJobRef.current = jobId;
    try {
      setAutoTxLoading(true);
      const fd = new FormData();
      fd.append('audioUrl', url);
      fd.append('skipSummary', 'true');
      fd.append('prompt', '');
      const res = await fetch('/api/ai/summarize', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to transcribe');
      if (transcribeJobRef.current !== jobId) return; // outdated job, ignore
      const tx = String(data.transcript || '');
      transcriptCacheRef.current.set(url, tx);
      setCachedTranscript(tx);
    } catch {
      // silent fail for auto-transcribe
    } finally {
      if (transcribeJobRef.current === jobId) setAutoTxLoading(false);
    }
  }, []);

  // Auto-pick current page <video> src/currentSrc on mount and on changes
  useEffect(() => {
    const pick = () => {
      try {
        const vid = document.querySelector('video') as HTMLVideoElement | null;
        const src = vid?.currentSrc || vid?.src || '';
        if (src && /^https?:\/\//i.test(src)) {
          if (src !== lastAudioUrlRef.current) {
            lastAudioUrlRef.current = src;
            setAudioUrl(src);
            // Reset cached transcript if video source changed (silent)
            const existing = transcriptCacheRef.current.get(src);
            if (existing) {
              // Reuse existing transcript, no API call
              setCachedTranscript(existing);
            } else {
              setCachedTranscript("");
              // Auto-transcribe for the new video source
              startAutoTranscribe(src);
            }
          }
        }
      } catch {
        // ignore
      }
    };

    // Initial pick
    pick();

    // Observe changes in <video> as a fallback
    const vid = document.querySelector('video') as HTMLVideoElement | null;
    let obs: MutationObserver | null = null;
    if (vid) {
      obs = new MutationObserver(() => pick());
      obs.observe(vid, { attributes: true, attributeFilter: ['src'] });
      vid.addEventListener('loadedmetadata', pick);
    }

    // Listen to CoursePage event for reliable changes
    const onCourseVideoChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const url = String(detail.url || '');
      if (!url || !/^https?:\/\//i.test(url)) return;
      if (url !== lastAudioUrlRef.current) {
        lastAudioUrlRef.current = url;
        setAudioUrl(url);
        const existing = transcriptCacheRef.current.get(url);
        if (existing) {
          setCachedTranscript(existing);
        } else {
          setCachedTranscript("");
          startAutoTranscribe(url);
        }
      }
    };
    window.addEventListener('nl:video-changed', onCourseVideoChanged as EventListener);

    return () => {
      if (obs) obs.disconnect();
      if (vid) vid.removeEventListener('loadedmetadata', pick);
      window.removeEventListener('nl:video-changed', onCourseVideoChanged as EventListener);
    };
  }, [startAutoTranscribe]);

  const canSend = useMemo(() => !!prompt.trim() && !loading, [prompt, loading]);

  const onSubmit = useCallback(async (overridePrompt?: unknown) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure we have a valid URL; try pick again if empty
      let url = audioUrl;
      if (!url) {
        const vid = document.querySelector('video') as HTMLVideoElement | null;
        url = (vid?.currentSrc || vid?.src || '').trim();
        if (url) {
          setAudioUrl(url);
          lastAudioUrlRef.current = url;
        }
      }
      if (!url || !/^https?:\/\//i.test(url)) {
        throw new Error('No valid video/audio URL detected (http/https required). If the player uses blob:, please provide a public URL.');
      }

      const raw = typeof overridePrompt === 'string' ? overridePrompt : prompt;
      const userPrompt = raw.trim();
      if (!userPrompt) throw new Error('Prompt is empty');
      const userMsg: ChatMsg = { role: 'user', content: userPrompt };
      setMessages((prev) => [...prev, userMsg]);

      let transcriptToUse = cachedTranscript || transcriptCacheRef.current.get(url) || '';

      // First-time: fetch transcript only and cache it
      if (!transcriptToUse) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Creating transcript for the first time. Please wait...' },
        ]);
        const fdT = new FormData();
        fdT.append('audioUrl', url);
        fdT.append('skipSummary', 'true');
        // Prompt here is not needed for transcript-only, but safe to send
        fdT.append('prompt', '');

        const resT = await fetch('/api/ai/summarize', { method: 'POST', body: fdT });
        const dataT = await resT.json();
        if (!resT.ok) {
          throw new Error(dataT?.error || 'Failed to transcribe');
        }
        transcriptToUse = String(dataT.transcript || '');
        setCachedTranscript(transcriptToUse);
        transcriptCacheRef.current.set(url, transcriptToUse);
      }

      // Now ask Gemini using cached transcript
      const fd = new FormData();
      fd.append('transcript', transcriptToUse);
      fd.append('prompt', userPrompt);

      const res = await fetch('/api/ai/summarize', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to summarize');
      }

      const assistantMsg: ChatMsg = {
        role: 'assistant',
        content: data.summary || 'No response received from Gemini.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setPrompt('');
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [audioUrl, prompt, cachedTranscript]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow text-[#0D0D0D]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-[#3858F8]">Hey, I&apos;m Academix.</h1>
        <p className="text-[#D9D9D9]">Your AI-Powered copilot for the web.</p>
      </div>

      {/* Features */}
      {showFeatures && (
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              const p = 'Summarize this lecture concisely with bullet points.';
              setPrompt(p);
              setShowFeatures(false);
              onSubmit(p);
            }}
            className="flex flex-col items-center bg-[#F7F8FA] rounded-xl p-4 w-1/3 text-center shadow-sm hover:shadow cursor-pointer"
          >
            <Image src="/assets/icons/summarize.svg" alt="Summarize Icon" width={32} height={32} />
            <p className="text-sm mt-2">Summarize lectures<br />via AI chatbot</p>
          </button>
          <button
            type="button"
            onClick={() => {
              const p = 'Answer questions about this lecture. Provide clear, concise explanations.';
              setPrompt(p);
              setShowFeatures(false);
              onSubmit(p);
            }}
            className="flex flex-col items-center bg-[#F7F8FA] rounded-xl p-4 w-1/3 text-center shadow-sm hover:shadow cursor-pointer"
          >
            <Image src="/assets/icons/chat-ai.svg" alt="chat ai Icon" width={32} height={32} />
            <p className="text-sm mt-2">Answer lecture<br />questions via AI chatbot</p>
          </button>
          <button
            type="button"
            onClick={() => {
              const p = 'Create quality learning content from this lecture (key points, definitions, and examples).';
              setPrompt(p);
              setShowFeatures(false);
              onSubmit(p);
            }}
            className="flex flex-col items-center bg-[#F7F8FA] rounded-xl p-4 w-1/3 text-center shadow-sm hover:shadow cursor-pointer"
          >
            <Image src="/assets/icons/content.svg" alt="Content Icon" width={32} height={32} />
            <p className="text-sm mt-2">Create quality content<br />via AI chatbot</p>
          </button>
        </div>
      )}

      {/* Chat window */}
      <div className="text-center text-xs text-gray-400 mb-4">{audioUrl ? 'Video source detected' : 'No public (http/https) video detected'}</div>
      <div className="flex flex-col gap-2 mb-6 max-h-[50vh] overflow-y-auto pr-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={
              m.role === 'user'
                ? 'self-end bg-[#4F46E5] text-white px-4 py-2 rounded-2xl max-w-[80%] text-sm'
                : 'self-start bg-[#EEF0FF] text-[#0D0D0D] px-4 py-2 rounded-2xl max-w-[80%] text-sm'
            }
          >
            {m.role === 'assistant' ? (
              <AnswerRenderer text={m.content} />
            ) : (
              m.content
            )}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-[#EEF0FF] text-[#0D0D0D] px-4 py-2 rounded-2xl max-w-[80%] text-sm opacity-80">
            Generating answer...
          </div>
        )}
      </div>

      {/* Error */}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {/* Input row */}
      <div className="flex items-center gap-2 bg-[#F7F8FA] rounded-full px-4 py-2 shadow-inner">
        <input
          type="text"
          placeholder="Type your request (e.g., 5 key points, explain concept X, ...)"
          className="flex-1 bg-transparent outline-none text-sm placeholder-[#A0AEC0]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && canSend) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button onClick={() => onSubmit()} disabled={!canSend} className="disabled:opacity-50">
          <Image src="/assets/icons/send.svg" alt="Send" width={30} height={30} />
        </button>
      </div>

      {/* Footnote about blob urls
      {!audioUrl && (
        <p className="mt-3 text-xs text-gray-500">
          Tip: If the player uses blob:/file: or requires auth, please provide a public http/https URL so AssemblyAI can access it.
        </p>
      )} */}
    </div>
  );
}
