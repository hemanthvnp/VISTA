/** Roadmap layer section grouping technologies by layer */
export default function LayerSection({ layer, title, description, children }) {
  const layerColors = {
    1: 'border-brutal-mint/30 text-brutal-mint',
    2: 'border-brutal-purple/30 text-brutal-purple',
    3: 'border-brutal-yellow/30 text-brutal-yellow',
  };

  return (
    <div className="mb-8">
      <div className={`flex items-center gap-3 mb-4 pb-2 border-b ${layerColors[layer] || ''}`}>
        <span className={`text-sm font-heading font-bold ${layerColors[layer]?.split(' ')[1] || ''}`}>
          LAYER {layer}
        </span>
        <h2 className="text-lg font-heading font-semibold text-text-primary">{title}</h2>
      </div>
      {description && <p className="text-sm text-text-muted mb-4">{description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}
