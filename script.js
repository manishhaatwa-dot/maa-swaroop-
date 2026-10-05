/* =========================================================
   MAA SWAROOP GLASS HOUSE
   Dynamic Category-Based Work Gallery
   DigiProfiles.in
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const GITHUB_API =
    "https://api.github.com/repos/manishhaatwa-dot/maa-swaroop-/contents/assets/products";


const GITHUB_RAW =
    "https://raw.githubusercontent.com/manishhaatwa-dot/maa-swaroop-/main/assets/products";


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


    if (!("IntersectionObserver" in window)) {

        revealItems.forEach(item => {

            item.classList.add("visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealItems.forEach(item => {

        observer.observe(item);

    });

}


/* =========================================================
   CATEGORY NAME
   ========================================================= */

function formatCategoryName(folderName) {

    return folderName
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* =========================================================
   IMAGE NAME
   ========================================================= */

function formatImageName(fileName) {

    return fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


/* =========================================================
   GET IMAGE FILES FROM CATEGORY
   ========================================================= */

async function getCategoryImages(categoryName) {

    const url =
        `${GITHUB_API}/${encodeURIComponent(categoryName)}`;


    try {

        const response = await fetch(url, {
            cache: "no-store"
        });


        if (!response.ok) {

            console.warn(
                `Unable to load category: ${categoryName}`
            );

            return [];

        }


        const files = await response.json();


        return files.filter(file => {

            return (
                file.type === "file" &&
                /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
            );

        });

    } catch (error) {

        console.error(
            `Category loading error: ${categoryName}`,
            error
        );

        return [];

    }

}


/* =========================================================
   CREATE IMAGE CARD
   ========================================================= */

function createWorkCard(
    imageUrl,
    imageName,
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
                alt="${imageName} - ${categoryName} - Maa Swaroop Glass House Pali"
                loading="lazy"
            >

        </div>

        <div class="product-card-content">

            <span class="product-category">
                ${categoryName}
            </span>

            <h3>
                ${imageName}
            </h3>

        </div>

    `;


    return card;

}


/* =========================================================
   CREATE CATEGORY SECTION
   ========================================================= */

function createCategorySection(
    categoryName,
    files
) {

    const section =
        document.createElement("div");

    section.className =
        "work-category reveal";


    const heading =
        document.createElement("div");

    heading.className =
        "work-category-heading";


    heading.innerHTML = `

        <span class="category-line"></span>

        <div>

            <span class="category-label">
                OUR WORK
            </span>

            <h3>
                ${categoryName}
            </h3>

        </div>

    `;


    const grid =
        document.createElement("div");

    grid.className =
        "category-product-grid";


    files.forEach(file => {

        const imageUrl =
            `${GITHUB_RAW}/${encodeURIComponent(categoryName.toLowerCase())}/${encodeURIComponent(file.name)}`;


        const imageName =
            formatImageName(file.name);


        const card =
            createWorkCard(
                imageUrl,
                imageName,
                categoryName
            );


        grid.appendChild(card);

    });


    section.appendChild(heading);

    section.appendChild(grid);


    return section;

}


/* =========================================================
   LOAD ALL CATEGORIES
   ========================================================= */

async function loadProducts() {

    const productGrid =
        document.getElementById("productGrid");


    const galleryGrid =
        document.getElementById("galleryGrid");


    if (!productGrid) {

        return;

    }


    productGrid.innerHTML = `

        <div class="work-loading">

            <span class="loading-spinner"></span>

            <p>
                Loading our work...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                GITHUB_API,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to read GitHub products folder."
            );

        }


        const items =
            await response.json();


        const categories =
            items.filter(item => {

                return item.type === "dir";

            });


        if (!categories.length) {

            productGrid.innerHTML = `

                <div class="work-empty">

                    <p>
                        Work photos will be added soon.
                    </p>

                </div>

            `;

            return;

        }


        productGrid.innerHTML = "";


        /*
         * Load every category.
         */

        for (const category of categories) {

            const files =
                await getCategoryImages(
                    category.name
                );


            if (!files.length) {

                continue;

            }


            const categoryTitle =
                formatCategoryName(
                    category.name
                );


            const categorySection =
                createCategorySection(
                    categoryTitle,
                    files
                );


            productGrid.appendChild(
                categorySection
            );


            /*
             * Gallery images
             */

            if (galleryGrid) {

                files.forEach(file => {

                    const imageUrl =
                        `${GITHUB_RAW}/${encodeURIComponent(category.name.toLowerCase())}/${encodeURIComponent(file.name)}`;


                    const galleryItem =
                        document.createElement("a");


                    galleryItem.className =
                        "gallery-item reveal";


                    galleryItem.href =
                        imageUrl;


                    galleryItem.target =
                        "_blank";


                    galleryItem.rel =
                        "noopener";


                    galleryItem.innerHTML = `

                        <img
                            src="${imageUrl}"
                            alt="${formatImageName(file.name)} - Maa Swaroop Glass House"
                            loading="lazy"
                        >

                        <span class="gallery-overlay">

                            <strong>
                                ${formatImageName(file.name)}
                            </strong>

                            <small>
                                ${formatCategoryName(category.name)}
                            </small>

                        </span>

                    `;


                    galleryGrid.appendChild(
                        galleryItem
                    );

                });

            }

        }


        setupReveal();


        /*
         * Check whether any category produced images.
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


    } catch (error) {

        console.error(
            "Work loading error:",
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
   SMOOTH INTERNAL LINKS
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            targetId === "#"
        ) {

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

        siteHeader.classList.add(
            "scrolled"
        );

    } else {

        siteHeader.classList.remove(
            "scrolled"
        );

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
   IMAGE LOAD HANDLING
   ========================================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("load", () => {

        image.classList.add("loaded");

    });

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
   PAGE START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

        setupReveal();

    }
);
