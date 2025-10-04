import {
  Directive, ElementRef, Input, AfterViewInit, OnDestroy, NgZone, Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({ selector: '[appTilt]', standalone: true })
export class TiltDirective implements AfterViewInit, OnDestroy {
  @Input() tiltMax = 8;
  @Input() tiltPerspective = 900;
  @Input() tiltScale = 1.01;
  @Input() tiltChildSelector?: string;

  private host!: HTMLElement;
  private target!: HTMLElement;
  private rafId = 0;
  private pending = false;
  private lastX = 0;
  private lastY = 0;
  private isBrowser = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;               // SSR guard

    this.host = this.el.nativeElement;
    this.target = this.tiltChildSelector
      ? (this.host.querySelector(this.tiltChildSelector) as HTMLElement) || this.host
      : this.host;

    this.target.style.willChange = 'transform';
    this.target.style.transformStyle = 'preserve-3d';

    this.zone.runOutsideAngular(() => {
      this.host.addEventListener('pointermove', this.onMove, { passive: true });
      this.host.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.host?.removeEventListener('pointermove', this.onMove as any);
    this.host?.removeEventListener('pointerleave', this.onLeave as any);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private onMove = (e: PointerEvent) => {
    const r = this.host.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    this.lastX = Math.max(-1, Math.min(1, dx));
    this.lastY = Math.max(-1, Math.min(1, dy));
    this.scheduleFrame(false);
  };

  private onLeave = () => this.scheduleFrame(true);

  private scheduleFrame(reset: boolean) {
    if (this.pending) return;
    this.pending = true;
    this.rafId = requestAnimationFrame(() => {
      this.pending = false;

      const max = this.tiltMax;
      const rotX = reset ? 0 : (-this.lastY * max);
      const rotY = reset ? 0 : ( this.lastX * max);
      const scale = reset ? 1 : this.tiltScale;

      this.target.style.transition = reset ? 'transform 140ms ease' : 'transform 0ms';
      this.target.style.transform =
        `perspective(${this.tiltPerspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    });
  }
}
