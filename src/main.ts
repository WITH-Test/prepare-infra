import * as core from "@actions/core";
import {config} from "./config";
import makeTerraformBackend from './backend'
import {context} from "@actions/github";
import {readdir} from "@actions/io/lib/io-util";

process.on("unhandledRejection", handleError);
main().catch(handleError);


async function main(): Promise<void> {
  let enabled = false

  const files = await readdir('.')

  for (const file of files) {
    console.log(file)
  }

  if (config) {
    enabled = true
    const backend = await makeTerraformBackend(config)
    core.setOutput("tf_backend", backend)
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
