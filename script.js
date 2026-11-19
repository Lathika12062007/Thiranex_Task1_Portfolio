
/* ==============================
   PORTFOLIO JAVASCRIPT
================================ */

// Update footer year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Smooth navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});

// Scroll reveal animation
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Contact form submission
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const formData = new FormData(contactForm);

    const messageData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message")
    };

    formStatus.textContent = "Sending message...";

    try {

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to send message");
        }

        formStatus.textContent =
            "Message sent successfully! Thank you for contacting me.";

        contactForm.reset();

    } catch (error) {

        formStatus.textContent =
            "Unable to send message. Please try again later.";

        console.error(error);

    }

});

console.log("Portfolio website loaded successfully!");
