document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const yearSpan = document.getElementById("year");
    const includeElements = document.querySelectorAll("[data-include]");
    includeElements.forEach((el) => {
        const file = el.getAttribute("data-include");
        if (!file) return;

        fetch(file)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${file}`);
                }
                return response.text();
            })
            .then((html) => {
                el.innerHTML = html;
            })
            .catch((error) => {
                console.error(error);
            });
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
});
