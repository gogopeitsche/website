(function(){
  var root=document.documentElement;
  root.classList.remove('no-js');root.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO='IntersectionObserver' in window;
  function all(sel){return [].slice.call(document.querySelectorAll(sel))}

  /* Header turns dark over dark sections, browser bar colour follows */
  var top=document.querySelector('.top');
  var meta=document.querySelector('meta[name="theme-color"]');
  var darks=all('.story,.contact,.foot');
  var lightColor=meta?meta.getAttribute('content'):'#f3f4f6';
  var current=null,ticking=false;
  function header(){
    ticking=false;
    var y=top.offsetHeight/2,hit=null;
    darks.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<=y&&r.bottom>=y)hit=el});
    var color=hit?getComputedStyle(hit).backgroundColor:lightColor;
    if(color===current)return;
    current=color;
    top.classList.toggle('dark',!!hit);
    if(meta)meta.setAttribute('content',color);
  }
  if(top){
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(header)}},{passive:true});
    window.addEventListener('resize',header);
    header();
  }

  /* Reveal on scroll, siblings slightly staggered */
  var reveal=all('[data-reveal]');
  if(!hasIO||reduce){
    reveal.forEach(function(el){el.classList.add('in')});
  }else{
    reveal.forEach(function(el){
      var i=0,p=el.previousElementSibling;
      while(p){if(p.hasAttribute('data-reveal'))i++;p=p.previousElementSibling}
      if(i)el.style.transitionDelay=Math.min(i,4)*90+'ms';
    });
    var ro=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}});
    },{rootMargin:'0px 0px -8% 0px'});
    reveal.forEach(function(el){ro.observe(el)});
  }

  /* Scroll story */
  var paper=document.querySelector('.paper');
  var steps=all('.steps li');
  var dots=all('.dots li');
  var loc=document.querySelector('.r-loc-val');
  var nums=all('.report .n');
  if(!paper||!steps.length||!hasIO){steps.forEach(function(s){s.classList.add('on')});return}

  nums.forEach(function(n){n.dataset.v=n.textContent});
  function countUp(){
    if(reduce)return;
    var start=null,dur=900,delay=350;
    nums.forEach(function(n){n.textContent='0'});
    function frame(t){
      if(start===null)start=t;
      var k=Math.min(1,Math.max(0,(t-start-delay)/dur));
      var e=1-Math.pow(1-k,3);
      nums.forEach(function(n){n.textContent=Math.round(e*n.dataset.v)});
      if(k<1)requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var cur=-1;
  function set(n){
    if(n===cur)return;
    var prev=cur;cur=n;
    paper.dataset.step=n;
    var city=n>=2?'Zürich':'?';
    if(loc.textContent!==city){
      loc.textContent=city;
      if(!reduce){loc.classList.remove('flip');void loc.offsetWidth;loc.classList.add('flip')}
    }
    steps.forEach(function(s){s.classList.toggle('on',+s.dataset.step===n)});
    dots.forEach(function(d,i){d.classList.toggle('on',i+1===n);d.classList.toggle('done',i+1<n)});
    if(n===4&&prev!==4)countUp();
  }

  var mobile=window.matchMedia('(max-width:860px)').matches;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)set(+e.target.dataset.step)});
  },{rootMargin:mobile?'-62% 0px -33% 0px':'-45% 0px -45% 0px'});
  steps.forEach(function(s){io.observe(s)});

  /* The receipt prints as soon as the stage is in view */
  var po=new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting&&cur===0)set(1);
  },{threshold:.5});
  po.observe(paper);

  set(0);
})();
