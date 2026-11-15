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
  });
})();
