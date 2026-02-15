
export interface Calculation {
  id: string;
  query: string;
  result: string;
  explanation?: string;
  steps?: string[];
  timestamp: number;
  type: 'basic' | 'ai' | 'vision';
  graphData?: any[];
}

export interface AIResponse {
  answer: string;
  steps: string[];
  explanation: string;
  graphableData?: {
    label: string;
    points: { x: number; y: number }[];
  };
}
