/* Interactive gallery component
   - Reads the list of images from assets/gallery.json
   - Autoplay every 5s
   - Pause on hover
   - Prev/Next buttons
   - Thumbnails click
*/
(function(){
  const main = document.getElementById('mainMedia');
  const thumbsBar = document.querySelector('.gallery-wrap .thumbs-bar');
  const prevBtn = document.querySelector('.gallery-wrap .nav-btn.prev');
  const nextBtn = document.querySelector('.gallery-wrap .nav-btn.next');
  const galleryWrap = document.querySelector('.gallery-wrap');

  let images = [];
  let index = 0;
  let intervalId = null;
  const AUTOPLAY_DELAY = 5000;
  let autoplay = true;

  const fallbackImages = [
    'assets/optimized/image14.webp',
    'assets/optimized/image13.webp',
    'assets/optimized/image12.webp',
    'assets/optimized/image11.webp',
    'assets/optimized/image10.webp',
    'assets/optimized/image1.webp',
    'assets/optimized/analyse de donnée.webp',
    'assets/optimized/Image18.webp',
    'assets/optimized/Image17.webp',
    'assets/optimized/image16.webp',
    'assets/optimized/image15.webp',
    'assets/optimized/image20.webp',
    'assets/optimized/image2.webp',
    'assets/optimized/image19.webp',
    'assets/optimized/image21.webp',
    'assets/optimized/image22.webp',
    'assets/optimized/image9.webp',
    'assets/optimized/image8.webp',
    'assets/optimized/image7.webp',
    'assets/optimized/image6.webp',
    'assets/optimized/image5.webp',
    'assets/optimized/image4.webp',
    'assets/optimized/image3.webp',
    'assets/optimized/image25.webp',
    'assets/optimized/image24.webp',
    'assets/optimized/IMAGE23.webp'
  ];

  function setMain(src){
    if (!main) return;
    main.style.opacity = 0;
    setTimeout(() => {
      main.src = src;
      main.style.opacity = 1;
    }, 180);
  }

  function updateActiveThumb(){
    if (!thumbsBar) return;
    thumbsBar.querySelectorAll('img').forEach(img => {
      img.classList.toggle('active', Number(img.dataset.index) === index);
    });

    const active = thumbsBar.querySelector('img.active');
    if (active) {
      const containerWidth = thumbsBar.clientWidth;
      const activeOffset = active.offsetLeft;
      const activeWidth = active.clientWidth;
      thumbsBar.scrollTo({
        left: activeOffset - (containerWidth / 2) + (activeWidth / 2),
        behavior: 'smooth'
      });
    }
  }

  function renderThumbs(){
    if (!thumbsBar) return;
    thumbsBar.innerHTML = '';
    images.forEach((image, i) => {
      const t = document.createElement('img');
      t.src = image.thumb;
      t.alt = `Photo ${i + 1}`;
      t.loading = 'lazy';
      t.decoding = 'async';
      t.dataset.index = i;
      if (i === 0) t.classList.add('active');
      t.addEventListener('click', () => { goTo(i); pauseAutoplay(); });
      thumbsBar.appendChild(t);
    });
  }

  function goTo(i){
    if (!images.length) return;
    index = (i + images.length) % images.length;
    setMain(images[index].full);
    updateActiveThumb();
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function startAutoplay(){
    stopAutoplay();
    intervalId = setInterval(() => { next(); }, AUTOPLAY_DELAY);
  }

  function stopAutoplay(){
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function pauseAutoplay(){
    autoplay = false;
    stopAutoplay();
  }

  async function loadGallery(){
    try {
      const response = await fetch('assets/gallery.json');
      if (!response.ok) throw new Error('Manifest non disponible');
      const items = await response.json();
      if (!Array.isArray(items) || !items.length) throw new Error('Manifest vide');

      const valid = items
        .map(item => {
          const full = item.full || item.src || '';
          const thumb = item.thumb || full;
          return full ? { full: encodeURI(full), thumb: encodeURI(thumb) } : null;
        })
        .filter(Boolean);

      if (valid.length) {
        images = valid;
        return;
      }
    } catch (error) {
      console.warn('Chargement du JSON gallery échoué, utilisation du fallback :', error);
    }

    images = fallbackImages.map(src => ({ full: src, thumb: src }));
  }

  async function init(){
    if (!galleryWrap || !main || !thumbsBar) return;

    await loadGallery();
    renderThumbs();

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); pauseAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); pauseAutoplay(); });

    galleryWrap.addEventListener('mouseenter', () => { stopAutoplay(); });
    galleryWrap.addEventListener('mouseleave', () => { if (autoplay) startAutoplay(); });

    galleryWrap.tabIndex = 0;
    galleryWrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    setMain(images[0].full);
    updateActiveThumb();
    startAutoplay();
  }

  init();
})();