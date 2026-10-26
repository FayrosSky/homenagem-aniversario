// script.js – Clean functional version for the birthday tribute
/*
  Features:
  1️⃣ "Abrir minha surpresa" – overlay with message and confetti.
  2️⃣ "Ir para a mensagem" – smooth scroll to the main message section.
  3️⃣ Carousel of memories – auto‑play, photo upload, click to enlarge (modal).
  4️⃣ "Voltar ao início" – smooth scroll to top.
  5️⃣ Scroll‑in animations via IntersectionObserver.
*/

// ---------- Helper: ensure DOM is ready ----------
function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

onReady(() => {
  // ---------- 1️⃣ Surprise overlay ----------
  const openBtn = document.getElementById('openSurprise');
  const hero = document.getElementById('hero');
  if (openBtn && hero) {
    openBtn.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.id = 'surpriseOverlay';
      Object.assign(overlay.style, {
        position: 'absolute',
        inset: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        zIndex: '10',
        backdropFilter: 'blur(4px)',
        transition: 'opacity 0.4s',
      });

      const msg = document.createElement('p');
      msg.textContent = 'Eliente, você ilumina nossas vidas como estrelas no céu!';
      Object.assign(msg.style, {
        fontSize: '1.4rem',
        textAlign: 'center',
        maxWidth: '80%',
      });
      overlay.appendChild(msg);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Continuar';
      closeBtn.className = 'cta-button';
      closeBtn.style.marginTop = '1.5rem';
      closeBtn.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 350);
      });
      overlay.appendChild(closeBtn);

      // simple confetti element – CSS animation added later
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      overlay.appendChild(confetti);

      hero.appendChild(overlay);
    });
  }

  // ---------- 2️⃣ Direct navigation ----------
  const goNextBtn = document.getElementById('goNext');
  const mensagemSection = document.getElementById('mensagem');
  if (goNextBtn && mensagemSection) {
    goNextBtn.addEventListener('click', () => {
      mensagemSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- 3️⃣ Carousel (auto‑play, upload, modal) ----------
  const carouselTrack = document.getElementById('carouselTrack');
  const addPhotosBtn = document.getElementById('addPhotosBtn');
  const photoInput = document.getElementById('photoInput');

  // Modal for enlarged view
  const modal = document.createElement('div');
  modal.id = 'photoModal';
  modal.innerHTML = `
    <span class="close">&times;</span>
    <img src="" alt="Preview" />
  `;
  Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '100',
  });
  document.body.appendChild(modal);

  const closeModal = () => (modal.style.display = 'none');
  modal.querySelector('.close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Click on carousel items to open modal
  carouselTrack.addEventListener('click', e => {
    const img = e.target.closest('.carousel-item')?.querySelector('img');
    if (img) {
      modal.querySelector('img').src = img.src;
      modal.querySelector('img').alt = img.alt;
      modal.style.display = 'flex';
    }
  });

  // Photo upload handling
  if (addPhotosBtn && photoInput) {
    addPhotosBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', e => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          // Find first empty carousel item or create new one
          let target = Array.from(carouselTrack.children).find(item => !item.querySelector('img'));
          if (!target) {
            target = document.createElement('div');
            target.className = 'carousel-item';
            carouselTrack.appendChild(target);
          }
          target.innerHTML = `<img src="${ev.target.result}" alt="${file.name}" />`;
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    });
  }

  // Auto‑play carousel
  let currentIndex = 0;
  function showSlide(index) {
    const total = carouselTrack.children.length;
    if (total === 0) return;
    const offset = -index * 100; // percent
    carouselTrack.style.transform = `translateX(${offset}%)`;
  }
  function nextSlide() {
    const total = carouselTrack.children.length;
    if (total === 0) return;
    currentIndex = (currentIndex + 1) % total;
    showSlide(currentIndex);
  }
  // Initialise first slide position
  showSlide(0);
  setInterval(nextSlide, 3000);

  // ---------- 4️⃣ Back to top ----------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- 5️⃣ Scroll‑in animations ----------
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

  // ---------- Dynamic CSS for confetti & section fade ----------
  const dynStyle = document.createElement('style');
  dynStyle.textContent = `
    .confetti {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, var(--cor-dourado) 1px, transparent 1px);
      background-size: 8px 8px;
      animation: confetti 2s linear infinite;
      opacity: 0.4;
    }
    @keyframes confetti {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .section {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity .6s ease-out, transform .6s ease-out;
    }
    .section.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(dynStyle);
});
