/* =========================================================
   UNLEASHED K9 SOLUTIONS
   GLOBAL JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeComponents();
    initializeNavigation();
    initializeCurrentYear();
    initializeHeaderScroll();

});


/* ---------------------------------------------------------
   1. Component Loader
   --------------------------------------------------------- */

async function loadComponent(elementId, filePath) {

    const target = document.getElementById(elementId);

    if (!target) {
        return;
    }

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(
                `Failed to load component: ${filePath}`
            );
        }

        target.innerHTML = await response.text();

    } catch (error) {

        console.error(error);

    }

}


/* ---------------------------------------------------------
   2. Load Global Components
   --------------------------------------------------------- */

async function initializeComponents() {

    await Promise.all([
        loadComponent(
            "header-root",
            "./components/header.html"
        ),

        loadComponent(
            "footer-root",
            "./components/footer.html"
        )
    ]);

    /*
     * Components must be loaded before initializing
     * interactions that depend on their DOM elements.
     */

    initializeNavigation();
    initializeCurrentYear();

}


/* ---------------------------------------------------------
   3. Mobile Navigation
   --------------------------------------------------------- */

function initializeNavigation() {

    const menuToggle = document.querySelector(
        ".mobile-menu-toggle"
    );

    const navigation = document.querySelector(
        ".site-navigation"
    );

    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.addEventListener("click", () => {

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        menuToggle.classList.toggle(
            "is-active",
            !isOpen
        );

        navigation.classList.toggle(
            "is-open",
            !isOpen
        );

    });


    /*
     * Close mobile navigation when a navigation link
     * is selected.
     */

    const navigationLinks =
        navigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.classList.remove(
                "is-active"
            );

            navigation.classList.remove(
                "is-open"
            );

        });

    });


    /*
     * Close the menu when the Escape key is pressed.
     */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.classList.remove(
            "is-active"
        );

        navigation.classList.remove(
            "is-open"
        );

    });

}


/* ---------------------------------------------------------
   4. Current Year
   --------------------------------------------------------- */

function initializeCurrentYear() {

    const yearElement =
        document.getElementById("current-year");

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}


/* ---------------------------------------------------------
   5. Header Scroll State
   --------------------------------------------------------- */

function initializeHeaderScroll() {

    const header =
        document.querySelector(".site-header");

    if (!header) {
        return;
    }

    const updateHeader =
        () => {

            header.classList.toggle(
                "is-scrolled",
                window.scrollY > 20
            );

        };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}
