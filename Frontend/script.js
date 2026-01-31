document.addEventListener("DOMContentLoaded", () => {
    // Create Solar System Background
    const body = document.body;
    const solarSystemBg = document.createElement("div");
    solarSystemBg.className = "solar-system-bg";
    body.insertBefore(solarSystemBg, body.firstChild);

    // Create stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        const size = Math.random() * 1.5 + 0.5;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = Math.random() * 0.7 + 0.3;
        solarSystemBg.appendChild(star);
    }

    // Create Sun
    const sun = document.createElement("div");
    sun.className = "sun";
    solarSystemBg.appendChild(sun);

    // Create Orbits and Planets with realistic orbital distances
    const planets = [
        { name: "mercury", orbitSize: 180 },
        { name: "venus", orbitSize: 260 },
        { name: "earth", orbitSize: 360 },
        { name: "mars", orbitSize: 480 },
        { name: "jupiter", orbitSize: 720 },
        { name: "saturn", orbitSize: 850 },
        { name: "uranus", orbitSize: 1000 },
        { name: "neptune", orbitSize: 1200 }
    ];

    planets.forEach((planet) => {
        const orbit = document.createElement("div");
        orbit.className = "orbit";
        orbit.style.width = planet.orbitSize + "px";
        orbit.style.height = planet.orbitSize + "px";
        solarSystemBg.appendChild(orbit);

        const planetEl = document.createElement("div");
        planetEl.className = "planet " + planet.name;
        solarSystemBg.appendChild(planetEl);

        if (planet.name === "saturn") {
            const ring = document.createElement("div");
            ring.className = "saturn-ring";
            solarSystemBg.appendChild(ring);
        }
    });

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const yearSpan = document.getElementById("year");
    const includeElements = document.querySelectorAll("[data-include]");
    const loadPromises = Array.from(includeElements).map((el) => {
        const file = el.getAttribute("data-include");
        if (!file) return Promise.resolve();

        return fetch(file)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${file}`);
                }
                return response.text();
            })
            .then((html) => {
                el.innerHTML = html;
                if (file === 'contact.html') {
                    const contactForm = el.querySelector('.contact-form');
                    if (contactForm) {
                        contactForm.addEventListener('submit', function(event) {
                            event.preventDefault();
                            // Replace with your EmailJS service ID, template ID, and public key
                            emailjs.sendForm('service_zw5cv9q', 'template_whb1drf', this, 'FTaakuNdXBJUWRfKV')
                                .then(function() {
                                    alert('Message sent successfully!');
                                    contactForm.reset();
                                }, function(error) {
                                    alert('Failed to send message: ' + error.text);
                                });
                        });
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    });

    // After all includes are loaded, initialize features that depend on included content
    Promise.all(loadPromises).then(() => {
        // Interactive timeline needs included DOM nodes
        if (typeof initInteractiveTimeline === 'function') {
            setTimeout(initInteractiveTimeline, 0);
        }
    }).catch((err) => {
        console.error('Error loading includes:', err);
    });

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        navLinks.addEventListener("click", (event) => {
            if (event.target.tagName === "A") {
                navLinks.classList.remove("open");
            }
        });
    }

    const links = document.querySelectorAll(".nav-links a[href^='#']");

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const headerOffset = 70;
            const rect = target.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        });
    });

    // Theme Toggle
    const themeToggle = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-regular fa-lightbulb"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const isLight = document.body.classList.contains("light-theme");
            
            if (isLight) {
                themeToggle.innerHTML = '<i class="fa-regular fa-lightbulb"></i>';
                localStorage.setItem("theme", "light");
            } else {
                themeToggle.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
                localStorage.setItem("theme", "dark");
            }
        });
    }

    // ========== FLOATING PARTICLES ==========
    function createParticles() {
        const colors = ['rgba(56, 189, 248, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(139, 92, 246, 0.5)', 'rgba(251, 191, 36, 0.5)'];
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            
            solarSystemBg.appendChild(particle);
        }
    }
    createParticles();

    // ========== SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    }

    // Initialize after content is loaded
    setTimeout(initScrollAnimations, 500);

    // ========== BACK TO TOP BUTTON ==========
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== INTERACTIVE TIMELINE ==========
    function initInteractiveTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item-interactive');
        
        timelineItems.forEach(item => {
            const header = item.querySelector('.timeline-header');
            
            if (header) {
                header.addEventListener('click', () => {
                    const isExpanded = item.getAttribute('data-expanded') === 'true';
                    
                    // Close all other items
                    timelineItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.setAttribute('data-expanded', 'false');
                        }
                    });
                    
                    // Toggle current item
                    item.setAttribute('data-expanded', !isExpanded);
                });
            }
        });
        
        // Auto-expand first item
        if (timelineItems.length > 0) {
            timelineItems[0].setAttribute('data-expanded', 'true');
        }
    }

    // Initialize timeline after content is loaded
    setTimeout(initInteractiveTimeline, 600);
});
