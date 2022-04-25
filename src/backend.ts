import {configure, Environment} from "nunjucks";
import {Config, makeConfigDir} from './config'
import {access, mkdir, writeFile} from 'node:fs/promises'
import * as path from "path";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}


export default async function makeBackend(cfg: Config): Promise<string> {
  return await renderToFile('s3_backend.hcl', cfg)
}

export async function renderToFile(template: string, cfg: Config, destFolder: string = 'dogeops'): Promise<string> {
  await makeConfigDir(destFolder)
  const templateFile = `${template}.njk`

  const env: Environment = configure('templates', {
    autoescape: false,
    throwOnUndefined: true,
  })
  const content = env.render(templateFile, {
    client: cfg.client,
    project: cfg.project
  })

  const destPath = path.join(destFolder, template)
  await writeFile(destPath, content, "utf-8")
  return path.resolve(destPath)
}
