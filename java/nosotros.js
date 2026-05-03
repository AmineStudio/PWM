document.addEventListener("DOMContentLoaded", () => {

    const mapFrame = document.getElementById("google-map");
    const botones = document.querySelectorAll(".lista-restaurantes li");

    console.log("Mapa:", mapFrame);
    console.log("Botones:", botones.length);

    if (!mapFrame || botones.length === 0) return;

    const ubicaciones = {
        centro: "https://www.google.com/maps?q=Telde+Las+Palmas&output=embed",
        puerto: "https://www.google.com/maps?q=Puerto+de+la+Luz+Las+Palmas&output=embed",
        sur: "https://www.google.com/maps?q=Maspalomas+Gran+Canaria&output=embed"
    };

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.map;
            console.log("Click en:", id);

            if (ubicaciones[id]) {
                mapFrame.src = ubicaciones[id];
            }
        });
    });
});