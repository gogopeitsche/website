(function(){
  var root=document.documentElement;
  root.classList.remove('no-js');root.classList.add('js');
  var paper=document.querySelector('.paper');
  var steps=[].slice.call(document.querySelectorAll('.steps li'));
  var loc=document.querySelector('.r-loc-val');
  if(!paper||!steps.length||!('IntersectionObserver' in window)){steps.forEach(function(s){s.classList.add('on')});return}
  function set(n){
    paper.dataset.step=n;
    loc.textContent=n>=2?'Zürich':'Beispiel';
    steps.forEach(function(s){s.classList.toggle('on',s.dataset.step===String(n))});
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)set(+e.target.dataset.step)});
  },{rootMargin:window.matchMedia('(max-width:860px)').matches?'-62% 0px -33% 0px':'-45% 0px -45% 0px'});
  steps.forEach(function(s){io.observe(s)});
  set(1);
})();
