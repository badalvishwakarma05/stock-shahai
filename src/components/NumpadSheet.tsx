import React, { useState, useEffect } from 'react';
import { Delete, Check, X, Plus, Minus, RotateCcw } from 'lucide-react';
import { KiranaItem } from '../types';

interface NumpadSheetProps {
  item: KiranaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: number, newStock: number) => void;
}

export const NumpadSheet: React.FC<NumpadSheetProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (item && isOpen) {
      setInputValue(item.stock.toString());
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  // Haptic feedback helper for native Android tactile feel
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDigit = (digit: string) => {
    triggerHaptic();
    if (digit === '.') {
      if (inputValue.includes('.')) return; // Prevent multiple decimals
      setInputValue((prev) => (prev === '' ? '0.' : prev + '.'));
      return;
    }

    if (inputValue === '0') {
      setInputValue(digit);
    } else {
      // Limit to 4 integer digits + 2 decimals
      if (inputValue.length < 6) {
        setInputValue((prev) => prev + digit);
      }
    }
  };

  const handleBackspace = () => {
    triggerHaptic();
    setInputValue((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleClear = () => {
    triggerHaptic();
    setInputValue('0');
  };

  const handleQuickAdd = (amount: number) => {
    triggerHaptic();
    const current = parseFloat(inputValue);
    const validCurrent = isNaN(current) ? 0 : current;
    const result = Math.max(0, Math.round((validCurrent + amount) * 100) / 100);
    setInputValue(result.toString());
  };

  const handleSave = () => {
    triggerHaptic();
    const parsed = parseFloat(inputValue);
    const validStock = isNaN(parsed) ? 0 : Math.max(0, Math.round(parsed * 100) / 100);
    if (item.id !== undefined) {
      onSave(item.id, validStock);
    }
    onClose();
  };

  const parsedValue = parseFloat(inputValue);
  const numericValue = isNaN(parsedValue) ? 0 : parsedValue;
  const isStockLow = numericValue <= item.reorderThreshold;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-sheet overflow-hidden animate-slide-up border-t border-slate-200">
        {/* Handle Bar */}
        <div className="pt-2.5 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Item Header & Info */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
          <div className="pr-2 truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {item.name}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
              <span>Purana Stock: <strong className="text-slate-800">{item.stock} {item.unit || ''}</strong></span>
              <span>•</span>
              <span>Reorder Limit: <strong className="text-rose-600">{item.reorderThreshold}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 touch-active flex-shrink-0"
            aria-label="Radd Karein"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Stock Display with Zero Layout Shift */}
        <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Naya Stock Darj Karein:
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-800">
                {inputValue || '0'}
              </span>
              {item.unit && (
                <span className="text-sm font-bold text-slate-500">
                  {item.unit}
                </span>
              )}
            </div>
          </div>

          {/* Quick Warning Badge if entered value is low */}
          {isStockLow && (
            <span className="text-[11px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-md border border-rose-200">
              ⚠️ Kam Maal (Reorder)
            </span>
          )}
        </div>

        {/* Quick Increment Chips (Thumb Zone) */}
        <div className="grid grid-cols-4 gap-2 px-3 pt-2.5 pb-1 bg-white">
          <button
            onClick={() => handleQuickAdd(-1)}
            className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center text-sm touch-active border border-slate-200"
          >
            <Minus className="w-3.5 h-3.5 mr-1" /> 1
          </button>
          <button
            onClick={() => handleQuickAdd(1)}
            className="h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center text-sm touch-active border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> 1
          </button>
          <button
            onClick={() => handleQuickAdd(5)}
            className="h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center text-sm touch-active border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> 5
          </button>
          <button
            onClick={() => handleQuickAdd(10)}
            className="h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center text-sm touch-active border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> 10
          </button>
        </div>

        {/* Custom Numpad Grid (0-9, Decimal, Backspace) - FAT FINGER TARGETS (h-14) */}
        <div className="p-3 grid grid-cols-3 gap-2.5 bg-white">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 min-h-14 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-2xl font-bold rounded-2xl flex items-center justify-center shadow-sm touch-active border border-slate-200/80 transition-transform"
            >
              {digit}
            </button>
          ))}

          {/* Decimal Button */}
          <button
            onClick={() => handleDigit('.')}
            className="h-14 min-h-14 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 text-3xl font-extrabold rounded-2xl flex items-center justify-center shadow-sm touch-active border border-slate-300"
            aria-label="Decimal"
          >
            .
          </button>

          {/* Zero Button */}
          <button
            onClick={() => handleDigit('0')}
            className="h-14 min-h-14 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-2xl font-bold rounded-2xl flex items-center justify-center shadow-sm touch-active border border-slate-200/80"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            className="h-14 min-h-14 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 font-bold rounded-2xl flex items-center justify-center shadow-sm touch-active border border-rose-200"
            aria-label="Mitao (Backspace)"
          >
            <Delete className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Primary Save Action Button (Fat h-14 Thumb Zone) */}
        <div className="p-3 pt-0 bg-white grid grid-cols-4 gap-2">
          <button
            onClick={handleClear}
            className="col-span-1 h-14 min-h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-2xl flex flex-col items-center justify-center touch-active border border-slate-300"
          >
            <RotateCcw className="w-4 h-4 mb-0.5" />
            <span>Saaf</span>
          </button>

          <button
            onClick={handleSave}
            className="col-span-3 h-14 min-h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-base font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 touch-active"
          >
            <Check className="w-6 h-6 stroke-[2.5]" />
            <span className="tracking-wide">Sale Log Karein</span>
          </button>
        </div>
      </div>
    </div>
  );
};
