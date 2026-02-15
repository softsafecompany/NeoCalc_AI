
import React from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onCalculate: () => void;
}

const CalculatorKeypad: React.FC<KeypadProps> = ({ onKeyPress, onClear, onCalculate }) => {
  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', '^']
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {buttons.flat().map((btn) => (
        <button
          key={btn}
          onClick={() => {
            if (btn === 'C') onClear();
            else if (btn === '=') onCalculate();
            else onKeyPress(btn);
          }}
          className={`
            h-14 md:h-16 rounded-2xl text-xl font-semibold transition-all duration-200
            active:scale-95 flex items-center justify-center
            ${btn === 'C' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 
              ['/', '*', '-', '+', '=', '^'].includes(btn) ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20' : 
              'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'}
          `}
        >
          {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
        </button>
      ))}
    </div>
  );
};

export default CalculatorKeypad;
