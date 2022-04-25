import * as path from "node:path";
import {existsSync, readFileSync} from 'node:fs'
// import { context } from "@actions/github";
import * as core from "@actions/core";
import {mkdir} from "node:fs/promises";


const yaml = require('js-yaml');


export interface Config {
  client: string
  project: string
}

/**
 * Try the bare name and also .yml and .yaml extensions
 */
const configFile = ((input) => {
  const baseName = input.split('.')[0]
  const configs = [`${baseName}.yaml`, `${baseName}.yml`]
  for (const c of configs) {
    console.log("config file is", c)
    if (existsSync(c)) {
      console.log("config file is", path.resolve(c))
      return path.resolve(c)
    }
  }
  return ""
})(core.getInput("config_file") || 'dogeops.yml')

function ensureString(object: { [name: string]: any }, propName: string): string {
  if (!object[propName] || object[propName].trim().length === 0)
    throw new Error(propName + " does not exist or is empty");

  return object[propName];
}

export const getConfig = (configFile: string) => {
  const unparsedEnv = yaml.load(readFileSync(path.resolve(configFile), "utf8"));
  try {

    const cfg: Config = {
      client: ensureString(unparsedEnv, "Client"),
      project: ensureString(unparsedEnv, "Project")
    }
    return cfg
  } catch {
    return undefined
  }
}

export const config = getConfig(configFile)

export async function makeConfigDir(dir: string) {
  await mkdir(dir, {recursive: true})
}
