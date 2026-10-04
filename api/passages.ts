const BLOG_FEED =
  'https://www.puneexamupdate.in/feeds/posts/default?alt=json&max-results=10';

function stripHtml(html: string): string {
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

const isProse = (text: string): boolean => {
  if (text.length < 200) return false;
  if (/https?:\/\//.test(text)) return false;
  const sentences = text.split(/[।.!?]/).filter((s) => s.trim().length > 25);
  return sentences.length >= 3;
};

export default async function handler(_req: unknown, res: any) {
  try {
    const response = await fetch(BLOG_FEED);
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);

    const data: any = await response.json();
    const items = data?.feed?.entry ?? [];

    const passages = items
      .map((entry: any) => {
        const text = stripHtml(entry?.content?.$t ?? '');
        const alternate = (entry?.link ?? []).find((l: any) => l.rel === 'alternate');
        return {
          id: `blog-${entry.id.$t}`,
          title: entry.title.$t,
          url: alternate?.href ?? '',
          published: entry.published?.$t ?? '',
          text,
          wordCount: text.split(/\s+/).filter(Boolean).length,
        };
      })
      .filter((p: any) => isProse(p.text));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ source: 'blogger', count: passages.length, passages });
  } catch (err) {
    res.status(502).json({ error: 'Could not read blog feed', detail: String(err) });
  }
}
