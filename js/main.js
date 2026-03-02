async function loadComponent(id, file) {
    try {
        const response = await fetch(file);
        const content = await response.text();
        document.getElementById(id).innerHTML = content;
    } catch (error) {
        console.error("Error cargando componente:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "/components/header.html");
    loadComponent("footer", "/components/footer.html");
});