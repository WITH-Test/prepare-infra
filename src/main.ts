import * as core from "@actions/core";
import {config} from "./config";
import makeTerraformBackend from './backend'
import {context} from "@actions/github";

process.on("unhandledRejection", handleError);
main().catch(handleError);


async function main(): Promise<void> {
  let enabled = false

  if (config) {
    enabled = true
    const backend = await makeTerraformBackend(config)
    core.setOutput("tf_backend", backend)

    console.log("GitHub Context", context)
  } else {
    console.log("DogeOps disabled")
  }
  core.setOutput("enabled", enabled);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
