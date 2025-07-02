
// Photo and Visit Data
async function fetchAndRenderPhotos() {
    try {
        const res = await fetch('http://localhost:3000/api/photos');
        const photoData = await res.json();  // ✅ now this has data
        renderGallery(photoData);           // ✅ pass it to gallery renderer
    } catch (err) {
        console.error('Failed to load photos', err);
    }
}



// ✅ Step 2: Trigger on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderPhotos();
});

async function fetchAndRenderVisits() {
    try {
        const res = await fetch('http://localhost:3000/api/visits');
        const data = await res.json();

        // ✅ Convert tags from string to array
        const normalizedVisits = data.map(visit => ({
            ...visit,
            tags: visit.tags ? visit.tags.split(',') : []
        }));

        filteredVisits = [...normalizedVisits];
        renderVisitTimeline(filteredVisits);
    } catch (err) {
        console.error('❌ Failed to load visit timeline', err);
    }
}

async function fetchAndRenderEvents() {
    try {
        const res = await fetch('http://localhost:3000/api/events');
        const eventData = await res.json();
        renderEvents(eventData); // 👈 pass to renderer
    } catch (err) {
        console.error('Failed to load events', err);
    }
}

async function fetchPhotosAndRenderCarousel() {
    try {
        const res = await fetch('/api/photos');
        const photos = await res.json();

        const carousel = document.getElementById('galleryCarousel');
        carousel.innerHTML = '';

        photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" />
        <div class="gallery-card-content">
          <h3>${photo.title}</h3>
          <p>${photo.location} • ${photo.year}</p>
          <p>${photo.description}</p>
        </div>
      `;
            carousel.appendChild(card);
        });
    } catch (err) {
        console.error('❌ Failed to load photos:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPhotosAndRenderCarousel();

    document.getElementById('prevBtn').addEventListener('click', () => {
        document.getElementById('galleryCarousel').scrollBy({
            left: -window.innerWidth * 0.4,
            behavior: 'smooth'
        });
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        document.getElementById('galleryCarousel').scrollBy({
            left: window.innerWidth * 0.4,
            behavior: 'smooth'
        });
    });
});


// Global variables
let currentFilter = 'all';
let currentYear = 'all';
let filteredPhotos = [];
let filteredVisits = [];

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Gallery Functions
function renderGallery(photos) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !photos) return;

    galleryGrid.innerHTML = '';

    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.id = photo.id;
        item.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}" loading="lazy" />
            <div class="gallery-overlay">
                <h4>${photo.title}</h4>
                <p>${photo.location} • ${photo.year}</p>
            </div>
        `;
        galleryGrid.appendChild(item);
    });
}





function openPhotoModal(photo) {
    const modal = document.getElementById('photoModal');
    if (!modal) return;
    modal.querySelector('.modal-image').src = photo.src;
    modal.querySelector('.modal-title').textContent = photo.title;
    modal.querySelector('.modal-location').textContent = `${photo.location} • ${photo.year}`;
    modal.querySelector('.modal-description').textContent = photo.description;
    modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    // Add click listener only once
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.addEventListener('click', function (e) {
            const item = e.target.closest('.gallery-item');
            if (!item) return;
            const id = parseInt(item.dataset.id);
            const photo = photoData.find(p => p.id === id);
            if (photo) openPhotoModal(photo);
        });
    }

    // Close modal
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
});



function openPhotoModal(photo) {
    const modal = document.getElementById('photoModal');
    if (!modal) return;
    modal.querySelector('.modal-image').src = photo.src;
    modal.querySelector('.modal-title').textContent = photo.title;
    modal.querySelector('.modal-location').textContent = `${photo.location} • ${photo.year}`;
    modal.querySelector('.modal-description').textContent = photo.description;
    modal.classList.add('active');
}

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});




function filterPhotos() {
    filteredPhotos = photoData.filter(photo => {
        const matchesTag = currentFilter === 'all' || photo.tags.includes(currentFilter);
        const matchesYear = currentYear === 'all' || photo.year.toString() === currentYear;
        return matchesTag && matchesYear;
    });

    renderGallery(filteredPhotos);
}

