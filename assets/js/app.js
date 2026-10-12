/* Меню, фильтр каталога, переключение языка, появление блоков */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* --- мобильное меню --- */
  const burger = $('#burger'), menu = $('#menu');
  burger?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* --- фильтр каталога --- */
  const tabs = $$('#tabs button'), cards = $$('#cards .card');
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    applyFilter(btn.dataset.filter);
  }));

  function applyFilter(f) {
    cards.forEach(c => {
      const show = f === '*' || (f === '__sugar' ? c.dataset.sugar === '1' : c.dataset.cat === f);
      c.classList.toggle('is-hidden', !show);
      c.hidden = !show;
      if (show) { c.classList.remove('in'); requestAnimationFrame(() => c.classList.add('in')); }
    });
  }

  /* фильтр можно открыть ссылкой: ?filter=Зефир или ?filter=__sugar — удобно
     показывать заказчику конкретную линейку и проверять вид без кликов */
  const preset = new URLSearchParams(location.search).get('filter');
  if (preset) {
    const btn = [...tabs].find(b => b.dataset.filter === preset);
    if (btn) { tabs.forEach(b => b.setAttribute('aria-pressed', String(b === btn))); applyFilter(preset); }
  }

  /* --- кнопка «Показать без сахара» в блоке про сахар --- */
  document.querySelector('[data-sugar-link]')?.addEventListener('click', () => {
    document.querySelector('#tabs .tab-sugar')?.click();
  });

  /* --- смена языка --- */
  const T = {
    ru: {
      nav_history: 'Производство', nav_catalog: 'Продукция', nav_awards: 'Награды',
      nav_buy: 'Где купить', nav_b2b: 'Опт и СТМ', nav_contacts: 'Контакты',
      hero_h1: 'Пастила, которую варят в печи XIX века',
      hero_p: 'Белёвская пастила создаётся исключительно вручную из сочных антоновских яблок по неизменной технологии: нежнейшее яблочное пюре, яичный белок и цельные ягоды, орехи или корица. Мастера по сей день готовят её в русской печи, построенной в XIX веке.',
      hero_cta1: 'Смотреть продукцию', hero_cta2: 'Опт и СТМ',
      cat_eyebrow: 'Продукция', cat_h2: 'Ассортимент мануфактуры',
      cat_lead: 'Разделено по типам продукта — пастила, зефир, смоква, пастилки, меренга, сухарики, батончики. Важное при выборе вынесено в метки: «Без сахара», «Новинка», «Дикие ягоды».',
      hist_eyebrow: 'Производство', hist_h2: 'Рецепт, которому 145 лет',
      aw_eyebrow: 'Признание', aw_h2: 'Награды и качество'
    },
    en: {
      nav_history: 'Production', nav_catalog: 'Products', nav_awards: 'Awards',
      nav_buy: 'Where to buy', nav_b2b: 'Wholesale & OEM', nav_contacts: 'Contacts',
      hero_h1: 'Pastila made in a 19th-century Russian stove',
      hero_p: 'Belev pastila is made entirely by hand from juicy Antonovka apples, following an unchanged recipe: the finest apple puree, egg white and whole berries, nuts or cinnamon. To this day the craftsmen dry it in the Russian stove built in the 19th century.',
      hero_cta1: 'Browse products', hero_cta2: 'Wholesale & OEM',
      cat_eyebrow: 'Products', cat_h2: 'The manufactory range',
      cat_lead: 'Grouped by product type: pastila, zefir, smokva, pastilles, meringue, rusks and bars. What matters at a glance is shown as labels: no added sugar, new, wild berries.',
      hist_eyebrow: 'Production', hist_h2: 'A recipe that is 145 years old',
      aw_eyebrow: 'Recognition', aw_h2: 'Awards and quality'
    }
  };
  $$('.lang button').forEach(btn => btn.addEventListener('click', () => {
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const dict = T[btn.dataset.lang]; if (!dict) return;
    $$('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v) el.textContent = v;
    });
    document.documentElement.lang = btn.dataset.lang;
  }));

  /* --- появление блоков при прокрутке --- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  $$('.reveal').forEach(el => io.observe(el));
})();
