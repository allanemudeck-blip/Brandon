// Types related to the Grounding Metadata from Gemini
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

export interface SearchResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

export interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: SearchResponse | null;
  error: string | null;
}
