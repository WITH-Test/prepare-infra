import * as core from "@actions/core";
import {config} from "./config";
import makeTerraformBackend from './backend'
import {context} from "@actions/github";
import {readdir} from "@actions/io/lib/io-util";
import * as path from "path";

process.on("unhandledRejection", handleError);
main().catch(handleError);


async function main(): Promise<void> {
  let enabled = false

  try {
    const here = path.resolve('.')
    console.log("HERE", here)

    const files = await readdir(here);
    for (const file of files)
      console.log(file);
  } catch (err) {
    console.error(err);
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
