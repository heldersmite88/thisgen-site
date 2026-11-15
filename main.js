(function () {
  var GA_ID = 'G-TNHC1TLRET';
  var KEY = 'thisgen_consent';

  // Cabeçalho sólido ao fazer scroll
  var top = document.getElementById('top');
  function onScroll() { top.classList.toggle('solid', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Animações de entrada
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else { document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  // Mapa só quando aparece
  var map = document.getElementById('map');
  if (map && 'IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) {
        var f = document.createElement('iframe');
        f.src = map.getAttribute('data-src'); f.title = 'Mapa da THISGEN em Caíde de Rei, Lousada'; f.loading = 'lazy';
        f.referrerPolicy = 'no-referrer-when-downgrade'; map.appendChild(f); mo.disconnect();
      }
    }, { rootMargin: '300px' });
    mo.observe(map);
  }

  var y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();

  // Consentimento + Google Analytics (só carrega depois de aceitar)
  function getC() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setC(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var loaded = false;
  function loadGA() {
    if (loaded) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
    loadPixel();
  }
  // Pixel da Meta (só depois de aceitar cookies)
  var PIXEL_ID = '8668712054';
  function loadPixel() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView');
  }
  var box = document.getElementById('cookie');
  var c = getC();
  if (c === 'yes') loadGA(); else if (!c) box.classList.add('show');
  document.getElementById('cookie-ok').onclick = function () { setC('yes'); box.classList.remove('show'); loadGA(); };
  document.getElementById('cookie-no').onclick = function () { setC('no'); box.classList.remove('show'); };
  document.getElementById('cookie-open').onclick = function (e) { e.preventDefault(); box.classList.add('show'); };

  // Medir cliques nos botões (Regybox e WhatsApp)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cta]'); if (!a || !window.gtag) return;
    var href = a.getAttribute('href') || '';
    var dest = /wa\.me/.test(href) ? 'whatsapp' : /aula_experimental/.test(href) ? 'aula_experimental'
      : /comprar_plano/.test(href) ? 'acesso_livre' : /aula_avulso/.test(href) ? 'treino_avulso'
      : /novo_registo/.test(href) ? 'inscricao' : /pedir_contacto/.test(href) ? 'pedido_contacto' : 'outro';
    gtag('event', dest === 'whatsapp' ? 'clique_whatsapp' : 'clique_regybox', { cta_local: a.getAttribute('data-cta'), destino: dest, transport_type: 'beacon' });
    if (window.fbq) fbq('track', dest === 'whatsapp' ? 'Contact' : dest === 'aula_experimental' ? 'Schedule' : dest === 'pedido_contacto' ? 'Lead' : dest === 'acesso_livre' || dest === 'treino_avulso' ? 'InitiateCheckout' : dest === 'inscricao' ? 'CompleteRegistration' : 'Lead', { content_name: a.getAttribute('data-cta') });
  });
})();

// Pop-up de lead: formulário "Pedir para ser contactado" da Regybox (integração 13)
(function () {
  var pop = document.getElementById('leadpop'); if (!pop) return;
  var KEY = 'thisgen_leadpop', DIAS = 7, ATRASO = 6000;
  var REGY = 'https://www.regibox.pt/php8/admin/modulos/crm/site_integrations/pedir_contacto.php?id_box=128&id_int=13&acs=dd1ad5ad960f1ad913954e41e91376518006284282839e5094081f6eb7e49fdb&site=s';
  function get() { try { return Number(localStorage.getItem(KEY)) || 0; } catch (e) { return 0; } }
  function set() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  function ev(n) { if (window.gtag) gtag('event', n, { cta_local: 'popup' }); }
  if (Date.now() - get() < DIAS * 864e5) return;
  var aberto = false, carregado = false, ultimoFoco = null;
  function carregar() {
    if (carregado) return; carregado = true;
    var d = document.createElement('div'); d.className = 'regy-int'; d.setAttribute('data-regy', REGY);
    document.getElementById('leadpop-form').appendChild(d);
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.regibox.pt/php8/admin/modulos/crm/site_integrations/regy2.js';
    document.body.appendChild(s);
  }
  function abrir() {
    if (aberto || Date.now() - get() < DIAS * 864e5) return;
    if (document.getElementById('cookie').classList.contains('show')) { setTimeout(abrir, 4000); return; }
    aberto = true; set(); carregar(); ultimoFoco = document.activeElement;
    pop.hidden = false; requestAnimationFrame(function () { pop.classList.add('show'); });
    pop.querySelector('.lead-pop__x').focus(); ev('popup_lead_aberto');
  }
  function fechar() {
    pop.classList.remove('show'); setTimeout(function () { pop.hidden = true; }, 250);
    if (ultimoFoco) ultimoFoco.focus(); ev('popup_lead_fechado');
  }
  pop.addEventListener('click', function (e) { if (e.target === pop || e.target.hasAttribute('data-close')) fechar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) fechar(); });
  // Quem já clicou para marcar não precisa do pop-up
  document.addEventListener('click', function (e) { if (e.target.closest('[data-cta]')) set(); });
  setTimeout(abrir, ATRASO);
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 5) abrir(); });
})();
