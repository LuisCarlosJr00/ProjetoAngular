import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NewsBenefitsComponent } from '../news-benefits/news-benefits.component';
import { ExploreBrechoComponent } from '../explore-brecho/explore-brecho.component';
import { CommunityTestimonialsComponent } from '../community-testimonials/community-testimonials.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NewsBenefitsComponent, ExploreBrechoComponent, CommunityTestimonialsComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private _listeners: Array<{ el: Element; type: string; handler: EventListenerOrEventListenerObject }> = [];
  private _carouselInterval: number | undefined;

  ngAfterViewInit(): void {
    // Navigation mobile toggle
    const navigationToggle = document.getElementById('navigation-toggle');
    const navigationMobileMenu = document.getElementById('navigation-mobile-menu');

    if (navigationToggle && navigationMobileMenu) {
      const toggleHandler = () => {
        const isExpanded = navigationToggle.getAttribute('aria-expanded') === 'true';
        navigationToggle.setAttribute('aria-expanded', (!isExpanded).toString());
        navigationMobileMenu.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
      };
      navigationToggle.addEventListener('click', toggleHandler);
      this._listeners.push({ el: navigationToggle, type: 'click', handler: toggleHandler });

      const mobileOverlay = navigationMobileMenu.querySelector('.navigation-mobile-overlay');
      if (mobileOverlay) {
        const overlayHandler = () => {
          navigationToggle.setAttribute('aria-expanded', 'false');
          navigationMobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        };
        mobileOverlay.addEventListener('click', overlayHandler);
        this._listeners.push({ el: mobileOverlay, type: 'click', handler: overlayHandler });
      }
    }

    // Simple carousel behavior
    const slides = Array.from(document.querySelectorAll<HTMLElement>('.carousel-slide'));
    const indicators = Array.from(document.querySelectorAll<HTMLElement>('.indicator'));
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');

    if (slides.length) {
      let current = slides.findIndex(s => s.classList.contains('active'));
      if (current < 0) current = 0;

      const goTo = (index: number) => {
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));
        const idx = ((index % slides.length) + slides.length) % slides.length;
        slides[idx].classList.add('active');
        if (indicators[idx]) indicators[idx].classList.add('active');
        current = idx;
      };

      const next = () => goTo(current + 1);
      const prev = () => goTo(current - 1);

      if (nextBtn) {
        nextBtn.addEventListener('click', next);
        this._listeners.push({ el: nextBtn, type: 'click', handler: next });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', prev);
        this._listeners.push({ el: prevBtn, type: 'click', handler: prev });
      }

      indicators.forEach((ind, idx) => {
        const indHandler = () => goTo(idx);
        ind.addEventListener('click', indHandler);
        this._listeners.push({ el: ind, type: 'click', handler: indHandler });
      });

      // Auto-advance
      this._carouselInterval = window.setInterval(next, 6000) as unknown as number;
    }
  }

  ngOnDestroy(): void {
    this._listeners.forEach(l => {
      try { l.el.removeEventListener(l.type, l.handler); } catch (e) { /* ignore */ }
    });
    if (this._carouselInterval) {
      clearInterval(this._carouselInterval);
    }
  }
}
