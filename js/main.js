const arranque = () => {
  'use strict';
  const W = window, E = W.EMPRESA, V = W.VEICULOS || [], S = W.SERVICOS || [], C = W.CONSTRUCAO || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const eur = n => n.toLocaleString('pt-PT') + ' €';
  const km = n => n.toLocaleString('pt-PT');
  const nome = v => `${v.marca} ${v.modelo}`;
  const tel = E.telefone.replace(/\s/g, '');
  const wa = t => `https://wa.me/${E.whatsapp}?text=${encodeURIComponent(t)}`;
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(E.morada)}`;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } }
  };
  const aberto = () => {
    const H = E.abertura; if (!H) return '';
    const ag = new Date(), f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(ag);
    const g = t => f.find(x => x.type === t).value, dia = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')), h = Number(g('hour')) + Number(g('minute')) / 60;
    const nomes = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
    if (H[dia] && h >= H[dia][0] && h < H[dia][1]) return `<span class="ponto on"></span>Aberto agora · fecha às ${H[dia][1]}h`;
    for (let k = 0; k < 7; k++) { const d = (dia + k) % 7; if (H[d] && (k > 0 || h < H[d][0])) return `<span class="ponto"></span>Fechado · abre ${k === 0 ? 'hoje' : k === 1 ? 'amanhã' : nomes[d]} às ${H[d][0]}h`; }
    return '';
  };
  const pag = document.body.dataset.page;
  { const t = { automoveis: 'auto', veiculos: 'auto', veiculo: 'auto', servicos: 'auto', construcoes: 'obras' }[pag]; if (t) document.body.dataset.tema = t; }
  const qs = new URLSearchParams(location.search);
  let favs = store.get('fav', []);
  let refresh = () => {};

  // ---- tema ----
  const aplicarTema = t => {
    document.documentElement.dataset.theme = t;
    const b = document.querySelector('.tema-btn');
    if (b) { b.innerHTML = t === 'dark' ? SOL : LUA; b.setAttribute('aria-label', t === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'); b.setAttribute('aria-pressed', t === 'dark'); }
  };
  const LUA = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10z" fill="currentColor"/></svg>';
  const SOL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  aplicarTema(store.get('tema', null) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  // ---- imagens ----
  const car = '<svg viewBox="0 0 240 100"><path d="M10 72 L22 52 Q30 40 48 38 L88 36 Q104 18 130 18 L168 20 Q186 24 196 40 L222 46 Q232 50 232 62 L232 72Z" fill="currentColor"/><circle cx="62" cy="74" r="15" stroke="currentColor" stroke-width="5"/><circle cx="182" cy="74" r="15" stroke="currentColor" stroke-width="5"/></svg>';
  W.PH = `<div class="foto vazia" role="img" aria-label="Foto indisponível">${car}</div>`;
  W.PHO = '<div class="foto vazia" role="img" aria-label="Foto indisponível"><svg viewBox="0 0 240 100"><path d="M30 90V45L100 15l70 30v45zM180 90V30h20v60z" fill="currentColor"/></svg></div>';
  V.forEach(v => { v.fotos = v.fotos || (v.foto ? [v.foto] : []); });
  const foto = (v, i = 0, alt) => v.fotos[i]
    ? `<img class="foto" src="${esc(v.fotos[i])}" alt="${esc(alt || nome(v))}" loading="lazy" onerror="this.outerHTML=window.PH">` : W.PH;

  const toast = m => {
    let t = $('#toast');
    if (!t) { document.body.insertAdjacentHTML('beforeend', '<div id="toast" role="status" aria-live="polite"></div>'); t = $('#toast'); }
    t.textContent = m; t.classList.add('on');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600);
  };

  // ---- cabeçalho, rodapé, WhatsApp, topo ----
  const links = [['index','Início'],['automoveis','Automóveis'],['veiculos','Veículos'],['construcoes','Construção'],['sobre','Sobre nós'],['faq','FAQ'],['contacto','Contacto']];
  const atual = { veiculo: 'veiculos', servicos: 'automoveis' }[pag] || pag;
  document.body.insertAdjacentHTML('afterbegin', `<a class="salto" href="#conteudo">Saltar para o conteúdo</a>
    <header class="topo" id="topo"><a class="marca" href="index.html"><picture><source media="(max-width:78rem)" srcset="img/logo-icone-192.png"><img src="img/logo-128.png" alt="" width="44" height="44"></picture><span class="marca-t">Cuber <b>Orlando</b></span></a>
    <button type="button" class="tema-btn"></button>
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu"><span></span></button>
    <nav id="menu" aria-label="Principal"><ul>${links.map(([p, n]) => `<li><a href="${p}.html"${p === atual ? ' aria-current="page"' : ''}>${n}</a></li>`).join('')}</ul>
    <div class="menu-acoes"><button type="button" class="botao sec sm" data-comparar hidden>Comparar (<span data-n-comp>0</span>)</button><button type="button" class="botao sm" data-contactar>Contactar</button></div></nav></header>
    <div class="fundo" hidden></div>`);
  $('main').id = 'conteudo';
  document.body.insertAdjacentHTML('beforeend', `<footer class="rodape"><div class="rodape-grid">
    <div><img class="logo-rodape" src="img/logo-128.png" alt="Logótipo Cuber Orlando" width="72" height="72" loading="lazy"><p class="lema">Perfeito ou nada feito</p><p>${esc(E.nome)}<br>${esc(W.EMPRESA2.nome)}</p></div>
    <div><strong>Navegação</strong><ul>${links.map(([p, n]) => `<li><a href="${p}.html">${n}</a></li>`).join('')}</ul></div>
    <address><strong>Contactos</strong><p>${esc(E.morada)}<br>${esc(E.horario)}</p><p class="aberto">${aberto()}</p><p><a href="tel:${tel}">${esc(E.telefone)}</a><br><a href="mailto:${esc(E.email)}">${esc(E.email)}</a><br><a href="${mapa}" target="_blank" rel="noopener">Ver no mapa</a></p></address>
    </div><small>© ${new Date().getFullYear()} ${esc(E.nome)} · <a href="#topo">Voltar ao topo &uarr;</a></small></footer>
    <button type="button" class="subir" aria-label="Voltar ao topo">&uarr;</button>`);

  aplicarTema(document.documentElement.dataset.theme || 'light');
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', ev => { if (store.get('tema', null) === null) aplicarTema(ev.matches ? 'dark' : 'light'); });
  const hd = $('#topo'), mb = $('.menu-btn'), fundo = $('.fundo'), subir = $('.subir');
  const menu = a => {
    hd.classList.toggle('aberto', a); mb.setAttribute('aria-expanded', a);
    mb.setAttribute('aria-label', a ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('sem-scroll', a); fundo.hidden = !a;
  };
  mb.addEventListener('click', () => menu(!hd.classList.contains('aberto')));
  fundo.addEventListener('click', () => menu(false));
  $('#menu').addEventListener('click', e => { if (e.target.closest('a')) menu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });
  $('.tema-btn').addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; aplicarTema(t); store.set('tema', t);
  });
  subir.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  const aoRolar = () => { hd.classList.toggle('scroll', scrollY > 8); subir.classList.toggle('on', scrollY > 700); };
  addEventListener('scroll', aoRolar, { passive: true }); aoRolar();

  // ---- migalhas ----
  const nomes = { automoveis: 'Automóveis', veiculos: 'Veículos', veiculo: 'Veículo', construcoes: 'Construções', servicos: 'Serviços', sobre: 'Sobre', faq: 'Perguntas', contacto: 'Contacto' };
  const migalhas = (ult, meio) => {
    if (pag === 'index') return;
    $('main').insertAdjacentHTML('afterbegin', `<nav class="migalhas" aria-label="Localização"><a href="index.html">Início</a>${meio ? `<a href="${meio[0]}">${meio[1]}</a>` : ''}<span aria-current="page">${esc(ult || nomes[pag])}</span></nav>`);
  };

  // ---- favoritos (delegação) ----
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]'); if (!b) return;
    const id = Number(b.dataset.fav), on = !favs.includes(id);
    favs = on ? [...favs, id] : favs.filter(x => x !== id); store.set('fav', favs);
    toast(on ? 'Guardado nos favoritos.' : 'Removido dos favoritos.'); refresh();
  });

  // ---- comparação (até 3 veículos) ----
  let comp = store.get('comp', []).filter(id => V.some(v => v.id === id));
  const estadoBtn = b => { const on = comp.includes(Number(b.dataset.comp)); b.setAttribute('aria-pressed', on); b.textContent = on ? 'Na comparação' : 'Comparar'; };
  const barra = () => {
    const n = comp.length, b = $('[data-comparar]'), m = $('.menu-btn');
    if (b) { b.hidden = n === 0; $('[data-n-comp]', b).textContent = n; }
    if (m) m.dataset.n = n;
  };
  const mostrarComparacao = () => {
    const items = comp.map(id => V.find(v => v.id === id)).filter(Boolean);
    let d = $('#dlg-comp');
    if (!d) { d = document.createElement('dialog'); d.id = 'dlg-comp'; d.className = 'dlg dlg-comp'; d.setAttribute('aria-label', 'Comparação de veículos');
      d.addEventListener('click', ev => { if (ev.target === d || ev.target.closest('[data-close]')) d.close(); }); document.body.appendChild(d); }
    if (items.length < 2) { if (d.open) d.close(); return; }
    const melhor = (f, menor) => { const vs = items.map(f); const m = menor ? Math.min(...vs) : Math.max(...vs); return vs.every(x => x === m) ? [] : items.filter(v => f(v) === m).map(v => v.id); };
    const linhas = [['Preço', v => eur(v.preco), melhor(v => v.preco, true)], ['Ano', v => v.ano, melhor(v => v.ano, false)], ['Quilómetros', v => km(v.km) + ' km', melhor(v => v.km, true)], ['Combustível', v => v.comb], ['Caixa', v => v.caixa], ['Tipo', v => v.tipo], ['Estado', v => v.vendido ? 'Vendido' : 'Disponível']];
    d.innerHTML = `<button type="button" class="lb-x" data-close aria-label="Fechar">&times;</button><h2>Comparar veículos</h2>
      <div class="cmp" style="--n:${items.length}"><div class="cmp-cab">${items.map(v => `<div class="cmp-v"><a href="veiculo.html?id=${v.id}">${foto(v)}<strong>${esc(nome(v))}</strong></a><button type="button" class="lnk cmp-rm" data-rm-comp="${v.id}">Remover</button></div>`).join('')}</div>
      ${linhas.map(([n, f, m]) => `<div class="cmp-l">${n}</div><div class="cmp-r">${items.map(v => `<div class="${m && m.includes(v.id) ? 'melhor' : ''}">${esc(f(v))}</div>`).join('')}</div>`).join('')}</div>
      <p class="nota">A verde, o melhor valor em preço, ano e quilómetros.</p><button type="button" class="lnk cmp-rm" data-limpar-comp>Limpar comparação</button>`;
    if (!d.open) d.showModal();
  };
  document.addEventListener('click', e => {
    const r = e.target.closest('[data-rm-comp]'); if (!r) return;
    comp = comp.filter(x => x !== Number(r.dataset.rmComp)); store.set('comp', comp); barra(); $$('[data-comp]').forEach(estadoBtn); mostrarComparacao();
  });
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-comp]');
    if (c) {
      const id = Number(c.dataset.comp);
      if (comp.includes(id)) comp = comp.filter(x => x !== id);
      else if (comp.length >= 3) { toast('Podes comparar até 3 veículos.'); return; }
      else { comp = [...comp, id]; toast(comp.length < 2 ? 'Adicionado. Escolhe mais um para comparar.' : (matchMedia('(max-width: 78rem)').matches ? 'Pronto! Toca no menu (☰) em cima e escolhe Comparar.' : 'Pronto! Usa o botão Comparar, no topo da página.')); }
      store.set('comp', comp); barra(); $$('[data-comp]').forEach(estadoBtn);
    } else if (e.target.closest('[data-comparar]')) { menu(false); if (comp.length < 2) toast('Escolhe pelo menos 2 veículos para comparar.'); else mostrarComparacao(); }
    else if (e.target.closest('[data-limpar-comp]')) { comp = []; store.set('comp', comp); barra(); $$('[data-comp]').forEach(estadoBtn); const d = $('#dlg-comp'); if (d && d.open) d.close(); }
  });
  barra();

  document.addEventListener('click', async e => {
    if (!e.target.closest('[data-partilhar]')) return;
    const d = { title: document.title, text: document.title, url: location.href };
    try { if (navigator.share) await navigator.share(d); else { await navigator.clipboard.writeText(location.href); toast('Ligação copiada.'); } }
    catch (err) { if (err && err.name !== 'AbortError') toast('Não foi possível partilhar. Copia o endereço da página.'); }
  });

  // ---- cartões ----
  const cartao = v => {
    const f = favs.includes(v.id), url = `veiculo.html?id=${v.id}`;
    return `<article class="cartao${v.vendido ? ' vendido' : ''}"><a class="cartao-foto" href="${url}" tabindex="-1" aria-hidden="true">${foto(v)}</a>
      ${v.vendido ? '<span class="selo">Vendido</span>' : v.destaque ? '<span class="selo dest">Destaque</span>' : ''}
      <button type="button" class="fav" data-fav="${v.id}" aria-pressed="${f}" aria-label="${f ? 'Remover dos favoritos' : 'Guardar nos favoritos'}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg></button>
      <div class="info"><h3><a href="${url}">${esc(nome(v))}</a></h3><p class="spec">${v.ano} · ${km(v.km)} km · ${esc(v.comb)} · ${esc(v.caixa)}</p>
      <div class="linha"><strong>${eur(v.preco)}</strong><a class="lnk" href="${url}">Ver detalhe</a></div><button type="button" class="comp" data-comp="${v.id}" aria-pressed="${comp.includes(v.id)}">${comp.includes(v.id) ? 'Na comparação' : 'Comparar'}</button></div></article>`;
  };
  const vazio = '<div class="estado"><h3>Nenhum veículo encontrado</h3><p>Experimenta alargar os filtros ou pede-nos uma procura.</p><a class="botao sm" href="contacto.html?assunto=Procura%20de%20ve%C3%ADculo">Pedir procura</a></div>';

  // ---- início e secções com dados ----
  const montar = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
  const cardServ = (s, i, tipo) => `<li class="servico"><h3>${esc(s[0])}</h3><p>${esc(s[tipo === 'obras' ? 1 : (pag === 'servicos' ? 2 : 1)])}</p>
    <div class="acoes"><a class="lnk" href="contacto.html?empresa=${tipo === 'obras' ? 'Constru%C3%A7%C3%B5es' : 'Autom%C3%B3veis'}&assunto=${encodeURIComponent(s[0])}">Pedir informações</a>
    <a class="lnk" href="#" data-wa="Olá! Gostaria de obter informações sobre o serviço de ${esc(s[0])}.">Contactar</a></div></li>`;
  montar('#servicos-curto', S.map((s, i) => cardServ(s, i)).join(''));
  montar('#servicos-largo', S.map((s, i) => cardServ(s, i)).join(''));
  montar('#obras-servicos', C.map((s, i) => cardServ(s, i, 'obras')).join(''));
  montar('#home-obras', C.slice(0, 4).map((s, i) => cardServ(s, i, 'obras')).join(''));
  montar('#destaques', V.filter(v => v.destaque && !v.vendido).slice(0, 3).map(cartao).join('') || '<p>Em breve novos veículos.</p>');
  const P = W.PROJETOS || [];
  montar('#obras-galeria', P.length ? P.map(p => `<article class="cartao"><div class="cartao-foto">${foto(p, 0, p.nome)}</div><div class="info"><h3>${esc(p.nome)}</h3><p class="spec">${[p.categoria, p.local, p.estado].filter(Boolean).map(esc).join(' · ')}</p><p>${esc(p.descricao || '')}</p></div></article>`).join('')
    : '<div class="estado"><h3>Projetos em breve</h3><p>Os projetos realizados serão apresentados aqui.</p><a class="botao sm" href="contacto.html?empresa=Constru%C3%A7%C3%B5es&assunto=Pedido%20de%20or%C3%A7amento">Pedir orçamento</a></div>');
  $$('[data-n-obras]').forEach(el => { el.textContent = C.length; });
  $$('[data-desde]').forEach(el => { el.textContent = E.desde; });
  $$('[data-morada]').forEach(el => { el.textContent = E.morada; });
  $$('[data-mapa]').forEach(el => { el.href = mapa; });

  $$('[data-wa]').forEach(a => { a.href = '#'; });
  // ---- escolha de contacto (nada liga nem abre sem a pessoa escolher) ----
  const dc = document.createElement('dialog'); dc.className = 'dlg dlg-c'; dc.id = 'dlg-contacto'; dc.setAttribute('aria-label', 'Como queres falar connosco?');
  document.body.appendChild(dc);
  const ic = d => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const abrirContacto = (m = 'Olá! Gostaria de entrar em contacto com a Cuber Orlando.') => {
    dc.innerHTML = `<button type="button" class="lb-x" data-close aria-label="Fechar">&times;</button><h2>Como queres falar connosco?</h2><p class="nota">Escolhe uma opção. Nada é enviado nem chamado até confirmares na aplicação.</p>
      <ul class="escolhas"><li><a href="${wa(m)}" target="_blank" rel="noopener">${ic('<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z"/>')}<span><strong>Mensagem no WhatsApp</strong><small>Abre a conversa com o texto já escrito</small></span></a></li>
      <li><a href="contacto.html?assunto=${encodeURIComponent(m.slice(0, 80))}">${ic('<path d="M4 4h16v13H7l-3 3z"/>')}<span><strong>Formulário</strong><small>Escreve o teu pedido no site</small></span></a></li>
      <li><a href="mailto:${esc(E.email)}?body=${encodeURIComponent(m)}">${ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>')}<span><strong>Email</strong><small>${esc(E.email)}</small></span></a></li>
      <li><a href="tel:${tel}" data-ligar>${ic('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>')}<span><strong>Ligar</strong><small>${esc(E.telefone)} · ${esc(E.horario)}</small></span></a></li></ul>`;
    dc.showModal();
  };
  dc.addEventListener('click', e => { if (e.target === dc || e.target.closest('[data-close]')) dc.close(); });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-wa],[data-contactar]'); if (!a) return;
    e.preventDefault(); menu(false); abrirContacto(a.dataset.wa || a.dataset.contactar || undefined);
  });

  // ---- FAQ e opiniões ----
  montar('#faq', ['Automóveis', 'Construções'].map(g => `<h2 class="sub">${g}</h2>` + (W.FAQ || []).filter(x => x[0] === g).map(x => `<details><summary>${esc(x[1])}</summary><p>${esc(x[2])}</p></details>`).join('')).join(''));
  const op = $('#opinioes-sec');
  if (op) { if ((W.OPINIOES || []).length) montar('#opinioes', W.OPINIOES.map(o => `<blockquote><p>${esc(o[2])}</p><span class="autor">${esc(o[1])}, ${esc(o[0])}</span></blockquote>`).join('')); else op.hidden = true; }

  // ---- lista de veículos ----
  const filtros = $('#filtros');
  if (filtros) {
    migalhas();
    const uniq = k => [...new Set(V.map(v => v[k]))].sort();
    ['tipo', 'comb', 'caixa'].forEach(k => { $('#' + k).innerHTML = '<option value="">Todos</option>' + uniq(k).map(x => `<option>${esc(x)}</option>`).join(''); });
    const num = id => { const x = $('#' + id).value; return x === '' ? null : Number(x); };
    const ordens = { asc: (a, b) => a.preco - b.preco, desc: (a, b) => b.preco - a.preco, ano: (a, b) => b.ano - a.ano, km: (a, b) => a.km - b.km };
    const desenhar = () => {
      const t = $('#q').value.trim().toLowerCase(), g = id => $('#' + id).value;
      const dentro = (x, min, max) => (min === null || x >= min) && (max === null || x <= max);
      const r = V.filter(v => (!t || nome(v).toLowerCase().includes(t)) && (!g('tipo') || v.tipo === g('tipo')) && (!g('comb') || v.comb === g('comb')) &&
        (!g('caixa') || v.caixa === g('caixa')) && dentro(v.preco, num('pmin'), num('pmax')) && dentro(v.ano, num('amin'), num('amax')) && dentro(v.km, null, num('kmax')) &&
        (!$('#disp').checked || !v.vendido) && (!$('#dest').checked || v.destaque) && (!$('#favs').checked || favs.includes(v.id)));
      r.sort((a, b) => (a.vendido - b.vendido) || (ordens[g('ordem')] || ((x, y) => (y.ordem ?? y.id) - (x.ordem ?? x.id)))(a, b));
      $('#contador').textContent = `${r.length} ${r.length === 1 ? 'veículo' : 'veículos'}`;
      $('#lista').innerHTML = r.length ? r.map(cartao).join('') : vazio;
    };
    refresh = desenhar;
    $('#filtros').insertAdjacentHTML('beforebegin', `<div class="chips" id="chips" role="group" aria-label="Tipo de veículo">${['', ...uniq('tipo')].map(t => `<button type="button" class="chip" data-tipo="${esc(t)}" aria-pressed="${t === ''}">${t || 'Todos'}</button>`).join('')}</div>`);
    $('#chips').addEventListener('click', e => { const b = e.target.closest('[data-tipo]'); if (!b) return; $('#tipo').value = b.dataset.tipo; $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', c === b)); desenhar(); });
    filtros.addEventListener('input', desenhar);
    filtros.addEventListener('submit', e => e.preventDefault());
    $('#limpar').addEventListener('click', () => { filtros.reset(); $$('#chips .chip').forEach((c, k) => c.setAttribute('aria-pressed', k === 0)); desenhar(); toast('Filtros limpos.'); });
    const ab = $('#abrir-filtros');
    ab.addEventListener('click', () => { const on = filtros.classList.toggle('aberto'); ab.setAttribute('aria-expanded', on); });
    desenhar();
  }

  // ---- detalhe do veículo ----
  const det = $('#detalhe');
  if (det) {
    const raw = qs.get('id'), id = /^\d+$/.test(raw || '') ? Number(raw) : NaN;
    const v = V.find(x => x.id === id);
    if (!v) {
      migalhas('Não encontrado', ['veiculos.html', 'Veículos']);
      det.innerHTML = `<div class="estado"><h1>Veículo não encontrado</h1><p>${raw ? 'O endereço não corresponde a nenhum veículo.' : 'Nenhum veículo foi indicado.'}</p><a class="botao sm" href="veiculos.html">Ver todos os veículos</a></div>`;
    } else {
      migalhas(nome(v), ['veiculos.html', 'Veículos']);
      document.title = `${nome(v)} | Cuber Orlando`;
      const desc = `${nome(v)}, ${v.ano}, ${km(v.km)} km, ${v.comb}, ${v.caixa}.`;
      $('meta[name="description"]').content = desc;
      const fs = v.fotos.length ? v.fotos : [''];
      let i = 0;
      const msg = `Olá! Gostaria de obter informações sobre o ${nome(v)}.`;
      const linhas = [['Ano', v.ano], ['Quilómetros', km(v.km) + ' km'], ['Combustível', v.comb], ['Caixa', v.caixa], ['Tipo', v.tipo], ['Estado', v.vendido ? 'Vendido' : 'Disponível']];
      const gal = `<div class="galeria"><div class="grande" id="gr"></div>
        ${fs.length > 1 ? `<button type="button" class="gal-nav ant" data-go="-1" aria-label="Foto anterior">&lsaquo;</button><button type="button" class="gal-nav seg" data-go="1" aria-label="Foto seguinte">&rsaquo;</button>` : ''}
        <div class="mini">${fs.length > 1 ? fs.map((p, n) => `<button type="button" data-i="${n}" aria-label="Ver foto ${n + 1}"><img src="${esc(p)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('sem')"></button>`).join('') : ''}</div></div>`;
      const stats = [[v.ano, 'Ano'], [km(v.km) + ' km', 'Quilómetros'], [v.comb, 'Combustível'], [v.caixa, 'Caixa']];
      det.innerHTML = `${gal}<div class="dados"><p class="eyebrow">${esc(v.marca)} · ${esc(v.tipo)}</p><h1 class="h1">${esc(v.modelo)}</h1>${v.vendido ? '<p class="selo-linha">Vendido</p>' : ''}<p class="preco">${eur(v.preco)}</p>
        <ul class="destaques-det">${stats.map(x => `<li><strong>${esc(x[0])}</strong><span>${x[1]}</span></li>`).join('')}</ul>
        <div class="acoes-det"><button type="button" class="botao" data-contactar="${esc(msg)}">${v.vendido ? 'Perguntar sobre este veículo' : 'Contactar sobre este veículo'}</button>
        <a class="botao sec" href="contacto.html?veiculo=${v.id}">Pedir proposta</a>
        <button type="button" class="botao sec" data-partilhar>Partilhar</button>
        <button type="button" class="botao sec" data-comp="${v.id}" aria-pressed="${comp.includes(v.id)}">${comp.includes(v.id) ? 'Na comparação' : 'Comparar'}</button></div>
        ${v.descricao ? `<p class="desc">${esc(v.descricao)}</p>` : ''}
        <table class="ficha">${linhas.map(l => `<tr><th scope="row">${l[0]}</th><td>${esc(l[1])}</td></tr>`).join('')}</table>
        ${v.vendido ? '' : `<details class="sim"><summary>Simular prestação</summary><div class="sim-in"><label>Entrada (€)<input id="s-ent" type="number" min="0" inputmode="numeric" value="0"></label><label>Prazo<select id="s-prazo">${[12, 24, 36, 48, 60, 72, 84, 96].map(n => `<option value="${n}"${n === 60 ? ' selected' : ''}>${n} meses</option>`).join('')}</select></label><label>Taxa anual (%)<input id="s-taxa" type="number" min="0" step="0.1" inputmode="decimal" value="0"></label></div><p class="sim-res" aria-live="polite"></p><p class="nota">Valor meramente indicativo. Não é uma proposta de crédito. Introduz a taxa do teu financiamento.</p></details>`}
        <p><a class="lnk" href="veiculos.html">Voltar aos veículos</a></p></div>`;
      const sim = $('.sim', det);
      if (sim) {
        const calc = () => { const ent = Math.max(0, Number($('#s-ent').value) || 0), n = Number($('#s-prazo').value), t = Math.max(0, Number($('#s-taxa').value) || 0) / 1200, cap = Math.max(0, v.preco - ent);
          const m = t ? cap * t / (1 - Math.pow(1 + t, -n)) : cap / n; $('.sim-res', sim).innerHTML = `<strong>${eur(Math.round(m))}</strong> por mês, durante ${n} meses`; };
        sim.addEventListener('input', calc); calc();
      }
      const gr = $('#gr');
      const dlg = document.createElement('dialog'); dlg.className = 'lb'; dlg.setAttribute('aria-label', 'Galeria ampliada');
      dlg.innerHTML = '<button type="button" class="lb-x" data-close aria-label="Fechar">&times;</button><button type="button" class="gal-nav ant" data-go="-1" aria-label="Foto anterior">&lsaquo;</button><div class="lb-img"></div><button type="button" class="gal-nav seg" data-go="1" aria-label="Foto seguinte">&rsaquo;</button>';
      document.body.appendChild(dlg);
      const img = n => fs[n] ? `<img class="foto" src="${esc(fs[n])}" alt="${esc(nome(v))}, foto ${n + 1} de ${fs.length}" onerror="this.outerHTML=window.PH">` : W.PH;
      const mostrar = n => {
        i = (n + fs.length) % fs.length;
        gr.innerHTML = `<button type="button" class="zoom" data-zoom aria-label="Ampliar foto">${img(i)}</button>`;
        $('.lb-img', dlg).innerHTML = img(i);
        $$('.mini button', det).forEach((b, k) => b.toggleAttribute('aria-current', k === i));
      };
      det.addEventListener('click', e => {
        const go = e.target.closest('[data-go]'), th = e.target.closest('[data-i]');
        if (go) mostrar(i + Number(go.dataset.go)); else if (th) mostrar(Number(th.dataset.i)); else if (e.target.closest('[data-zoom]')) dlg.showModal();
      });
      dlg.addEventListener('click', e => {
        const go = e.target.closest('[data-go]');
        if (go) mostrar(i + Number(go.dataset.go)); else if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
      });
      document.addEventListener('keydown', e => {
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && (dlg.open || det.contains(document.activeElement))) mostrar(i + (e.key === 'ArrowRight' ? 1 : -1));
      });
      let x0 = null;
      gr.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      gr.addEventListener('touchend', e => { if (x0 !== null) { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) mostrar(i + (d < 0 ? 1 : -1)); x0 = null; } });
      mostrar(0);
      const rel = V.filter(x => x.id !== v.id && (x.tipo === v.tipo || x.comb === v.comb)).slice(0, 3);
      if (rel.length) det.insertAdjacentHTML('afterend', `<section class="bloco" id="semelhantes"><h2>Veículos semelhantes</h2><div class="grade">${rel.map(cartao).join('')}</div></section>`);
      const ld = { '@context': 'https://schema.org', '@type': 'Car', name: nome(v), brand: { '@type': 'Brand', name: v.marca }, model: v.modelo, vehicleModelDate: String(v.ano),
        mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.km, unitCode: 'KMT' }, fuelType: v.comb, vehicleTransmission: v.caixa,
        offers: { '@type': 'Offer', price: v.preco, priceCurrency: 'EUR', availability: v.vendido ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } };
      const sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);
    }
  }

  // ---- páginas simples ----
  if (['automoveis', 'construcoes', 'servicos', 'sobre', 'faq', 'contacto'].includes(pag)) migalhas();

  // ---- contacto ----
  const f = $('#form-contacto');
  if (f) {
    f.empresa.value = qs.get('empresa') === 'Construções' ? 'Construções' : f.empresa.value;
    const vid = /^\d+$/.test(qs.get('veiculo') || '') ? V.find(x => x.id === Number(qs.get('veiculo'))) : null;
    f.assunto.value = qs.get('assunto') || (vid ? 'Interesse: ' + nome(vid) : '');
    montar('#morada', `${esc(E.morada)}<br>${esc(E.horario)}<br><span class="aberto">${aberto()}</span><br><a href="tel:${tel}">${esc(E.telefone)}</a><br><a href="mailto:${esc(E.email)}">${esc(E.email)}</a><br><a class="lnk" target="_blank" rel="noopener" href="${mapa}">Ver no mapa</a>`);
    const regras = [
      ['nome', v => v.trim().length >= 2, 'Indica o teu nome.'],
      ['email', v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'O email não parece válido.'],
      ['telefone', v => !v || /^\+?[\d\s]{7,}$/.test(v.trim()), 'O telefone não parece válido.'],
      ['mensagem', v => v.trim().length >= 10, 'Escreve pelo menos 10 caracteres.']
    ];
    const erro = (n, m) => { $('#e-' + n).textContent = m || ''; f[n].setAttribute('aria-invalid', m ? 'true' : 'false'); };
    const validar = () => {
      let ok = true, primeiro = null;
      regras.forEach(([n, fn, m]) => { const bad = !fn(f[n].value); erro(n, bad ? m : ''); if (bad) { ok = false; primeiro = primeiro || f[n]; } });
      if (!f.email.value.trim() && !f.telefone.value.trim()) { erro('telefone', 'Indica um email ou um telefone.'); ok = false; primeiro = primeiro || f.telefone; }
      if (primeiro) primeiro.focus();
      return ok;
    };
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!validar()) return;
      const txt = `Olá! Gostaria de entrar em contacto com a Cuber Orlando (${f.empresa.value}).\nAssunto: ${f.assunto.value || '-'}\n${f.mensagem.value}\n\nNome: ${f.nome.value}${f.email.value ? '\nEmail: ' + f.email.value : ''}${f.telefone.value ? '\nTelefone: ' + f.telefone.value : ''}`;
      if (ev.submitter && ev.submitter.value === 'email') location.href = `mailto:${E.email}?subject=${encodeURIComponent(f.assunto.value || 'Contacto pelo site')}&body=${encodeURIComponent(txt)}`;
      else window.open(wa(txt), '_blank', 'noopener');
      toast('Mensagem preparada. Confirma o envio na aplicação que abriu.');
    });
  }
  const alvos = $$('.bloco, .faixa');
  if ('IntersectionObserver' in W) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target); } }), { threshold: 0.08 });
    alvos.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }
};

// ---- dados editáveis pelo painel (/admin): lê data/*.json; se falhar, usa js/dados.js ----
(() => {
  const W = window;
  const ler = f => fetch(f, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
  const num = x => { const n = Number(String(x ?? '').replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };
  const foto = f => (typeof f === 'string' ? f : f && f.foto) || '';
  const fotos = l => (l || []).map(foto).filter(Boolean);
  const hash = s => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.codePointAt(0)) >>> 0; return (h % 2000000000) + 1; };
  const veiculos = l => {
    const usados = new Set();
    return l.filter(v => v && v.marca && v.modelo).map((v, i) => {
      const o = { ...v, ano: num(v.ano), km: num(v.km), preco: num(v.preco), fotos: fotos(v.fotos), destaque: !!v.destaque, vendido: !!v.vendido, tipo: v.tipo || 'Ligeiro', comb: v.comb || '', caixa: v.caixa || '', ordem: -i };
      let id = hash(`${o.marca}|${o.modelo}|${o.ano}`); while (usados.has(id)) id++; usados.add(id); o.id = id; return o;
    });
  };
  const empresa = e => {
    const h = n => (e[n] === undefined || e[n] === null || e[n] === '' ? null : num(e[n]));
    const a = h('semana_abre'), f = h('semana_fecha'), sa = h('sabado_abre'), sf = h('sabado_fecha');
    const o = {};
    ['telefone', 'whatsapp', 'email', 'morada'].forEach(k => { if (e[k]) o[k] = String(e[k]).trim(); });
    if (o.whatsapp) o.whatsapp = o.whatsapp.replace(/\D/g, '');
    if (a !== null && f !== null) {
      o.horario = `Seg a Sex: ${a}h às ${f}h` + (sa && sf ? ` · Sáb: ${sa}h às ${sf}h` : '');
      o.abertura = { 1: [a, f], 2: [a, f], 3: [a, f], 4: [a, f], 5: [a, f] };
      if (sa && sf) o.abertura[6] = [sa, sf];
    }
    return o;
  };
  Promise.allSettled([ler('data/veiculos.json'), ler('data/projetos.json'), ler('data/empresa.json')]).then(([v, p, e]) => {
    try {
      if (v.status === 'fulfilled' && Array.isArray(v.value.veiculos)) W.VEICULOS = veiculos(v.value.veiculos);
      if (p.status === 'fulfilled' && Array.isArray(p.value.projetos)) W.PROJETOS = p.value.projetos.filter(x => x && x.nome).map(x => ({ ...x, fotos: fotos(x.fotos) }));
      if (e.status === 'fulfilled' && e.value) W.EMPRESA = { ...W.EMPRESA, ...empresa(e.value) };
    } catch (err) { /* dados inválidos: mantém js/dados.js */ }
    arranque();
  });
})();
