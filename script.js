/* =========================================================
   MAA SWAROOP GLASS HOUSE
   Main Website Script
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("active");
    });

    mainNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            mainNav.classList.remove("active");
        });

    });

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupReveal() {

    const revealItems =
        document.querySelectorAll(".reveal");

    if (!revealItems.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {

        revealItems.forEach(item => {
            item.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.10
        }
    );

    revealItems.forEach(item => {
        observer.observe(item);
    });

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   HEADER SHADOW
   ========================================================= */

const siteHeader =
    document.querySelector(".site-header");

function updateHeader() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 20) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    {
        passive: true
    }
);

updateHeader();


/* =========================================================
   IMAGE LOAD
   ========================================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("load", () => {
        image.classList.add("loaded");
    });

});


/* =========================================================
   CURRENT YEAR
   ========================================================= */

document.querySelectorAll("[data-current-year]")
    .forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupReveal();

    }
);
