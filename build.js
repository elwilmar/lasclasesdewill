const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "docs");

/* ================================
   UTILIDAD: COPIAR CARPETAS
================================ */

function copyFolder(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/* ================================
   UTILIDAD: CALCULAR PROFUNDIDAD
================================ */

function getRelativePrefix(filePath) {
  const relativePath = path.relative(DIST, filePath);
  const segments = relativePath.split(path.sep);

  // restamos 1 porque el último segmento es el archivo
  const depth = segments.length - 1;

  if (depth === 0) return "./";

  return "../".repeat(depth);
}

/* ================================
   PROCESAR HTML
================================ */

function processHTML(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      processHTML(fullPath);
    } else if (file.endsWith(".html")) {

      let content = fs.readFileSync(fullPath, "utf8");

      const prefix = getRelativePrefix(fullPath);

      // Reemplazar ruta absoluta de CSS
      content = content.replace(
        /href="\/css\/theme.css"/g,
        `href="${prefix}css/theme.css"`
      );

      // Reemplazar ruta absoluta de JS si existiera
      content = content.replace(
        /src="\/js\/main.js"/g,
        `src="${prefix}js/main.js"`
      );

      fs.writeFileSync(fullPath, content, "utf8");
    }
  });
}

/* ================================
   BUILD PRINCIPAL
================================ */

// Limpiar dist completamente
fs.rmSync(DIST, { recursive: true, force: true });

// Crear dist vacío
fs.mkdirSync(DIST);

// Copiar estructura necesaria
copyFolder(path.join(ROOT, "css"), path.join(DIST, "css"));
copyFolder(path.join(ROOT, "js"), path.join(DIST, "js"));
copyFolder(path.join(ROOT, "components"), path.join(DIST, "components"));
copyFolder(path.join(ROOT, "areas"), path.join(DIST, "areas"));

// Copiar index principal si existe
if (fs.existsSync(path.join(ROOT, "index.html"))) {
  fs.copyFileSync(
    path.join(ROOT, "index.html"),
    path.join(DIST, "index.html")
  );
}

// Procesar HTML dentro de dist
processHTML(DIST);

console.log("Build compilado limpio y estructuralmente correcto.");