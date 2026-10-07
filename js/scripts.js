document.addEventListener('DOMContentLoaded', function(){
  // Navbar style on scroll
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY>50) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });

  // Gallery filters — buttons will be generated after loading gallery.json

  // Initialize gallery from static .gallery-img elements
  let galleryItems = [];
  let currentMediaIndex = 0;

  function openMedia(index){
    const it = galleryItems[index];
    if(!it) return;
    const modalImg = document.getElementById('mediaModalImg');
    const caption = document.getElementById('mediaCaption');
    modalImg.src = it.full;
    caption.textContent = it.caption || '';
    currentMediaIndex = index;
    const modalEl = document.getElementById('mediaModal');
    const bs = new bootstrap.Modal(modalEl);
    bs.show();
  }

  // collect static images
  const staticImgs = Array.from(document.querySelectorAll('.gallery-img'));
  galleryItems = staticImgs.map((img, idx)=>({ full: img.src, thumb: img.src, caption: img.dataset.caption || img.alt || '' }));
  staticImgs.forEach((img, idx)=>{
    img.setAttribute('data-idx', idx);
    img.addEventListener('click', ()=>openMedia(idx));
  });

  document.getElementById('prevMedia').addEventListener('click', ()=>{
    if(currentMediaIndex>0) openMedia(currentMediaIndex-1);
  });
  document.getElementById('nextMedia').addEventListener('click', ()=>{
    if(currentMediaIndex<galleryItems.length-1) openMedia(currentMediaIndex+1);
  });

  document.addEventListener('keydown', (e)=>{
    if(!document.querySelector('#mediaModal.show')) return;
    if(e.key==='ArrowLeft'){
      if(currentMediaIndex>0) openMedia(currentMediaIndex-1);
    } else if(e.key==='ArrowRight'){
      if(currentMediaIndex<galleryItems.length-1) openMedia(currentMediaIndex+1);
    }
  });

  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const feedback = document.getElementById('contactFeedback');
    const formspreeId = contactForm.dataset.formspreeId || '';

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const firstName = (formData.get('first_name') || '').trim();
      const lastName = (formData.get('last_name') || '').trim();
      const email = (formData.get('email') || '').trim();
      const subject = (formData.get('subject') || '').trim();
      const message = (formData.get('message') || '').trim();

      const body = [
        'Prénom: ' + firstName,
        'Nom: ' + lastName,
        'Email: ' + email,
        '',
        'Objet: ' + subject,
        '',
        'Message:',
        message
      ].join('\n');

      const mailtoUrl = `mailto:betatechcam01@gmail.com?subject=${encodeURIComponent(subject || 'Demande de contact')}&body=${encodeURIComponent(body)}`;

      if (formspreeId) {
        try {
          const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            if (feedback) {
              feedback.className = 'alert alert-success';
              feedback.textContent = 'Votre message a bien été envoyé.';
              feedback.classList.remove('d-none');
            }
            contactForm.reset();
            return;
          }
        } catch (error) {
          console.warn('Formspree indisponible, bascule sur mailto.', error);
        }
      }

      window.location.href = mailtoUrl;
      if (feedback) {
        feedback.className = 'alert alert-success';
        feedback.textContent = 'Votre client de messagerie va s’ouvrir pour finaliser l’envoi.';
        feedback.classList.remove('d-none');
      }
      contactForm.reset();
    });
  }

  // Simple form validation / disabled submit until valid
  const form = document.getElementById('preinscription');
  if(form){
    const submit = form.querySelector('button[type=submit]');

    // populate module options depending on filiere
    const filiereSelect = document.getElementById('filiere');
    const moduleSelect = document.getElementById('module');
    const modulesMap = {
      'Bureautique': ['Word (traitement de texte)','Excel (tableur)','PowerPoint (présentation)','Gestion de données'],
      'Maintenance': ['Réparation matérielle','Installation logicielle','Réseaux de base','Diagnostic'],
      'Langues': ['Français (tous niveaux)','Anglais (tous niveaux)','Langues optionnelles']
    };

    function populateModules(f){
      moduleSelect.innerHTML = '';
      if(!f || !modulesMap[f]){
        const opt = document.createElement('option'); opt.value=''; opt.textContent='-- Sélectionnez la filière d\'abord --'; moduleSelect.appendChild(opt); return;
      }
      const opt0 = document.createElement('option'); opt0.value=''; opt0.textContent='Choisir...'; moduleSelect.appendChild(opt0);
      modulesMap[f].forEach(m=>{
        const o = document.createElement('option'); o.value = m; o.textContent = m; moduleSelect.appendChild(o);
      })
    }

    filiereSelect.addEventListener('change', (e)=>{
      populateModules(e.target.value);
    });

    // custom validation messages
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const niveauSelect = document.getElementById('niveau');
    const consent = document.getElementById('consent');

    function setFeedback(input, msg){
      const fb = input.closest('.mb-3').querySelector('.invalid-feedback');
      if(fb) fb.textContent = msg || '';
    }

    nameInput.addEventListener('input', ()=>{
      if(nameInput.validity.valueMissing) setFeedback(nameInput,'Veuillez indiquer votre nom complet.');
      else if(nameInput.value.length<3) setFeedback(nameInput,'Le nom doit contenir au moins 3 caractères.');
      else setFeedback(nameInput,'');
    });

    emailInput.addEventListener('input', ()=>{
      if(emailInput.validity.valueMissing) setFeedback(emailInput,'Veuillez indiquer votre adresse email.');
      else if(emailInput.validity.typeMismatch) setFeedback(emailInput,'Format d\'email invalide.');
      else setFeedback(emailInput,'');
    });

    phoneInput.addEventListener('input', ()=>{
      const pattern = phoneInput.getAttribute('pattern');
      const re = new RegExp('^'+pattern+'$');
      if(phoneInput.validity.valueMissing) setFeedback(phoneInput,'Veuillez indiquer votre numéro de téléphone.');
      else if(!re.test(phoneInput.value)) setFeedback(phoneInput,'Format de numéro invalide.');
      else setFeedback(phoneInput,'');
    });

    niveauSelect.addEventListener('change', ()=>{
      if(niveauSelect.value==='') setFeedback(niveauSelect,'Veuillez choisir votre niveau.'); else setFeedback(niveauSelect,'');
    });

    consent.addEventListener('change', ()=>{
      if(!consent.checked) setFeedback(consent,'Le consentement est requis pour continuer.'); else setFeedback(consent,'');
    });

    form.addEventListener('input', ()=>{
      submit.disabled = !form.checkValidity();
    });

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      // Here you can integrate Formspree / EmailJS / backend. For now show confirmation modal.
      const modalEl = document.getElementById('confirmModal');
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
      form.reset();
      populateModules('');
      submit.disabled = true;
    })
  }

  // WhatsApp button
  const wa = document.getElementById('whatsappBtn');
  if(wa){
    wa.addEventListener('click', ()=>{
      const url = wa.dataset.url || 'https://wa.me/';
      window.open(url,'_blank');
    });
  }

  // Animate about section counters when visible
  const statEls = document.querySelectorAll('.stat-number');
  if(statEls.length){
    const animate = (el)=>{
      const target = +el.dataset.target;
      const start = 0;
      const duration = 1200;
      const stepTime = Math.max(Math.floor(duration / target), 20);
      let current = start;
      const inc = Math.max(1, Math.floor(target / (duration / stepTime)));
      const iv = setInterval(()=>{
        current += inc;
        if(current >= target){ el.textContent = target; clearInterval(iv);} else el.textContent = current;
      }, stepTime);
    };

    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ animate(en.target); o.unobserve(en.target); }
      });
    },{threshold:0.4});

    statEls.forEach(el=>{ el.textContent = '0'; obs.observe(el); });
  }

  // Swiper initialization removed — formations are a static grid now
});
