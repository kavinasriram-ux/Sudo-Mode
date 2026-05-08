/* =============================================
   AMMA — A STORY IN YEARS
   script.js
   ============================================= */

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

const DEFAULT_TITLES = {
  2020: 'Covid Times Were Amazing',
  2021: 'Finding Light Again',
  2022: 'New Years',
  2023: 'Poonal Year',
  2024: 'Family First!',
  2025: 'Always Together, Forever',
  2026: 'Our Greatest Gift is you, Amma!'
};

const DEFAULT_CAPTIONS = {
  2020: 'Even in the hardest of times, you were there for us, feeding, bathing, and helping us get onto Zoom!',
  2021: 'You reminded us what truly matters, our family.',
  2022: 'Having you in our lives makes our lives a lot better, more than you will ever know',
  2023: 'The little moments with you are the ones we will treasure forever.',
  2024: 'You took care of Kavin for 10 years!!',
  2025: 'No matter where life takes us, we always find our way back to you.',
  2026: 'You are, and always will be, the heart of our family.'
};

// State
let slides = YEARS.map(year => ({
  year,
  title: DEFAULT_TITLES[year],
  caption: DEFAULT_CAPTIONS[year],
  photo: null,
  theme: 'warm',
  layout: 'left',
  notes: ''
}));

let currentIndex = 0;

// DOM refs
const introScreen   = document.getElementById('intro-screen');
const beginBtn      = document.getElementById('begin-btn');
const app           = document.getElementById('app');
const thumbnailList = document.getElementById('thumbnail-list');
const slideCanvas   = document.getElementById('slide-canvas');
const slideInner    = document.getElementById('slide-inner');
const photoPH       = document.getElementById('photo-placeholder');
const slidePhoto    = document.getElementById('slide-photo');
const changePhotoBtn = document.getElementById('change-photo-btn');
const photoInput    = document.getElementById('photo-input');
const slideYear     = document.getElementById('slide-year-display');
const slideTitle    = document.getElementById('slide-title');
const slideCaption  = document.getElementById('slide-caption');
const slideCounter  = document.getElementById('slide-counter');
const prevBtn       = document.getElementById('prev-btn');
const nextBtn       = document.getElementById('next-btn');
const yearInput     = document.getElementById('year-input');
const themePicker   = document.getElementById('theme-picker');
const layoutSelect  = document.getElementById('layout-select');
const slideNotes    = document.getElementById('slide-notes');
const addSlideBtn   = document.getElementById('add-slide-btn');
const deleteSlideBtn = document.getElementById('delete-slide-btn');
const uploadBtnSide = document.getElementById('upload-btn-side');
const presentBtn    = document.getElementById('present-btn');
const presentMode   = document.getElementById('present-mode');
const presentSlide  = document.getElementById('present-slide');
const presentPhoto  = document.getElementById('present-photo');
const presentPhotoWrap = document.getElementById('present-photo-wrap');
const presentYear   = document.getElementById('present-year');
const presentTitle  = document.getElementById('present-title');
const presentCaption = document.getElementById('present-caption');
const presentCounter = document.getElementById('present-counter');
const presentPrev   = document.getElementById('present-prev');
const presentNext   = document.getElementById('present-next');
const presentExit   = document.getElementById('present-exit');

let presentIndex = 0;

/* =============================================
   INTRO
   ============================================= */
beginBtn.addEventListener('click', () => {
  introScreen.style.opacity = '0';
  introScreen.style.transition = 'opacity 0.8s ease';
  setTimeout(() => {
    introScreen.classList.add('hidden');
    app.classList.remove('hidden');
    app.style.opacity = '0';
    app.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { app.style.opacity = '1'; });
    });
    buildThumbnails();
    renderSlide(0);
  }, 800);
});

/* =============================================
   THUMBNAILS
   ============================================= */
function buildThumbnails() {
  thumbnailList.innerHTML = '';
  slides.forEach((slide, i) => {
    const item = document.createElement('div');
    item.className = 'thumb-item' + (i === currentIndex ? ' active' : '');
    item.dataset.index = i;

    const preview = document.createElement('div');
    preview.className = 'thumb-preview';

    if (slide.photo) {
      const img = document.createElement('img');
      img.src = slide.photo;
      img.alt = slide.year;
      preview.appendChild(img);
    } else {
      const num = document.createElement('span');
      num.className = 'thumb-num';
      num.textContent = slide.year;
      preview.appendChild(num);
    }

    const info = document.createElement('div');
    info.className = 'thumb-info';
    info.innerHTML = `
      <div class="thumb-year">${slide.year}</div>
      <div class="thumb-slide-title">${slide.title || 'Untitled'}</div>
    `;

    item.appendChild(preview);
    item.appendChild(info);
    item.addEventListener('click', () => goToSlide(i));
    thumbnailList.appendChild(item);
  });
}

