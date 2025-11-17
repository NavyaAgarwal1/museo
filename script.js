// --- 1. Static Data Store (Organized by Categories) ---
const ARTWORKS_BY_CATEGORY = {
    "Renaissance": [
        { id: 'r001', title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: 1503, medium: 'Oil on Poplar Panel', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg', description: 'A classic portrait known for its sfumato technique, giving the subject an enigmatic smile. It represents the height of Renaissance humanism.' },
        { id: 'r002', title: 'The Creation of Adam', artist: 'Michelangelo', year: 1512, medium: 'Fresco', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3G7lQMrPUI19cZInI-xkt789wHqNBtIlKiA&s', description: 'Part of the Sistine Chapel ceiling, depicting God giving life to Adam. A powerful symbol of the Renaissance focus on the human form.' },
        { id: 'r003', title: 'Primavera', artist: 'Sandro Botticelli', year: 1482, medium: 'Tempera on Panel', image: 'https://www.datocms-assets.com/103094/1688660198-1543409165944481-primavera-grazie.jpg?auto=format%2Ccompress&cs=srgb&max-w=800', description: 'A large panel painting celebrating the arrival of Spring, featuring mythological figures in a lush garden setting.' },
    ],
    "Modern": [
        { id: 'm001', title: 'The Scream', artist: 'Edvard Munch', year: 1893, medium: 'Tempera and Crayon on Cardboard', image: 'https://www.datocms-assets.com/103094/1688660198-1543409165944481-primavera-grazie.jpg?auto=format%2Ccompress&cs=srgb&max-w=800', description: 'An iconic work of Expressionism, reflecting the anxiety and mental turmoil of modern life at the turn of the century.' },
        { id: 'm002', title: 'Starry Night', artist: 'Vincent van Gogh', year: 1889, medium: 'Oil on Canvas', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy-G_yAZ0-6OB3Pw2Od0cWUgbE0rZOhRfeA&s', description: 'Post-Impressionist masterpiece characterized by its swirling impasto brushstrokes and vibrant nocturnal sky.' },
        { id: 'm003', title: 'Les Demoiselles d\'Avignon', artist: 'Pablo Picasso', year: 1907, medium: 'Oil on Canvas', image: 'https://www.moma.org/media/W1siZiIsIjQzODQ1MiJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg?sha=8b2a1c3992bba555', description: 'A proto-Cubist work that broke with traditional representation, paving the way for Cubism and modern art.' },
    ],
    "Abstract": [
        { id: 'a001', title: 'Composition II', artist: 'Wassily Kandinsky', year: 1913, medium: 'Oil on Canvas', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDX1zSlb_l7pXDE3iErvrXq_YkeXpWQ4z-9w&s', description: 'A complex swirl of colors and forms, considered one of the most important compositions of the abstract expressionist movement.' },
        { id: 'a002', title: 'No. 5, 1948', artist: 'Jackson Pollock', year: 1948, medium: 'Oil on Fiberboard', image: 'https://upload.wikimedia.org/wikipedia/en/4/4a/No._5%2C_1948.jpg', description: 'A classic example of his "drip" technique, embodying the energy and spontaneous chaos of Abstract Expressionism.' },
        { id: 'a003', title: 'Black Square', artist: 'Kazimir Malevich', year: 1915, medium: 'Oil on Linen', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSp8C0GiP_gxafjXta6qaN1_Fh5-TAvlq3Ag&s', description: 'A foundational work of Suprematism, marking the "zero point of painting" and the rejection of objective representation.' },
    ]
};
const CATEGORIES = Object.keys(ARTWORKS_BY_CATEGORY);
let currentCategoryIndex = 0;

const galleryContainer = document.getElementById('gallery-container');
const startTourBtn = document.getElementById('start-tour-btn');
const gallerySection = document.getElementById('gallery-walkthrough');
const modal = document.getElementById('artwork-focus-modal');
const closeModal = modal.querySelector('.close-btn');
const favoriteArtSelect = document.getElementById('favorite-art');
const feedbackForm = document.getElementById('feedback-form');
const prevBtn = document.getElementById('prev-category'); 
const nextBtn = document.getElementById('next-category');
const categoryTitle = document.getElementById('category-title');
const ALL_ARTWORKS = CATEGORIES.flatMap(cat => ARTWORKS_BY_CATEGORY[cat]);
const thankYouModal = document.getElementById('thank-you-modal');
const thankYouCloseBtn = thankYouModal.querySelector('.close-btn');

// --- 2. Dynamic Content Rendering & Category Navigation ---
function renderArtworkCards(category) {
    const artworks = ARTWORKS_BY_CATEGORY[category];
    galleryContainer.innerHTML = '';
    
    artworks.forEach((art) => {
        const card = document.createElement('div');
        card.className = 'artwork-card fade-in-transition';
        card.setAttribute('data-id', art.id);

        // Card Structure includes hover-details
        card.innerHTML = `
            <img src="${art.image}" alt="${art.title}">
            
            <div class="card-details">
                <h4>${art.title}</h4>
                <p>by ${art.artist}</p>
            </div>

            <div class="hover-details">
                <h4>${art.title}</h4>
                <p>Artist: ${art.artist}</p>
                <p>Year: ${art.year} | Medium: ${art.medium}</p>
                <p class="click-prompt">(Click for Full View)</p>
            </div>
        `;
        
        card.addEventListener('click', () => openArtworkModal(art.id));
        galleryContainer.appendChild(card);
    });

    // Staggered cinematic entrance animation
    galleryContainer.querySelectorAll('.artwork-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`; 
        setTimeout(() => card.classList.add('visible'), 50);
    });
}

function updateGallery(index) {
    if (index >= 0 && index < CATEGORIES.length) {
        currentCategoryIndex = index;
        const currentCategory = CATEGORIES[currentCategoryIndex];
        
        categoryTitle.textContent = currentCategory;
        
        // Cinematic Transition: Fade out content
        galleryContainer.classList.remove('content-visible');
        galleryContainer.classList.add('content-hidden');

        // Wait for the fade-out transition
        setTimeout(() => {
            renderArtworkCards(currentCategory);
            // Cinematic Transition: Fade in content
            galleryContainer.classList.remove('content-hidden');
            galleryContainer.classList.add('content-visible');
        }, 300); 

        // =======================================================
        // FIX: Customized Button Visibility Logic
        // =======================================================
        
        // Disable Left Button Logic:
        
        if (currentCategory === 'Renaissance') {
            prevBtn.disabled = true;
            prevBtn.classList.add('hidden'); 
        } else {
            prevBtn.disabled = currentCategoryIndex === 0;
            prevBtn.classList.remove('hidden');
        }

        // Disable Right Button Logic:
        const lastIndex = CATEGORIES.length - 1;

        if (currentCategory === 'Abstract') {
            nextBtn.disabled = true;
            nextBtn.classList.add('hidden'); 
        } else {
            nextBtn.disabled = currentCategoryIndex === lastIndex;
            nextBtn.classList.remove('hidden');
        }
    }
}

function setupDropdown() {
    ALL_ARTWORKS.forEach(art => {
        const option = document.createElement('option');
        option.value = art.id;
        option.textContent = `${art.title} (${art.artist})`;
        favoriteArtSelect.appendChild(option);
    });
}

// --- 3. Modal and Form Handlers ---
function openArtworkModal(id) {
    const art = ALL_ARTWORKS.find(a => a.id === id);
    if (!art) return;

    document.getElementById('modal-art-image').src = art.image;
    document.getElementById('modal-art-image').alt = art.title;
    document.getElementById('modal-art-title').textContent = art.title;
    document.getElementById('modal-art-artist').textContent = art.artist;
    document.getElementById('modal-art-year').textContent = art.year;
    document.getElementById('modal-art-medium').textContent = art.medium;
    document.getElementById('modal-art-notes').textContent = art.description;

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open'); 
}

function closeArtworkModal() {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// Function to close the Thank You Modal (used by the Share button)
function closeThankYouModal() {
    thankYouModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// **NEW:** Function for client-side form validation
function validateForm(name, email) {
    if (name.trim() === "") {
        alert("Please enter your name.");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}


// --- 4. Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    setupDropdown();
    updateGallery(currentCategoryIndex); 

    startTourBtn.addEventListener('click', () => {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => updateGallery(currentCategoryIndex - 1));
    nextBtn.addEventListener('click', () => updateGallery(currentCategoryIndex + 1));

    closeModal.addEventListener('click', closeArtworkModal);
    
    // Updated listener for thank-you modal close button
    thankYouCloseBtn.addEventListener('click', closeThankYouModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeArtworkModal();
        } else if (e.target === thankYouModal) {
             closeThankYouModal();
        }
    });

    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('visitor-name');
        const emailInput = document.getElementById('visitor-email');
        const name = nameInput.value;
        const email = emailInput.value;
        const comment = document.getElementById('visitor-comment').value;
        const favoriteId = document.getElementById('favorite-art').value;
        
        // **STEP 1: VALIDATION**
        if (!validateForm(name, email)) {
            return; 
        }

        const favoriteArtObject = ALL_ARTWORKS.find(a => a.id === favoriteId);
        const favoriteArt = favoriteArtObject ? favoriteArtObject.title : 'Not selected';

        // **STEP 2: DYNAMIC FEEDBACK SUMMARY**
        const summary = `
            <p>Thank you, <strong>${name}</strong>! Your reflection is valued.</p>
            <p class="summary-detail">Your Email: <em>${email}</em></p>
            <p class="summary-detail">Favorite Masterpiece: <strong>${favoriteArt}</strong></p>
            <p class="summary-comment">Curator Notes: "${comment || 'No comment provided.'}"</p>
        `;
        document.getElementById('reflection-summary').innerHTML = summary;
        
        // **STEP 3: DISPLAY MODAL**
        thankYouModal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Optional: Clear the form after successful submission
        feedbackForm.reset();
    });
});