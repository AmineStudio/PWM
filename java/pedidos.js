document.addEventListener("DOMContentLoaded", () => {

    // Esperar a que se cargue el include (muy importante)
    setTimeout(() => {

        const template = document.getElementById("qty-template");

        document.querySelectorAll(".menu-item").forEach(item => {
            const info = item.querySelector(".item-info");

            if (info && template) {
                const clone = template.content.cloneNode(true);
                info.appendChild(clone);
            }
        });

    }, 300); // pequeño delay para asegurar que carta.html ya cargó

});