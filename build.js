const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

function getDepth(relativePath) {
  const parts = relativePath.split(path.sep);
  return parts.length - 1; // excluye index.html
}

function generateRelativePath(depth) {
  if (depth === 0) return "./";
  return "../".repeat(depth);
}

function copyAssets(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      if (file !== "dist" && file !== "node_modules" && file !== "build.js" && file !== "package.json") {
        copyAssets(
          path.join(src, file),
          path.join(dest, file)
        );
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function processHTMLFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      processHTMLFiles(fullPath);
    } else if (file.endsWith(".html")) {

      const relative = path.relative(ROOT, fullPath);
      const depth = getDepth(relative);
      const relativePrefix = generateRelativePath(depth);

      let content = fs.readFileSync(fullPath, "utf8");

      const header = fs.readFileSync(path.join(ROOT, "components/header.html"), "utf8");
      const footer = fs.readFileSync(path.join(ROOT, "components/footer.html"), "utf8");

      content = content.replace('<div id="header"></div>', header);
      content = content.replace('<div id="footer"></div>', footer);

      content = content.replace(
        /href="\/css\/theme.css"/g,
        `href="${relativePrefix}css/theme.css"`
      );

      const outputPath = path.join(DIST, relative);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, content, "utf8");
    }
  });
}

fs.rmSync(DIST, { recursive: true, force: true });

copyAssets(ROOT, DIST);
processHTMLFiles(DIST);

console.log("Build limpio generado correctamente.");