(function(){
var d=document,b=d.body,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var bg=d.querySelector('.burger');
bg.onclick=function(){var o=b.classList.toggle('menu-open');bg.setAttribute('aria-expanded',o)};
d.querySelectorAll('.overlay a').forEach(function(a){a.onclick=function(){b.classList.remove('menu-open');bg.setAttribute('aria-expanded',false)}});
// reveal
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
d.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
// split words
var sp=d.getElementById('split'),ws=sp.textContent.trim().split(' ');
sp.innerHTML=ws.map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
var W=sp.querySelectorAll('.w'),cards=d.querySelectorAll('.card'),big=d.getElementById('big'),tk=false;
function tick(){
 var vh=innerHeight,r=sp.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35)));
 W.forEach(function(w,i){w.classList.toggle('on',i/W.length<p*1.05)});
 if(!rm){
 var br=big.getBoundingClientRect();big.style.setProperty('--by',Math.max(0,Math.min(14,(br.top-vh*.6)/vh*40))+'%')}
 tk=false}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(tick)}},{passive:true});tick();
// magnetic buttons
if(!rm&&matchMedia('(hover:hover)').matches)d.querySelectorAll('[data-mag]').forEach(function(m){
 m.addEventListener('mousemove',function(e){var r=m.getBoundingClientRect();m.style.transform='translate('+(e.clientX-r.left-r.width/2)*.25+'px,'+(e.clientY-r.top-r.height/2)*.35+'px)'});
 m.addEventListener('mouseleave',function(){m.style.transform=''})});
