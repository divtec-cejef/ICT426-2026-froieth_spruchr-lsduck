class MyHeader extends HTMLElement {
    connectedCallback() {
        fetch("./components/header.html")
            .then(res => res.text())
            .then(html => this.innerHTML = html);
    }
}

customElements.define("my-header", MyHeader);

// Injection automatique dans la page
window.addEventListener("DOMContentLoaded", () => {
    const header = document.createElement("my-header");
    document.body.prepend(header);
});
