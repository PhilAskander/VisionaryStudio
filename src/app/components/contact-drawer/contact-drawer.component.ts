import {
  Component, HostListener, signal, effect, Inject, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-drawer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-drawer.component.html',
  styleUrls: ['./contact-drawer.component.scss']
})
export class ContactDrawerComponent {
  open = signal(false);
  private isBrowser = false;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName:  ['', [Validators.required, Validators.maxLength(50)]],
    email:     ['', [Validators.required, Validators.email]],
    message:   ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // lock body scroll when drawer is open
    effect(() => {
      if (!this.isBrowser) return;
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });
  }

  toggle() {
    this.open.update(v => !v);
  }

  close() {
    this.open.set(false);
  }

  // Close with ESC
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open()) this.close();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: replace with real submit (API/Email)
    const data = this.form.getRawValue();
    console.log('Contact form submit:', data);

    // Quick fallback: open a mailto draft
    const subject = encodeURIComponent('Project inquiry — Visionary Studios');
    const body = encodeURIComponent(
      `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\n${data.message}`
    );
    if (this.isBrowser) {
      window.open(`mailto:hello@visionarystudios.dev?subject=${subject}&body=${body}`, '_blank');
    }

    this.form.reset();
    this.close();
  }
}
