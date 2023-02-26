import { info } from '@actions/core'
import axios from 'axios'
import { getApiVersion, getRunTimeToken, getRuntimeUrl, getWorkFlowRunId } from './context'

export function getArtifactListUrl(): string {
  const artifactUrl = `${getRuntimeUrl()}_apis/pipelines/workflows/${getWorkFlowRunId()}/artifacts?api-version=${getApiVersion()}`
  info(`Artifact Url: ${artifactUrl}`)
  return artifactUrl
}

export async function getArtifactUrl(name: string): Promise<string> {
  const artifactListUrl = getArtifactListUrl()
  info(`Artifact List Url: ${artifactListUrl}`)
  const { data } = await axios.get(artifactListUrl, {
    headers: {
      'Authorization': `Bearer ${getRunTimeToken()}`,
      'Content-Type': 'application/json',
    },
  })
  info(JSON.stringify(data))
  const artifactRawUrl = data?.value?.find(artifact => artifact.name === name)?.url
  if (!artifactRawUrl)
    throw new Error('No uploaded artifact was found! Please check if there are any errors at build step, or uploaded artifact name is correct.')
  const artifactUrl = `${artifactRawUrl}&%24expand=SignedContent`
  info(`Artifact Url: ${artifactUrl}`)
  return artifactUrl
}
