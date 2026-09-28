import React, { useState, useRef } from 'react';
import { SAMPLE_CASES } from '../data/sampleCases';
import { SampleCase } from '../types/detective';
import { 
  FileText, 
  UploadCloud, 
  Table, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface InputPanelProps {
  onAnalyze: (text: string, fileName?: string) => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, isLoading }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('rahul-loan');
  const [inputMode, setInputMode] = useState<'sample' | 'custom' | 'csv'>('sample');
  const [inputText, setInputText] = useState<string>(SAMPLE_CASES[0].content);
  const [fileName, setFileName] = useState<string>('rahul_personal_loan_form.txt');
  
  // CSV specific state
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [selectedCsvIndex, setSelectedCsvIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectCase = (caseItem: SampleCase) => {
    setSelectedCaseId(caseItem.id);
    setInputText(caseItem.content);
    setFileName(`${caseItem.id}.txt`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCsv(text, file.name);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        setInputMode('custom');
      };
      reader.readAsText(file);
    }
  };

  const parseCsv = (csvText: string, name: string) => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      setInputText(csvText);
      setInputMode('custom');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }

    setCsvHeaders(headers);
    setCsvRows(rows);
    setSelectedCsvIndex(0);
    setInputMode('csv');

    // Convert first row to document text
    updateTextFromCsvRow(rows[0], headers, name, 0);
  };

  const updateTextFromCsvRow = (row: Record<string, string>, headers: string[], name: string, rowIndex: number) => {
    const formatted = Object.entries(row)
      .map(([k, v]) => `${k}: ${v || '[MISSING / EMPTY]'}`)
      .join('\n');
    setInputText(`DATASET RECORD ROW #${rowIndex + 1} (${name})\n\n${formatted}`);
  };

  const handleSelectCsvRow = (index: number) => {
    setSelectedCsvIndex(index);
    if (csvRows[index]) {
      updateTextFromCsvRow(csvRows[index], csvHeaders, fileName, index);
    }
  };

  const loadSampleCsvDataset = () => {
    const demoCsv = `Applicant_ID,Full_Name,Age,Occupation,Monthly_Income,Requested_Loan_Amount,Employment_Years,Existing_EMIs,Credit_Score
APP-101,Rahul Sharma,25,Software Developer,45000,500000,,,
APP-102,Pooja Patel,31,Senior Product Manager,120000,1500000,6,15000,780
APP-103,Vikram Singhania,28,Freelance Graphic Designer,35000,300000,1,,
APP-104,Ananya Iyer,42,Government School Teacher,65000,800000,14,0,740`;
    parseCsv(demoCsv, 'loan_applicants_batch.csv');
  };

  const handleTriggerAnalysis = () => {
    if (!inputText.trim()) return;
    onAnalyze(inputText, fileName);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Case Intake & Document Staging</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage an application, clinical form, or CSV batch for multi-agent missing information detection.
          </p>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setInputMode('sample')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              inputMode === 'sample' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Benchmarks
          </button>
          <button
            onClick={() => setInputMode('custom')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              inputMode === 'custom' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Document
          </button>
          <button
            onClick={() => {
              if (csvRows.length === 0) {
                loadSampleCsvDataset();
              } else {
                setInputMode('csv');
              }
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              inputMode === 'csv' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CSV Dataset Batch
          </button>
        </div>
      </div>

      {/* Mode 1: Benchmark Cases Carousel */}
      {inputMode === 'sample' && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SAMPLE_CASES.map((caseItem) => {
              const isSelected = selectedCaseId === caseItem.id;
              return (
                <button
                  key={caseItem.id}
                  onClick={() => handleSelectCase(caseItem)}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                      : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-400">{caseItem.badge}</span>
                    <span>~{caseItem.expectedMissingCount} Gaps</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                    {caseItem.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {caseItem.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: CSV Dataset Explorer */}
      {inputMode === 'csv' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span className="font-medium text-slate-200">{fileName}</span>
              <span>·</span>
              <span>{csvRows.length} Records</span>
              <span>·</span>
              <span>{csvHeaders.length} Columns</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Upload Different CSV
            </button>
          </div>

          {/* CSV Table Preview */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 max-h-52">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 w-16">Select</th>
                  {csvHeaders.map((header) => (
                    <th key={header} className="py-2 px-3 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {csvRows.map((row, idx) => {
                  const isSelected = selectedCsvIndex === idx;
                  return (
                    <tr 
                      key={idx}
                      onClick={() => handleSelectCsvRow(idx)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-950/40 text-white font-medium' : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        <input
                          type="radio"
                          name="csv-row"
                          checked={isSelected}
                          onChange={() => handleSelectCsvRow(idx)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      {csvHeaders.map((header) => {
                        const val = row[header];
                        const isEmpty = !val || val.trim() === '';
                        return (
                          <td 
                            key={header} 
                            className={`py-2 px-3 whitespace-nowrap ${
                              isEmpty ? 'text-amber-400/80 italic font-mono' : ''
                            }`}
                          >
                            {isEmpty ? '[EMPTY]' : val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">
            Click on any record above to load its profile into the Detective pipeline. Notice how Record #1 (Rahul) has empty Employment and EMIs fields!
          </p>
        </div>
      )}

      {/* Document Content Workspace */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span>Document Content Staging</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Import File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.csv,.json,.doc,.docx,.pdf"
              className="hidden"
            />
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={7}
          placeholder="Paste application text, form intake, or clinical note here..."
          className="w-full rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed"
        />
      </div>

      {/* CTA Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Multi-Agent architecture: Data Completeness → Context → Risk → Verification → Coordinator</span>
        </div>

        <button
          onClick={handleTriggerAnalysis}
          disabled={isLoading || !inputText.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Running 4-Agent Pipeline...</span>
            </>
          ) : (
            <>
              <span>Deploy Detective Pipeline</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
