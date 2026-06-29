/** @fileoverview Flashcards page - spaced repetition flashcards with tech filter */
import { useState, useEffect, useCallback } from 'react';
import { getFlashcards, updateFlashcardProgress, generateFlashcards } from '../api/progress';
import { addXP } from '../api/progress';
import useAppStore from '../store/useAppStore';
import FlashCard from '../components/flashcards/FlashCard';
import CardControls from '../components/flashcards/CardControls';
import TechFilter from '../components/resources/TechFilter';
import BrutalCard from '../components/ui/BrutalCard';
import { Layers, Shuffle, RotateCcw, Sparkles } from 'lucide-react';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const activeTech = useAppStore((s) => s.activeTech);
  const [techFilter, setTechFilter] = useState(activeTech || 'all');
  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stats, setStats] = useState({ reviewed: 0, gotIt: 0, learning: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadCards = useCallback(async (tech) => {
    setLoading(true);
    try {
      const data = await getFlashcards(tech === 'all' ? undefined : tech);
      const fetched = data.flashcards || data || [];
      setCards(shuffleArray(fetched));
      setCurrentIdx(0);
      setStats({ reviewed: 0, gotIt: 0, learning: 0, hard: 0 });
    } catch (e) {
      console.error('Flashcard load error:', e);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards(techFilter);
  }, [techFilter, loadCards]);

  const handleResponse = async (response) => {
    const card = cards[currentIdx];
    if (!card) return;

    setStats((prev) => ({
      reviewed: prev.reviewed + 1,
      gotIt: prev.gotIt + (response === 'got-it' ? 1 : 0),
      learning: prev.learning + (response === 'learning' ? 1 : 0),
      hard: prev.hard + (response === 'hard' ? 1 : 0),
    }));

    try {
      if (card._id) {
        await updateFlashcardProgress(card._id, { response });
      }
    } catch (e) { /* silent */ }

    if (currentIdx < cards.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleShuffle = () => {
    setCards(shuffleArray(cards));
    setCurrentIdx(0);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setStats({ reviewed: 0, gotIt: 0, learning: 0, hard: 0 });
  };

  const handleGenerate = async () => {
    const tech = techFilter === 'all' ? 'general programming' : techFilter;
    setGenerating(true);
    try {
      const data = await generateFlashcards(tech);
      const generated = data.flashcards || [];
      setCards((prev) => [...prev, ...generated]);
    } catch (e) {
      console.error('Generate flashcards error:', e);
    } finally {
      setGenerating(false);
    }
  };

  const currentCard = cards[currentIdx];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <Layers className="text-brutal-mint" size={22} /> Flashcards
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-brutal-purple/20 text-brutal-purple border border-brutal-purple/40 rounded-lg hover:bg-brutal-purple/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={14} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Generating...' : 'Generate Flashcards'}
          </button>
          <span className="text-sm text-text-muted">{cards.length} cards</span>
        </div>
      </div>

      <TechFilter value={techFilter} onChange={setTechFilter} />

      {loading ? (
        <BrutalCard className="text-center py-16">
          <p className="text-text-muted animate-pulse">Loading flashcards...</p>
        </BrutalCard>
      ) : cards.length === 0 ? (
        <BrutalCard className="text-center py-16">
          <Layers size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted text-sm">No flashcards available for this technology.</p>
          <p className="text-text-muted text-xs mt-1">Run the seed script to populate flashcards.</p>
        </BrutalCard>
      ) : (
        <>
          <FlashCard card={currentCard} onResponse={handleResponse} />
          <CardControls
            current={currentIdx}
            total={cards.length}
            onPrev={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIdx((prev) => Math.min(cards.length - 1, prev + 1))}
            onShuffle={handleShuffle}
            onReset={handleReset}
            stats={stats}
          />
        </>
      )}

      {stats.reviewed > 0 && (
        <BrutalCard className="text-center">
          <h3 className="text-sm text-text-secondary mb-2">Session Progress</h3>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <span className="text-brutal-mint font-mono text-lg">{stats.gotIt}</span>
              <p className="text-xs text-text-muted">Got It</p>
            </div>
            <div>
              <span className="text-text-secondary font-mono text-lg">{stats.learning}</span>
              <p className="text-xs text-text-muted">Learning</p>
            </div>
            <div>
              <span className="text-brutal-pink font-mono text-lg">{stats.hard}</span>
              <p className="text-xs text-text-muted">Hard</p>
            </div>
          </div>
        </BrutalCard>
      )}
    </div>
  );
}
