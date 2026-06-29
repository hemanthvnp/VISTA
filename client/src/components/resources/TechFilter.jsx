import { TECHNOLOGIES } from '../../utils/typingGeminiPrompt';

/** Technology filter dropdown for resources page */
export default function TechFilter({ value, onChange, includeAll = true }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-bg-card border border-brutal-black rounded-lg px-3 py-2 text-sm text-text-primary focus:border-brutal-mint focus:outline-none"
    >
      {includeAll && <option value="">All Technologies</option>}
      {TECHNOLOGIES.map((tech) => (
        <option key={tech.id} value={tech.id}>
          {tech.emoji} {tech.name}
        </option>
      ))}
    </select>
  );
}
