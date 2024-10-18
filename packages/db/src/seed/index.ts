import initChannel from "./initChannel";
import initUser from "./initUser";

(async function seedMain() {
  // Seed data
  const settled = await Promise.allSettled([initUser(), initChannel()]);

  // Check if any seed data failed
  const rejects = settled
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason);
  if (rejects.length > 0) {
    console.error("❌  Some seed data failed.", rejects);
    process.exit(1);
  }

  // Log success
  console.log("🎉  Seed data successfully.");
  process.exit(0);
})();
