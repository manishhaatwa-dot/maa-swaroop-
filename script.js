/* =========================================================
   MAA KALP GLASS HOUSE
   Glass • Aluminium • Stainless Steel Works
   DigiProfiles.in
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("active");

        const isOpen =
            mainNav.classList.contains("active");

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close Menu" : "Open Menu"
        );

    });


    const navLinks =
        mainNav.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");

            menuToggle.setAttribute(
                "aria-label",
                "Open Menu"
            );

        });

    });

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealOnScroll = () => {

    const windowHeight =
        window.innerHeight;


    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;


        if (elementTop < windowHeight - 80) {

            element.classList.add("active");

        }

    });

};


revealOnScroll();


window.addEventListener(
    "scroll",
    revealOnScroll,
    { passive: true }
);


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");


                /*
                 * Pending links such as href="#"
                 * should do nothing.
                 */

                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    event.preventDefault();

                    return;

                }


                const target =
                    document.querySelector(targetId);


                if (!target) {

                    return;

                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".site-header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


/* =========================================================
   HEADER SHADOW
   ========================================================= */

const header =
    document.querySelector(".site-header");


const updateHeader = () => {

    if (!header) {

        return;

    }


    if (window.scrollY > 20) {

        header.style.boxShadow =
            "0 8px 25px rgba(30, 55, 75, 0.10)";

    } else {

        header.style.boxShadow =
            "none";

    }

};


updateHeader();


window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);


/* =========================================================
   DYNAMIC PRODUCTS
   =========================================================

   products.json se jitni images milengi,
   utne hi product cards automatically banenge.

   Koi fixed 10/20/50 limit nahi hai.

   ========================================================= */

const productGrid =
    document.getElementById("productGrid");


const galleryGrid =
    document.getElementById("galleryGrid");


const loadProducts = async () => {

    if (!productGrid) {

        return;

    }


    try {

        const response =
            await fetch("products.json");


        if (!response.ok) {

            throw new Error(
                "products.json could not be loaded."
            );

        }


        const products =
            await response.json();


        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {

            productGrid.innerHTML = `
                <div class="product-empty">
                    <p>
                        Our latest work will be displayed here.
                    </p>
                </div>
            `;

            return;

        }


        productGrid.innerHTML = "";


        /*
         * Create one product card
         * for every item in products.json.
         */

        products.forEach(
            (product, index) => {

                if (
                    !product ||
                    !product.image
                ) {

                    return;

                }


                const card =
                    document.createElement("article");


                card.className =
                    "product-card reveal";


                const productName =
                    product.name ||
                    "Glass & Fabrication Work";


                const description =
                    product.description ||
                    "Quality glass, aluminium and stainless-steel work.";


                const imagePath =
                    "assets/products/" +
                    product.image;


                card.innerHTML = `

                    <div class="product-image">

                        <img
                            src="${imagePath}"
                            alt="${escapeHtml(productName)}"
                            loading="lazy"
                        >

                    </div>


                    <div class="product-content">

                        <span class="product-number">

                            ${String(index + 1).padStart(2, "0")}

                        </span>


                        <h3>
                            ${escapeHtml(productName)}
                        </h3>


                        <p>
                            ${escapeHtml(description)}
                        </p>

                    </div>

                `;


                productGrid.appendChild(card);

            }
        );


        /*
         * Gallery uses the same actual work photos.
         */

        if (galleryGrid) {

            galleryGrid.innerHTML = "";


            products.forEach(
                product => {

                    if (
                        !product ||
                        !product.image
                    ) {

                        return;

                    }


                    const galleryItem =
                        document.createElement("div");


                    galleryItem.className =
                        "gallery-item reveal";


                    const productName =
                        product.name ||
                        "Maa Kalp Glass House Work";


                    galleryItem.innerHTML = `

                        <img
                            src="assets/products/${product.image}"
                            alt="${escapeHtml(productName)}"
                            loading="lazy"
                        >

                    `;


                    galleryGrid.appendChild(
                        galleryItem
                    );

                }
            );

        }


        /*
         * New reveal elements need to be checked
         * after dynamic cards are created.
         */

        revealOnScroll();


        /*
         * Add image load class to dynamic images.
         */

        const dynamicImages =
            document.querySelectorAll(
                "#productGrid img, #galleryGrid img"
            );


        dynamicImages.forEach(image => {

            if (image.complete) {

                image.classList.add(
                    "image-loaded"
                );

            } else {

                image.addEventListener(
                    "load",
                    () => {

                        image.classList.add(
                            "image-loaded"
                        );

                    },
                    { once: true }
                );

            }

        });

    } catch (error) {

        console.error(
            "Products loading error:",
            error
        );


        productGrid.innerHTML = `
            <div class="product-empty">
                <p>
                    Our work images will be available soon.
                </p>
            </div>
        `;

    }

};


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   IMAGE LOAD EFFECT
   ========================================================= */

const images =
    document.querySelectorAll("img");


images.forEach(image => {

    if (image.complete) {

        image.classList.add(
            "image-loaded"
        );

    } else {

        image.addEventListener(
            "load",
            () => {

                image.classList.add(
                    "image-loaded"
                );

            },
            { once: true }
        );

    }

});


/* =========================================================
   CURRENT YEAR
   ========================================================= */

const yearElements =
    document.querySelectorAll(
        "[data-current-year]"
    );


yearElements.forEach(element => {

    element.textContent =
        new Date().getFullYear();

});


/* =========================================================
   PAGE READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.classList.add(
            "page-loaded"
        );


        /*
         * Load all work photos.
         */

        loadProducts();


        revealOnScroll();

    }
);