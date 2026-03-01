// ================= PRELOADER =================
window.addEventListener("load", () => {
    const loader = document.getElementById("preloader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 400);
    }
});

// ================= NAV TOGGLE =================
const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");

if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", () => {
        navLinksContainer.classList.toggle("open");
        hamburger.classList.toggle("active");
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", !expanded);
    });

    navLinksContainer.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinksContainer.classList.remove("open");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });
}

// ================= ACTIVE NAV ON SCROLL =================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) current = section.getAttribute("id");
    });

    navLinks.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href").includes(current)) a.classList.add("active");
    });
});

// ================= SMOOTH SCROLL =================
document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// ================= BACK TO TOP BUTTON =================
const topBtn = document.getElementById("topBtn");
window.addEventListener("scroll", () => {
    if (topBtn) topBtn.style.display = window.scrollY > 400 ? "block" : "none";
});
if (topBtn) topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ================= DARK / LIGHT MODE =================
const themeToggle = document.getElementById("themeToggle");
function setTheme(mode) {
    if (mode === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "☀️";
    } else {
        document.body.classList.remove("light-mode");
        themeToggle.textContent = "🌙";
    }
    localStorage.setItem("theme", mode);
}
const savedTheme = localStorage.getItem("theme") || "dark";
if (themeToggle) setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
        setTheme(newTheme);
    });
}

// ================= EMAIL JS =================
if (typeof emailjs !== "undefined") emailjs.init("YOUR_PUBLIC_KEY");
const contactForm = document.getElementById("contact-form");
const formFeedback = document.querySelector(".form-feedback");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = this.querySelector("input[type='text']").value.trim();
        const email = this.querySelector("input[type='email']").value.trim();
        const message = this.querySelector("textarea").value.trim();

        if (!name || !email || !message) {
            formFeedback.textContent = "Please fill all fields.";
            return;
        }

        const submitBtn = contactForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        formFeedback.textContent = "Sending...";

        emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
            .then(() => {
                formFeedback.textContent = "Message sent successfully!";
                contactForm.reset();
                submitBtn.disabled = false;
            })
            .catch(() => {
                formFeedback.textContent = "Failed to send message. Please try again.";
                submitBtn.disabled = false;
            });
    });
}

// ================= SCROLL REVEAL =================
const revealElements = document.querySelectorAll(".project-card, .progress, .about, .contact, .gallery-item");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
    });
}, { threshold: 0.25 });

revealElements.forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
});

// ================= SKILL BARS (DYNAMIC %) =================
const skillSection = document.getElementById("skills");
const skills = document.querySelectorAll(".progress");
const animatedSkills = new Set();

const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skills.forEach(skill => {
                if (animatedSkills.has(skill)) return;
                animatedSkills.add(skill);

                const span = skill.querySelector("span");
                const target = parseInt(skill.dataset.percent) || 100;
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= target) clearInterval(interval);
                    else {
                        width++;
                        skill.style.width = width + "%";
                        span.textContent = width + "%";
                    }
                }, 15);
            });
        }
    });
}, { threshold: 0.5 });

if (skillSection) skillObserver.observe(skillSection);

// ================= TYPING HERO =================
const heroTitle = document.getElementById("hero-text");
const heroText = "Hi, Welcome to Phantom Tech Solutions";
let charIndex = 0;

function typeHero() {
    if (heroTitle && charIndex < heroText.length) {
        heroTitle.textContent += heroText[charIndex];
        charIndex++;
        setTimeout(typeHero, 80);
    }
}
window.addEventListener("load", typeHero);

// ================= PROJECT MODAL =================
const projectModal = document.getElementById("projectModal");
if (projectModal) {
    const modalImg = projectModal.querySelector("#modalImg");
    const modalTitle = projectModal.querySelector("#modalTitle");
    const modalDesc = projectModal.querySelector("#modalDesc");
    const closeBtn = projectModal.querySelector(".close-btn");

    function openModal(card) {
        modalImg.src = card.dataset.img;
        modalImg.alt = card.dataset.title;
        modalTitle.textContent = card.dataset.title;
        modalDesc.textContent = card.dataset.desc;
        projectModal.style.display = "flex";
    }

    function closeModal() {
        projectModal.style.display = "none";
        modalImg.src = "";
    }

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => openModal(card));
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    projectModal.addEventListener("click", e => {
        if (e.target === projectModal) closeModal();
    });
    window.addEventListener("keydown", e => {
        if (e.key === "Escape" && projectModal.style.display === "flex") closeModal();
    });
}

// ================= PARALLAX HERO =================
const hero = document.querySelector(".hero");
window.addEventListener("scroll", () => {
    if (!hero) return;
    const speed = parseFloat(hero.dataset.parallaxSpeed) || 0.5;
    hero.style.backgroundPositionY = `${window.scrollY * speed}px`;
});

// ================= PARTICLES =================
const canvas = document.createElement("canvas");
canvas.id = "particles";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.x = Math.random() * canvas.width;
        if (this.y < 0 || this.y > canvas.height) this.y = Math.random() * canvas.height;
    }
    draw() {
        ctx.fillStyle = "rgba(0,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles(num = 80) {
    particles = [];
    for (let i = 0; i < num; i++) particles.push(new Particle());
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
});