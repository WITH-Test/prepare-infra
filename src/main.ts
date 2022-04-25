import * as core from "@actions/core";
import {config} from "./config";
import makeTerraformBackend from './backend'
import {context} from "@actions/github";

process.on("unhandledRejection", handleError);
main().catch(handleError);


async function main(): Promise<void> {
  let enabled = false

  const fs = require('fs')

  const files = fs.readdirSync('.')

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