function updateThumbnail(index) {
  const items = thumbnailList.querySelectorAll('.thumb-item');
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index);
    const slide = slides[i];
    const preview = item.querySelector('.thumb-preview');
    preview.innerHTML = '';
    if (slide.photo) {
      const img = document.createElement('img');
      img.src = slide.photo;
      preview.appendChild(img);
    } else {
      const num = document.createElement('span');
      num.className = 'thumb-num';
      num.textContent = slide.year;
      preview.appendChild(num);
    }
    const info = item.querySelector('.thumb-info');
    info.innerHTML = `
      <div class="thumb-year">${slide.year}</div>
      <div class="thumb-slide-title">${slide.title || 'Untitled'}</div>
    `;
  });
}

/* =============================================
   RENDER SLIDE
   ============================================= */
function renderSlide(index) {
  const slide = slides[index];

  // Layout
  slideInner.className = 'slide-inner layout-' + slide.layout;

  // Theme
  slideCanvas.className = 'slide-canvas theme-' + slide.theme;

  // Year label
  slideYear.textContent = slide.year;

  // Title & Caption
  slideTitle.textContent = slide.title;
  slideCaption.textContent = slide.caption;

  // Photo
  if (slide.photo) {
    photoPH.classList.add('hidden');
    slidePhoto.classList.remove('hidden');
    changePhotoBtn.classList.remove('hidden');
    slidePhoto.src = slide.photo;
  } else {
    photoPH.classList.remove('hidden');
    slidePhoto.classList.add('hidden');
    changePhotoBtn.classList.add('hidden');
  }

  // Counter
  slideCounter.textContent = `${index + 1} / ${slides.length}`;

  // Right panel
  yearInput.value = slide.year;
  layoutSelect.value = slide.layout;
  slideNotes.value = slide.notes;

  // Theme picker active
  document.querySelectorAll('.theme-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.theme === slide.theme);
  });

  updateThumbnail(index);
  currentIndex = index;
}

function goToSlide(i) {
  saveCurrent();
  currentIndex = i;
  renderSlide(i);
}

/* =============================================
   SAVE CURRENT EDITS
   ============================================= */
function saveCurrent() {
  const slide = slides[currentIndex];
  slide.title = slideTitle.textContent;
  slide.caption = slideCaption.textContent;
  slide.notes = slideNotes.value;
}

/* =============================================
   NAVIGATION
   ============================================= */
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) goToSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
});

document.addEventListener('keydown', e => {
  if (presentMode.classList.contains('hidden') && !e.target.matches('[contenteditable]')) {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
  }
});

/* =============================================
   PHOTO UPLOAD
   ============================================= */
function handlePhotoFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    slides[currentIndex].photo = e.target.result;
    renderSlide(currentIndex);
    updateThumbnail(currentIndex);
  };
  reader.readAsDataURL(file);
}

photoInput.addEventListener('change', e => {
  handlePhotoFile(e.target.files[0]);
  e.target.value = '';
});

changePhotoBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = e => handlePhotoFile(e.target.files[0]);
  input.click();
});

uploadBtnSide.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = e => handlePhotoFile(e.target.files[0]);
  input.click();
});

// Drag and drop onto canvas
slideCanvas.addEventListener('dragover', e => { e.preventDefault(); slideCanvas.style.outline = '2px solid #c9956a'; });
slideCanvas.addEventListener('dragleave', () => { slideCanvas.style.outline = ''; });
slideCanvas.addEventListener('drop', e => {
  e.preventDefault();
  slideCanvas.style.outline = '';
  const file = e.dataTransfer.files[0];
  handlePhotoFile(file);
});

/* =============================================
   SETTINGS
   ============================================= */
yearInput.addEventListener('input', () => {
  slides[currentIndex].year = parseInt(yearInput.value) || slides[currentIndex].year;
  slideYear.textContent = slides[currentIndex].year;
  updateThumbnail(currentIndex);
});

layoutSelect.addEventListener('change', () => {
  slides[currentIndex].layout = layoutSelect.value;
  slideInner.className = 'slide-inner layout-' + layoutSelect.value;
});

themePicker.addEventListener('click', e => {
  const sw = e.target.closest('.theme-swatch');
  if (!sw) return;
  slides[currentIndex].theme = sw.dataset.theme;
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
  sw.classList.add('active');
  slideCanvas.className = 'slide-canvas theme-' + sw.dataset.theme;
});

