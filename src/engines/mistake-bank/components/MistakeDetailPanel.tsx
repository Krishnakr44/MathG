'use client';

/**
 * MathG — Mistake Detail Panel
 * Shows full mistake info when teacher triggers one
 */

import { useMistakeBankOptional } from '../MistakeBankContext';
import { getLocalizedText } from '../schema';
import type { Mistake, LocaleCode } from '../types';

export interface MistakeDetailPanelProps {
  mistake: Mistake | null;
  locale?: LocaleCode;
  className?: string;
}

export function MistakeDetailPanel({ mistake, locale = 'en', className = '' }: MistakeDetailPanelProps) {
  const bank = useMistakeBankOptional();
  const loc = bank?.locale ?? locale;

  if (!mistake) return null;

  const t = (v: string | import('../schema').LocalizedText) => getLocalizedText(v, loc);

  return (
    <div className={`border rounded-lg p-4 bg-amber-50 border-amber-200 ${className}`}>
      <h3 className="font-semibold text-amber-900 mb-2">{t(mistake.concept)}</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-amber-800">Student&apos;s wrong answer:</span>
          <p className="text-gray-700 mt-0.5">{t(mistake.studentWrongAnswer)}</p>
        </div>
        <div>
          <span className="font-medium text-amber-800">Why they think it&apos;s correct:</span>
          <p className="text-gray-700 mt-0.5">{t(mistake.studentReasoning)}</p>
        </div>
        <div>
          <span className="font-medium text-green-800">Correct reasoning (teacher script):</span>
          <p className="text-gray-700 mt-0.5">{t(mistake.correctReasoning)}</p>
        </div>
        <div>
          <span className="font-medium text-blue-800">Exam tip:</span>
          <p className="text-gray-700 mt-0.5">{t(mistake.examTip)}</p>
        </div>
      </div>
    </div>
  );
}
