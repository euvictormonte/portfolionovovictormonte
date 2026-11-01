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
})();