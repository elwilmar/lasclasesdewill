const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "docs");

/* ================================
   COPIAR CARPETAS
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
   CALCULAR PROFUNDIDAD
================================ */

function getRelativePrefix(filePath) {
  const relativePath = path.relative(DIST, filePath);
  const segments = relativePath.split(path.sep);
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

      // CSS
      content = content.replace(
        /href="\/css\/theme.css"/g,
        `href="${prefix}css/theme.css"`
      );

      // JS
      content = content.replace(
        /src="\/js\/main.js"/g,
        `src="${prefix}js/main.js"`
      );

      // HEADER HOME LINKS
      content = content.replace(
        /href="\/index.html"/g,
        `href="${prefix}index.html"`
      );

      fs.writeFileSync(fullPath, content, "utf8");
    }
  });
}

/* ================================
   BUILD
================================ */

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);

copyFolder(path.join(ROOT, "css"), path.join(DIST, "css"));
copyFolder(path.join(ROOT, "js"), path.join(DIST, "js"));
copyFolder(path.join(ROOT, "components"), path.join(DIST, "components"));
copyFolder(path.join(ROOT, "areas"), path.join(DIST, "areas"));

if (fs.existsSync(path.join(ROOT, "index.html"))) {
  fs.copyFileSync(
    path.join(ROOT, "index.html"),
    path.join(DIST, "index.html")
  );
}

processHTML(DIST);

console.log("Build final limpio y estable.");