slideNotes.addEventListener('input', () => {
  slides[currentIndex].notes = slideNotes.value;
});

/* =============================================
   TITLE & CAPTION EDITING
   ============================================= */
slideTitle.addEventListener('input', () => {
  slides[currentIndex].title = slideTitle.textContent;
  const items = thumbnailList.querySelectorAll('.thumb-item');
  const item = items[currentIndex];
  if (item) {
    const t = item.querySelector('.thumb-slide-title');
    if (t) t.textContent = slideTitle.textContent || 'Untitled';
  }
});

slideCaption.addEventListener('input', () => {
  slides[currentIndex].caption = slideCaption.textContent;
});

/* =============================================
   ADD SLIDE
   ============================================= */
addSlideBtn.addEventListener('click', () => {
  const lastYear = slides[slides.length - 1]?.year || 2026;
  const newYear = lastYear + 1;
  slides.push({
    year: newYear,
    title: `Year ${newYear}`,
    caption: 'Add a memory for this year...',
    photo: null,
    theme: 'warm',
    layout: 'left',
    notes: ''
  });
  buildThumbnails();
  goToSlide(slides.length - 1);
});

/* =============================================
   DELETE SLIDE
   ============================================= */
deleteSlideBtn.addEventListener('click', () => {
  if (slides.length <= 1) return;
  slides.splice(currentIndex, 1);
  const newIndex = Math.min(currentIndex, slides.length - 1);
  buildThumbnails();
  renderSlide(newIndex);
});

/* =============================================
   PRESENTATION MODE
   ============================================= */
function openPresent(startIndex = 0) {
  saveCurrent();
  presentIndex = startIndex;
  presentMode.classList.remove('hidden');
  renderPresent();
}

function renderPresent() {
  const slide = slides[presentIndex];
  presentYear.textContent = slide.year;
  presentTitle.textContent = slide.title;
  presentCaption.textContent = slide.caption;
  presentCounter.textContent = `${presentIndex + 1} / ${slides.length}`;

  // Apply theme to present slide
  presentSlide.className = 'present-slide theme-' + slide.theme;

  if (slide.photo) {
    presentPhotoWrap.style.display = '';
    presentPhoto.src = slide.photo;
  } else {
    presentPhotoWrap.style.display = 'none';
  }

  // Animate
  presentSlide.style.animation = 'none';
  void presentSlide.offsetWidth;
  presentSlide.style.animation = 'slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both';
}

presentBtn.addEventListener('click', () => openPresent(currentIndex));

presentPrev.addEventListener('click', () => {
  if (presentIndex > 0) { presentIndex--; renderPresent(); }
});

presentNext.addEventListener('click', () => {
  if (presentIndex < slides.length - 1) { presentIndex++; renderPresent(); }
});

presentExit.addEventListener('click', () => {
  presentMode.classList.add('hidden');
});

document.addEventListener('keydown', e => {
  if (!presentMode.classList.contains('hidden')) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      if (presentIndex < slides.length - 1) { presentIndex++; renderPresent(); }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (presentIndex > 0) { presentIndex--; renderPresent(); }
    }
    if (e.key === 'Escape') {
      presentMode.classList.add('hidden');
    }
  }
});

// Theme-aware present slide text
const themeTextColors = {
  warm: { year: '#c9956a', title: '#3a2e24', caption: '#8c7b6b', bg: '#fdf8f0' },
  blush: { year: '#c96a8a', title: '#3a2430', caption: '#8c6b74', bg: '#fdf0f3' },
  sage: { year: '#6a9a6a', title: '#243024', caption: '#6b8c6b', bg: '#f2f6f0' },
  midnight: { year: '#9a8fc8', title: '#f0ecfa', caption: '#8a85a8', bg: '#1a1a2e' },
  ivory: { year: '#a08060', title: '#2c2418', caption: '#7a6a58', bg: '#faf8f3' },
  dusk: { year: '#c8a0e0', title: '#f4eefa', caption: '#9a80b0', bg: '#2e1f3e' }
};

const _origRenderPresent = renderPresent;
function renderPresent() {
  _origRenderPresent();
  const slide = slides[presentIndex];
  const colors = themeTextColors[slide.theme] || themeTextColors.warm;
  presentSlide.style.background = colors.bg;
  presentYear.style.color = colors.year;
  presentTitle.style.color = colors.title;
  presentCaption.style.color = colors.caption;
  presentPhotoWrap.style.background = slide.photo ? 'transparent' : '#e8ddd0';
}
