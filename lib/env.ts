// lib/env.ts
export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  VONAGE_APPLICATION_ID: process.env.VONAGE_APPLICATION_ID ?? "",
  VONAGE_PRIVATE_KEY: process.env.VONAGE_PRIVATE_KEY ?? "",
};

for (const [k, v] of Object.entries(env)) {
  if (!v) {
    // Prefer failing fast on boot in server environments
    // You can soften this if desired:
     console.warn(`[env] Missing ${k}`);
  }
}
