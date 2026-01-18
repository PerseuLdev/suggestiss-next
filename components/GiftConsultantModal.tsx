import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { generateGiftSuggestions } from '../services/geminiService';
import { useLanguage } from '../hooks/useLanguage';
import { ProductGridSkeleton } from './LoadingSkeleton';
import { useAnalytics } from '../hooks/useAnalytics';

interface GiftConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftConsultantModal: React.FC<GiftConsultantModalProps> = ({ isOpen, onClose }) => {
  const { locale, amazonConfig } = useLanguage();
  const { trackEvent } = useAnalytics();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Track gift consultant search
    trackEvent('gift_search', {
      query: description,
      query_length: description.length,
      locale,
    });

    setLoading(true);
    setHasSearched(true);
    // Always fetch page 1 for the modal quick search
    const products = await generateGiftSuggestions(description, locale, amazonConfig, undefined, undefined, 1);

    // Track search results
    trackEvent('gift_search_completed', {
      query: description,
      results_count: products.length,
      locale,
    });

    setResults(products);
    setLoading(false);
  };

  const handleReset = () => {
    setResults([]);
    setHasSearched(false);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 text-zinc-900 p-2.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Consultor de Presentes IA</h2>
              <p className="text-sm text-zinc-500">Descreva a pessoa e receba sugestões perfeitas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50">
          {!hasSearched && (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
                 <div className="text-left space-y-3">
                    <label htmlFor="gift-desc" className="block text-sm font-medium text-zinc-900">Para quem é o presente?</label>
                    <textarea
                        id="gift-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Meu namorado de 25 anos que ama café, jogos retrô e design minimalista..."
                        className="w-full h-32 px-4 py-3 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:border-zinc-300 focus:shadow-[0_1px_3px_rgba(0,0,0,0.08)] resize-none text-zinc-900 text-sm bg-white outline-none transition-all duration-200"
                        autoFocus
                    />
                 </div>
                 <button
                    type="submit"
                    disabled={!description.trim() || loading}
                    className="w-full px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)] hover:bg-zinc-800 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.10)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                 >
                    {loading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Analisando perfil...
                        </>
                    ) : (
                        <>
                           <span>✨</span> Encontrar Presentes
                        </>
                    )}
                 </button>
              </form>
            </div>
          )}

          {hasSearched && loading && (
             <ProductGridSkeleton />
          )}

          {hasSearched && !loading && results.length > 0 && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-zinc-900">Sugestões Selecionadas</h3>
                    <button onClick={handleReset} className="text-sm text-zinc-900 hover:text-zinc-700 font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors duration-200">Nova Consulta</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {results.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          position={index + 1}
                          category="gift_consultant_modal"
                          listType="gift_consultant"
                        />
                    ))}
                </div>
             </div>
          )}

          {hasSearched && !loading && results.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-zinc-500 text-sm mb-4">Não conseguimos encontrar sugestões no momento.</p>
                  <button onClick={handleReset} className="text-sm text-zinc-900 hover:text-zinc-700 font-medium px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors duration-200">Tentar novamente</button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};