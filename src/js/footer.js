class MyFooter extends HTMLElement {
    connectedCallback() {
        fetch("./components/footer.html")
            .then(res => res.text())
            .then(html => this.innerHTML = html);
    }
}

customElements.define("my-footer", MyFooter);

window.addEventListener("DOMContentLoaded", () => {
    const footer = document.createElement("my-footer");
    document.body.append(footer);  // ← append pour mettre à la fin
});