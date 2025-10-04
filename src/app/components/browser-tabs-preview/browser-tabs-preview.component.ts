// src/app/components/browser-tabs-preview/browser-tabs-preview.component.ts
import { Component, Input, signal, computed, HostListener, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export type PreviewItem = {
  id: string; label: string; poster: string;
  video?: string; image?: string; href?: string; alt?: string;
};

@Component({
  selector: 'app-browser-tabs-preview',
  standalone: true,
  imports: [CommonModule],                          // for *ngIf/*ngFor
  templateUrl: './browser-tabs-preview.component.html',
  styleUrls: ['./browser-tabs-preview.component.scss'], // make sure this file exists (see Step 3)
})
export class BrowserTabsPreviewComponent {
  @Input({ required: true }) items: PreviewItem[] = [];
  @Input() title = 'Live preview';
  @Input() height = 360;

  activeId = signal<string>('');
  activeIndex = computed(() => Math.max(0, this.items.findIndex(i => i.id === this.activeId())));

  prefersReducedMotion = false;
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    // ✅ NO window usage here — just compute the flag
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.activeId() && this.items.length) this.activeId.set(this.items[0].id);

    // ✅ Only touch window in ngOnInit when we're in the browser
    if (this.isBrowser) {
      try {
        // Optional chaining avoids evaluating window in weird builds
        this.prefersReducedMotion = !!(globalThis as any)?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      } catch { /* ignore */ }
    }
  }

  select(id: string) { this.activeId.set(id); }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const len = this.items.length;
    let idx = this.activeIndex();
    if (e.key === 'ArrowRight') idx = (idx + 1) % len;
    if (e.key === 'ArrowLeft')  idx = (idx - 1 + len) % len;
    if (e.key === 'Home')       idx = 0;
    if (e.key === 'End')        idx = len - 1;
    this.activeId.set(this.items[idx].id);
  }
  forcePlay(event: Event) {
  const video = event.target as HTMLVideoElement;
  if (video && video.paused) {
    video.play().catch(() => {});
  }
}

}
