/* =========================================================
   MAA SWAROOP GLASS HOUSE
   Category Based GitHub Work Gallery
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

    const items = document.querySelectorAll(".reveal");

    if (!items.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {

        items.forEach(item => {
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
            threshold: 0.08
        }
    );

    items.forEach(item => {
        observer.observe(item);
    });

}


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
   SMOOTH SCROLL
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const id =
            link.getAttribute("href");

        if (!id || id === "#") {
            return;
        }

        const target =
            document.querySelector(id);

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
   GITHUB CONFIG
   ========================================================= */

const GITHUB_API =
    "https://api.github.com/repos/manishhaatwa-dot/maa-swaroop-/contents/assets/products/category";

const GITHUB_RAW =
    "https://raw.githubusercontent.com/manishhaatwa-dot/maa-swaroop-/main/assets/products/category";


/* =========================================================
   CATEGORY NAME
   ========================================================= */

function formatCategoryName(name) {

    return name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* =========================================================
   IMAGE CHECK
   ========================================================= */

function isImage(fileName) {

    return /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);

}


/* =========================================================
   CREATE PHOTO CARD
   ========================================================= */

function createWorkCard(
    imageUrl,
    categoryName
) {

    const card =
        document.createElement("article");

    card.className =
        "product-card reveal";


    card.innerHTML = `

        <div class="product-image-wrap">

            <img
                src="${imageUrl}"
                alt="${categoryName} - Maa Swaroop Glass House Pali"
                loading="lazy"
            >

        </div>

    `;


    return card;

}


/* =========================================================
   CREATE GALLERY IMAGE
   ========================================================= */

function createGalleryItem(
    imageUrl,
    categoryName
) {

    const item =
        document.createElement("a");

    item.className =
        "gallery-item reveal";

    item.href =
        imageUrl;

    item.target =
        "_blank";

    item.rel =
        "noopener";


    item.innerHTML = `

        <img
            src="${imageUrl}"
            alt="${categoryName} - Maa Swaroop Glass House"
            loading="lazy"
        >

    `;


    return item;

}


/* =========================================================
   LOAD WORK CATEGORIES
   ========================================================= */

async function loadWork() {

    const productGrid =
        document.getElementById("productGrid");

    const galleryGrid =
        document.getElementById("galleryGrid");


    if (!productGrid) {
        return;
    }


    try {

        /* -----------------------------------------------
           GET CATEGORY FOLDERS
           ----------------------------------------------- */

        const response =
            await fetch(
                GITHUB_API,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load GitHub categories."
            );

        }


        const categories =
            await response.json();


        const categoryFolders =
            categories.filter(item => {

                return item.type === "dir";

            });


        productGrid.innerHTML = "";


        if (galleryGrid) {

            galleryGrid.innerHTML = "";

        }


        /* -----------------------------------------------
           EACH CATEGORY
           ----------------------------------------------- */

        for (const category of categoryFolders) {


            const categoryUrl =
                `${GITHUB_API}/${encodeURIComponent(category.name)}`;


            const categoryResponse =
                await fetch(
                    categoryUrl,
                    {
                        cache: "no-store"
                    }
                );


            if (!categoryResponse.ok) {
                continue;
            }


            const files =
                await categoryResponse.json();


            const images =
                files.filter(file => {

                    return (
                        file.type === "file" &&
                        isImage(file.name)
                    );

                });


            if (!images.length) {
                continue;
            }


            /* -------------------------------------------
               CATEGORY NAME
               ------------------------------------------- */

            const categoryName =
                formatCategoryName(
                    category.name
                );


            /* -------------------------------------------
               CATEGORY SECTION
               ------------------------------------------- */

            const categorySection =
                document.createElement("div");


            categorySection.className =
                "work-category reveal";


            categorySection.innerHTML = `

                <div class="work-category-heading">

                    <h3>
                        ${categoryName}
                    </h3>

                </div>

                <div class="category-product-grid">
                </div>

            `;


            const categoryGrid =
                categorySection.querySelector(
                    ".category-product-grid"
                );


            /* -------------------------------------------
               CATEGORY PHOTOS
               ------------------------------------------- */

            images.forEach(file => {


                const imageUrl =
                    `${GITHUB_RAW}/${encodeURIComponent(category.name)}/${encodeURIComponent(file.name)}`;


                const card =
                    createWorkCard(
                        imageUrl,
                        categoryName
                    );


                categoryGrid.appendChild(card);


                /* ---------------------------------------
                   GALLERY
                   --------------------------------------- */

                if (galleryGrid) {

                    const galleryItem =
                        createGalleryItem(
                            imageUrl,
                            categoryName
                        );


                    galleryGrid.appendChild(
                        galleryItem
                    );

                }

            });


            productGrid.appendChild(
                categorySection
            );

        }


        /* -----------------------------------------------
           NO PHOTOS
           ----------------------------------------------- */

        if (!productGrid.children.length) {

            productGrid.innerHTML = `

                <div class="work-empty">

                    <p>
                        Work photos will be added soon.
                    </p>

                </div>

            `;

        }


        setupReveal();


    } catch (error) {

        console.error(
            "Maa Swaroop Work Error:",
            error
        );


        productGrid.innerHTML = `

            <div class="work-empty">

                <p>
                    Work photos are currently unavailable.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupReveal();

        loadWork();

    }
);
