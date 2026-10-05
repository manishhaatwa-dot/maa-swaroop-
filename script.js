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

    if (!items.length) return;

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
            threshold: 0.10
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

    if (!siteHeader) return;

    if (window.scrollY > 20) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const id =
            link.getAttribute("href");

        if (!id || id === "#") return;

        const target =
            document.querySelector(id);

        if (!target) return;

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
   FORMAT CATEGORY NAME
   ========================================================= */

function formatCategoryName(name) {

    return name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* =========================================================
   FORMAT PHOTO NAME
   ========================================================= */

function formatPhotoName(name) {

    return name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* =========================================================
   CHECK IMAGE FILE
   ========================================================= */

function isImage(fileName) {

    return /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);

}


/* =========================================================
   CREATE WORK CARD
   ========================================================= */

function createWorkCard(
    imageUrl,
    photoName,
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
                alt="${photoName} - ${categoryName} - Maa Swaroop Glass House Pali"
                loading="lazy"
            >

        </div>

        <div class="product-card-content">

            <span class="product-category">
                ${categoryName}
            </span>

            <h3>
                ${photoName}
            </h3>

        </div>

    `;

    return card;

}


/* =========================================================
   CREATE GALLERY ITEM
   ========================================================= */

function createGalleryItem(
    imageUrl,
    photoName,
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
            alt="${photoName} - ${categoryName} - Maa Swaroop Glass House"
            loading="lazy"
        >

        <span class="gallery-overlay">

            <strong>
                ${photoName}
            </strong>

            <small>
                ${categoryName}
            </small>

        </span>

    `;

    return item;

}


/* =========================================================
   LOAD WORK
   ========================================================= */

async function loadWork() {

    const productGrid =
        document.getElementById("productGrid");

    const galleryGrid =
        document.getElementById("galleryGrid");


    if (!productGrid) return;


    try {

        /*
         * Get category folders
         */

        const categoryResponse =
            await fetch(
                GITHUB_API,
                {
                    cache: "no-store"
                }
            );


        if (!categoryResponse.ok) {

            throw new Error(
                "GitHub category folder could not be loaded."
            );

        }


        const categories =
            await categoryResponse.json();


        /*
         * Only folders
         */

        const categoryFolders =
            categories.filter(item =>
                item.type === "dir"
            );


        productGrid.innerHTML = "";


        if (galleryGrid) {
            galleryGrid.innerHTML = "";
        }


        /*
         * Open every category
         */

        for (const category of categoryFolders) {

            const categoryPath =
                `${GITHUB_API}/${encodeURIComponent(category.name)}`;


            const categoryResponse =
                await fetch(
                    categoryPath,
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
                files.filter(file =>
                    file.type === "file" &&
                    isImage(file.name)
                );


            /*
             * If category has no images,
             * skip it.
             */

            if (!images.length) {
                continue;
            }


            const categoryName =
                formatCategoryName(
                    category.name
                );


            /*
             * Category wrapper
             */

            const categorySection =
                document.createElement("div");

            categorySection.className =
                "work-category reveal";


            categorySection.innerHTML = `

                <div class="work-category-heading">

                    <span class="category-line"></span>

                    <div>

                        <span class="category-label">
                            OUR WORK
                        </span>

                        <h3>
                            ${categoryName}
                        </h3>

                    </div>

                </div>

                <div class="category-product-grid"></div>

            `;


            const categoryGrid =
                categorySection.querySelector(
                    ".category-product-grid"
                );


            /*
             * Add every image
             */

            images.forEach(file => {

                const imageUrl =
                    `${GITHUB_RAW}/${encodeURIComponent(category.name)}/${encodeURIComponent(file.name)}`;


                const photoName =
                    formatPhotoName(
                        file.name
                    );


                /*
                 * Product card
                 */

                const card =
                    createWorkCard(
                        imageUrl,
                        photoName,
                        categoryName
                    );


                categoryGrid.appendChild(card);


                /*
                 * Gallery
                 */

                if (galleryGrid) {

                    const galleryItem =
                        createGalleryItem(
                            imageUrl,
                            photoName,
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


        /*
         * If nothing found
         */

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
