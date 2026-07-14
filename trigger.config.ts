import { defineConfig } from "@trigger.dev/sdk";

// Self-hosted: TRIGGER_API_URL e TRIGGER_SECRET_KEY vêm do ambiente (.env.local / Coolify).
export default defineConfig({
  project: "proj_mjiflhfpfsmescrpmqsn",
  dirs: ["./src/trigger"],
  maxDuration: 3600,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      factor: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 30000,
      randomize: true,
    },
  },
});
