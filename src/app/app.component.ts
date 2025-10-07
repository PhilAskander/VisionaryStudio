import {
  Component, HostBinding, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, Inject, NgZone, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TiltDirective } from './tilt.directive';
import { CommonModule } from '@angular/common';
import { BrowserTabsPreviewComponent } from './components/browser-tabs-preview/browser-tabs-preview.component';
import { AboutShowcaseComponent } from './components/about-showcase/about-showcase.component';
import { AboutCapsuleComponent } from './components/about-capsule/about-capsule.component';
import { ContactDrawerComponent } from './components/contact-drawer/contact-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TiltDirective, BrowserTabsPreviewComponent, CommonModule, AboutCapsuleComponent, ContactDrawerComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') hostClass = 'theme-dark';

  year = new Date().getFullYear();

  // mobile nav (unchanged)
  mobileOpen = false;
  toggleMobile() { this.mobileOpen = !this.mobileOpen; }
  closeMobile()  { this.mobileOpen = false; }

  @ViewChild('tw', { static: false }) tw!: ElementRef<HTMLElement>;

  private phrases = [
    'Welcome to Visionary Studio!',
    'Futuristic, fast, and finely crafted web experiences.',
    'Angular + TypeScript for high-performance apps.',
    'Beautiful, accessible, production-ready frontends.'
  ];



previewItems = [
  {
    id: 'barbershop',
    label: 'Barbershop',
    poster: 'assets/previews/barbershop-poster.jpg',
    video:  'assets/previews/barbershop-loop.mp4',
    alt:    'Barbershop booking flow demo'
  },
  {
    id: 'pt',
    label: 'Realtor',
    poster: 'assets/previews/realtor-loop.jpg',
    video:  'assets/previews/realtor-loop.mp4',
    alt:    'Realtor site demo'
  },
];

  // perf/loop state
  private isBrowser = false;
  private reduceMotion = false;
  private phraseIdx = 0;
  private charIdx = 0;
  private deleting = false;
  private nextAt = 0;
  private rafId = 0;

  // timings (tweak to taste)
  private typeMs = 42;
  private deleteMs = 28;
  private holdEnd = 1200;
  private holdStart = 350;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private zone: NgZone) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && 'matchMedia' in window) {
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
  }

  
ngAfterViewInit(): void {
  if (!this.isBrowser) return;

  // ---------- Typewriter ----------
  if (this.tw) {
    const el = this.tw.nativeElement;

    if (this.reduceMotion) {
      el.textContent = this.phrases[0];
    } else {
      this.zone.runOutsideAngular(() => {
        const step = (t: number) => {
          if (t >= this.nextAt) {
            const phrase = this.phrases[this.phraseIdx];

            if (!this.deleting) {
              this.charIdx = Math.min(this.charIdx + 1, phrase.length);
              el.textContent = phrase.slice(0, this.charIdx);
              this.nextAt = t + (this.charIdx === phrase.length ? this.holdEnd : this.typeMs);
              if (this.charIdx === phrase.length) this.deleting = true;
            } else {
              this.charIdx = Math.max(this.charIdx - 1, 0);
              el.textContent = phrase.slice(0, this.charIdx);
              if (this.charIdx === 0) {
                this.deleting = false;
                this.phraseIdx = (this.phraseIdx + 1) % this.phrases.length;
                this.nextAt = t + this.holdStart;
              } else {
                this.nextAt = t + this.deleteMs;
              }
            }
          }
          this.rafId = requestAnimationFrame(step);
        };

        this.nextAt = performance.now() + this.typeMs;
        this.rafId = requestAnimationFrame(step);
      });
    }
  }

  // ---------- Reveal on scroll ----------
  if (!('IntersectionObserver' in window)) return;

  const targets: Element[] = Array.from(
    document.querySelectorAll('.work-frame.reveal, .team')
  );

  if (targets.length === 0) return;

  const io = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const el = entry.target as HTMLElement;

      // Apply the appropriate class to each target
      if (el.classList.contains('team')) {
        el.classList.add('in-view');      // for your team fade-in
      } else if (el.classList.contains('reveal')) {
        el.classList.add('in');           // for your work-frame reveal
      }

      observer.unobserve(el);             // fire once per element
    }
  }, { threshold: 0.2 });

  targets.forEach(t => io.observe(t));
}


  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
