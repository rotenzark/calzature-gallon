/* Calzature Gallon — interazioni, i18n, orari dinamici */
(function(){
  "use strict";
  var intro=document.getElementById('intro');
  window.addEventListener('load',function(){ setTimeout(function(){ if(intro) intro.classList.add('gone'); },900); });
  setTimeout(function(){ if(intro) intro.classList.add('gone'); },2600);

  var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });},{threshold:.13});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  var burger=document.getElementById('burger'), navlinks=document.getElementById('navlinks');
  if(burger){ burger.addEventListener('click',function(){ navlinks.classList.toggle('show'); }); }
  document.querySelectorAll('#navlinks a').forEach(function(a){ a.addEventListener('click',function(){ navlinks.classList.remove('show'); }); });

  document.querySelectorAll('.faq-q').forEach(function(b){
    b.addEventListener('click',function(){ var it=b.parentElement,a=b.nextElementSibling,o=it.classList.contains('open'); it.classList.toggle('open'); a.style.maxHeight=o?null:a.scrollHeight+'px'; });
  });

  /* ---------- ORARI dinamici ---------- */
  // getDay 0=Dom..6=Sab · Lun 15–19:30 · Mar–Sab 09:30–13 + 15–19:30 · Dom chiuso
  var HOURS={0:[],1:[[15,19.5]],2:[[9.5,13],[15,19.5]],3:[[9.5,13],[15,19.5]],4:[[9.5,13],[15,19.5]],5:[[9.5,13],[15,19.5]],6:[[9.5,13],[15,19.5]]};
  var DAYS_IT=['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  var DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(h){ var H=Math.floor(h),M=Math.round((h-H)*60); H=H%24; return H+':'+(M<10?'0'+M:''+M); }
  function winStr(w){ return fmt(w[0])+'–'+fmt(w[1]); }
  function romeNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'})); }
  function computeStatus(){
    var n=romeNow(), d=n.getDay(), h=n.getHours()+n.getMinutes()/60, wins=HOURS[d]||[];
    for(var i=0;i<wins.length;i++){ if(h>=wins[i][0]&&h<wins[i][1]) return {open:true,close:wins[i][1]}; }
    for(var j=0;j<wins.length;j++){ if(h<wins[j][0]) return {open:false,next:wins[j][0],today:true}; }
    for(var k=1;k<=7;k++){ var dd=(d+k)%7; if((HOURS[dd]||[]).length) return {open:false,next:HOURS[dd][0][0],nextDay:dd}; }
    return {open:false};
  }
  var LANG='it';
  function renderHours(){
    var box=document.getElementById('hours'); if(!box) return;
    var days=LANG==='en'?DAYS_EN:DAYS_IT, today=romeNow().getDay(), out='';
    [1,2,3,4,5,6,0].forEach(function(d){
      var wins=HOURS[d], txt=wins&&wins.length?wins.map(winStr).join(' · '):(LANG==='en'?'Closed':'Chiuso');
      out+='<div class="hours-line'+(d===today?' today':'')+'"><span class="d">'+days[d]+'</span><span>'+txt+'</span></div>';
    });
    box.innerHTML=out;
    var st=computeStatus(), sb=document.getElementById('statusbox'), ab=document.getElementById('ab-state'), label,cls;
    if(st.open){ cls='open'; label=(LANG==='en'?'Open now · until ':'Aperto ora · fino alle ')+fmt(st.close); }
    else if(st.next!=null){ cls='closed'; var dt=st.today?'':((LANG==='en'?days[st.nextDay]:days[st.nextDay])+' '); label=(LANG==='en'?'Closed · opens ':'Chiuso · apre ')+dt+fmt(st.next); }
    else { cls='closed'; label=(LANG==='en'?'Closed':'Chiuso'); }
    if(sb) sb.innerHTML='<span class="status '+cls+'"><span class="dot"></span>'+label+'</span>';
    if(ab) ab.textContent=(st.open?(LANG==='en'?'Open now':'Aperto ora'):(LANG==='en'?'Closed now':'Ora chiuso'));
  }

  /* ---------- i18n ---------- */
  var EN={
    'nav.storia':'The story','nav.friul':'The friulane','nav.negozio':'In the shop','nav.dove':'Find us','nav.cta':'Call',
    'hero.kick':'Piazza Sant’Eustorgio · by the Columns of San Lorenzo','hero.h1':'The real <em>friulane</em>, since 1955.',
    'hero.lead':'One of the few shops in Milan with the authentic hand-made friulane — and with the classic shoes of always, at a fair price.',
    'hero.p1':'three generations','hero.p2':'90 reviews','hero.p3':'Historic Milanese shop',
    'hero.cta1':'Call the shop','hero.cta2':'The friulane',
    'storia.cap':'The shop on the square, as it was','storia.kick':'The story · since 1955','storia.h2':'Seventy years on the square',
    'storia.lead':'An <b>«old-style»</b> shop, where it feels like stepping back in time — and indeed it has been here since 1955.',
    'storia.p1':'The Gallon family opens its shoe shop on Piazza Sant’Eustorgio, steps from the Columns of San Lorenzo. Ever since, the strategy has been the same: quality and craftsmanship at a fair price.',
    'storia.p2':'Today the shop is in its third generation. The full windows, the chairs to try shoes on at your ease, the owner who knows you: one of the city’s most iconic and historic addresses.',
    'storia.g1':'Calzature Gallon is born','storia.g2n':'3 gen.','storia.g2':'Three family generations','storia.g3':'90 reviews, «so kind»',
    'friul.kick':'The star piece','friul.h2':'The <em>friulana</em>, the real one',
    'friul.p1':'The friulana — «furlane» in dialect — is an old velvet slipper born in the Friuli countryside: a hand-sewn upper, a soft sole, long times and small quantities. At Gallon you find the authentic ones, made by artisans as they once were, brought to central Milan at an honest price.',
    'friul.lab':'— one for every colour —',
    'neg.kick':'In the shop','neg.h2':'What you find at Gallon','neg.sub':'Quality shoes, in real leather, at fair prices — since 1955.',
    'neg.c1h':'The friulane','neg.c1p':'The authentic hand-made velvet slippers, in many colours — our star piece.',
    'neg.c2h':'Espadrilles','neg.c2p':'Light and colourful for summer, in many sizes and shades.',
    'neg.c3h':'Classic men’s shoes','neg.c3p':'An excellent selection of classic leather footwear, at competitive prices.',
    'neg.c4h':'Leather ankle boots','neg.c4p':'Real Italian leather for winter — comfortable and made to last.',
    'gal.kick':'A look','gal.h2':'The shop',
    'rev.src':'On Google · 90 reviews',
    'rev.q1':'An old-style shop, it feels like stepping back in time. Good choice. Famous for the friulane at a fair price.',
    'rev.q2':'A venerable Italian shoe emporium which I have frequented for 38 years. My daughter received her first pair of shoes here: a truly exceptional experience.',
    'rev.q3':'Adorable little shop, friendly and helpful. I got myself a beautiful pair of Italian leather boots for only 75 euros.',
    'rev.q4':'So kind, shoes of excellent quality in real leather at fair prices. The owner helpful and kind.',
    'dove.h2':'Find us','dove.addr':'Address','dove.phone':'Phone','dove.hours':'Opening hours','dove.call':'Call the shop','dove.dir':'Get directions',
    'faq.kick':'Frequently asked','faq.h2':'Good to know',
    'faq.q1':'Are the friulane the real, hand-made ones?','faq.a1':'Yes: at Gallon you find the authentic velvet friulane, hand-sewn by artisans in the traditional way, in many colours — at an honest price.',
    'faq.q2':'How old is the shop?','faq.a2':'Since 1955, always on Piazza Sant’Eustorgio. Today we are the third generation of the Gallon family.',
    'faq.q3':'What do you sell besides the friulane?','faq.a3':'Espadrilles, classic men’s leather shoes, Italian leather ankle boots and quality everyday footwear, at competitive prices.',
    'faq.q4':'When are you open?','faq.a4':'Monday 3:00–7:30pm; Tuesday to Saturday 9:30am–1pm and 3:00–7:30pm. Closed on Sunday.',
    'faq.q5':'Where exactly are you?','faq.a5':'On Piazza Sant’Eustorgio 4, at the end of Corso di Porta Ticinese, steps from the Columns of San Lorenzo.',
    'foot.sub':'Sant’Eustorgio · Milan · since 1955','foot.rating':'4.7★ on Google (90 reviews)',
    'foot.demo':'Demo website by Bespoke Studio. Content and reviews from public sources (Google Maps).',
    'ab.call':'Call','ab.map':'Map'
  };
  var IT={};
  document.querySelectorAll('[data-i18n]').forEach(function(el){ IT[el.getAttribute('data-i18n')]=el.innerHTML; });
  function apply(lang){
    LANG=lang; var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){ var k=el.getAttribute('data-i18n'); if(dict[k]!=null) el.innerHTML=dict[k]; else if(lang==='it'&&IT[k]!=null) el.innerHTML=IT[k]; });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-lang')===lang); });
    renderHours();
  }
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click',function(){ apply(b.getAttribute('data-lang')); }); });

  renderHours();
  setInterval(renderHours,60000);

  /* ---------- JSON-LD ---------- */
  var ld1={"@context":"https://schema.org","@type":"ShoeStore","name":"Calzature Gallon","image":"https://rotenzark.github.io/calzature-gallon/img/facciata.jpg","telephone":"+390289402735","url":"https://rotenzark.github.io/calzature-gallon/","priceRange":"€€","address":{"@type":"PostalAddress","streetAddress":"Piazza Sant'Eustorgio 4","addressLocality":"Milano","postalCode":"20122","addressCountry":"IT"},"geo":{"@type":"GeoCoordinates","latitude":45.4532727,"longitude":9.1807261},"sameAs":["https://instagram.com/calzature_gallon"],"foundingDate":"1955","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":"Monday","opens":"15:00","closes":"19:30"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:30","closes":"13:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"15:00","closes":"19:30"}]};
  var ld2={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"Le friulane sono quelle vere fatte a mano?","acceptedAnswer":{"@type":"Answer","text":"Sì, da Gallon trovi le autentiche friulane in velluto cucite a mano dagli artigiani, in tanti colori, a un prezzo onesto."}},
    {"@type":"Question","name":"Da quando esiste il negozio?","acceptedAnswer":{"@type":"Answer","text":"Dal 1955, in Piazza Sant'Eustorgio a Milano. Oggi è alla terza generazione della famiglia Gallon."}},
    {"@type":"Question","name":"Quando siete aperti?","acceptedAnswer":{"@type":"Answer","text":"Lunedì 15–19:30; martedì–sabato 9:30–13 e 15–19:30; domenica chiuso."}}
  ]};
  [ld1,ld2].forEach(function(o){ var s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(o); document.head.appendChild(s); });
})();