// portrait parallax
var po=d.querySelector('.portrait');
if(!rm&&innerWidth>860)addEventListener('mousemove',function(e){var x=(e.clientX/innerWidth-.5)*14;po.style.translate=x+'px 0'});
// filtro de projetos
var fb=d.querySelectorAll('.flt button'),pj=d.querySelectorAll('.proj');
fb.forEach(function(b){b.onclick=function(){fb.forEach(function(x){x.classList.toggle('on',x===b)});pj.forEach(function(p){p.hidden=b.dataset.f!=='all'&&p.dataset.c!==b.dataset.f})}});
// GSAP: hero + processo
if(window.gsap&&window.ScrollTrigger&&!rm){
gsap.registerPlugin(ScrollTrigger);
gsap.from('.portrait',{opacity:0,yPercent:8,duration:1.5,delay:.5,ease:'power3.out'});
var st={trigger:'.hero',start:'top top',end:'bottom top',scrub:1};
gsap.to('.portrait',{scale:1.14,y:40,ease:'none',scrollTrigger:st});
gsap.to('.hero h1',{y:-50,ease:'none',scrollTrigger:st});
gsap.to('.hero-row',{opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'25% top',end:'bottom top',scrub:true}});
var mm=gsap.matchMedia(),rot=[-3,3,-3];
mm.add('(min-width:861px)',function(){
 var cs=gsap.utils.toArray('.card');
 gsap.set(cs,{rotation:function(i){return rot[i]}});
 var tl=gsap.timeline({scrollTrigger:{trigger:'.proc',start:'top top',end:'+=1800',pin:true,scrub:1,anticipatePin:1}});
 cs.forEach(function(c,i){tl.from(c,{y:180,opacity:0,rotation:rot[i]*3,duration:1,ease:'power2.out'},i)});
 
});
mm.add('(max-width:860px)',function(){
 gsap.utils.toArray('.card').forEach(function(c,i){gsap.set(c,{rotation:rot[i]*.6});gsap.from(c,{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 88%'}})});
});
}
// bolinhas saindo de trás do calendário
var cl=d.querySelector('.cal'),dt=d.querySelector('.dots'),cb=d.querySelector('.calbox');
function dots(){
 if(!dt||!cb||rm)return;
 var w=cb.offsetWidth,h=cb.offsetHeight,n=innerWidth>860?36:18,html='',i,a,r,du;
 dt.style.setProperty('--ox',(cb.offsetLeft+w/2)+'px');dt.style.setProperty('--oy',(cb.offsetTop+h/2)+'px');
 for(i=0;i<n;i++){
  a=Math.random()*6.2832;
  r=Math.min(w/2/(Math.abs(Math.cos(a))||.001),h/2/(Math.abs(Math.sin(a))||.001))+80+Math.random()*280;
  du=r/(20+Math.random()*14);
  html+='<i style="--dx:'+(Math.cos(a)*r).toFixed(0)+'px;--dy:'+(Math.sin(a)*r).toFixed(0)+'px;--d:'+du.toFixed(1)+'s;--l:-'+(i/n*du).toFixed(1)+'s;--s:'+(9+Math.random()*10).toFixed(1)+'px;--o:'+(.7+Math.random()*.3).toFixed(2)+'"></i>'}
 dt.innerHTML=html}
dots();addEventListener('resize',function(){clearTimeout(dots.t);dots.t=setTimeout(dots,250)});
if(dt)new IntersectionObserver(function(es){dt.classList.toggle('on',es[0].isIntersecting)}).observe(cl);
// raios no clique (desligado na seção do calendário)
if(!rm)d.addEventListener('click',function(e){
 if(e.detail===0||e.target.closest('.cal'))return;
 var c=d.createElement('div');c.className='clk';c.setAttribute('aria-hidden','true');
 c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';
 c.innerHTML=[-51.75,-17.25,17.25,51.75].map(function(a){return '<i style="--a:'+a+'deg"></i>'}).join('');
 b.appendChild(c);setTimeout(function(){c.remove()},700)});
// visualizador de projeto: página inteira rolável
var lb=d.getElementById('lb');
if(lb){
 var sc=lb.querySelector('.lb-sc'),li=sc.querySelector('img'),lt=lb.querySelector('.lb-t'),lc=lb.querySelector('.lb-chips'),lx=lb.querySelector('.lb-x'),lh=lb.querySelector('.lb-hint'),lv=sc.querySelector('.lb-v'),from=null,H=d.documentElement;
 var openLb=function(card){
  from=card;var tt=card.getAttribute('data-title')||'';lt.textContent=tt;li.alt=tt;
  var ch=card.querySelector('.chips');lc.innerHTML=ch?ch.innerHTML:'';
  var vs=card.getAttribute('data-video'),src=card.getAttribute('data-full');
  sc.classList.toggle('vid',!!vs);sc.scrollTop=0;lh.classList.remove('off');
  if(vs){li.hidden=true;lv.hidden=false;lv.poster=src||'';lv.src=vs;lh.classList.add('off');var pp=lv.play();if(pp&&pp.catch)pp.catch(function(){})}
  else{lv.hidden=true;li.hidden=false;if(li.getAttribute('src')!==src){li.src=src}}
  var sw=innerWidth-H.clientWidth;H.style.overflow='hidden';if(sw>0)H.style.paddingRight=sw+'px';
  lb.classList.add('on');lb.setAttribute('aria-hidden','false');
  setTimeout(function(){lx.focus({preventScroll:true})},60)};
 var closeLb=function(){
  if(!lb.classList.contains('on'))return;
  lb.classList.remove('on');lb.setAttribute('aria-hidden','true');lv.pause();if(lv.getAttribute('src')){lv.removeAttribute('src');lv.load()}
  H.style.overflow='';H.style.paddingRight='';
  if(from)from.focus({preventScroll:true});
  setTimeout(function(){sc.scrollTop=0},450)};
 d.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.proj');if(!c)return;e.preventDefault();if(c.hasAttribute('data-full'))openLb(c)});
 lx.addEventListener('click',closeLb);
 lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
 d.addEventListener('keydown',function(e){
  if(!lb.classList.contains('on'))return;
  if(e.key==='Escape'){closeLb();return}
  if(e.key==='Tab'){e.preventDefault();(d.activeElement===lx?sc:lx).focus({preventScroll:true})}});
 sc.addEventListener('scroll',function(){lh.classList.toggle('off',sc.scrollTop>40)},{passive:true});
}
var vids=d.querySelectorAll('.proj .ph video');
if(vids.length&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver' in window){
 var vo=new IntersectionObserver(function(es){es.forEach(function(en){var v=en.target;if(en.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{threshold:.35});
 vids.forEach(function(v){vo.observe(v)})}
})();
