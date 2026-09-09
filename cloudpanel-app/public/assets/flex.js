/* Country Style - runtime do tema Flex (drawer, adbar, slideshow) */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {
    /* Modais/drawer do tema (menu mobile, carrinho) */
    var overlay = document.querySelector('.js-menu-overlay');
    function openModal(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.style.display = '';
      el.classList.add('show', 'modal-show');
      if (overlay) overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
    function closeModals() {
      document.querySelectorAll('.modal.show, .modal.modal-show').forEach(function (el) {
        el.classList.remove('show', 'modal-show');
        if (el.id === 'nav-hamburger') el.style.display = 'none';
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

    /* Accordion do menu mobile (subcategorias) */
    document.addEventListener('click', function (ev) {
      var link = ev.target.closest ? ev.target.closest('a.js-toggle-page-accordion') : null;
      if (!link) return;
      var li = link.closest('.nav-item');
      var sub = li ? li.querySelector(':scope > .js-pages-accordion') : null;
      if (!sub) return;
      ev.preventDefault();
      var isOpen = sub.style.display === 'block';
      sub.style.display = isOpen ? 'none' : 'block';
      var arrow = link.querySelector('.nav-list-arrow');
      if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
    });

    /* Carrinho mobile: cria o drawer #modal-cart sob demanda (o tema live
       carregava via AJAX; aqui geramos localmente com a fonte de verdade) */
    function buildCartModal() {
      if (document.querySelector('#modal-cart')) return;
      var modal = document.createElement('div');
      modal.id = 'modal-cart';
      modal.className = 'js-modal modal modal-cart modal-docked-small modal-right modal--md transition-slide modal-full';
      modal.style.display = 'none';
      modal.innerHTML =
        '<div class="modal-header"><div class="row no-gutters align-items-center">' +
        '<div class="col px-3 d-flex justify-content-between align-items-center"><strong>Meu carrinho</strong></div>' +
        '<div class="col-auto"><a class="js-modal-close modal-close"><svg class="icon-inline"><use xlink:href="#times"/></svg></a></div>' +
        '</div></div>' +
        '<div class="modal-body"><div id="modal-cart-items"></div>' +
        '<div class="px-3 py-3"><a href="/cart" class="btn btn-primary btn-block">Ver carrinho e finalizar</a></div></div>';
      document.body.appendChild(modal);
    }
    function renderCartModal() {
      var box = document.querySelector('#modal-cart-items');
      if (!box || !window.CSCart) return;
      var cart = window.CSCart.getCart();
      if (!cart.items.length) {
        box.innerHTML = '<p class="px-3 py-4 text-center">Seu carrinho está vazio.</p>';
        return;
      }
      var rows = cart.items.map(function (item) {
        var img = item.variant && item.variant.image ? '<img src="' + item.variant.image + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:10px">' : '';
        var price = ((item.variant && item.variant.price) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return '<div class="d-flex align-items-center px-3 py-2 border-bottom">' + img +
          '<div class="flex-grow-1"><div style="font-size:13px">' + (item.product ? item.product.title : '') + '</div>' +
          '<div style="font-size:12px;color:#888">' + (item.variant && item.variant.title ? item.variant.title : '') + '</div>' +
          '<div style="font-size:13px;font-weight:600">' + price + ' × ' + item.quantity + '</div></div></div>';
      }).join('');
      var total = (cart.total_price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      box.innerHTML = rows + '<div class="d-flex justify-content-between px-3 py-3"><strong>Total</strong><strong>' + total + '</strong></div>';
    }
    document.addEventListener('click', function (ev) {
      var cartOpener = ev.target.closest ? ev.target.closest('.js-toggle-cart') : null;
      if (!cartOpener) return;
      ev.preventDefault();
      buildCartModal();
      renderCartModal();
      openModal('#modal-cart');
    });
    window.addEventListener('cart-updated', function () {
      if (document.querySelector('#modal-cart.show, #modal-cart.modal-show')) renderCartModal();
    });

    /* Adbar rotativa com setas (igual ao tema live) */
    var adSlides = document.querySelectorAll('.js-swiper-adbar .swiper-slide');
    if (adSlides.length > 1) {
      var adIdx = 0;
      var adTimer = null;
      function adGo(n) {
        adSlides[adIdx].classList.remove('adbar-active');
        adIdx = (n + adSlides.length) % adSlides.length;
        adSlides[adIdx].classList.add('adbar-active');
      }
      function adRestart() {
        clearInterval(adTimer);
        adTimer = setInterval(function () { adGo(adIdx + 1); }, 4000);
      }
      var adPrevBtn = document.querySelector('.js-swiper-adbar-prev');
      var adNextBtn = document.querySelector('.js-swiper-adbar-next');
      if (adPrevBtn) adPrevBtn.addEventListener('click', function (e) { e.preventDefault(); adGo(adIdx - 1); adRestart(); });
      if (adNextBtn) adNextBtn.addEventListener('click', function (e) { e.preventDefault(); adGo(adIdx + 1); adRestart(); });
      adRestart();
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
