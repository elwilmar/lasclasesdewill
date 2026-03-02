function getBasePath() {
    const path = window.location.pathname;
    const repoName = "lasclasesdewill";

    if (path.includes(repoName)) {
        return "/" + repoName;
    } else {
        return "";
    }
}

async function loadComponent(id, file) {
    const base = getBasePath();
    const response = await fetch(base + file);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
}

document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "/components/header.html");
    loadComponent("footer", "/components/footer.html");
});