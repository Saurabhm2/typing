import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;
const BLOG_FEED =
  'https://www.puneexamupdate.in/feeds/posts/default?alt=json&max-results=10';

app.use(express.json());

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const isProse = (text) => {
  if (text.length < 200) return false;
  if (/https?:\/\//.test(text)) return false;
  // Exam posts are mostly tables, dates and link lists. Require real sentences.
  const sentences = text.split(/[।.!?]/).filter((s) => s.trim().length > 25);
  return sentences.length >= 3;
};

app.get('/api/passages', async (_req, res) => {
  try {
    const response = await fetch(BLOG_FEED);
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);

    const data = await response.json();
    const items = data?.feed?.entry ?? [];

    const passages = items
      .map((entry) => {
        const raw = entry?.content?.$t ?? '';
        const text = stripHtml(raw);
        return {
          id: `blog-${entry.id.$t}`,
          title: entry.title.$t,
          url: entry.link
            .filter((l) => l.rel === 'alternate')
            .map((l) => l.href)[0],
          published: entry.published.$t,
          text,
          wordCount: text.split(/\s+/).filter(Boolean).length,
        };
      })
      .filter((p) => isProse(p.text));

    res.json({ source: 'blogger', count: passages.length, passages });
  } catch (err) {
    res.status(502).json({ error: 'Could not read blog feed', detail: String(err) });
  }
});

app.post('/api/results', (req, res) => {
  // Google Sheet append wiring lands here once the sheet is created.
  res.status(501).json({ error: 'Results storage not configured yet' });
});

app.use('/typing', express.static(path.join(__dirname, 'dist')));

app.get('/typing/*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/healthz', (_req, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
