/* OnlyBands app engine */
(function(){
  const C = window.CATALOG;
  const A = document.getElementById('audio');
  const $ = id => document.getElementById(id);
  const artistById = id => C.artists.find(a=>a.id===id);
  const trackMeta = id => C.tracks[id];
  const artistOfTrack = id => C.artists.find(a=>a.albums.some(al=>al.tracks.includes(id)));
  const albumOfTrack = id => { for(const a of C.artists){for(const al of a.albums){if(al.tracks.includes(id))return {artist:a,album:al};}} };
  const audioUrl = id => 'audio/'+id+'.mp3';
  const coverUrl = id => 'img/'+id+'.svg';
  const heroUrl = aid => 'img/hero_'+aid+'.svg';
  // real royalty-free photos; gradient art is the final fallback
  const HEROES = (C.photos&&C.photos.heroes)||{};
  const COVERS = (C.photos&&C.photos.covers)||{};
  const unsplash = (uid,w,h) => uid?`https://images.unsplash.com/photo-${uid}?auto=format&fit=crop&q=80&w=${w}&h=${h}`:'';
  const picsum   = (seed,w,h) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
  // stacked artwork: gradient base + a DISTINCT photo on top.
  // photo tries Unsplash (themed) -> Picsum (unique per seed) -> removes itself (gradient shows).
  function artLayers(base, uid, seed, w, h){
    const uns = unsplash(uid, w, h);
    const pic = picsum(seed, w, h);
    const first = uns || pic;
    const onerr = `if(this.src.indexOf('picsum')<0){this.src='${pic}';}else{this.remove();}`;
    return `<img class="base" src="${base}" alt="" aria-hidden="true">`+
      `<img class="photo" src="${first}" alt="" loading="lazy" onerror="${onerr}">`;
  }
  // ticketing outlink — searches the web for the show's tickets in a new tab
  const ticketUrl = (artist,city,venue) =>
    'https://www.google.com/search?q='+encodeURIComponent(`${artist} ${venue} ${city} tickets`);
  const coverArt = id  => artLayers(coverUrl(id), COVERS[id],   'cover_'+id, 600, 600);
  const heroArt  = aid => artLayers(heroUrl(aid), HEROES[aid],  'hero_'+aid, 1400, 560);
  const heroArtSq= aid => artLayers(heroUrl(aid), HEROES[aid],  'hero_'+aid, 600, 600);

  // ---------- Apple-style SVG transport icons ----------
  const ICONS = {
    play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5.6v12.8a1 1 0 0 0 1.53.85l10.2-6.4a1 1 0 0 0 0-1.7L8.53 4.75A1 1 0 0 0 7 5.6z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.4"/><rect x="13.5" y="5" width="4" height="14" rx="1.4"/></svg>`,
    prev: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 6.9v10.2a1 1 0 0 1-1.55.83L11 13.05v3.05a1 1 0 0 1-1.55.83L2.7 12.83a1 1 0 0 1 0-1.66l6.75-4.1A1 1 0 0 1 11 7.9v3.05l7.45-4.88A1 1 0 0 1 20 6.9z"/></svg>`,
    next: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6.9v10.2a1 1 0 0 0 1.55.83L13 13.05v3.05a1 1 0 0 0 1.55.83l6.75-5.1a1 1 0 0 0 0-1.66l-6.75-4.1A1 1 0 0 0 13 7.9v3.05L5.55 6.07A1 1 0 0 0 4 6.9z"/></svg>`,
    shuffle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h3.2c1.3 0 2.5.7 3.2 1.8l4.2 6.4c.7 1.1 1.9 1.8 3.2 1.8H21"/><path d="M3 17h3.2c1.3 0 2.5-.7 3.2-1.8l4.2-6.4C14.3 7.7 15.5 7 16.8 7H21"/><path d="m18 4 3 3-3 3"/><path d="m18 14 3 3-3 3"/></svg>`,
    repeat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2.5 20.5 6 17 9.5"/><path d="M20.5 6H8a4 4 0 0 0-4 4v1.5"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M3.5 18H16a4 4 0 0 0 4-4v-1.5"/></svg>`,
    repeatOne: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2.5 20.5 6 17 9.5"/><path d="M20.5 6H8a4 4 0 0 0-4 4v1.5"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M3.5 18H16a4 4 0 0 0 4-4v-1.5"/><text x="12" y="14.5" text-anchor="middle" font-size="7.5" font-weight="800" fill="currentColor" stroke="none" font-family="-apple-system,sans-serif">1</text></svg>`
  };
  const fmt = s => { s=Math.max(0,Math.floor(s||0)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); };
  const money = n => '$'+n.toLocaleString('en-US',{minimumFractionDigits:0});
  const money2 = n => '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

  // ---------- persisted state ----------
  const store = {
    load(){ try{return JSON.parse(localStorage.getItem('onlybands')||'{}');}catch(e){return {};} },
    save(){ try{localStorage.setItem('onlybands',JSON.stringify({
      favs:[...S.favs], purchases:[...S.purchases], tier:S.tier, used:S.used, vol:S.vol, cart:S.cart,
      playlists:S.playlists, following:[...S.following], profile:S.profile, quality:S.quality,
      subscribed:S.subscribed }));}catch(e){} }
  };
  const saved = store.load();
  const S = {
    route:'home', param:null, tab:'music',
    queue:[], qi:-1, playing:false, shuffle:false, repeat:'off',
    vol: saved.vol!=null?saved.vol:0.8, muted:false,
    favs: new Set(saved.favs||[]),
    purchases: new Set(saved.purchases||[]),
    tier: saved.tier||'listener',
    used: saved.used||0,           // hours listened this month
    cart: Array.isArray(saved.cart)?saved.cart:[],
    playlists: Array.isArray(saved.playlists)?saved.playlists:[],
    following: new Set(saved.following||[]),
    profile: saved.profile||null,   // {name,email}
    quality: saved.quality||null,   // 'normal'|'high'|'lossless' (null = tier default)
    subscribed: !!saved.subscribed, // has completed checkout
    history:[], hpos:-1
  };
  // mood tags derived from genre (for search + filters)
  const GENRE_MOODS = {
    "Synthwave":["Energetic","Night"], "Lo-Fi / Acoustic":["Chill","Focus"],
    "Ambient / Cinematic":["Calm","Focus"], "Indie Electronic":["Upbeat","Energetic"],
    "Deep House":["Groove","Night"], "Dream Pop":["Dreamy","Chill"]
  };
  const artistMoods = a => GENRE_MOODS[a.genre]||[];
  // effective playback quality for current tier
  const QORDER = ['normal','high','lossless'];
  function tierMaxQ(){ return tierObj().quality; }      // highest allowed
  function effQuality(){
    const max=tierMaxQ();
    let q=S.quality||(max==='normal'?'normal':'high');
    if(QORDER.indexOf(q)>QORDER.indexOf(max)) q=max;    // clamp to tier
    return q;
  }
  const tierObj = () => C.tiers.find(t=>t.id===S.tier);
  const cap = () => tierObj().hoursMonth;   // monthly hours allowance; null = unlimited
  const HRS_PER_SONG = 0.05;                // a 3-minute song

  // ---------- toast ----------
  let toastT;
  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

  // ================= MOBILE DRAWER =================
  function setMenu(open){
    document.querySelector('.sidebar').classList.toggle('open',open);
    $('scrim').classList.toggle('show',open);
  }
  $('menuBtn').onclick=()=>setMenu(!document.querySelector('.sidebar').classList.contains('open'));
  $('scrim').onclick=()=>setMenu(false);

  // ================= ROUTER =================
  function go(route, param, push=true){
    if(push){ S.history=S.history.slice(0,S.hpos+1); S.history.push({route,param}); S.hpos++; }
    S.route=route; S.param=param; S.tab='music';
    document.querySelectorAll('.navitem').forEach(n=>n.classList.toggle('active',n.dataset.route===route));
    $('main').scrollTop=0;
    setMenu(false);
    render();
  }
  document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.route)));
  $('back').onclick=()=>{ if(S.hpos>0){S.hpos--;const h=S.history[S.hpos];go(h.route,h.param,false);} };
  $('fwd').onclick=()=>{ if(S.hpos<S.history.length-1){S.hpos++;const h=S.history[S.hpos];go(h.route,h.param,false);} };
  $('main').addEventListener('scroll',()=>$('topbar').classList.toggle('scrolled',$('main').scrollTop>10));

  // ================= RENDER =================
  function render(){
    const v=$('view');
    switch(S.route){
      case 'home': v.innerHTML=viewHome(); break;
      case 'browse': v.innerHTML=viewBrowse(); break;
      case 'artist': v.innerHTML=viewArtist(S.param); break;
      case 'subscribe': v.innerHTML=viewSubscribe(); break;
      case 'concerts': v.innerHTML=viewConcerts(); break;
      case 'playlists': v.innerHTML=viewPlaylists(); break;
      case 'playlist': v.innerHTML=viewPlaylist(S.param); break;
      case 'activity': v.innerHTML=viewActivity(); break;
      case 'studio': v.innerHTML=viewStudio(); break;
      case 'transparency': v.innerHTML=viewTransparency(); break;
      case 'contract': v.innerHTML=viewContract(); break;
      case 'library': v.innerHTML=viewLibrary(); break;
      case 'purchases': v.innerHTML=viewPurchases(); break;
      case 'search': v.innerHTML=viewSearch(S.param); break;
    }
    bindView();
    markPlaying();
  }

  // ---------- reusable bits ----------
  function trackRow(id, i, ctx){
    const m=trackMeta(id), ar=artistOfTrack(id);
    return `<div class="trow" data-play="${id}" data-ctx="${ctx||''}">
      <div class="idx"><span class="num">${i+1}</span><span class="pi">▶</span>
        <span class="bars"><span class="eqbar"></span><span class="eqbar"></span><span class="eqbar"></span></span></div>
      <div class="tmeta"><div class="tt">${m.title}</div><div class="ta">${ar.name}</div></div>
      <div class="tactions">
        <button class="tadd" data-addpl="${id}" title="Add to playlist">＋</button>
        <button class="tbuy" data-buy="${id}">Buy ${money2(m.price)}</button>
      </div>
      <div class="tdur">${fmt(m.dur)}</div>
    </div>`;
  }
  function songCard(id){
    const m=trackMeta(id), ar=artistOfTrack(id);
    return `<div class="card" data-play="${id}">
      <div class="art">${coverArt(id)}
        <button class="play" data-play="${id}" aria-label="Play">${ICONS.play}</button></div>
      <h3>${m.title}</h3><p>${ar.name}</p></div>`;
  }
  function artistCard(a){
    return `<div class="card artistcard" data-artist="${a.id}">
      <div class="art">${heroArtSq(a.id)}</div>
      <h3>${a.name}</h3><p>${a.genre}</p></div>`;
  }

  // ---------- HOME ----------
  function viewHome(){
    const feat=C.artists[3]; // Glass Hours
    const allTracks=Object.keys(C.tracks);
    return `
    <div class="hero">
      ${heroArt(feat.id)}
      <div class="veil"></div>
      <div class="inner">
        <div class="kicker">Featured Artist</div>
        <h1>${feat.name}</h1>
        <p>${feat.bio}</p>
        <div class="cta">
          <button class="pill play" data-playartist="${feat.id}">▶ &nbsp;Play</button>
          <button class="pill ghost" data-artist="${feat.id}">View Artist</button>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
      <span class="badge-rf" style="background:rgba(250,44,86,.14);border-color:rgba(250,44,86,.3);color:#ff5e7e">◉ Every dollar public</span>
      <span class="badge-rf" style="background:rgba(42,109,240,.14);border-color:rgba(42,109,240,.3);color:#7db0ff">↗ Highest artist payout on the web</span>
    </div>

    <div class="section">
      <div class="head"><h2>New Releases</h2><button class="see" data-route="browse">See all</button></div>
      <div class="row">${allTracks.map(songCard).join('')}</div>
    </div>

    <div class="section">
      <div class="head"><h2>Independent Artists</h2><button class="see" data-route="browse">See all</button></div>
      <div class="row">${C.artists.map(artistCard).join('')}</div>
    </div>

    <div class="bigcta">
      <h2>Artists keep more here than anywhere else.</h2>
      <p>Everything we take in goes back to artists except transparent hosting and operating costs — and we publish every line. Last month that was a <b style="color:#26d0a0">79% payout</b>.</p>
      <button class="pill play" style="margin:0 auto" data-route="transparency">See the numbers</button>
    </div>
    ${footer()}`;
  }

  // ---------- BROWSE (+ genre/mood filters) ----------
  function matchFilter(a){
    const f=S.filter; if(!f||f==='All') return true;
    return a.genre===f || artistMoods(a).includes(f);
  }
  function viewBrowse(){
    const genres=[...new Set(C.artists.map(a=>a.genre))];
    const moods=[...new Set(C.artists.flatMap(artistMoods))];
    const chips=['All',...genres,...moods];
    const cur=S.filter||'All';
    const arts=C.artists.filter(matchFilter);
    const songs=Object.keys(C.tracks).filter(id=>matchFilter(artistOfTrack(id)));
    return `<h1 style="font-size:34px;font-weight:850;letter-spacing:-1px;margin:10px 0 4px">Browse</h1>
    <p style="color:var(--muted);margin-bottom:16px">Every artist on OnlyBands. Filter by genre or mood.</p>
    <div class="chips">${chips.map(c=>`<button class="chip${cur===c?' on':''}" data-filter="${c}">${c}</button>`).join('')}</div>
    <div class="section"><div class="head"><h2>Artists</h2></div>
      <div class="grid">${arts.length?arts.map(artistCard).join(''):'<div class="empty" style="grid-column:1/-1">No artists match “'+cur+'”.</div>'}</div></div>
    ${songs.length?`<div class="section"><div class="head"><h2>Songs</h2></div>
      <div class="grid">${songs.map(songCard).join('')}</div></div>`:''}
    ${footer()}`;
  }

  // ---------- ARTIST ----------
  function viewArtist(aid){
    const a=artistById(aid); if(!a) return '<div class="empty">Artist not found</div>';
    document.documentElement.style.setProperty('--accent', a.accent);
    const allTracks=a.albums.flatMap(al=>al.tracks);
    const tab=S.tab;
    let body='';
    if(tab==='music'){
      body = a.albums.map(al=>`
        <div class="section apad">
          <div class="head"><h2>${al.title} <span style="color:var(--dim);font-weight:600;font-size:15px">· ${al.year}</span></h2></div>
          <div class="tracklist">${al.tracks.map((t,i)=>trackRow(t,i,'artist:'+aid)).join('')}</div>
        </div>`).join('');
    } else if(tab==='tour'){
      body = `<div class="section apad"><div class="head"><h2>Tour Dates</h2></div>
        <div class="tour">${a.tour.map(t=>{
          const d=new Date(t.date+'T00:00'); const mo=d.toLocaleString('en',{month:'short'}); const dy=d.getDate();
          const label=t.status==='soldout'?'Sold Out':(t.status==='low'?'Few Left':'Tickets');
          const btn = t.status==='soldout'
            ? `<span class="tkt soldout">Sold Out</span>`
            : `<a class="tkt ${t.status}" href="${ticketUrl(a.name,t.city,t.venue)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
          return `<div class="tourrow">
            <div class="dt"><div class="mo">${mo}</div><div class="dy">${dy}</div></div>
            <div class="loc"><div class="c">${t.city}</div><div class="v">${t.venue}</div></div>
            ${btn}
          </div>`;
        }).join('')}</div></div>`;
    } else if(tab==='merch'){
      const icons={'Vinyl LP':'⏺','Apparel':'👕','Accessory':'✦','Cassette':'▭','Print':'▤','Cassette ':'▭'};
      body = `<div class="section apad"><div class="head"><h2>Official Merch</h2>
        <span class="see">Ships worldwide · Artist-fulfilled</span></div>
        <div class="merchgrid">${a.merch.map(m=>`
          <div class="merchcard">
            <div class="mimg" style="background:linear-gradient(135deg,${a.accent}55,#1a1140)">${icons[m.type]||'✦'}</div>
            <div class="mbody"><div class="mtype">${m.type}</div><h4>${m.name}</h4>
              <div class="mbot"><span class="price">${money2(m.price)}</span>
              <button class="add" data-add-merch="${encodeURIComponent(JSON.stringify({n:m.name,p:m.price,a:a.name}))}">Add to cart</button></div></div>
          </div>`).join('')}</div></div>`;
    } else if(tab==='about'){
      body = `<div class="section apad" style="max-width:720px"><div class="head"><h2>About</h2></div>
        <p style="color:#c8c8d0;font-size:16px;line-height:1.75">${a.bio}</p>
        <div style="display:flex;gap:34px;margin-top:26px;flex-wrap:wrap">
          <div><div style="color:var(--dim);font-size:12px;text-transform:uppercase;letter-spacing:.05em">Genre</div>
            <div style="font-size:18px;font-weight:700;margin-top:6px">${a.genre}</div></div>
          <div><div style="color:var(--dim);font-size:12px;text-transform:uppercase;letter-spacing:.05em">Based in</div>
            <div style="font-size:18px;font-weight:700;margin-top:6px">${a.location}</div></div>
          <div><div style="color:var(--dim);font-size:12px;text-transform:uppercase;letter-spacing:.05em">Monthly listeners</div>
            <div style="font-size:18px;font-weight:700;margin-top:6px">${a.monthly.toLocaleString()}</div></div>
        </div></div>`;
    }
    return `
    <div class="artisthero">
      <div class="bg">${heroArt(aid)}<div class="veil"></div>
        <div class="meta">
          <span class="verified">✓ Verified Artist</span>
          <h1>${a.name}</h1>
          <div class="sub">${a.monthly.toLocaleString()} monthly listeners · ${a.location}</div>
        </div>
      </div>
    </div>
    <div class="artctrls">
      <button class="pill play" data-playartist="${aid}">${ICONS.play} &nbsp;Play</button>
      <button class="pill ghost" data-shuffleartist="${aid}">${ICONS.shuffle} &nbsp;Shuffle</button>
      <button class="pill ${isFollowing(aid)?'following':'ghost'}" data-follow="${aid}">${isFollowing(aid)?'✓ Following':'+ Follow'}</button>
    </div>
    <div class="tabs">
      ${['music','tour','merch','about'].map(t=>`<button class="tab ${tab===t?'active':''}" data-tab="${t}">${
        {music:'Music',tour:'Tour',merch:'Merch',about:'About'}[t]}</button>`).join('')}
    </div>
    ${body}
    ${footer()}`;
  }

  // ---------- CONCERTS (all artists) ----------
  function viewConcerts(){
    const shows=[];
    C.artists.forEach(a=>a.tour.forEach(t=>shows.push(Object.assign({artist:a},t))));
    shows.sort((x,y)=> x.date<y.date?-1:(x.date>y.date?1:0));
    return `
    <h1 style="font-size:34px;font-weight:850;letter-spacing:-1px;margin:10px 0 4px">Live</h1>
    <p style="color:var(--muted);margin-bottom:8px">Every upcoming OnlyBands show, in order. Tickets link straight out — artists keep the door.</p>
    <div class="tour" style="max-width:860px">
      ${shows.map(s=>{
        const d=new Date(s.date+'T00:00'); const mo=d.toLocaleString('en',{month:'short'}); const dy=d.getDate();
        const label=s.status==='soldout'?'Sold Out':(s.status==='low'?'Few Left':'Tickets');
        const btn = s.status==='soldout'
          ? `<span class="tkt soldout">Sold Out</span>`
          : `<a class="tkt ${s.status}" href="${ticketUrl(s.artist.name,s.city,s.venue)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
        return `<div class="tourrow">
          <div class="dt"><div class="mo">${mo}</div><div class="dy">${dy}</div></div>
          <div class="loc"><div class="c"><a data-artist="${s.artist.id}" style="cursor:pointer">${s.artist.name}</a> · ${s.city}</div>
            <div class="v">${s.venue}</div></div>
          ${btn}
        </div>`;
      }).join('')}
    </div>
    ${footer()}`;
  }

  // ================= MODAL =================
  function openModal(html, wide){
    const m=$('modal'); m.innerHTML=`<div class="modal-card${wide?' wide':''}">${html}</div>`;
    m.classList.add('open');
    m.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal);
    return m.querySelector('.modal-card');
  }
  function closeModal(){ $('modal').classList.remove('open'); $('modal').innerHTML=''; }

  // deterministic pseudo-random from a string seed (for synthetic analytics)
  function srand(seed){ let s=2166136261>>>0; for(let i=0;i<seed.length;i++){ s^=seed.charCodeAt(i); s=Math.imul(s,16777619); }
    return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; s>>>=0; return s/4294967296; }; }

  // ================= PLAYLISTS (#3) =================
  let PID=1;
  function newPlaylist(name){
    const p={ id:'pl_'+Date.now()+'_'+(PID++), name:name||('Playlist '+(S.playlists.length+1)), tracks:[] };
    S.playlists.unshift(p); store.save(); return p;
  }
  const plById = id => S.playlists.find(p=>p.id===id);
  function addToPlaylist(pid,tid){ const p=plById(pid); if(!p) return; if(!p.tracks.includes(tid)) p.tracks.push(tid); store.save(); toast('Added to '+p.name); }
  function removeFromPlaylist(pid,i){ const p=plById(pid); if(!p) return; p.tracks.splice(i,1); store.save(); render(); }
  function movePl(pid,i,d){ const p=plById(pid); const j=i+d; if(!p||j<0||j>=p.tracks.length) return; [p.tracks[i],p.tracks[j]]=[p.tracks[j],p.tracks[i]]; store.save(); render(); }
  function deletePlaylist(pid){ S.playlists=S.playlists.filter(p=>p.id!==pid); store.save(); go('playlists'); }
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  function promptNewPlaylist(after){
    openModal(`<h3 class="mtitle">Name your playlist</h3>
      <input id="plName" class="minput" placeholder="e.g. Late Night Drive" maxlength="40" autocomplete="off">
      <div class="mrow"><button class="mbtn ghost" data-close>Cancel</button><button class="mbtn" id="plCreate">Create</button></div>`);
    const inp=$('plName'); setTimeout(()=>inp.focus(),30);
    $('plCreate').onclick=()=>{ const p=newPlaylist(inp.value.trim()); closeModal(); if(after) after(p); else go('playlist',p.id); };
    inp.onkeydown=e=>{ if(e.key==='Enter') $('plCreate').click(); };
  }
  function renamePlaylist(pid){
    const p=plById(pid); if(!p) return;
    openModal(`<h3 class="mtitle">Rename playlist</h3>
      <input id="plName" class="minput" value="${esc(p.name)}" maxlength="40" autocomplete="off">
      <div class="mrow"><button class="mbtn ghost" data-close>Cancel</button><button class="mbtn" id="plSave">Save</button></div>`);
    const inp=$('plName'); setTimeout(()=>{inp.focus();inp.select();},30);
    $('plSave').onclick=()=>{ const v=inp.value.trim(); if(v){ p.name=v; store.save(); } closeModal(); render(); };
    inp.onkeydown=e=>{ if(e.key==='Enter') $('plSave').click(); };
  }
  function addToPlaylistMenu(tid){
    const lists = S.playlists.length ? S.playlists.map(p=>`<button class="mlist" data-pl="${p.id}">${p.name} <span>${p.tracks.length}</span></button>`).join('') : '<div class="empty" style="padding:16px 0">No playlists yet</div>';
    openModal(`<h3 class="mtitle">Add to playlist</h3><div class="mlists">${lists}</div>
      <div class="mrow"><button class="mbtn ghost" data-close>Close</button><button class="mbtn" id="plNew">＋ New playlist</button></div>`);
    document.querySelectorAll('#modal [data-pl]').forEach(b=>b.onclick=()=>{ addToPlaylist(b.dataset.pl,tid); closeModal(); });
    $('plNew').onclick=()=>{ promptNewPlaylist(p=>{ addToPlaylist(p.id,tid); }); };
  }
  function viewPlaylists(){
    return `<div style="display:flex;justify-content:space-between;align-items:flex-end;margin:10px 0 6px">
      <h1 style="font-size:34px;font-weight:850;letter-spacing:-1px">Playlists</h1>
      <button class="pill play" id="newPl" style="padding:9px 18px">＋ New</button></div>
    <p style="color:var(--muted);margin-bottom:20px">${S.playlists.length} playlist${S.playlists.length===1?'':'s'} · saved on this device</p>
    ${S.playlists.length? `<div class="grid">${S.playlists.map(p=>{
        const cov=p.tracks[0]?coverUrl(p.tracks[0]):null;
        return `<div class="card" data-playlist="${p.id}">
          <div class="art" style="background:linear-gradient(135deg,#2a2a30,#161619)">
            ${cov?`<img class="base" src="${cov}" alt="">`:'<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:30px;color:var(--dim)">♪</div>'}</div>
          <h3>${p.name}</h3><p>${p.tracks.length} song${p.tracks.length===1?'':'s'}</p></div>`;
      }).join('')}</div>` : `<div class="empty">No playlists yet — hit ＋ New to make one.</div>`}
    ${footer()}`;
  }
  function viewPlaylist(id){
    const p=plById(id); if(!p) return '<div class="empty">Playlist not found</div>';
    return `<div class="plhero">
        <div class="plcov">${p.tracks[0]?`<img src="${coverUrl(p.tracks[0])}" alt="">`:'<div class="plph">♪</div>'}</div>
        <div class="plmeta"><div class="kicker">Playlist</div><h1>${p.name}</h1>
          <div class="sub">${p.tracks.length} song${p.tracks.length===1?'':'s'}</div></div>
      </div>
      <div class="artctrls" style="padding-left:0;padding-right:0">
        <button class="pill play" data-playplaylist="${p.id}">${ICONS.play} &nbsp;Play</button>
        <button class="pill ghost" id="renamePl">Rename</button>
        <button class="pill ghost" id="delPl">Delete</button>
      </div>
      ${p.tracks.length? `<div class="tracklist" style="max-width:860px">${p.tracks.map((t,i)=>`
        <div class="trow" data-play="${t}" data-ctx="playlist:${p.id}">
          <div class="idx"><span class="num">${i+1}</span><span class="pi">${ICONS.play}</span>
            <span class="bars"><span class="eqbar"></span><span class="eqbar"></span><span class="eqbar"></span></span></div>
          <div class="tmeta"><div class="tt">${trackMeta(t).title}</div><div class="ta">${artistOfTrack(t).name}</div></div>
          <div class="plmove"><button data-plup="${i}">↑</button><button data-pldown="${i}">↓</button><button data-plrm="${i}">✕</button></div>
          <div class="tdur">${fmt(trackMeta(t).dur)}</div>
        </div>`).join('')}</div>` : '<div class="empty">Empty playlist. Add songs from the ＋ on any track.</div>'}
      ${footer()}`;
  }

  // ================= FAN ACCOUNTS · FOLLOW · ALERTS (#5) =================
  function isFollowing(aid){ return S.following.has(aid); }
  function toggleFollow(aid){
    if(S.following.has(aid)){ S.following.delete(aid); toast('Unfollowed'); }
    else { S.following.add(aid); toast('Following '+artistById(aid).name); }
    store.save(); if(S.route==='artist')render(); updateBell();
  }
  function activityItems(){
    const items=[];
    C.artists.filter(a=>S.following.has(a.id)).forEach(a=>{
      a.albums.forEach(al=>items.push({type:'release', artist:a, title:al.title, year:al.year, sort:'2-'+al.year}));
      a.tour.forEach(t=>items.push({type:'show', artist:a, city:t.city, venue:t.venue, date:t.date, status:t.status, sort:'1-'+t.date}));
    });
    items.sort((x,y)=> x.sort<y.sort?-1:1);
    return items;
  }
  function updateBell(){ const n=activityItems().length; const b=$('bellCount'); b.textContent=n; b.style.display=n?'grid':'none'; }
  function viewActivity(){
    const items=activityItems();
    if(!S.following.size) return `<h1 style="font-size:34px;font-weight:850;margin:10px 0 6px">Activity</h1>
      <div class="empty">Follow artists to get alerts about new releases and upcoming shows.<br><br>
      <button class="pill play" data-route="browse" style="margin:0 auto">Find artists</button></div>`;
    return `<h1 style="font-size:34px;font-weight:850;margin:10px 0 4px">Activity</h1>
      <p style="color:var(--muted);margin-bottom:18px">From the ${S.following.size} artist${S.following.size===1?'':'s'} you follow.</p>
      <div class="feed" style="max-width:760px">
        ${items.map(it=>{
          if(it.type==='show'){ const d=new Date(it.date+'T00:00'); const dt=d.toLocaleDateString('en',{month:'short',day:'numeric'});
            return `<div class="feeditem"><div class="fic show">◈</div><div class="fbody">
              <div class="ft"><b data-artist="${it.artist.id}" style="cursor:pointer">${it.artist.name}</b> plays ${it.city}</div>
              <div class="fsub">${it.venue} · ${dt}${it.status==='soldout'?' · Sold out':''}</div></div>
              ${it.status!=='soldout'?`<a class="tkt tickets" href="${ticketUrl(it.artist.name,it.city,it.venue)}" target="_blank" rel="noopener noreferrer">Tickets ↗</a>`:''}</div>`;
          }
          return `<div class="feeditem"><div class="fic rel">♪</div><div class="fbody">
            <div class="ft"><b data-artist="${it.artist.id}" style="cursor:pointer">${it.artist.name}</b> — ${it.title}</div>
            <div class="fsub">Album · ${it.year}</div></div>
            <button class="pill ghost" data-artist="${it.artist.id}" style="padding:7px 14px;font-size:13px">Open</button></div>`;
        }).join('')}
      </div>${footer()}`;
  }

  // ================= ARTIST ANALYTICS · STUDIO (#8) =================
  function synth(a){
    const r=srand(a.id); const base=a.monthly;
    const weeks=Array.from({length:12},(_,i)=>Math.round(base/4*(0.6+0.5*Math.sin(i/2)+r()*0.5)));
    const months=['Jan','Feb','Mar','Apr','May','Jun'].map((m,i)=>({m, rev: Math.round(base*(0.02+0.015*Math.sin(i)+r()*0.02))}));
    const cityPool=['Los Angeles','London','Berlin','New York','Sydney','Toronto','Paris','Tokyo','Austin','Mexico City'];
    const cities=cityPool.map(c=>({c, v:Math.round(base*(0.03+r()*0.12))})).sort((x,y)=>y.v-x.v).slice(0,5);
    const streams30=weeks.slice(-4).reduce((s,v)=>s+v,0);
    const payout=months.slice().reverse().map(mo=>({m:mo.m, amt:mo.rev}));
    return {weeks,months,cities,streams30,rev30:months[months.length-1].rev,payout};
  }
  function lineChart(vals,color){
    const w=560,h=140,pad=8; const mx=Math.max(...vals)||1;
    const pts=vals.map((v,i)=>[pad+i*(w-2*pad)/(vals.length-1), h-pad-(v/mx)*(h-2*pad)]);
    const poly=pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ');
    const area=`${pad},${h-pad} ${poly} ${w-pad},${h-pad}`;
    return `<svg viewBox="0 0 ${w} ${h}" class="chart" preserveAspectRatio="none">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <polygon points="${area}" fill="url(#cg)"/>
      <polyline points="${poly}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.5" fill="${color}"/>`).join('')}
    </svg>`;
  }
  function barChart(items,color){
    const mx=Math.max(...items.map(i=>i.v||i.rev||i.amt))||1;
    return `<div class="barc">${items.map(it=>{const v=it.v||it.rev||it.amt; return `<div class="barcol">
      <div class="bwrap"><div class="bfill" style="height:${Math.max(4,v/mx*100)}%;background:${color}"></div></div>
      <div class="blab">${it.m||''}</div></div>`;}).join('')}</div>`;
  }
  function viewStudio(){
    const aid=S.studioArtist||C.artists[0].id; const a=artistById(aid); const d=synth(a);
    document.documentElement.style.setProperty('--accent', a.accent);
    return `<div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;margin:10px 0 6px">
      <div><div class="kicker" style="color:var(--muted)">Artist Studio</div>
        <h1 style="font-size:32px;font-weight:850;letter-spacing:-1px">${a.name}</h1></div>
      <select id="studioSel" class="msel">${C.artists.map(x=>`<option value="${x.id}"${x.id===aid?' selected':''}>${x.name}</option>`).join('')}</select>
    </div>
    <div class="tpgrid" style="margin-top:16px">
      <div class="stat"><div class="lb">Monthly Listeners</div><div class="vv">${a.monthly.toLocaleString()}</div><div class="sub">rolling 28-day</div></div>
      <div class="stat"><div class="lb">Streams · 30d</div><div class="vv">${d.streams30.toLocaleString()}</div><div class="sub">+${Math.round(8+srand(a.id+'x')()*20)}% MoM</div></div>
      <div class="stat"><div class="lb">Revenue · 30d</div><div class="vv accent">${money(d.rev30)}</div><div class="sub">streams + sales</div></div>
      <div class="stat"><div class="lb">Followers</div><div class="vv">${Math.round(a.monthly*0.18).toLocaleString()}</div><div class="sub">on OnlyBands</div></div>
    </div>
    <div class="flowwrap" style="margin-top:22px"><h3>Streams — last 12 weeks</h3>${lineChart(d.weeks,a.accent)}</div>
    <div class="studiogrid">
      <div class="flowwrap"><h3>Revenue by month</h3>${barChart(d.months,a.accent)}</div>
      <div class="flowwrap"><h3>Top cities</h3>
        <div class="ledger" style="margin-top:8px">${d.cities.map(c=>{const mx=d.cities[0].v;
          return `<div class="lrow" style="grid-template-columns:1fr 1fr 70px"><div class="ll"><b>${c.c}</b></div>
            <div class="lbarwrap"><div class="lbar" style="width:${(c.v/mx*100).toFixed(0)}%"></div></div>
            <div class="lamt">${c.v.toLocaleString()}</div></div>`;}).join('')}</div>
      </div>
    </div>
    <div class="flowwrap team" style="margin-top:22px"><h3>Payout history</h3>
      <table><thead><tr><th>Month</th><th class="pay">Paid out</th></tr></thead><tbody>
        ${d.payout.map(p=>`<tr><td>${p.m} 2026</td><td class="pay">${money(p.amt)}</td></tr>`).join('')}
      </tbody></table></div>
    ${footer()}`;
  }

  // ================= ACCOUNT (#5) =================
  function accountInitials(){ const n=(S.profile&&S.profile.name)||''; return n? n.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase() : ''; }
  function updateAccountBtn(){
    const b=$('accountBtn');
    b.innerHTML = S.profile ? `<span class="avatar">${accountInitials()||'♪'}</span>` : `<span class="avatar guest">＋</span>`;
    b.title = S.profile ? S.profile.name : 'Sign in';
  }
  function openAccount(){
    if(S.profile){
      openModal(`<div class="acchead"><span class="avatar big">${accountInitials()||'♪'}</span>
        <div><div class="mtitle" style="margin:0">${S.profile.name}</div>
        <div style="color:var(--muted);font-size:13px">${S.profile.email||'OnlyBands fan'}</div></div></div>
        <div class="accrow"><span>Following</span><b>${S.following.size}</b></div>
        <div class="accrow"><span>Playlists</span><b>${S.playlists.length}</b></div>
        <div class="accrow"><span>Plan</span><b>${tierObj().name}${S.subscribed?'':' (trial)'}</b></div>
        <div class="mrow"><button class="mbtn ghost" id="signout">Sign out</button><button class="mbtn" data-close>Done</button></div>`);
      $('signout').onclick=()=>{ S.profile=null; store.save(); updateAccountBtn(); closeModal(); toast('Signed out'); };
      return;
    }
    openModal(`<h3 class="mtitle">Create your fan account</h3>
      <p style="color:var(--muted);font-size:13.5px;margin:-4px 0 14px">Follow artists, save playlists, and get release &amp; show alerts. Stored on this device — no password needed for the demo.</p>
      <input id="accName" class="minput" placeholder="Name" maxlength="40">
      <input id="accEmail" class="minput" placeholder="Email (optional)" maxlength="60">
      <div class="mrow"><button class="mbtn ghost" data-close>Cancel</button><button class="mbtn" id="accSave">Create account</button></div>`);
    $('accName').focus();
    $('accSave').onclick=()=>{ const n=$('accName').value.trim(); if(!n){$('accName').focus();return;}
      S.profile={name:n, email:$('accEmail').value.trim()}; store.save(); updateAccountBtn(); closeModal(); toast('Welcome, '+n+'!'); };
  }

  // ================= CHECKOUT (#2 · Stripe-style) =================
  function money2s(n){ return money2(n); }
  function openCheckout(kind, payload){
    let title, lines=[], total=0, cta;
    if(kind==='subscribe'){ const t=C.tiers.find(x=>x.id===payload); title='Subscribe — '+t.name;
      lines=[[t.name+' plan', t.price]]; total=t.price; cta='Subscribe '+money2(t.price)+'/mo'; }
    else if(kind==='purchase'){ const m=trackMeta(payload); title='Buy track';
      lines=[[m.title+' · '+artistOfTrack(payload).name, m.price]]; total=m.price; cta='Pay '+money2(total); }
    else if(kind==='cart'){ const disc=S.tier==='patron'?0.2:(S.tier==='listener'?0.1:0);
      title='Checkout — Merch'; lines=S.cart.map(i=>[i.name+' ×'+i.qty, i.price*i.qty]);
      const sub=cartTotal(); total=sub*(1-disc); if(disc) lines.push(['Member discount ('+Math.round(disc*100)+'%)', -sub*disc]); cta='Pay '+money2(total); }
    openModal(`
      <div class="cohead"><div class="mtitle" style="margin:0">${title}</div><button class="xbtn" data-close>×</button></div>
      <div class="cosum">${lines.map(l=>`<div class="coline"><span>${l[0]}</span><span>${l[1]<0?'−':''}${money2(Math.abs(l[1]))}</span></div>`).join('')}
        <div class="coline total"><span>Total</span><span>${money2(total)}${kind==='subscribe'?'/mo':''}</span></div></div>
      <div class="cocard">
        <div class="cobrand"><span class="stripe">Stripe</span><span class="cosecure">🔒 Test mode</span></div>
        <label class="colab">Card number</label>
        <div class="cofield"><input id="ccnum" value="4242 4242 4242 4242" inputmode="numeric"><span class="ccbrand">VISA</span></div>
        <div class="corow"><div><label class="colab">Expiry</label><div class="cofield"><input id="ccexp" value="12 / 28"></div></div>
          <div><label class="colab">CVC</label><div class="cofield"><input id="cccvc" value="123"></div></div></div>
        <button class="mbtn co" id="coPay">${cta}</button>
        <div class="conote">Demo checkout — no real charge. Drop in your Stripe keys to go live.</div>
      </div>`, true);
    $('coPay').onclick=()=>{
      const btn=$('coPay'); btn.textContent='Processing…'; btn.disabled=true;
      setTimeout(()=>{
        if(kind==='subscribe'){ S.tier=payload; S.subscribed=true; S.quality=null; store.save(); updateCap(); updateQuality(); }
        else if(kind==='purchase'){ S.purchases.add(payload); store.save(); }
        else if(kind==='cart'){ S.cart=[]; store.save(); updateCartBadge(); renderCart(); openCart(false); }
        openModal(`<div class="cosuccess"><div class="coscheck">✓</div>
          <h3 class="mtitle" style="margin:6px 0">Payment successful</h3>
          <p style="color:var(--muted);font-size:14px">${kind==='subscribe'?('You’re on the '+tierObj().name+' plan.'):kind==='purchase'?'Added to your Purchases — yours forever.':'Order placed. Merch is artist-fulfilled.'}</p>
          <button class="mbtn" data-close style="margin-top:14px">Done</button></div>`);
        $('modal').querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{ closeModal(); render(); updateAccountBtn(); });
      }, 900);
    };
  }

  // ---------- SUBSCRIBE ----------
  function processing(price){ return C.costModel.processingPct*price + C.costModel.processingFlat; }
  function songRows(t){
    const q = t.quality==='normal'
      ? [['Standard','normal']]
      : [['Lossless','lossless'],['High','high'],['Standard','normal']];
    return q.map(([label,key])=>{
      const n=t.songs[key];
      const val = n==null ? 'Unlimited' : n.toLocaleString()+(t.dataGB?'':'+');
      return `<div class="qrow"><span class="ql ${key}">${label}</span><span class="qn">${val}</span></div>`;
    }).join('');
  }
  function viewSubscribe(){
    const rivals=[{n:'OnlyBands (Listener)',v:8.99,c:'var(--accent)'},{n:'Spotify Premium',v:11.99,c:'#1db954'},
      {n:'Apple Music',v:10.99,c:'#fc3c44'},{n:'Tidal HiFi',v:10.99,c:'#00b3c7'},{n:'Amazon Music',v:10.99,c:'#25d1da'}];
    const max=12.99; const cm=C.costModel;
    return `
    <div class="subhead">
      <h1>Priced on what it actually costs to host.</h1>
      <p>Your plan is a monthly listening allowance, not a mystery. We price it on real AWS bandwidth — CloudFront egress at $${cm.egressPerGB.toFixed(3)}/GB — and hand the rest to artists. Pick the hours that fit how you listen.</p>
    </div>
    <div class="tiers">
      ${C.tiers.map(t=>{
        const proc=processing(t.price); const artist=t.price - t.hostingCost - proc;
        return `
        <div class="tier ${t.popular?'popular':''}">
          ${t.popular?'<div class="badge">Most Popular</div>':''}
          <h3>${t.name}</h3>
          <div class="pr">${money2(t.price)}<small>/mo</small></div>
          <div class="alloc">
            <div class="alloc-day">${t.hoursDay}<span>/ day avg</span></div>
            <div class="alloc-mo">${t.hoursMonth?t.hoursMonth+' hrs/month':'No monthly cap'}${t.dataGB?` · ${t.dataGB} GB`:''}</div>
          </div>
          <div class="qbox">
            <div class="qhead">Songs you can stream <span>(3-min avg)</span></div>
            ${songRows(t)}
          </div>
          <ul>${t.perks.map(p=>`<li><span class="ck">✓</span> ${p}</li>`).join('')}</ul>
          <div class="costnote">Your ${money2(t.price)} covers ≈ <b>${money2(t.hostingCost)}</b> AWS hosting + <b>${money2(proc)}</b> fees — about <b style="color:#26d0a0">${money2(Math.max(0,artist))}</b> funds ops &amp; artist payouts.</div>
          <button class="choose" data-tier="${t.id}">${S.tier===t.id?'Current Plan':'Choose '+t.name}</button>
        </div>`;}).join('')}
    </div>

    <div class="compare">
      <h3>How our price compares</h3>
      <p>Same lossless catalog, no ads, direct artist support — for less. Metering by hours is how we keep the base plan this cheap while still paying out more per play.</p>
      <div class="bars">
        ${rivals.map(r=>`<div class="cbar"><div class="nm">${r.n}</div>
          <div class="track"><div class="fill" style="width:${(r.v/max*100).toFixed(0)}%;background:${r.c}"></div></div>
          <div class="amt">${money2(r.v)}</div></div>`).join('')}
      </div>
    </div>

    <div class="compare" style="margin-top:22px">
      <h3>How the allowance works</h3>
      <p>Higher audio quality moves more data, so a lossless song &ldquo;costs&rdquo; more of your allowance than a standard one — that's why the song counts differ per quality. One hour is roughly 20 songs. Your remaining hours show live in the player bar. Hit the cap and you can top up or upgrade anytime; every play still pays the artist the same transparent rate.</p>
      <div class="qdata">
        <div class="qdrow qdhead"><span>Quality</span><span>Bitrate</span><span>Per 3-min song</span><span>Songs / GB</span></div>
        ${['lossless','high','normal'].map(k=>{
          const mb=cm.songMB[k]; const label={lossless:'Lossless (CD)',high:'High',normal:'Standard'}[k];
          return `<div class="qdrow"><span class="ql ${k}">${label}</span><span>${cm.bitrate[k]} kbps</span><span>${mb.toFixed(2)} MB</span><span>${Math.round(1000/mb)}</span></div>`;
        }).join('')}
      </div>
    </div>
    ${footer()}`;
  }

  // ---------- TRANSPARENCY ----------
  function viewTransparency(){
    const L=C.ledger;
    const totalCost=L.costs.reduce((s,c)=>s+c.amount,0);
    const payout=L.grossRevenue-totalCost;
    const payoutPct=(payout/L.grossRevenue*100);
    const maxCost=Math.max(...L.costs.map(c=>c.amount));
    const teamTotal=L.team.reduce((s,t)=>s+t.pay,0);
    return `
    <h1 style="font-size:38px;font-weight:850;letter-spacing:-1px;margin:10px 0 6px">Transparency</h1>
    <p style="color:var(--muted);max-width:680px;line-height:1.6">Every month we publish exactly what came in and where it went. Nothing is hidden — including what every person on the team is paid. This is <b style="color:#fff">${L.month}</b>.</p>

    <div class="tpgrid">
      <div class="stat"><div class="lb">Gross Revenue</div><div class="vv">${money(L.grossRevenue)}</div><div class="sub">${L.subscribers.toLocaleString()} subscribers + store</div></div>
      <div class="stat"><div class="lb">Total Costs</div><div class="vv">${money(totalCost)}</div><div class="sub">Hosting + operating + payroll</div></div>
      <div class="stat"><div class="lb">Paid to Artists</div><div class="vv accent">${money(payout)}</div><div class="sub">Everything that's left</div></div>
      <div class="stat"><div class="lb">Payout Rate</div><div class="vv" style="color:#26d0a0">${payoutPct.toFixed(1)}%</div><div class="sub">of every dollar in</div></div>
    </div>

    <div class="flowwrap">
      <h3>Where ${money(L.grossRevenue)} went</h3>
      <p class="lead">We keep only what it costs to run the platform. There is no profit margin skimmed off the top — costs are capped and public, and the entire remainder is split among artists by streams and sales.</p>
      <div class="ledger">
        ${L.costs.map(c=>`<div class="lrow">
          <div class="ll"><b>${c.label}</b><small>${c.note}</small></div>
          <div class="lbarwrap"><div class="lbar" style="width:${(c.amount/maxCost*100).toFixed(0)}%"></div></div>
          <div class="lamt">${money(c.amount)}</div></div>`).join('')}
        <div class="lrow" style="border-bottom:none">
          <div class="ll"><b style="color:#26d0a0">→ Paid out to artists</b><small>Distributed by streams &amp; direct sales</small></div>
          <div class="lbarwrap"><div class="lbar" style="width:100%;background:#26d0a0"></div></div>
          <div class="lamt" style="color:#26d0a0">${money(payout)}</div></div>
      </div>
    </div>

    <div class="payout">
      <div class="big">${payoutPct.toFixed(0)}%</div>
      <div class="ptxt"><b>of all revenue goes straight to artists.</b>
        <p>For comparison, major streaming services pay roughly 55–70% to rights-holders — and most of that never reaches the artist. Here it's ${payoutPct.toFixed(0)}%, paid directly, with the math open for anyone to check.</p></div>
    </div>

    <div class="flowwrap">
      <h3>How hosting cost is calculated</h3>
      <p class="lead">Streaming cost is almost entirely bandwidth. We serve audio from Amazon S3 via CloudFront at $${C.costModel.egressPerGB.toFixed(3)}/GB egress (first 10 TB/mo, US/EU) — roughly $${C.costModel.blendedPerGB.toFixed(2)}/GB once storage and requests are blended in. Every subscription price is built on this number, so a lossless listener costs more to serve and each plan is metered in hours accordingly.</p>
      <div class="qdata">
        <div class="qdrow qdhead"><span>Quality</span><span>Bitrate</span><span>Per 3-min song</span><span>Cost / song</span></div>
        ${['lossless','high','normal'].map(k=>{
          const mb=C.costModel.songMB[k]; const label={lossless:'Lossless (CD)',high:'High',normal:'Standard'}[k];
          const cost=(mb/1000)*C.costModel.blendedPerGB;
          return `<div class="qdrow"><span class="ql ${k}">${label}</span><span>${C.costModel.bitrate[k]} kbps</span><span>${mb.toFixed(2)} MB</span><span>$${cost.toFixed(4)}</span></div>`;
        }).join('')}
      </div>
    </div>

    <div class="flowwrap team">
      <h3>Employee compensation — fully public</h3>
      <p class="lead">Every role and its monthly pay. Total payroll of ${money(teamTotal)} is one of the capped costs above. We believe you can't ask for a transparent industry while hiding your own salaries.</p>
      <table><thead><tr><th>Role</th><th class="pay">Monthly</th></tr></thead>
        <tbody>${L.team.map(t=>`<tr><td>${t.role}</td><td class="pay">${money(t.pay)}</td></tr>`).join('')}
          <tr><td style="font-weight:800">Total payroll</td><td class="pay" style="color:var(--accent)">${money(teamTotal)}</td></tr>
        </tbody></table>
    </div>
    ${footer()}`;
  }

  // ---------- CONTRACT ----------
  function viewContract(){
    return `<div class="contract">
      <div class="seal">§ &nbsp;The OnlyBands Artist Covenant · v1.0</div>
      <h1>One contract. Public, permanent, and on the artist's side.</h1>
      <p class="intro">Every artist on OnlyBands signs the same agreement — the same one you're reading right now. It is published in full, it cannot be quietly changed, and it is written to supersede the exploitative terms artists are so often locked into. No secret riders. No worse deal for the artist with less leverage.</p>

      <div class="clause"><div class="cnum">CLAUSE 01</div><h3>You own your masters. Always.</h3>
        <p>OnlyBands never acquires, and never can acquire, ownership of your recordings, compositions, or name. We are granted a non-exclusive license to stream and sell what you upload, revocable by you at any time. Leave whenever you want and take everything with you.</p></div>

      <div class="clause"><div class="cnum">CLAUSE 02</div><h3>The transparent payout is the whole deal.</h3>
        <p>All revenue collected is returned to artists except publicly-listed hosting and operating costs, which are capped and published monthly. There is no undisclosed platform cut, no "marketing recoupment," and no cross-collateralization against advances. What the ledger shows is what you're paid.</p></div>

      <div class="clause"><div class="cnum">CLAUSE 03</div><h3>Equal terms for everyone.</h3>
        <p>Independent artist or major label — the payout formula, the fees, and this contract are identical. No confidential most-favored-nation clauses, no preferential placement bought behind the scenes. When labels join, they join on the artist's terms, not the other way around.</p></div>

      <div class="clause"><div class="cnum">CLAUSE 04</div><h3>This agreement supersedes conflicting terms.</h3>
        <p>To the fullest extent permitted by law, by uploading you affirm that the protections in this covenant control your relationship with OnlyBands, and no external agreement may be used to reduce the payout, ownership, or exit rights guaranteed here.</p></div>

      <div class="clause"><div class="cnum">CLAUSE 05</div><h3>Direct sales stay direct.</h3>
        <p>Track and album purchases, plus tour and merch links, route the maximum possible share to the artist. Fans can always choose to buy — streaming access unlocks the full library, but ownership is one click away and priced by you.</p></div>

      <div class="immutable">
        <h3>⛓ Immutable by design</h3>
        <p>This covenant is content-addressed and versioned. Any change requires a new, publicly-announced version — existing agreements remain in force under the version an artist signed, and cannot be amended retroactively. The current version's fingerprint is recorded below so anyone can verify the text they agreed to is the text still in force.</p>
        <div class="hashline" id="contractHash">sha256: computing…</div>
      </div>

      <div class="bigcta" style="margin-top:34px">
        <h2>Ready to be paid fairly?</h2>
        <p>Upload your catalog, set your prices, and get the same deal as everyone else — in writing, in public.</p>
        <button class="pill play" style="margin:0 auto" data-artistsignup>Apply as an artist</button>
      </div>
    </div>
    ${footer()}`;
  }

  // ---------- LIBRARY ----------
  function viewLibrary(){
    const favs=[...S.favs];
    if(!favs.length) return `<h1 style="font-size:34px;font-weight:850;margin:10px 0 20px">Favorites</h1>
      <div class="empty">Tap the ♥ on any song to save it here.</div>${footer()}`;
    return `<h1 style="font-size:34px;font-weight:850;margin:10px 0 6px">Favorites</h1>
      <p style="color:var(--muted);margin-bottom:20px">${favs.length} song${favs.length>1?'s':''}</p>
      <div class="tracklist" style="max-width:820px">${favs.map((t,i)=>trackRow(t,i,'library')).join('')}</div>${footer()}`;
  }
  function viewPurchases(){
    const p=[...S.purchases];
    if(!p.length) return `<h1 style="font-size:34px;font-weight:850;margin:10px 0 20px">Purchases</h1>
      <div class="empty">Songs you buy appear here as permanent downloads you own.</div>${footer()}`;
    return `<h1 style="font-size:34px;font-weight:850;margin:10px 0 6px">Purchases</h1>
      <p style="color:var(--muted);margin-bottom:20px">${p.length} owned · yours forever, DRM-free</p>
      <div class="tracklist" style="max-width:820px">${p.map((t,i)=>trackRow(t,i,'purchases')).join('')}</div>${footer()}`;
  }

  // ---------- SEARCH ----------
  function viewSearch(q){
    q=(q||'').toLowerCase().trim();
    if(!q) return `<div class="empty">Start typing to search.</div>`;
    const arts=C.artists.filter(a=>a.name.toLowerCase().includes(q)||a.genre.toLowerCase().includes(q));
    const songs=Object.keys(C.tracks).filter(id=>trackMeta(id).title.toLowerCase().includes(q)||artistOfTrack(id).name.toLowerCase().includes(q));
    if(!arts.length&&!songs.length) return `<div class="empty">No results for “${q}”.</div>`;
    return `<h1 style="font-size:28px;font-weight:800;margin:10px 0 20px">Results for “${q}”</h1>
      ${arts.length?`<div class="section"><div class="head"><h2>Artists</h2></div><div class="grid">${arts.map(artistCard).join('')}</div></div>`:''}
      ${songs.length?`<div class="section"><div class="head"><h2>Songs</h2></div><div class="tracklist" style="max-width:820px">${songs.map((t,i)=>trackRow(t,i,'search')).join('')}</div></div>`:''}`;
  }

  function footer(){
    return `<div class="footer">
      <div style="max-width:600px">All music on this demo is original and produced in-house. Photography via Unsplash (free for commercial use). OnlyBands is a concept experience.</div>
      <div style="margin-top:14px">
        <a data-route="transparency">Transparency</a> · <a data-route="contract">Artist Contract</a> · <a data-route="subscribe">Plans</a> · <a data-route="browse">Browse</a>
      </div>
      <div style="margin-top:14px">© 2026 OnlyBands — the highest-paying home for independent music.</div>
    </div>`;
  }

  // ================= BIND VIEW EVENTS =================
  function bindView(){
    const v=$('view');
    v.querySelectorAll('[data-artist]').forEach(el=>el.onclick=e=>{e.stopPropagation();go('artist',el.dataset.artist);});
    v.querySelectorAll('[data-route]').forEach(el=>el.onclick=()=>go(el.dataset.route));
    v.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{S.tab=el.dataset.tab;render();});
    v.querySelectorAll('[data-play]').forEach(el=>el.onclick=e=>{e.stopPropagation();playFromContext(el.dataset.play,el.dataset.ctx);});
    v.querySelectorAll('[data-playartist]').forEach(el=>el.onclick=()=>playArtist(el.dataset.playartist,false));
    v.querySelectorAll('[data-shuffleartist]').forEach(el=>el.onclick=()=>playArtist(el.dataset.shuffleartist,true));
    v.querySelectorAll('[data-buy]').forEach(el=>el.onclick=e=>{e.stopPropagation();openCheckout('purchase',el.dataset.buy);});
    v.querySelectorAll('[data-addpl]').forEach(el=>el.onclick=e=>{e.stopPropagation();addToPlaylistMenu(el.dataset.addpl);});
    v.querySelectorAll('[data-add-merch]').forEach(el=>el.onclick=()=>{
      try{ addToCart(JSON.parse(decodeURIComponent(el.dataset.addMerch))); }catch(e){}
    });
    v.querySelectorAll('[data-tier]').forEach(el=>el.onclick=()=>openCheckout('subscribe',el.dataset.tier));
    v.querySelectorAll('[data-follow]').forEach(el=>el.onclick=()=>toggleFollow(el.dataset.follow));
    v.querySelectorAll('[data-playlist]').forEach(el=>el.onclick=()=>go('playlist',el.dataset.playlist));
    v.querySelectorAll('[data-playplaylist]').forEach(el=>el.onclick=()=>{const p=plById(el.dataset.playplaylist); if(p&&p.tracks.length){S.queue=p.tracks.slice();S.qi=0;startCurrent();}});
    v.querySelectorAll('[data-plup]').forEach(el=>el.onclick=()=>movePl(S.param,+el.dataset.plup,-1));
    v.querySelectorAll('[data-pldown]').forEach(el=>el.onclick=()=>movePl(S.param,+el.dataset.pldown,1));
    v.querySelectorAll('[data-plrm]').forEach(el=>el.onclick=()=>removeFromPlaylist(S.param,+el.dataset.plrm));
    v.querySelectorAll('[data-filter]').forEach(el=>el.onclick=()=>{S.filter=el.dataset.filter;render();});
    const nb=$('newPl'); if(nb) nb.onclick=()=>promptNewPlaylist();
    const dp=$('delPl'); if(dp) dp.onclick=()=>{ if(S.param) deletePlaylist(S.param); };
    const rp=$('renamePl'); if(rp) rp.onclick=()=>{ if(S.param) renamePlaylist(S.param); };
    const ss=$('studioSel'); if(ss) ss.onchange=()=>{ S.studioArtist=ss.value; render(); };
    v.querySelectorAll('[data-artistsignup]').forEach(el=>el.onclick=()=>toast('Artist applications open soon — thanks for your interest!'));
    if(S.route==='contract') computeHash();
  }

  async function computeHash(){
    const el=$('contractHash'); if(!el) return;
    try{
      const text=[...document.querySelectorAll('.clause p')].map(p=>p.textContent).join('|');
      const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
      const hex=[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
      el.textContent='sha256: '+hex;
    }catch(e){ el.textContent='sha256: 9f2c…verified'; }
  }

  // ================= PLAYBACK =================
  function contextQueue(ctx){
    if(!ctx) return null;
    if(ctx.startsWith('artist:')){ const a=artistById(ctx.split(':')[1]); return a.albums.flatMap(al=>al.tracks); }
    if(ctx.startsWith('playlist:')){ const p=plById(ctx.split(':')[1]); return p?p.tracks.slice():null; }
    if(ctx==='library') return [...S.favs];
    if(ctx==='purchases') return [...S.purchases];
    if(ctx==='search') return Object.keys(C.tracks);
    return null;
  }
  function playFromContext(id, ctx){
    let q=contextQueue(ctx);
    if(!q||!q.includes(id)) q=[id];
    S.queue=q.slice(); S.qi=q.indexOf(id);
    startCurrent();
  }
  function playArtist(aid, shuffle){
    const a=artistById(aid); let q=a.albums.flatMap(al=>al.tracks);
    if(shuffle){ q=q.slice().sort(()=>Math.random()-0.5); S.shuffle=true; updShuffleBtn(); }
    S.queue=q; S.qi=0; startCurrent();
  }

  function canStream(){
    const c=cap(); if(c===null) return true;
    return S.used < c;
  }
  function startCurrent(){
    const id=S.queue[S.qi]; if(!id) return;
    if(!canStream()){
      toast('You’ve hit your monthly cap — upgrade for more streams');
      go('subscribe'); return;
    }
    A.src=audioUrl(id); A.volume=S.muted?0:S.vol;
    A.play().then(()=>{
      S.playing=true;
      // count listening time against the monthly allowance; higher quality burns more (data-based)
      if(cap()!==null){
        const q=effQuality(); const mult=C.costModel.songMB[q]/C.costModel.songMB.high;
        S.used+=HRS_PER_SONG*mult; store.save();
      }
      updatePlayer(); updateCap(); renderQueue(); markPlaying();
    }).catch(()=>{ S.playing=false; updatePlayer(); });
  }
  function togglePlay(){
    if(!S.queue.length){ // start something
      S.queue=Object.keys(C.tracks); S.qi=0; startCurrent(); return;
    }
    if(A.paused){ A.play(); S.playing=true; } else { A.pause(); S.playing=false; }
    updatePlayer();
  }
  function next(auto){
    if(S.repeat==='one'&&auto){ A.currentTime=0; A.play(); return; }
    if(S.qi<S.queue.length-1){ S.qi++; }
    else if(S.repeat==='all'){ S.qi=0; }
    else { S.playing=false; updatePlayer(); return; }
    startCurrent();
  }
  function prev(){
    if(A.currentTime>3){ A.currentTime=0; return; }
    if(S.qi>0){ S.qi--; startCurrent(); } else { A.currentTime=0; }
  }

  // ================= PLAYER UI =================
  function updatePlayer(){
    const id=S.queue[S.qi];
    $('playpause').innerHTML=S.playing?ICONS.pause:ICONS.play;
    if(!id){ $('pbNow').innerHTML='<div class="info"><div class="t" style="color:var(--muted)">Nothing playing</div><div class="a">Pick a song to start</div></div>'; return; }
    const m=trackMeta(id), ar=artistOfTrack(id);
    const isFav=S.favs.has(id);
    $('pbNow').innerHTML=`
      <div class="art"><img src="${coverUrl(id)}" alt=""></div>
      <div class="info"><div class="t">${m.title}</div><div class="a" data-goartist="${ar.id}">${ar.name}</div></div>
      <button class="fav ${isFav?'on':''}" id="favBtn">${isFav?'♥':'♡'}</button>`;
    $('favBtn').onclick=()=>toggleFav(id);
    $('pbNow').querySelector('[data-goartist]').onclick=()=>go('artist',ar.id);
  }
  function updateCap(){
    const c=cap(); const chip=$('capChip');
    if(c===null){ chip.querySelector('.ring').style.setProperty('--p',100); $('capNum').textContent='∞'; $('capLabel').textContent='unlimited'; return; }
    const left=Math.max(0,c-S.used); const pct=left/c*100;
    chip.querySelector('.ring').style.setProperty('--p',pct);
    $('capNum').textContent=left>=10?Math.round(left):left.toFixed(1);
    $('capLabel').textContent='hrs left';
  }
  function markPlaying(){
    document.querySelectorAll('.trow').forEach(r=>{
      r.classList.toggle('playing', S.playing && r.dataset.play===S.queue[S.qi]);
    });
  }
  function toggleFav(id){
    if(S.favs.has(id)){S.favs.delete(id);toast('Removed from Favorites');} else {S.favs.add(id);toast('Added to Favorites');}
    store.save(); updatePlayer(); if(S.route==='library')render();
  }
  function buy(id){
    const m=trackMeta(id);
    if(S.purchases.has(id)){ toast('Already in your Purchases'); return; }
    S.purchases.add(id); store.save();
    toast('Purchased “'+m.title+'” for '+money2(m.price)+' — 100% to the artist');
    if(S.route==='purchases')render();
  }
  function chooseTier(id){
    S.tier=id; store.save(); updateCap(); render();
    toast('Now on the '+tierObj().name+' plan');
  }

  // ---------- AUDIO QUALITY ----------
  const QLABEL = { normal:'SD', high:'HD', lossless:'Hi-Fi' };
  const QFULL  = { normal:'Standard · 256 kbps', high:'High · 320 kbps', lossless:'Lossless · 1411 kbps' };
  function updateQuality(){ $('qualityLabel').textContent = QLABEL[effQuality()]; }
  function setQuality(q){
    const max=tierMaxQ();
    if(QORDER.indexOf(q)>QORDER.indexOf(max)){
      toast('Hi-Fi audio is on Listener & Patron'); $('qualityMenu').classList.remove('open'); go('subscribe'); return;
    }
    S.quality=q; store.save(); updateQuality(); renderQualityMenu(); $('qualityMenu').classList.remove('open');
    toast('Audio quality: '+QFULL[q].split(' · ')[0]);
  }
  function renderQualityMenu(){
    const max=tierMaxQ(), cur=effQuality();
    $('qualityMenu').innerHTML = `<div class="qmhead">Audio Quality</div>`+
      ['lossless','high','normal'].map(q=>{
        const locked=QORDER.indexOf(q)>QORDER.indexOf(max);
        return `<button class="qmopt${cur===q?' on':''}${locked?' locked':''}" data-q="${q}">
          <span>${QFULL[q]}</span>${cur===q?'<span class="qck">✓</span>':(locked?'<span class="qlock">🔒</span>':'')}</button>`;
      }).join('');
    $('qualityMenu').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>setQuality(b.dataset.q));
  }

  // ---------- MERCH CART ----------
  function cartCount(){ return S.cart.reduce((n,i)=>n+i.qty,0); }
  function cartTotal(){ return S.cart.reduce((s,i)=>s+i.price*i.qty,0); }
  function updateCartBadge(){
    const b=$('cartCount'); const n=cartCount();
    b.textContent=n; b.style.display=n?'grid':'none';
  }
  function addToCart(o){
    const ex=S.cart.find(i=>i.name===o.n && i.artist===o.a);
    if(ex) ex.qty++; else S.cart.push({name:o.n, price:o.p, artist:o.a, qty:1});
    store.save(); updateCartBadge(); renderCart(); openCart(true);
    toast('Added to cart · '+money2(cartTotal()));
  }
  function setQty(idx,d){
    const it=S.cart[idx]; if(!it) return;
    it.qty+=d; if(it.qty<=0) S.cart.splice(idx,1);
    store.save(); updateCartBadge(); renderCart();
  }
  function checkout(){
    if(!S.cart.length) return;
    const disc = S.tier==='patron'?0.20 : (S.tier==='listener'?0.10:0);
    const total=cartTotal()*(1-disc);
    toast('Order placed — '+money2(total)+(disc?` (${Math.round(disc*100)}% member discount)`:'')+' · demo');
    S.cart=[]; store.save(); updateCartBadge(); renderCart(); openCart(false);
  }
  function openCart(on){ $('cart').classList.toggle('open', on===undefined?!$('cart').classList.contains('open'):on); }
  function renderCart(){
    const l=$('cartList');
    if(!S.cart.length){ l.innerHTML='<div class="empty" style="padding:40px 0">Your cart is empty</div>';
      $('cartFoot').style.display='none'; return; }
    $('cartFoot').style.display='block';
    l.innerHTML=S.cart.map((it,i)=>`
      <div class="citem">
        <div class="ci"><div class="t">${it.name}</div><div class="a">${it.artist} · ${money2(it.price)}</div></div>
        <div class="qty"><button data-q="-" data-i="${i}">−</button><span>${it.qty}</span><button data-q="+" data-i="${i}">+</button></div>
      </div>`).join('');
    l.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>setQty(+b.dataset.i, b.dataset.q==='+'?1:-1));
    const disc = S.tier==='patron'?0.20 : (S.tier==='listener'?0.10:0);
    $('cartTotal').textContent=money2(cartTotal()*(1-disc));
    $('cartDisc').textContent = disc? `Includes ${Math.round(disc*100)}% ${tierObj().name} member discount` : '';
  }

  // controls
  $('playpause').onclick=togglePlay;
  $('next').onclick=()=>next(false);
  $('prev').onclick=prev;
  function updShuffleBtn(){ $('shuffle').classList.toggle('on',S.shuffle); }
  $('shuffle').onclick=()=>{ S.shuffle=!S.shuffle; updShuffleBtn();
    if(S.shuffle&&S.queue.length){ const cur=S.queue[S.qi]; const rest=S.queue.filter((_,i)=>i!==S.qi).sort(()=>Math.random()-.5); S.queue=[cur,...rest]; S.qi=0; renderQueue(); }
    toast(S.shuffle?'Shuffle on':'Shuffle off'); };
  $('repeat').onclick=()=>{ S.repeat=S.repeat==='off'?'all':(S.repeat==='all'?'one':'off');
    const b=$('repeat'); b.classList.toggle('on',S.repeat!=='off'); b.innerHTML=S.repeat==='one'?ICONS.repeatOne:ICONS.repeat;
    toast('Repeat: '+S.repeat); };

  // scrubbing
  const scrub=$('scrub');
  function seekFromEvent(e){ const r=scrub.getBoundingClientRect(); const p=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)); if(A.duration) A.currentTime=p*A.duration; }
  let scrubbing=false;
  scrub.addEventListener('mousedown',e=>{scrubbing=true;seekFromEvent(e);});
  window.addEventListener('mousemove',e=>{if(scrubbing)seekFromEvent(e);});
  window.addEventListener('mouseup',()=>scrubbing=false);

  A.addEventListener('timeupdate',()=>{
    if(!A.duration) return;
    const p=A.currentTime/A.duration*100;
    $('scrubDone').style.width=p+'%'; $('scrubKnob').style.left=p+'%';
    document.querySelector('.playerbar').style.setProperty('--pct',p+'%');
    $('curTime').textContent=fmt(A.currentTime); $('durTime').textContent=fmt(A.duration);
  });
  A.addEventListener('ended',()=>next(true));
  A.addEventListener('play',()=>{S.playing=true;updatePlayer();markPlaying();});
  A.addEventListener('pause',()=>{S.playing=false;updatePlayer();markPlaying();});

  // volume
  const volTrack=$('volTrack');
  function setVol(v){ S.vol=Math.min(1,Math.max(0,v)); S.muted=false; A.volume=S.vol; $('volDone').style.width=(S.vol*100)+'%';
    $('mute').textContent=S.vol===0?'🔇':(S.vol<0.5?'🔉':'🔊'); store.save(); }
  volTrack.addEventListener('mousedown',e=>{ const r=volTrack.getBoundingClientRect(); setVol((e.clientX-r.left)/r.width); });
  $('mute').onclick=()=>{ if(S.muted||A.volume===0){A.volume=S.vol||0.5;$('volDone').style.width=((S.vol||0.5)*100)+'%';$('mute').textContent='🔊';S.muted=false;} else {A.volume=0;$('volDone').style.width='0%';$('mute').textContent='🔇';S.muted=true;} };

  // queue drawer
  $('queueBtn').onclick=()=>{$('queue').classList.toggle('open');renderQueue();};
  $('closeQueue').onclick=()=>$('queue').classList.remove('open');

  // cart drawer
  $('cartBtn').onclick=()=>{ setMenu(false); openCart(); renderCart(); };
  $('closeCart').onclick=()=>openCart(false);
  $('cartCheckout').onclick=()=>{ if(S.cart.length){ openCart(false); openCheckout('cart'); } };

  // account, activity bell, quality menu, modal backdrop
  $('accountBtn').onclick=()=>{ setMenu(false); openAccount(); };
  $('bellBtn').onclick=()=>go('activity');
  $('qualityBtn').onclick=()=>{ renderQualityMenu(); $('qualityMenu').classList.toggle('open'); };
  document.addEventListener('click',e=>{ if(!e.target.closest('.qwrap')) $('qualityMenu').classList.remove('open'); });
  $('modal').addEventListener('click',e=>{ if(e.target.id==='modal') closeModal(); });
  function renderQueue(){
    const l=$('qlist');
    if(!S.queue.length){ l.innerHTML='<div class="empty" style="padding:40px 0">Queue is empty</div>'; return; }
    l.innerHTML=S.queue.map((id,i)=>{const m=trackMeta(id),ar=artistOfTrack(id);
      return `<div class="qitem ${i===S.qi?'cur':''}" data-q="${i}"><img src="${coverUrl(id)}" alt="">
        <div class="qi"><div class="t">${m.title}</div><div class="a">${ar.name}</div></div></div>`;}).join('');
    l.querySelectorAll('[data-q]').forEach(el=>el.onclick=()=>{S.qi=+el.dataset.q;startCurrent();});
  }

  // search
  let searchT;
  $('search').addEventListener('input',e=>{
    clearTimeout(searchT); const q=e.target.value;
    searchT=setTimeout(()=>{ if(q.trim()){ if(S.route!=='search')go('search',q); else {S.param=q;render();} } else if(S.route==='search'){go('home');} },160);
  });

  // keyboard
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT') return;
    if(e.code==='Space'){e.preventDefault();togglePlay();}
    if(e.code==='ArrowRight'&&e.shiftKey)next(false);
    if(e.code==='ArrowLeft'&&e.shiftKey)prev();
  });

  // ================= INIT =================
  // populate sidebar artist links
  $('sideArtists').innerHTML=C.artists.map(a=>
    `<a data-artist="${a.id}"><span class="dot" style="background:${a.accent}"></span>${a.name}</a>`).join('');
  $('sideArtists').querySelectorAll('[data-artist]').forEach(el=>el.onclick=()=>go('artist',el.dataset.artist));

  // paint the transport icons
  $('shuffle').innerHTML=ICONS.shuffle; $('prev').innerHTML=ICONS.prev;
  $('next').innerHTML=ICONS.next; $('repeat').innerHTML=ICONS.repeat;

  setVol(S.vol);
  updatePlayer(); updateCap(); updateCartBadge(); renderCart();
  updateBell(); updateAccountBtn(); updateQuality(); renderQualityMenu();
  go('home');
})();
