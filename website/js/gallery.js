/* Interactive gallery component
   - Autoplay every 5s
   - Pause on hover
   - Prev/Next buttons
   - Thumbnails click
*/
(function(){
  // Automatically mapped optimized images from assets/optimized/
  const basenames = [
    'image14.webp',
    'image13.webp',
    'image12.webp',
    'image11.webp',
    'image10.webp',
    'image1.webp',
    'bureautique.webp',
    'analyse de donnée.webp',
    'Image18.webp',
    'Image17.webp',
    'image16.webp',
    'image15.webp',
    'image20.webp',
    'image2.webp',
    'image19.webp',
    'image21.webp',
    'image22.webp',
    'infographie.webp',
    'image9.webp',
    'image8.webp',
    'image7.webp',
    'image6.webp',
    'image5.webp',
    'image4.webp',
    'image3.webp',
    'image25.webp',
    'image24.webp',
    'IMAGE23.webp'
  ];
  const images = basenames.map(n => encodeURI('assets/optimized/' + n));

  const main = document.getElementById('mainMedia');
  const thumbsBar = document.querySelector('.gallery-wrap .thumbs-bar');
  const prevBtn = document.querySelector('.gallery-wrap .nav-btn.prev');
  const nextBtn = document.querySelector('.gallery-wrap .nav-btn.next');

  let index = 0; let intervalId = null; const AUTOPLAY_DELAY = 5000; let autoplay = true;

  images.forEach((src,i)=>{
    const t = document.createElement('img');
    t.src = src; t.alt = `Photo ${i+1}`; t.dataset.index = i;
    if(i===0) t.classList.add('active');
    t.addEventListener('click', ()=>{ goTo(i); pauseAutoplay(); });
    thumbsBar.appendChild(t);
  });

  function setMain(src){ main.style.opacity = 0; setTimeout(()=>{ main.src = src; main.style.opacity = 1; }, 180); }
  
  // CORRECTION : scrollIntoView remplacé par scrollTo sur le conteneur interne
  function updateActiveThumb(){ 
    thumbsBar.querySelectorAll('img').forEach(img=>{ 
      img.classList.toggle('active', Number(img.dataset.index) === index); 
    }); 
    const active = thumbsBar.querySelector('img.active'); 
    if(active) {
      const containerWidth = thumbsBar.clientWidth;
      const activeOffset = active.offsetLeft;
      const activeWidth = active.clientWidth;
      thumbsBar.scrollTo({
        left: activeOffset - (containerWidth / 2) + (activeWidth / 2),
        behavior: 'smooth'
      });
    }
  }

  function goTo(i){ index = (i + images.length) % images.length; setMain(images[index]); updateActiveThumb(); }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }

  nextBtn.addEventListener('click', ()=>{ next(); pauseAutoplay(); });
  prevBtn.addEventListener('click', ()=>{ prev(); pauseAutoplay(); });

  function startAutoplay(){ stopAutoplay(); intervalId = setInterval(()=>{ next(); }, AUTOPLAY_DELAY); }
  function stopAutoplay(){ if(intervalId){ clearInterval(intervalId); intervalId = null; } }
  function pauseAutoplay(){ autoplay = false; stopAutoplay(); }

  const galleryWrap = document.querySelector('.gallery-wrap');
  galleryWrap.addEventListener('mouseenter', ()=>{ stopAutoplay(); });
  galleryWrap.addEventListener('mouseleave', ()=>{ if(autoplay) startAutoplay(); });

  setMain(images[0]); updateActiveThumb(); startAutoplay();

  // keyboard navigation
  galleryWrap.tabIndex = 0; galleryWrap.addEventListener('keydown', (e)=>{ if(e.key==='ArrowLeft') prev(); if(e.key==='ArrowRight') next(); });
})();