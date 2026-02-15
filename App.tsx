
import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator as CalcIcon, 
  History, 
  Sparkles, 
  Camera, 
  Trash2, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  BrainCircuit,
  X,
  Menu,
  Share,
  PlusSquare
} from 'lucide-react';
import CalculatorKeypad from './components/CalculatorKeypad';
import Visualizer from './components/Visualizer';
import { Calculation } from './types';
import { solveMathProblem } from './services/geminiService';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'smart' | 'vision'>('standard');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [smartQuery, setSmartQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detecta se é iOS e se NÃO está rodando como app instalado (standalone)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true;
    
    if (isIos && !isStandalone) {
      setShowInstallGuide(true);
    }
  }, []);

  const handleKeypadPress = (key: string) => {
    setDisplay(prev => (prev === '0' ? key : prev + key));
  };

  const handleClear = () => setDisplay('0');

  const executeStandardCalc = () => {
    try {
      const sanitized = display.replace(/[^-0-9+*/().^]/g, '');
      const evalResult = eval(sanitized.replace(/\^/g, '**')).toString();
      const newCalc: Calculation = {
        id: Date.now().toString(),
        query: display,
        result: evalResult,
        timestamp: Date.now(),
        type: 'basic'
      };
      setHistory([newCalc, ...history]);
      setDisplay(evalResult);
    } catch (err) {
      setError('Expressão inválida');
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleAiSolve = async (queryText?: string, image?: string) => {
    const q = queryText || smartQuery;
    if (!q && !image) return;

    setIsAiLoading(true);
    setError(null);
    try {
      const response = await solveMathProblem(q || "Explique este problema", image || undefined);
      const newCalc: Calculation = {
        id: Date.now().toString(),
        query: q || "Imagem analisada",
        result: response.answer,
        explanation: response.explanation,
        steps: response.steps,
        timestamp: Date.now(),
        type: image ? 'vision' : 'ai',
        graphData: response.graphableData?.points
      };
      setHistory([newCalc, ...history]);
      setSmartQuery('');
      setCapturedImage(null);
    } catch (err) {
      setError('Erro ao processar. Tente novamente.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Acesso à câmera negado');
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvasRef.current.toDataURL('image/png'));
        (videoRef.current.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-[#0a0a0a] text-zinc-100 overflow-hidden">
      
      {/* Guia de Instalação iOS */}
      {showInstallGuide && (
        <div className="fixed bottom-10 left-4 right-4 z-[100] bg-indigo-600 p-5 rounded-3xl shadow-2xl flex flex-col gap-3 animate-bounce">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white flex items-center gap-2">
              <PlusSquare size={20} /> Instale como Aplicativo
            </h3>
            <button onClick={() => setShowInstallGuide(false)} className="bg-white/20 p-1 rounded-full"><X size={16}/></button>
          </div>
          <p className="text-white/90 text-sm">Toque no ícone de <Share className="inline" size={16}/> <b>Compartilhar</b> e selecione <b>"Adicionar à Tela de Início"</b>.</p>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CalcIcon className="text-white w-5 h-5" />
          </div>
          <span className="font-bold">NeoCalc <span className="text-indigo-400">AI</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-400">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Histórico */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-full md:w-80 bg-[#0a0a0a] border-r border-zinc-800 p-6 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <CalcIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Histórico</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-12 opacity-30 text-sm">Sem cálculos recentes</div>
          ) : (
            history.map((calc) => (
              <div key={calc.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800" 
                onClick={() => { if(calc.type === 'basic') setDisplay(calc.result); setIsSidebarOpen(false); }}>
                <div className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">{calc.type}</div>
                <div className="text-sm text-zinc-400 truncate font-mono">{calc.query}</div>
                <div className="text-lg font-bold">{calc.result}</div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Workspace Principal */}
      <main className="flex-1 flex flex-col p-4 md:p-8 w-full overflow-y-auto no-scrollbar pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <nav className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 mb-8 max-w-lg mx-auto w-full">
          {['standard', 'smart', 'vision'].map(id => (
            <button 
              key={id}
              onClick={() => { setActiveTab(id as any); if(id==='vision') startCamera(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800/50 overflow-hidden shadow-2xl">
            {activeTab === 'standard' && (
              <div className="p-6">
                <div className="mb-8 text-right overflow-hidden">
                  <div className="text-zinc-500 text-sm mb-2 h-6">{history[0]?.type === 'basic' ? history[0].query : ''}</div>
                  <div className="text-5xl md:text-7xl font-light text-white fira-code truncate">{display}</div>
                </div>
                <CalculatorKeypad onKeyPress={handleKeypadPress} onClear={handleClear} onCalculate={executeStandardCalc} />
              </div>
            )}

            {activeTab === 'smart' && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400"><BrainCircuit size={28} /></div>
                  <div>
                    <h2 className="text-xl font-bold">IA Inteligente</h2>
                    <p className="text-zinc-500 text-xs">Pergunte o que quiser em português.</p>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={smartQuery}
                    onChange={(e) => setSmartQuery(e.target.value)}
                    placeholder="Ex: Qual a derivada de x^2?"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5 text-lg min-h-[140px] focus:outline-none"
                  />
                  <button 
                    disabled={isAiLoading || !smartQuery}
                    onClick={() => handleAiSolve()}
                    className="absolute bottom-4 right-4 bg-indigo-600 p-3 rounded-xl"
                  >
                    {isAiLoading ? '...' : <ArrowRight size={20} />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                    {!capturedImage ? (
                      <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3]">
                        <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
                           <button onClick={captureFrame} className="p-6 bg-white text-black rounded-full shadow-2xl active:scale-90"><Camera size={32} /></button>
                           <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-zinc-800 text-white rounded-full"><PlusSquare size={32} /></button>
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if(file) {
                               const r = new FileReader();
                               r.onload = (ev) => setCapturedImage(ev.target?.result as string);
                               r.readAsDataURL(file);
                             }
                           }} />
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    ) : (
                      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 aspect-[4/3]">
                        <img src={capturedImage} className="w-full h-full object-contain" />
                        <button onClick={() => setCapturedImage(null)} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full"><X size={20} /></button>
                      </div>
                    )}
                    <button 
                      disabled={!capturedImage || isAiLoading}
                      onClick={() => handleAiSolve(undefined, capturedImage?.split(',')[1])}
                      className="w-full py-5 bg-indigo-600 rounded-2xl font-bold shadow-xl"
                    >
                      {isAiLoading ? 'Analisando...' : 'Resolver Foto'}
                    </button>
                </div>
              </div>
            )}
          </div>

          {history.length > 0 && history[0].type !== 'basic' && (
            <section className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 md:p-8 space-y-6">
              <div className="border-b border-zinc-800 pb-6">
                <h2 className="text-2xl font-bold mb-1">Resultado: {history[0].result}</h2>
                <p className="text-zinc-500 text-xs font-mono">{history[0].query}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Passo a Passo</h3>
                {history[0].steps?.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-indigo-400">{idx + 1}</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
                <div className="p-5 rounded-xl bg-indigo-900/10 border border-indigo-500/20 text-zinc-400 text-sm italic">"{history[0].explanation}"</div>
                {history[0].graphData && <Visualizer data={history[0].graphData} label="Gráfico da Função" />}
              </div>
            </section>
          )}
        </div>
      </main>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default App;
