import { Component, OnInit, OnDestroy, Inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-about-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-showcase.component.html',
  styleUrls: ['./about-showcase.component.scss'],
})
export class AboutShowcaseComponent implements OnInit, OnDestroy {
  // slides: 0 = Overview, 1 = Core stack, 2 = Availability

  services = [
  'Marketing sites & landing pages',
  'Full-stack web apps',
  'Design systems & component libraries',
  'CMS integrations (Sanity, Contentful)',
  'Payments, auth, dashboards',
  'Analytics & performance budgets',
];

stack = {
  frontend: ['Angular', 'RxJS', 'Signals', 'Tailwind'],
  backend:  ['Node', 'NestJS', 'Postgres', 'GraphQL'],
  infra:    ['Vercel', 'Firebase', 'AWS'],
  quality:  ['Lighthouse 95+', 'Playwright', 'Jest', 'Axe a11y'],
};

education = [
  { label: 'M.S. Computer Science', value: 'Northeastern University' },
];

delivery = [
  { label: 'Discovery', value: 'requirements & success metrics' },
  { label: 'Design',    value: 'wireframes → component API' },
  { label: 'Build',     value: 'tickets, commits, previews' },
  { label: 'QA & Perf', value: 'a11y, e2e, Lighthouse' },
  { label: 'Launch',    value: 'monitoring & handoff docs' },
];

timezone = 'ET (UTC−5)';
capacityLabel = 'Taking 1–2 new projects';
responseTime = '~24h';
  private total = 3;
  active = signal(0);
  dots = computed(() => Array.from({ length: this.total }, (_, i) => i));

  // runtime flags
  private isBrowser = false;
  prefersReducedMotion = false;

  // autoplay
  private timer: any = null;
  intervalMs = 5000;
  isPaused = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && typeof window !== 'undefined' && 'matchMedia' in window) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay() {
    if (!this.isBrowser || this.prefersReducedMotion) return;
    this.stopAutoplay();
    this.timer = setInterval(() => this.next(), this.intervalMs);
  }

  stopAutoplay() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  next() { this.active.update(v => (v + 1) % this.total); }
  prev() { this.active.update(v => (v - 1 + this.total) % this.total); }
  go(i: number) { this.active.set(i % this.total); }

  onMouseEnter() { this.isPaused = true; this.stopAutoplay(); }
  onMouseLeave() { this.isPaused = false; this.startAutoplay(); }

  // keyboard: ← → Home End, Space toggles pause
  @HostListener('keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const k = e.key;
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', ' '].includes(k)) e.preventDefault();
    if (k === 'ArrowRight') this.next();
    if (k === 'ArrowLeft')  this.prev();
    if (k === 'Home')       this.go(0);
    if (k === 'End')        this.go(this.total - 1);
    if (k === ' ')          this.isPaused ? this.startAutoplay() : this.stopAutoplay(), this.isPaused = !this.isPaused;
  }
}
