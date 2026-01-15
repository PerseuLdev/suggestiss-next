import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm animate-pulse flex flex-col h-full">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-6">
       <div className="h-5 bg-zinc-200 rounded w-16" /> {/* Badge */}
       <div className="h-4 bg-zinc-200 rounded w-8" />  {/* Rating */}
    </div>

    {/* Title Skeleton */}
    <div className="space-y-2 mb-6">
        <div className="h-5 bg-zinc-200 rounded w-full" />
        <div className="h-5 bg-zinc-200 rounded w-2/3" />
    </div>

    {/* Reasoning Box Skeleton */}
    <div className="flex-grow p-4 bg-zinc-50 rounded-lg mb-6 border border-zinc-100">
        <div className="h-3 bg-zinc-200 rounded w-full mb-2" />
        <div className="h-3 bg-zinc-200 rounded w-full mb-2" />
        <div className="h-3 bg-zinc-200 rounded w-3/4" />
    </div>

    {/* Footer Skeleton */}
    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
        <div className="space-y-1">
            <div className="h-3 bg-zinc-200 rounded w-16" />
            <div className="h-6 bg-zinc-200 rounded w-24" />
        </div>
        <div className="h-9 bg-zinc-200 rounded w-24" />
    </div>
  </div>
);

const LoadingMessage = () => {
  const { t } = useLanguage();
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Change message after fade out completes
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % t.loading.messages.length);
        // Fade in
        setIsVisible(true);
      }, 300); // Match transition duration
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [t.loading.messages.length]);

  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-50 border border-zinc-200 rounded-full shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }} />
          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }} />
        </div>
        <p
          className={`text-sm font-medium text-zinc-700 transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {t.loading.messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = () => {
  return (
    <div>
      <LoadingMessage />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};