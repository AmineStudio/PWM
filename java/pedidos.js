document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const template = document.getElementById("qty-template");
        document.querySelectorAll(".menu-item").forEach(item => {
            const info = item.querySelector(".item-info");

            if (info && template) {
                const clone = template.content.cloneNode(true);
                info.appendChild(clone);
            }
        });
    }, 300); //delay
});