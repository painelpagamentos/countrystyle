/* Country Style - runtime do tema Flex (drawer, adbar, slideshow) */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {
    /* Modais/drawer do tema (menu mobile) */
    var overlay = document.querySelector('.js-menu-overlay');
    function openModal(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.classList.add('show');
      if (overlay) overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
    function closeModals() {
      document.querySelectorAll('.js-fullscreen-modal.show, [id].show').forEach(function (el) {
        if (el.classList.contains('show')) el.classList.remove('show');
      });
      if (overlay) overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
    document.addEventListener('click', function (ev) {
      var opener = ev.target.closest ? ev.target.closest('.js-modal-open') : null;
      if (opener) {
        ev.preventDefault();
        var sel = opener.getAttribute('data-toggle');
        if (sel) openModal(sel);
        return;
      }
      var closer = ev.target.closest ? ev.target.closest('.js-modal-close') : null;
      if (closer) { ev.preventDefault(); closeModals(); return; }
      if (overlay && ev.target === overlay) { closeModals(); return; }
    });

    /* Adbar rotativa */
    var adSlides = document.querySelectorAll('.js-swiper-adbar .swiper-slide');
    if (adSlides.length > 1) {
      var adIdx = 0;
      setInterval(function () {
        adSlides[adIdx].classList.remove('adbar-active');
        adIdx = (adIdx + 1) % adSlides.length;
        adSlides[adIdx].classList.add('adbar-active');
      }, 4000);
    }

    /* Carrossel de categorias da home */
    document.querySelectorAll('.js-swiper-categories').forEach(function (car) {
      var track = car.querySelector('.js-cats-track');
      if (!track) return;
      var prev = document.querySelector('.js-cats-prev');
      var next = document.querySelector('.js-cats-next');
      function page() {
        return Math.max(track.clientWidth * 0.5, 200);
      }
      function updateArrows() {
        if (prev) prev.classList.toggle('swiper-button-disabled', track.scrollLeft <= 2);
        if (next) next.classList.toggle('swiper-button-disabled', track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
      }
      if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); track.scrollBy({ left: -page(), behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function (e) { e.preventDefault(); track.scrollBy({ left: page(), behavior: 'smooth' }); });
      track.addEventListener('scroll', updateArrows, { passive: true });
      updateArrows();
    });

    /* Orientação da imagem do card (igual ao JS do tema live):
       retrato -> img-portrait (altura 100%), paisagem -> img-landscape (largura 100%, centralizada) */
    document.querySelectorAll('.js-item-image').forEach(function (img) {
      function classify() {
        if (!img.naturalWidth || img.classList.contains('img-portrait') || img.classList.contains('img-landscape')) return;
        img.classList.add(img.naturalHeight > img.naturalWidth ? 'img-portrait' : 'img-landscape');
      }
      if (img.complete && img.naturalWidth) classify();
      else img.addEventListener('load', classify);
    });

    /* Slideshow da home (fade) */
    document.querySelectorAll('.js-home-slider').forEach(function (slider) {
      var slides = slider.querySelectorAll('.home-slide');
      if (!slides.length) return;
      var idx = 0;
      function go(n) {
        slides[idx].classList.remove('active');
        idx = (n + slides.length) % slides.length;
        slides[idx].classList.add('active');
      }
      var prev = slider.querySelector('.home-slider-prev');
      var next = slider.querySelector('.home-slider-next');
      if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); go(idx - 1); });
      if (next) next.addEventListener('click', function (e) { e.preventDefault(); go(idx + 1); });
      setInterval(function () { go(idx + 1); }, 5000);
    });
  });
})();
