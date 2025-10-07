import { Component, Input, signal, computed, effect, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-about-capsule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-capsule.component.html',
  styleUrls: ['./about-capsule.component.scss']
})
export class AboutCapsuleComponent {
 
}