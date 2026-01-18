import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../hooks/useLanguage';
import { Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-zinc-950 py-16 mt-0 border-t border-zinc-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand & Support */}
          <div className="space-y-4">
            <div
              className="cursor-pointer group w-fit"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Image
                src="/images/logo/svg/logo-icon.svg"
                alt="Suggestiss"
                width={64}
                height={64}
                className="h-16 w-16 transform transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {locale === 'pt-BR' ? 'Redes Sociais' : 'Social Media'}
                </span>
                <a
                  href="https://www.instagram.com/suggestiss.app?igsh=Z3h4aTEzdTd6aDl4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors duration-200 w-fit"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {locale === 'pt-BR' ? 'Contato' : 'Contact'}
                </span>
                <a
                  href="mailto:contact@suggestiss.com"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors duration-200 inline-flex items-center gap-2 w-fit"
                >
                  <Mail size={16} className="text-zinc-500" />
                  contact@suggestiss.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal & Copyright */}
          <div className="flex flex-col items-start md:items-end">
             <div className="flex gap-6 mb-4">
                 <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">{t.footer.terms}</a>
                 <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">{t.footer.privacy}</a>
             </div>
             <p className="text-xs text-zinc-500">{t.footer.copyright}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900">
           <p className="text-xs text-zinc-500 leading-relaxed">
             <span className="font-medium">{t.footer.disclaimerTitle}</span> {t.footer.disclaimerText}
           </p>
        </div>
      </div>
    </footer>
  );
};