function searchPhotos(query) {
    if (!query.trim()) {
        filterPhotos();
        return;
    }

    const searchResults = filteredPhotos.filter(photo => {
        const searchText = query.toLowerCase();
        return (
            photo.title.toLowerCase().includes(searchText) ||
            photo.location.toLowerCase().includes(searchText) ||
            photo.animal.toLowerCase().includes(searchText) ||
            photo.tags.some(tag => tag.toLowerCase().includes(searchText))
        );
    });

    renderGallery(searchResults);
}

// Visit Timeline Functions
function renderVisitTimeline(visits = filteredVisits) {
    const timeline = document.getElementById('visitTimeline');
    if (!timeline) return;

    timeline.innerHTML = '';

    visits.forEach(visit => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.dataset.visitId = visit.id;

        timelineItem.innerHTML = `
      <div class="timeline-image">
        <img src="${visit.thumbnail}" alt="${visit.title}" loading="lazy" />
      </div>
      <div class="timeline-content">
        <h3>${visit.title}</h3>
        <p class="timeline-date">${visit.date}</p>
        <p class="timeline-description">${visit.description}</p>
        <div class="timeline-tags">
          ${visit.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;

        timelineItem.addEventListener('click', () => openVisitModal(visit));
        timeline.appendChild(timelineItem);
    });
}

function filterVisits() {
    filteredVisits = visitData.filter(visit => {
        return currentYear === 'all' || visit.year.toString() === currentYear;
    });

    renderVisitTimeline(filteredVisits);
}

function openVisitModal(visit) {
    const modal = document.getElementById('visitModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalGallery = document.getElementById('modalGallery');

    modalTitle.textContent = visit.title;
    modalDescription.textContent = visit.description;

    modalGallery.innerHTML = '';
    visit.images.forEach(imageId => {
        const photo = photoData.find(p => p.id === imageId);
        if (photo) {
            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.title;
            img.loading = 'lazy';
            modalGallery.appendChild(img);
        }
    });

    modal.classList.add('active');
}

// Events Functions
function renderEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = '';

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
      <div class="event-image">
        <img src="${event.image}" alt="${event.title}" loading="lazy" />
      </div>
      <div class="event-content">
        <h3>${event.title}</h3>
        <p class="event-year">${event.year}</p>
        <p class="event-description">${event.description}</p>
      </div>
    `;
        eventCard.addEventListener('click', () => openEventModal(event));
        eventsGrid.appendChild(eventCard);
    });
}


function openEventModal(event) {
    const modal = document.getElementById('eventModal');
    const modalImage = document.getElementById('eventModalImage');
    const modalTitle = document.getElementById('eventModalTitle');
    const modalYear = document.getElementById('eventModalYear');
    const modalDescription = document.getElementById('eventModalDescription');

    modalImage.src = event.image;
    modalImage.alt = event.title;
    modalTitle.textContent = event.title;
    modalYear.textContent = `${event.year} • ${event.venue}`;
    modalDescription.textContent = event.description;

    modal.classList.add('active');
}

// Modal Functions
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// Event Listeners
function setupEventListeners() {
    // Tag filter buttons
    document.querySelectorAll('.tag-filter').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tag-filter').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.tag;
            filterPhotos();
        });
    });

    // Year filter buttons
    document.querySelectorAll('.year-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.year-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentYear = button.dataset.year;
            filterPhotos();
            filterVisits();
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debouncedSearch = debounce((query) => searchPhotos(query), 300);
        searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    }

    // Setup modals
    setupModals();
}

// Scroll Effects
function setupScrollEffects() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero background
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-bg');
        if (heroBackground) {
            const yPos = -(scrolled * 0.5);
            heroBackground.style.transform = `translateY(${yPos}px)`;
        }
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Navigation background opacity on scroll
    const nav = document.querySelector('.nav');
    function updateNavigation() {
        const scrolled = window.pageYOffset;
        if (scrolled > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }

    // Combined scroll event handler
    function handleScroll() {
        requestAnimationFrame(() => {
            updateParallax();
            updateNavigation();
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Render initial content
    renderGallery();
    renderVisitTimeline();
    fetchAndRenderVisits();
    fetchAndRenderEvents();

    // Setup event listeners
    setupEventListeners();
    setupScrollEffects();

    // Add loading state handling
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any layout-dependent elements
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        const yPos = -(scrolled * 0.5);
        heroBackground.style.transform = `translateY(${yPos}px)`;
    }
});

// Preload hero image for better performance
const heroImg = new Image();
heroImg.src = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&h=1080&fit=crop';

// Add loading state
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
