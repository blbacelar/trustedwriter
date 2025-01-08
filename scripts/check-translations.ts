import en from "../src/locales/en";
import es from "../src/locales/es";
import pt from "../src/locales/pt";

function getAllKeys(obj: any, prefix = ""): string[] {
  return Object.keys(obj).reduce((keys: string[], key) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      return [...keys, ...getAllKeys(obj[key], newPrefix)];
    }
    return [...keys, newPrefix];
  }, []);
}

function checkMissingTranslations() {
  let hasMissing = false;
  const enKeys = getAllKeys(en);
  const esKeys = getAllKeys(es);
  const ptKeys = getAllKeys(pt);

  // Check Spanish translations
  const missingInEs = enKeys.filter((key) => !esKeys.includes(key));
  if (missingInEs.length > 0) {
    console.log("\nMissing Spanish translations:");
    missingInEs.forEach((key) => console.log(`- ${key}`));
    hasMissing = true;
  }

  // Check Portuguese translations
  const missingInPt = enKeys.filter((key) => !ptKeys.includes(key));
  if (missingInPt.length > 0) {
    console.log("\nMissing Portuguese translations:");
    missingInPt.forEach((key) => console.log(`- ${key}`));
    hasMissing = true;
  }

  if (hasMissing) {
    process.exit(1);
  }
}

checkMissingTranslations();
