import React from 'react';
import { GroundingChunk } from '../types';
import { GlobeIcon } from './Icons';

interface SourceCardProps {
  chunk: GroundingChunk;
  index: number;
}

const SourceCard: React.FC<SourceCardProps> = ({ chunk, index }) => {
  const { web } = chunk;

  if (!web) return null;

  // Extract domain for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'web';
    }
  };

  return (
    <a 
      href={web.uri}
      target="_blank" 
      rel="noopener noreferrer"
      className="flex-shrink-0 w-64 p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors duration-200 group flex flex-col gap-2"
    >
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div className="p-1 rounded-full bg-slate-700 group-hover:bg-slate-600">
          <GlobeIcon className="w-3 h-3" />
        </div>
        <span className="truncate">{getDomain(web.uri)}</span>
        <span className="ml-auto text-slate-600">#{index + 1}</span>
      </div>
      <h3 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug">
        {web.title}
      </h3>
    </a>
  );
};

export default SourceCard;