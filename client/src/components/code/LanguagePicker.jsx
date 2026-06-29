/** Language picker tabs for code playground */
export default function LanguagePicker({ active, onChange }) {
  const langs = [
    { id: 'python', label: 'Python', color: 'text-brutal-mint border-brutal-mint' },
    { id: 'javascript', label: 'JavaScript', color: 'text-brutal-yellow border-brutal-yellow' },
    { id: 'cpp', label: 'C++', color: 'text-brutal-blue border-brutal-blue' },
  ];

  return (
    <div className="flex gap-1 bg-bg-card rounded-lg p-1 border border-brutal-black">
      {langs.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onChange(lang.id)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            active === lang.id
              ? `${lang.color} bg-bg-elevated border`
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
