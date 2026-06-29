/** @fileoverview Mini Projects page - 10 guided projects with subtask checklists */
import { useState } from 'react';
import { addXP } from '../api/progress';
import BrutalCard from '../components/ui/BrutalCard';
import { MINI_PROJECTS, TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { FolderGit2, Check, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

export default function MiniProjects() {
  const [subtaskState, setSubtaskState] = useState({});
  const [completedProjects, setCompletedProjects] = useState({});
  const [expandedProject, setExpandedProject] = useState(null);

  const toggleSubtask = (techId, subtaskIdx) => {
    setSubtaskState((prev) => {
      const key = techId + '-' + subtaskIdx;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const getCompletedSubtasks = (project) => {
    return project.subtasks.filter((_, i) => subtaskState[project.techId + '-' + i]).length;
  };

  const allSubtasksDone = (project) => {
    return getCompletedSubtasks(project) === project.subtasks.length;
  };

  const handleCompleteProject = async (project) => {
    if (completedProjects[project.techId]) return;
    try {
      await addXP('complete_mini_project', 500);
      setCompletedProjects((prev) => ({ ...prev, [project.techId]: true }));
    } catch (e) {
      console.error('XP error:', e);
    }
  };

  const completedCount = Object.keys(completedProjects).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-text-primary flex items-center gap-2">
          <FolderGit2 className="text-brutal-mint" size={22} /> Mini Projects
        </h1>
        <span className="text-sm text-brutal-yellow font-mono">{completedCount}/10 completed</span>
      </div>

      <p className="text-sm text-text-muted">
        One guided project per technology. Complete all subtasks, then claim +500 XP.
      </p>

      <div className="space-y-3">
        {MINI_PROJECTS.map((project) => {
          const tech = TECHNOLOGIES.find(t => t.id === project.techId);
          const done = getCompletedSubtasks(project);
          const total = project.subtasks.length;
          const isComplete = completedProjects[project.techId];
          const isExpanded = expandedProject === project.techId;

          return (
            <BrutalCard key={project.techId} color={isComplete ? 'none' : 'cyan'}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedProject(isExpanded ? null : project.techId)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tech?.emoji}</span>
                  <div>
                    <h3 className={`text-sm font-semibold ${isComplete ? 'text-success-text' : 'text-text-primary'}`}>
                      {project.name}
                    </h3>
                    <p className="text-xs text-text-muted">{tech?.name} — {project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono ${done === total ? 'text-brutal-yellow' : 'text-text-muted'}`}>
                    {done}/{total}
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-2 border-t border-brutal-black pt-3">
                  {project.subtasks.map((task, i) => {
                    const checked = subtaskState[project.techId + '-' + i] || false;
                    return (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSubtask(project.techId, i); }}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            checked ? 'border-brutal-mint bg-brutal-mint/20' : 'border-brutal-black group-hover:border-brutal-purple'
                          }`}
                        >
                          {checked && <Check size={12} className="text-brutal-mint" />}
                        </button>
                        <span className={`text-sm ${checked ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                          {task}
                        </span>
                      </label>
                    );
                  })}

                  {allSubtasksDone(project) && !isComplete && (
                    <button
                      onClick={() => handleCompleteProject(project)}
                      className="mt-3 w-full px-4 py-2 bg-brutal-yellow text-text-primary border-2 border-brutal-black rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brutal-yellow/80 transition-colors"
                    >
                      <Trophy size={16} /> Complete Project (+500 XP)
                    </button>
                  )}

                  {isComplete && (
                    <div className="mt-3 text-center text-sm text-success-text flex items-center justify-center gap-2">
                      <Trophy size={16} /> Project Completed!
                    </div>
                  )}
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
}
