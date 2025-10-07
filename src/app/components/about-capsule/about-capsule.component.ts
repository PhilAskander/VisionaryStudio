import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDrawerComponent } from '../contact-drawer/contact-drawer.component';

type PackageTier = {
  id: 'launch' | 'growth' | 'scale';
  name: string;
  tagline: string;
  timeline: string;
  startIn: string;
  idealFor: string;
  highlights: string[];
  includes: string[];
  deliverables: string[];
};

@Component({
  selector: 'app-about-capsule',
  standalone: true,
  imports: [CommonModule, ContactDrawerComponent],
  templateUrl: './about-capsule.component.html',
  styleUrls: ['./about-capsule.component.scss']
})
export class AboutCapsuleComponent {
tiers: PackageTier[] = [
  {
    id: 'launch',
    name: 'Basic',
    tagline: 'Single-page, polished info presence.',
    timeline: '7–10 days',
    startIn: 'Inquire Basic Plan',
    idealFor: 'Solo founders & small teams needing a fast, professional one-pager.',
    highlights: ['Single page', 'A11y baseline', 'Perf budget'],
    includes: [
      'One-page information site (hero, value, features, CTA)',
      'Design system lite (tokens + base components)',
      'Basic contact (mailto or simple form)'
    ],
    deliverables: [
      'Responsive Angular one-pager with CI preview',
      'Design tokens (color, type, spacing) + core components',
      'Accessible navigation & keyboard handling',
      'Basic SEO (meta, Open Graph) & analytics (page/event)',
      'Lighthouse baseline perf/a11y pass',
      'Production deploy + handoff doc'
    ]
  },
  {
    id: 'growth',
    name: 'Standard',
    tagline: '1–3 pages with API integrations.',
    timeline: '3–4 weeks',
    startIn: 'Inquire Standard Plan',
    idealFor: 'Teams ready for richer content and live data.',
    highlights: ['1–3 pages', 'API integrations', 'Forms/Email'],
    includes: [
      '1–3 pages (e.g., Home + 1–2 detail pages)',
      'Typed API integrations (read-only or light write)',
      'Validated forms + email automation'
    ],
    deliverables: [
      'Typed API service layer (HttpClient) with error UX & retries',
      'State/caching for API data (RxJS signals/observables)',
      'Form pipelines (Web3Forms/EmailJS/Zapier) with validation',
      'Analytics events & conversion goals',
      'Perf pass (optimize LCP/TTI on key routes)',
      'WCAG AA checks; screen-reader validation',
      'Staging + prod environments with rollback plan'
    ]
  },
  {
    id: 'scale',
    name: 'Premium',
    tagline: 'Database, APIs, auth, and observability.',
    timeline: '5–6 weeks',
    startIn: 'Inquire Premium Plan',
    idealFor: 'Products needing authenticated flows & full data stack.',
    highlights: ['Database', 'APIs', 'Auth', 'E2E tests'],
    includes: [
      'Custom database schema & migrations',
      'Full CRUD APIs (secure, typed)',
      'Auth & roles + protected areas',
      'Testing & monitoring'
    ],
    deliverables: [
      'Database design (schema, indexes, migrations) with ORM',
      'Secure REST/GraphQL APIs (CRUD) with validation & rate-limits',
      'Auth (email/OAuth), role-based access, protected routes',
      'Background jobs & webhooks as needed',
      'E2E tests (Cypress/Playwright) + unit coverage thresholds',
      'Perf & a11y budgets enforced in CI',
      'Observability dashboards (logs, metrics, uptime, errors)'
    ]
  }
];

}
