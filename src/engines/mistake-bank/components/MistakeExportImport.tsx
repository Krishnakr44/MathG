'use client';

/**
 * MathG — Mistake Pack Export/Import
 * Export per chapter, import from JSON
 */

import { useState } from 'react';
import { getAllMistakes, getMistakesByChapter } from '@/engines/mistake-bank/registry';
import { exportAsJson, importFromJson, applyImportedMistakes, cacheToStorage } from '@/engines/mistake-bank/storage';
import type { Mistake } from '@/engines/mistake-bank/schema';

export interface MistakeExportImportProps {
  moduleId?: string;
  className?: string;
}

export function MistakeExportImport({ moduleId = 'imported', className = '' }: MistakeExportImportProps) {
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExportAll = () => {
    const mistakes = getAllMistakes();
    const json = exportAsJson(mistakes);
    downloadJson(json, 'mathg-mistakes-all.json');
  };

  const handleExportChapter = (chapter: string) => {
    const mistakes = getMistakesByChapter(chapter);
    if (mistakes.length === 0) return;
    const json = exportAsJson(mistakes);
    const filename = `mathg-mistakes-${chapter.replace(/\s+/g, '-').toLowerCase()}.json`;
    downloadJson(json, filename);
  };

  const handleImport = () => {
    setImportError(null);
    setImportSuccess(false);
    const { mistakes, errors } = importFromJson(importText);
    if (errors.length > 0) {
      setImportError(errors.join('; '));
      return;
    }
    if (mistakes.length === 0) {
      setImportError('No valid mistakes in file');
      return;
    }
    applyImportedMistakes(mistakes, moduleId);
    cacheToStorage(mistakes, [moduleId]);
    setImportSuccess(true);
    setImportText('');
  };

  const chapters = [...new Set(getAllMistakes().map((m) => (typeof m.chapter === 'string' ? m.chapter : m.chapter.en)))];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-medium text-gray-700">Export / Import</h3>
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleExportAll}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Export all mistakes
        </button>
        {chapters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chapters.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => handleExportChapter(ch)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Export: {ch}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Import from JSON</label>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='Paste MistakePack JSON here...'
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono h-24"
        />
        <button
          type="button"
          onClick={handleImport}
          className="mt-2 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 rounded"
        >
          Import
        </button>
        {importError && <p className="text-sm text-red-600 mt-1">{importError}</p>}
        {importSuccess && <p className="text-sm text-green-600 mt-1">Imported successfully.</p>}
      </div>
    </div>
  );
}

function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
