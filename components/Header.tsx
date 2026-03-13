'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Menu, X, Phone, FileText } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const nav = {
  pt: [
    { label: 'Reservas', href: '/reservations' },
    { label: 'Contacto', href: '/contact' }
  ],
  en: [
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' }
  ],
  fr: [
    { label: 'Réservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' }
  ]
};

const menuPdfLabel = { pt: 'Ver Menu', en: 'Open Menu', fr: 'Voir le Menu' };
const reserveLabel = { pt: 'Reservar', en: 'Reserve', fr: 'Réserver' };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const { scrollY } = useScroll();

  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.98)']
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [locale]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = nav[locale as keyof typeof nav] || nav.pt;
  const pdfLabel = menuPdfLabel[locale as keyof typeof menuPdfLabel] || menuPdfLabel.pt;
  const ctaLabel = reserveLabel[locale as keyof typeof reserveLabel] || reserveLabel.pt;

  return (
    <motion.header
      style={{ backgroundColor: headerBg }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/5 shadow-2xl backdrop-blur-xl' : ''
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between lg:h-24">
          <Link href={`/${locale}`} className="relative z-[60] group">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.04, rotate: 4 }}
                transition={{ duration: 0.28 }}
                className="relative h-12 w-12 lg:h-14 lg:w-14"
              >
                <Image
                  src="/logo.png"
                  alt="Latina Grill"
                  fill
                  className="object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.42)]"
                  priority
                />
              </motion.div>

              <span className="font-serif text-xl font-bold tracking-tight text-white lg:text-2xl">
                Latina Grill
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="group relative text-sm font-medium uppercase tracking-[0.2em] text-white/72 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-red-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            <a
              href="/latina-grill-menu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-white/60 transition-colors duration-200 hover:text-white"
              aria-label={pdfLabel}
            >
              <FileText className="h-3.5 w-3.5 text-white/35 transition-colors group-hover:text-white/70" />
              <span>{pdfLabel}</span>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/30 transition-all duration-300 group-hover:w-full" />
            </a>

            <div className="mx-1 h-4 w-px bg-white/15" />

            <LanguageSelector />

            <a
              href="tel:+351968707515"
              className="inline-flex items-center gap-2 border border-red-500 bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-red-400 hover:bg-red-600 hover:shadow-[0_12px_30px_rgba(180,20,20,0.28)]"
            >
              <Phone className="h-4 w-4" />
              {ctaLabel}
            </a>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSelector />

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="relative z-[60] rounded-full border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/72 backdrop-blur-sm lg:hidden"
            aria-label="Close menu overlay"
          />

          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full z-50 border-t border-white/10 bg-black/95 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-5 px-4 py-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/5 py-1 text-lg font-medium uppercase tracking-[0.16em] text-white"
                >
                  {item.label}
                </Link>
              ))}

              <a
                href="/latina-grill-menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 border-b border-white/5 py-1 text-lg font-medium uppercase tracking-[0.16em] text-white/78"
              >
                <FileText className="h-5 w-5 text-white/45" />
                {pdfLabel}
              </a>

              <a
                href="tel:+351968707515"
                className="mt-2 flex items-center justify-center gap-2 border border-red-500 bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                <Phone className="h-4 w-4" />
                {ctaLabel}
              </a>
            </nav>
          </motion.div>
        </>
      )}
    </motion.header>
  );
}
