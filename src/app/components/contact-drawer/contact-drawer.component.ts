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

status = '';
loading = false;

async submit(): Promise<void> {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // Build payload from the reactive form
  const payload = {
    access_key: 'aba8e28f-e7a9-4afc-a462-f653d7c7c507', // Web3Forms key
    ...this.form.getRawValue(),                         // firstName, lastName, email, message
    // Optional extras Web3Forms supports:
    // from_name: 'Visionary Lodges',
    // subject: `New inquiry from ${this.form.value.firstName} ${this.form.value.lastName}`,
  };

  this.status = 'Please wait…';
  this.loading = true;

  try {
    const resp = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await resp.json() as { message?: string; };
    if (resp.ok) {
      this.status = 'Form submitted successfully';
      this.form.reset();
      this.close();
      setTimeout(() => (this.status = ''), 3000);
    } else {
      console.error('Submit error:', resp, data);
      this.status = data?.message ?? 'Submission failed';
    }
  } catch (err) {
    console.error('Network/Runtime error:', err);
    this.status = 'Something went wrong!';
  } finally {
    this.loading = false;
  }
}


}
