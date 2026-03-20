// ================= CANTIDAD =================
document.addEventListener("click", e => {

    if(e.target.classList.contains("plus") || e.target.classList.contains("minus")){
        const control = e.target.closest(".qty-control");
        const qtyEl = control.querySelector(".qty");
        let qty = parseInt(qtyEl.textContent);

        if(e.target.classList.contains("plus")) qty++;
        if(e.target.classList.contains("minus") && qty > 0) qty--;

        qtyEl.textContent = qty;
    }

});