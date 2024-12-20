const { randomBytes } = require("crypto");

// Generate a 32-byte (256-bit) key and convert to hex
const key = randomBytes(32).toString("hex");
console.log("New encryption key:", key);
console.log("Key length:", key.length, "characters");
