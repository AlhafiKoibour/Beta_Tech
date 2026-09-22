document.addEventListener('DOMContentLoaded',function(){
  // counters
  document.querySelectorAll('.counter').forEach(c=>{
    const target=+c.dataset.target;let v=0;const step=Math.ceil(target/100);
    const iv=setInterval(()=>{v+=step;c.textContent=v; if(v>=target){c.textContent=target;clearInterval(iv)}},18);
  });

  // quiz navigation
  const quiz=document.getElementById('quiz-step');
  quiz.addEventListener('click',e=>{
    if(e.target.classList.contains('next-quiz')){gotoStep(1)}
    if(e.target.classList.contains('prev-quiz')){gotoStep(-1)}
  });
  function gotoStep(dir){
    const pages=[...quiz.querySelectorAll('.quiz-page')];
    const current=pages.findIndex(p=>!p.classList.contains('d-none'));
    pages[current].classList.add('d-none');
    const next=Math.min(Math.max(0,current+dir),pages.length-1);
    pages[next].classList.remove('d-none');
  }

  // quiz option toggles
  document.querySelectorAll('.quiz-option,.level-option').forEach(b=>b.addEventListener('click',e=>e.currentTarget.classList.toggle('active')));

  // program filters
  document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',function(){
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.accordion-item').forEach(it=>{
      it.style.display=(f==='all'||it.dataset.format===f)?'block':'none';
    });
  }));

  // faq search
  const faqInput=document.getElementById('faqSearch');
  faqInput.addEventListener('input',()=>{
    const q=faqInput.value.toLowerCase();
    document.querySelectorAll('#faqList .list-group-item').forEach(it=>{
      it.style.display=(it.textContent.toLowerCase().includes(q))?'block':'none';
    });
  });

  // open enroll buttons
  document.querySelectorAll('#openEnroll,#openEnroll2,#openEnroll').forEach(b=>b.addEventListener('click',()=>{
    window.location.href='index.html#contact';
  }));
});
