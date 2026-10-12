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

  /* --- фильтр каталога: тип продукта + метки, сочетаются (И) --- */
  const typeChips = $$('#tabs-type button'), tagChips = $$('#tabs-tag button');
  const cards = $$('#cards .card');
  const found = $('#found'), foundWord = $('#foundWord'), reset = $('#reset'), empty = $('#empty');
  const grid = $('#cards'), catalog = $('#catalog');
  const state = { type: '*', tag: null };

  const plural = n => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return 'позиций';
    if (b === 1) return 'позиция';
    if (b >= 2 && b <= 4) return 'позиции';
    return 'позиций';
  };

  function render(keepScroll) {
    let shown = 0;
    cards.forEach(c => {
      const okType = state.type === '*' || c.dataset.cat === state.type;
      const tags = (c.dataset.tags || '').split('|').filter(Boolean);
      const okTag = !state.tag || tags.includes(state.tag);
      const show = okType && okTag;
      if (show) shown++;
      c.classList.toggle('is-hidden', !show);
      c.hidden = !show;
      if (show) { c.classList.remove('in'); requestAnimationFrame(() => c.classList.add('in')); }
    });
    found.textContent = shown;
    foundWord.textContent = plural(shown);
    reset.hidden = state.type === '*' && !state.tag;
    empty.hidden = shown !== 0;
    typeChips.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.type === state.type)));
    tagChips.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tag === state.tag)));
    if (keepScroll && grid.getBoundingClientRect().top < 0) {
      catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  typeChips.forEach(btn => btn.addEventListener('click', () => {
    state.type = btn.dataset.type;
    render(true);
  }));
  tagChips.forEach(btn => btn.addEventListener('click', () => {
    state.tag = (state.tag === btn.dataset.tag) ? null : btn.dataset.tag;   // повторное нажатие снимает метку
    render(true);
  }));
  reset?.addEventListener('click', () => {
    state.type = '*'; state.tag = null;
    render(false);
  });

  /* фильтр можно открыть ссылкой: ?type=Зефир, ?tag=Без сахара — удобно показать
     заказчику конкретную линейку и проверять вид без нажатий */
  const q = new URLSearchParams(location.search);
  if (q.get('type')) state.type = q.get('type');
  if (q.get('tag')) state.tag = q.get('tag');
  if (q.get('type') || q.get('tag')) render(false);

  /* --- кнопка «Показать без сахара» в блоке про сахар --- */
  document.querySelector('[data-sugar-link]')?.addEventListener('click', () => {
    state.tag = 'Без сахара';
    render(true);
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
      cat_lead: 'Ассортимент разделён по типу продукта, а свойства вынесены в отдельные метки — их можно включать как фильтр: без сахара, новинки, дикие ягоды, в глазури, подарочная упаковка.',
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
      cat_lead: 'Grouped by product type, with properties shown as separate labels you can switch on as a filter: no added sugar, new, wild berries, glazed, gift packaging.',
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
