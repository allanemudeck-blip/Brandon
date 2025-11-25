import React, { useState, useRef, useEffect } from 'react';
import { performSearch } from './services/gemini';
import { SearchState } from './types';
import { SearchIcon, SparklesIcon, LinkIcon, GlobeIcon } from './components/Icons';
import SourceCard from './components/SourceCard';

const SUGGESTED_QUERIES = [
  "Latest updates on James Webb Telescope",
  "Who won the last Super Bowl?",
  "Stock market trends 2024",
  "Best Italian restaurants nearby"
];

function App() {
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({
    status: 'idle',
    data: null,
    error: null,
  });
  
  // For auto-scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setSearchState({ status: 'loading', data: null, error: null });
    
    // Update input if searched via suggestion click
    setQuery(searchQuery);

    try {
      const result = await performSearch(searchQuery);
      setSearchState({ status: 'success', data: result, error: null });
    } catch (err: any) {
      setSearchState({ 
        status: 'error', 
        data: null, 
        error: err.message || "Something went wrong" 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  // Scroll to results on success
  useEffect(() => {
    if (searchState.status === 'success' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchState.status]);

  // Determine container classes based on state to animate/shift layout
  const isIdle = searchState.status === 'idle';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col min-h-screen">
        
        {/* Header / Logo Area */}
        <header className={`flex flex-col items-center gap-4 py-6 transition-all duration-500 ${isIdle ? 'justify-center mt-[15vh]' : 'justify-start flex-row mt-0'}`}>
            <div className={`flex items-center gap-2 ${!isIdle && 'mr-auto'}`}>
              <div className={`p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 ${isIdle ? 'scale-125' : 'scale-100'}`}>
                  <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className={`font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent transition-all duration-500 ${isIdle ? 'text-4xl' : 'text-xl'}`}>
                  Gemini Search
              </h1>
            </div>
            
            {/* Connection Badge */}
            {isIdle && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Google Search Grounding Active
              </div>
            )}
        </header>

        {/* Search Input Section */}
        <section className={`w-full transition-all duration-500 ${isIdle ? 'max-w-2xl mx-auto mt-6' : 'w-full mt-2'}`}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className={`w-5 h-5 text-slate-500 transition-colors group-focus-within:text-cyan-400`} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything... (e.g., 'Latest news about AI')"
              className="w-full pl-11 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-lg placeholder-slate-500 shadow-xl shadow-black/20 transition-all"
              disabled={searchState.status === 'loading'}
            />
            
            {/* Loading Indicator or Google Logo */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-3">
              {searchState.status === 'loading' ? (
                 <div className="w-5 h-5 border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
              ) : (
                 <div className="hidden sm:flex items-center gap-1 opacity-50">
                    <GlobeIcon className="w-4 h-4 text-slate-400" />
                 </div>
              )}
            </div>
          </div>

          {/* Suggested Queries (Only visible when idle) */}
          {isIdle && (
            <div className="mt-8">
              <p className="text-center text-slate-500 text-sm mb-4">Try asking about</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-sm text-slate-300 transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {!isIdle && (
          <div ref={resultsRef} className="flex-1 mt-8 space-y-8 animate-fade-in-up pb-10">
            
            {/* Error State */}
            {searchState.status === 'error' && (
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-200 text-center">
                <p className="font-medium">Connection Error</p>
                <p className="text-sm opacity-80 mt-1">{searchState.error}</p>
                <button 
                  onClick={() => handleSearch(query)}
                  className="mt-3 px-4 py-1.5 rounded bg-red-900/40 hover:bg-red-900/60 text-xs uppercase tracking-wide transition-colors"
                >
                  Retry Search
                </button>
              </div>
            )}

            {/* Success State */}
            {searchState.status === 'success' && searchState.data && (
              <>
                {/* Sources / Grounding Data */}
                {searchState.data.groundingMetadata?.groundingChunks && searchState.data.groundingMetadata.groundingChunks.length > 0 && (
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-slate-400 px-1">
                        <LinkIcon className="w-4 h-4 text-cyan-500" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider">Sources Found</h2>
                     </div>
                     
                     {/* Horizontal Scroll for sources */}
                     <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide mask-fade-right">
                        {searchState.data.groundingMetadata.groundingChunks.map((chunk, idx) => (
                           <SourceCard key={idx} chunk={chunk} index={idx} />
                        ))}
                     </div>
                  </div>
                )}

                {/* Text Response */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <SparklesIcon className="w-24 h-24 text-cyan-500" />
                  </div>
                  <div className="prose prose-invert prose-lg max-w-none relative z-10">
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                      {searchState.data.text}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-slate-600 text-sm">
          <p>Powered by Gemini 2.5 Flash & Google Search</p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;