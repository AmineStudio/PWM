document.addEventListener("DOMContentLoaded", () => {
    const swiper1 = new Swiper('#hero-slider', {
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
    new Swiper('#productos-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
        }
    });

    // 3. FILA 3: EL TRUCO DEL RETARDO
    // Primero creamos el slider SIN autoplay
    const swiper3 = new Swiper('#combos-slider', {
        loop: true,
        speed: 600,
        autoplay: false,
    });
    setTimeout(() => {
        swiper3.params.autoplay.delay = 5000;
        swiper3.params.autoplay.reverseDirection = true;
        swiper3.autoplay.start();
    }, 3000);

});