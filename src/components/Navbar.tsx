import React from 'react';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'playground' | 'finops' | 'autorater' | 'telemetry' | 'docs';
  setActiveTab: (tab: 'overview' | 'playground' | 'finops' | 'autorater' | 'telemetry' | 'docs') => void;
  isInterviewMode: boolean;
  setIsInterviewMode: (enabled: boolean) => void;
  quotaRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isInterviewMode,
  setIsInterviewMode,
  quotaRemaining,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Brand Wordmark (Clicking returns to Overview) */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 shrink-0 text-left cursor-pointer focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            CascadeEval
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap rounded-md cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap rounded-md cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            Router Playground
          </button>
          <button
            onClick={() => setActiveTab('finops')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap rounded-md cursor-pointer ${
              activeTab === 'finops'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            FinOps &amp; Cost Model
          </button>
          <button
            onClick={() => setActiveTab('autorater')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap rounded-md cursor-pointer ${
              activeTab === 'autorater'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            Pairwise Autorater
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap rounded-md cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            Telemetry &amp; SLAs
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap rounded-md cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            Documentation
          </button>
        </nav>

        {/* Zone 3: Portfolio Sandbox & Interview Mode Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 border border-slate-800 rounded-md px-2.5 py-1 bg-slate-900/60">
            <span className="text-slate-500">Live Quota:</span>
            <span className={quotaRemaining > 5 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {quotaRemaining}/25
            </span>
          </div>

          <button
            onClick={() => setIsInterviewMode(!isInterviewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all whitespace-nowrap ${
              isInterviewMode
                ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-700/70 text-slate-300 hover:border-slate-600'
            }`}
            title="Toggle between Live Gemini API inference and Instant Deterministic Simulation"
          >
            {isInterviewMode ? (
              <>
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Live Gemini Mode</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>FinOps Sandbox Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
