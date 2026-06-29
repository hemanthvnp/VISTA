/** @fileoverview Root application component with routing, auth, gate, and onboarding logic */
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import useAppStore from './store/useAppStore';
import { getMe } from './api/auth';
import { isToday } from './utils/dateUtils';
import useTheme from './hooks/useTheme';

import PageWrapper from './components/layout/PageWrapper';
import GateScreen from './components/layout/GateScreen';
import OnboardingFlow from './components/layout/OnboardingFlow';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Typing from './pages/Typing';
import Roadmap from './pages/Roadmap';
import Resources from './pages/Resources';
import CodePlayground from './pages/CodePlayground';
import Flashcards from './pages/Flashcards';
import AITutor from './pages/AITutor';
import Schedule from './pages/Schedule';
import Notes from './pages/Notes';
import MiniProjects from './pages/MiniProjects';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import LearnHub from './pages/LearnHub';
import LearnTopics from './pages/LearnTopics';
import LearnLesson from './pages/LearnLesson';
import { Zap } from 'lucide-react';

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <Zap className="w-16 h-16 text-brutal-mint mx-auto mb-4 animate-pulse" />
        <h1 className="font-heading text-brutal-mint font-bold text-3xl tracking-widest">V</h1>
        <p className="text-text-muted text-sm mt-2">Type better. Learn deeper. Build smarter.</p>
      </div>
    </div>
  );
}

export default function App() {
  const { token, user, setUser } = useAuthStore();
  const { showSplash, setShowSplash, showGate, setShowGate, setGateCompleted, setActiveTech } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize theme (applies dark class to <html>)
  useTheme();

  // Fetch user on load if token exists
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const data = await getMe();
          setUser(data.user || data);
        } catch {
          useAuthStore.getState().logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  // Check gate and onboarding status when user loads
  useEffect(() => {
    if (user) {
      setActiveTech(user.activeTechId || 'python');
      if (!user.onboardingComplete) {
        setShowOnboarding(true);
      } else if (!isToday(user.lastGateDate)) {
        setShowGate(true);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Zap className="w-8 h-8 text-brutal-mint animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* Splash screen */}
      {showSplash && token && <SplashScreen onDone={() => setShowSplash(false)} />}

      {/* Onboarding overlay */}
      {showOnboarding && token && (
        <OnboardingFlow onComplete={() => {
          setShowOnboarding(false);
          setShowGate(true);
        }} />
      )}

      {/* Gate overlay */}
      {showGate && token && !showOnboarding && (
        <GateScreen onComplete={() => {
          setShowGate(false);
          setGateCompleted(true);
        }} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/typing" element={<ProtectedRoute><PageWrapper><Typing /></PageWrapper></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><PageWrapper><Roadmap /></PageWrapper></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><PageWrapper><Resources /></PageWrapper></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><PageWrapper><LearnHub /></PageWrapper></ProtectedRoute>} />
        <Route path="/learn/:techId" element={<ProtectedRoute><PageWrapper><LearnTopics /></PageWrapper></ProtectedRoute>} />
        <Route path="/learn/:techId/:topicId" element={<ProtectedRoute><PageWrapper><LearnLesson /></PageWrapper></ProtectedRoute>} />
        <Route path="/code" element={<ProtectedRoute><PageWrapper><CodePlayground /></PageWrapper></ProtectedRoute>} />
        <Route path="/flashcards" element={<ProtectedRoute><PageWrapper><Flashcards /></PageWrapper></ProtectedRoute>} />
        <Route path="/tutor" element={<ProtectedRoute><PageWrapper><AITutor /></PageWrapper></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><PageWrapper><Schedule /></PageWrapper></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><PageWrapper><Notes /></PageWrapper></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><PageWrapper><MiniProjects /></PageWrapper></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><PageWrapper><Achievements /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
