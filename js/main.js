document.addEventListener("DOMContentLoaded", async () => {
    await initializeComponents();
    initializeNavigation();
    initializeCurrentYear();
    initializeHeaderScroll();
    initializeFAQ();
    initializeContactCard();
    initializeFormFields();
    initializeConsultationForm();
});

async function loadComponent(elementId, filePath) {
    const target = document.getElementById(elementId);
    if (!target) return;
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load component: ${filePath}`);
        target.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

async function initializeComponents() {
    await Promise.all([
        loadComponent("header-root", "./partials/header.html"),
        loadComponent("footer-root", "./partials/footer.html")
    ]);
}

function initializeNavigation() {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const navigation = document.querySelector(".site-navigation");
    if (!menuToggle || !navigation) return;
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.classList.toggle("is-active", !isOpen);
        navigation.classList.toggle("is-open", !isOpen);
    });
    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.classList.remove("is-active");
            navigation.classList.remove("is-open");
        });
    });
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.classList.remove("is-active");
        navigation.classList.remove("is-open");
    });
}

function initializeCurrentYear() {
    const yearElement = document.getElementById("current-year");
    if (!yearElement) return;
    yearElement.textContent = new Date().getFullYear();
}

function initializeHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const updateHeader = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;
    faqItems.forEach(item => {
        const button = item.querySelector(".faq-question");
        if (!button) return;
        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");
        
            faqItems.forEach(otherItem =>
                otherItem.classList.remove("active")
            );
        
            if (!isOpen) {
                item.classList.add("active");
            }
        });
        });
    });
}

function initializeContactCard() {
    const card = document.getElementById("contact-card");
    const triggers = document.querySelectorAll("[data-contact-flip]");
    if (!card || !triggers.length) return;
    triggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            card.classList.toggle("is-flipped");
        });
    });
}

function initializeFormFields() {
    const fields = document.querySelectorAll(".form-field");
    if (!fields.length) return;
    fields.forEach(field => {
        const input = field.querySelector("input, textarea, select");
        const placeholder = field.querySelector(".field-placeholder");
        if (!input || !placeholder) return;
        const text = placeholder.textContent.trim();
        placeholder.textContent = "";
        [...text].forEach((character, index) => {
            const span = document.createElement("span");
            span.textContent = character === " " ? "\u00A0" : character;
            span.style.setProperty("--letter-index", index);
            placeholder.appendChild(span);
        });
        const updateState = () => {
            field.classList.toggle("has-value", input.value !== "");
            field.classList.toggle("is-active", document.activeElement === input);
        };
        input.addEventListener("focus", updateState);
        input.addEventListener("blur", updateState);
        input.addEventListener("input", updateState);
        input.addEventListener("change", updateState);
        updateState();
    });
}

function initializeConsultationForm() {
    const form = document.getElementById("consultation-form");
    if (!form) return;
    const pages = [...form.querySelectorAll("[data-consultation-page]")];
    const progressSteps = [...form.querySelectorAll("[data-progress-step]")];
    const progress = document.getElementById("consultation-progress");
    const currentPage = document.getElementById("consultation-current");
    const backButton = document.getElementById("consultation-back");
    const nextButton = document.getElementById("consultation-next");
    const submitButton = document.getElementById("consultation-submit");
    const status = document.getElementById("consultation-status");
    if (!pages.length || !backButton || !nextButton || !submitButton) return;
    let page = 1;
    const updateForm = () => {
        pages.forEach((item, index) => {
            item.classList.toggle("is-active", index + 1 === page);
        });
        progressSteps.forEach((step, index) => {
            step.classList.toggle("is-active", index + 1 === page);
            step.classList.toggle("is-complete", index + 1 < page);
        });
        if (progress) progress.style.width = `${((page - 1) / (pages.length - 1)) * 100}%`;
        if (currentPage) currentPage.textContent = String(page).padStart(2, "0");
        backButton.disabled = page === 1;
        nextButton.style.display = page === pages.length ? "none" : "block";
        submitButton.style.display = page === pages.length ? "block" : "none";
        status.textContent = "";
    };
    const validatePage = () => {
        const activePage = pages[page - 1];
        const requiredFields = activePage.querySelectorAll("input[required], textarea[required], select[required]");
        for (const field of requiredFields) {
            if (!field.checkValidity()) {
                field.reportValidity();
                return false;
            }
        }
        return true;
    };
    nextButton.addEventListener("click", () => {
        if (!validatePage()) return;
        if (page < pages.length) {
            page++;
            updateForm();
        }
    });
    backButton.addEventListener("click", () => {
        if (page > 1) {
            page--;
            updateForm();
        }
    });
    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validatePage()) return;
        const honeypot = form.querySelector('input[name="company"]');
        if (honeypot && honeypot.value !== "") return;
        status.textContent = "Your consultation request is ready to be submitted once a form endpoint is connected.";
    });
    updateForm();
}
