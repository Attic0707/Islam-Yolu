const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function replaceFirstLinePackage(filePath, correctPackage) {
  if (!fs.existsSync(filePath)) return;

  const src = fs.readFileSync(filePath, "utf8");
  const next = src.replace(/^package\s+.+$/m, `package ${correctPackage}`);

  if (next !== src) {
    fs.writeFileSync(filePath, next, "utf8");
  }
}

module.exports = function withFixAndroidKotlinPackage(config) {
  return withDangerousMod(config, [
    "android",
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const pkg = cfg.android?.package; // from app.json
      if (!pkg) return cfg;

      // Your current folder path is based on com.tavanarasi.islamyolu -> com/tavanarasi/islamyolu
      const pkgPath = pkg.replace(/\./g, path.sep);

      const mainActivity = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "java",
        pkgPath,
        "MainActivity.kt"
      );
      const mainApplication = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "java",
        pkgPath,
        "MainApplication.kt"
      );

      replaceFirstLinePackage(mainActivity, pkg);
      replaceFirstLinePackage(mainApplication, pkg);

      return cfg;
    },
  ]);
};
