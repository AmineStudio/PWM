const track = document.querySelector(".slider-track");
const cards = document.querySelectorAll(".card");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let index = 0;
const visibleCards = 3; // cuántas se ven en pantalla

function updateSlider(){

    const cardWidth = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${index * cardWidth}px)`;

    prev.disabled = index === 0;
    next.disabled = index >= cards.length - visibleCards;

}

next.addEventListener("click", () => {

    if(index < cards.length - visibleCards){
        index++;
        updateSlider();
    }

});

prev.addEventListener("click", () => {

    if(index > 0){
        index--;
        updateSlider();
    }

});

updateSlider();