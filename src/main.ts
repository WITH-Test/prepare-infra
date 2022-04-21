import * as core from "@actions/core";
import * as fs from "fs/promises";
import { context } from "@actions/github";

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function exists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const config = core.getInput("config_file");

  const dogeOpsEnabled = await exists(config);

  if (dogeOpsEnabled) {
    console.log("Config:", await fs.readFile(config));
  }

  console.log("Context:", context)

  core.setOutput("dogeops", dogeOpsEnabled);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
