document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initSkillProgressBars();
});

function initScrollAnimations() {
    const options = {
        root: null,
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-scroll');
            } else {
                entry.target.classList.remove('active-scroll');
            }
        });
    }, options);

    document.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));
}

function initSkillProgressBars() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const progressBar = entry.target.querySelector('.progress-bar');
            if (!progressBar) return;

            if (entry.isIntersecting) {
                progressBar.style.width = progressBar.getAttribute('data-target');
            } else {
                progressBar.style.width = '0%';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));
}

window.openPreviewModal = function (imagePath, certTitle) {
    const modal = document.getElementById("preview-modal");
    const modalImg = modal ? modal.querySelector("img") : null;
    const modalTitle = document.getElementById("modal-cert-title");

    if (modal && modalImg) {
        modalImg.src = imagePath;
        if (modalTitle && certTitle) {
            modalTitle.textContent = certTitle;
        }
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.opacity = "";
        document.body.style.overflow = "hidden";
    }
};

window.closePreviewModal = function () {
    const modal = document.getElementById("preview-modal");
    if (modal) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    }
};

const heroContainer = document.getElementById('hero-interaction-box');
const heroBlobGroup = document.getElementById('heroBlobGroup');
const heroResetBtn = document.getElementById('heroResetBtn');
const textPhase1 = document.getElementById('textPhase1');
const textPhase2 = document.getElementById('textPhase2');

let heroMouseX = window.innerWidth * 0.68;
let heroMouseY = window.innerHeight * 0.5;
let heroCurrentX = heroMouseX;
let heroCurrentY = heroMouseY;

let heroAnimationState = 'tracking';
let heroStartTime = 0;
const heroDuration = 1200;

let heroStartScale, heroStartX, heroStartY;

function portfolioEaseInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

window.addEventListener('mousemove', (e) => {
    if (heroAnimationState === 'expanding') return;
    heroMouseX = e.clientX;
    heroMouseY = e.clientY;
});

function renderHeroBlobPhysics(timestamp) {
    let distortionFactor = 1;
    let currentScale = 2.5;

    if (heroAnimationState === 'expanding') {
        if (!heroStartTime) heroStartTime = timestamp;
        let progress = Math.min((timestamp - heroStartTime) / heroDuration, 1);
        let ease = portfolioEaseInOut(progress);

        currentScale = heroStartScale + (75 - heroStartScale) * ease;
        heroCurrentX = heroStartX + (window.innerWidth / 2 - heroStartX) * ease;
        heroCurrentY = heroStartY + (window.innerHeight / 2 - heroStartY) * ease;
        distortionFactor = 1 - ease;
    }
    else if (heroAnimationState === 'shrinking') {
        if (!heroStartTime) heroStartTime = timestamp;
        let progress = Math.min((timestamp - heroStartTime) / heroDuration, 1);
        let ease = portfolioEaseInOut(progress);

        currentScale = heroStartScale + (2.5 - heroStartScale) * ease;
        heroCurrentX = heroStartX + (heroMouseX - heroStartX) * ease;
        heroCurrentY = heroStartY + (heroMouseY - heroStartY) * ease;
        distortionFactor = ease;

        if (progress === 1) {
            heroAnimationState = 'tracking';
        }
    }
    else {
        heroCurrentX += (heroMouseX - heroCurrentX) * 0.08;
        heroCurrentY += (heroMouseY - heroCurrentY) * 0.08;
        currentScale = 2.5;
        heroStartTime = 0;
    }

    const vx = heroMouseX - heroCurrentX;
    const vy = heroMouseY - heroCurrentY;
    const speed = Math.sqrt(vx * vx + vy * vy);
    const distortion = Math.min(speed * 0.007, 0.6) * distortionFactor;
    const scaleX = 1 + distortion;
    const scaleY = 1 - distortion;
    const angle = Math.atan2(vy, vx) * (180 / Math.PI);

    heroBlobGroup.style.transform = `
            translate(${heroCurrentX - 100}px, ${heroCurrentY - 100}px) 
            scale(${currentScale}) 
            rotate(${angle}deg) 
            scale(${scaleX}, ${scaleY}) 
            rotate(${-angle}deg)
        `;

    requestAnimationFrame(renderHeroBlobPhysics);
}

requestAnimationFrame(renderHeroBlobPhysics);

heroContainer.addEventListener('click', () => {
    if (heroAnimationState === 'tracking') {
        heroAnimationState = 'expanding';
        heroStartTime = 0;
        heroStartScale = 2.5;
        heroStartX = heroCurrentX;
        heroStartY = heroCurrentY;

        textPhase1.classList.replace('opacity-100', 'opacity-0');
        textPhase1.classList.replace('translate-y-0', '-translate-y-10');
        textPhase1.classList.replace('pointer-events-auto', 'pointer-events-none');

        textPhase2.classList.replace('opacity-0', 'opacity-100');
        textPhase2.classList.replace('translate-y-10', 'translate-y-0');
        textPhase2.classList.replace('pointer-events-none', 'pointer-events-auto');
    }
});

heroResetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    heroAnimationState = 'shrinking';
    heroStartTime = 0;
    heroStartScale = 75;
    heroStartX = heroCurrentX;
    heroStartY = heroCurrentY;

    textPhase1.classList.replace('opacity-0', 'opacity-100');
    textPhase1.classList.replace('-translate-y-10', 'translate-y-0');
    textPhase1.classList.replace('pointer-events-none', 'pointer-events-auto');

    textPhase2.classList.replace('opacity-100', 'opacity-0');
    textPhase2.classList.replace('translate-y-0', 'translate-y-10');
    textPhase2.classList.replace('pointer-events-auto', 'pointer-events-none');
});

const stopTriggers = document.querySelectorAll('.prevent-blob-click a, .prevent-blob-click button');
stopTriggers.forEach(element => {
    element.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

const modal = document.getElementById('projectModal');
const modalCard = modal.querySelector('div');
const openBtn = document.getElementById('viewProjectsBtn');
const closeBtn = document.getElementById('closeModalBtn');
const contactBtn = document.getElementById('contactModalBtn');

function openModal() {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalCard.classList.remove('scale-95');
    }, 10);
}

function closeModal() {
    modal.classList.add('opacity-0');
    modalCard.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();

    const subject = encodeURIComponent("Request for Secure Project Access / Live Demo");
    const email = "apardilla.spcpc@gmail.com";

    window.location.href = `mailto:${email}?subject=${subject}`;
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});