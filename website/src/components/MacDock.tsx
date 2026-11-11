import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue
} from 'framer-motion';
import {
  Compass,
  Layers,
  Database,
  ShieldCheck,
  FlaskConical,
  BarChart3,
  Sparkles,
  Users,
  Activity,
  MessageSquareQuote,
  FileCheck2,
  Terminal,
  FileSpreadsheet,
  DownloadCloud,
  FileText,
  Github
} from 'lucide-react';

export interface DockItemData {
  label: string;
  href: string;
  icon: React.ElementType;
  isExternal?: boolean;
}

export const DOCK_ITEMS: DockItemData[] = [
  { label: 'Overview', href: '#hero', icon: Compass },
  { label: 'Approach', href: '#approach', icon: Layers },
  { label: 'Dataset', href: '#dataset', icon: Database },
  { label: 'Leakage Gate', href: '#leakage-design', icon: ShieldCheck },
  { label: 'Experiments', href: '#experimental-design', icon: FlaskConical },
  { label: 'Results', href: '#results', icon: BarChart3 },
  { label: 'Explainability', href: '#explainability', icon: Sparkles },
  { label: 'Subgroups', href: '#subgroups', icon: Users },
  { label: 'Robustness', href: '#robustness', icon: Activity },
  { label: 'Discussion', href: '#discussion', icon: MessageSquareQuote },
  { label: 'Claims', href: '#claims', icon: FileCheck2 },
  { label: 'Reproduction', href: '#reproduction', icon: Terminal },
  { label: 'Supplement', href: '#supplementary', icon: FileSpreadsheet },
  { label: 'Resources', href: '#resources', icon: DownloadCloud },
  // External group after divider
  { label: 'PDF', href: '/paper.pdf', icon: FileText, isExternal: true },
  { label: 'GitHub', href: 'https://github.com/ugesh13/IEEE_Research_Web', icon: Github, isExternal: true },
];

interface DockTileProps {
  item: DockItemData;
  idx: number;
  mouseX: MotionValue<number>;
  activeId: string;
  onItemClick: (e: React.MouseEvent, item: DockItemData, idx: number) => void;
  onKeyDown: (e: React.KeyboardEvent, idx: number) => void;
  isBouncing: boolean;
  prefersReducedMotion: boolean;
}

const DockTile: React.FC<DockTileProps> = ({
  item,
  idx,
  mouseX,
  activeId,
  onItemClick,
  onKeyDown,
  isBouncing,
  prefersReducedMotion
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate distance from mouse pointer to item center
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Cosine falloff magnification curve (max scale ~ 1.55x)
  const widthSync = useTransform(distance, [-140, 0, 140], [42, 64, 42]);
  const width = useSpring(widthSync, {
    stiffness: 300,
    damping: 20
  });

  const Icon = item.icon;
  const targetId = item.href.replace('#', '');
  const isActive = !item.isExternal && activeId === targetId;

  const resolvedWidth = prefersReducedMotion ? 42 : width;

  return (
    <div className="relative flex flex-col items-center group">
      {/* Tooltip Pill */}
      {hovered && (
        <div
          role="tooltip"
          className="absolute -top-10 px-2.5 py-1 rounded-md text-[11px] font-sans font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl whitespace-nowrap pointer-events-none z-50 animate-in fade-in zoom-in-95"
        >
          {item.label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
        </div>
      )}

      {/* Dock Item Button Tile */}
      <motion.a
        ref={ref}
        href={item.href}
        data-dock-item
        data-label={item.label}
        aria-label={item.label}
        style={{ width: resolvedWidth, height: resolvedWidth }}
        target={item.isExternal ? '_blank' : undefined}
        rel={item.isExternal ? 'noopener noreferrer' : undefined}
        onClick={(e) => onItemClick(e, item, idx)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => onKeyDown(e, idx)}
        animate={isBouncing && !prefersReducedMotion ? { y: [0, -14, 0, -6, 0] } : { y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Icon
          className={`w-5 h-5 transition-colors ${
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-300'
          }`}
        />

        {/* Active section dot */}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400 shadow-xs"
          />
        )}
      </motion.a>
    </div>
  );
};

export const MacDock: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('hero');
  const [bouncingIdx, setBouncingIdx] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mouseX = useMotionValue(Infinity);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Scroll-spy to detect active section
  useEffect(() => {
    const sectionIds = DOCK_ITEMS.filter((i) => !i.isExternal).map((i) => i.href.replace('#', ''));
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveId(sectionIds[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent, item: DockItemData, idx: number) => {
    if (item.isExternal) return;
    e.preventDefault();
    setBouncingIdx(idx);
    setTimeout(() => setBouncingIdx(null), 500);

    const targetId = item.href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
      history.pushState(null, '', item.href);
      setActiveId(targetId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % DOCK_ITEMS.length;
      const el = dockRef.current?.querySelectorAll<HTMLElement>('[data-dock-item]')[next];
      el?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + DOCK_ITEMS.length) % DOCK_ITEMS.length;
      const el = dockRef.current?.querySelectorAll<HTMLElement>('[data-dock-item]')[prev];
      el?.focus();
    }
  };

  return (
    <nav
      aria-label="Mac OS Dock Navigation"
      className="dock-container fixed bottom-3 left-0 right-0 z-40 flex justify-center px-2 pointer-events-none"
    >
      <div
        ref={dockRef}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex items-end gap-1.5 p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl max-w-[98vw] overflow-x-auto md:overflow-visible scrollbar-none"
        style={{
          boxShadow: '0 20px 40px -6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.7)'
        }}
      >
        {DOCK_ITEMS.map((item, idx) => {
          const isDivider = idx === 14;

          return (
            <React.Fragment key={item.label}>
              {isDivider && (
                <div
                  aria-hidden="true"
                  className="w-[1px] h-8 bg-slate-300 dark:bg-slate-700 mx-1 self-center"
                />
              )}

              <DockTile
                item={item}
                idx={idx}
                mouseX={mouseX}
                activeId={activeId}
                onItemClick={handleClick}
                onKeyDown={handleKeyDown}
                isBouncing={bouncingIdx === idx}
                prefersReducedMotion={prefersReducedMotion}
              />
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
