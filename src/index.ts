import * as fs from 'fs'
import { randomBytes } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { Octokit } from 'octokit'
import * as tar from 'tar-fs'
import * as artifact from '@actions/artifact'
import * as core from '@actions/core'
import { getIDToken, getInps } from './context'
import { getArtifactUrl } from './artifact'
(async () => {
  const context = getInps()
  const [owner, repo] = context.repo.split('/')
  const octokit = new Octokit({
    auth: context.token,
  })

  await pipeline(
    tar.pack(context.dir, {
      ignore: name => name === '.git' || name === '.github',
    }),
    createWriteStream('gh-pages.tar'),
  )
  fs.readdirSync('.').forEach((name) => {
    core.info(name)
  })
  await artifact.create().uploadArtifact('gh-pages', ['gh-pages.tar'], '.')
  const artifactUrl = await getArtifactUrl('gh-pages')
  await octokit.request('POST /repos/{owner}/{repo}/pages/deployment', {
    owner,
    repo,
    artifact_url: artifactUrl,
    pages_build_version: randomBytes(40).toString('hex'),
    oidc_token: await getIDToken(),
  })
})()
