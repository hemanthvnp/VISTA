/** Chat message bubble for AI Tutor with lightweight markdown rendering */

/** Parse a line's inline markdown: **bold**, *italic*, `code` */
function InlineMd({ text }) {
  const parts = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
    if (m[2]) parts.push(<strong key={m.index} className="text-text-primary font-semibold">{m[2]}</strong>);
    else if (m[3]) parts.push(<em key={m.index} className="text-text-primary italic">{m[3]}</em>);
    else if (m[4]) parts.push(<code key={m.index} className="bg-bg-elevated text-brutal-mint font-mono text-xs px-1.5 py-0.5 rounded">{m[4]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
  return <>{parts}</>;
}

/** Render markdown content into React nodes */
function MarkdownBody({ content }) {
  const lines = content.split('\n');
  const nodes = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <pre key={i} className="bg-bg-elevated rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono text-text-secondary leading-relaxed">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Headings
    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^(#+)/)[1].length;
      const txt = line.replace(/^#+\s/, '');
      const cls = level === 1 ? 'text-base font-bold text-text-primary mt-2 mb-1' : 'text-sm font-semibold text-text-primary mt-1.5 mb-0.5';
      nodes.push(<div key={i} className={cls}><InlineMd text={txt} /></div>);
      i++;
      continue;
    }

    // Bullet list item
    if (/^[\-\*] /.test(line)) {
      nodes.push(
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-brutal-mint mt-0.5 shrink-0">•</span>
          <span><InlineMd text={line.slice(2)} /></span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list item
    if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)[1];
      nodes.push(
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-brutal-mint shrink-0 font-mono text-xs mt-0.5">{num}.</span>
          <span><InlineMd text={line.replace(/^\d+\. /, '')} /></span>
        </div>
      );
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      nodes.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Normal paragraph line
    nodes.push(<p key={i} className="leading-relaxed"><InlineMd text={line} /></p>);
    i++;
  }

  return <div className="space-y-0.5 text-sm">{nodes}</div>;
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${isUser
          ? 'bg-brutal-blue/20 border border-brutal-blue/30 text-text-primary rounded-br-sm'
          : 'bg-brutal-purple/10 border border-brutal-purple/30 text-text-secondary rounded-bl-sm'
          }`}
      >
        <div className="text-xs mb-1.5 opacity-50">{isUser ? 'You' : 'V Tutor'}</div>
        {isUser
          ? <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
          : <MarkdownBody content={message.content} />
        }
      </div>
    </div>
  );
}

