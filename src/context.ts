import { getIDToken as _getIDToken, getInput } from '@actions/core'

export function getInps() {
  return {
    repo: getInput('repo'),
    token: getInput('token'),
    dir: getInput('dir'),
  }
}

export function getRunTimeToken(): string {
  const runtimeToken = process.env.ACTIONS_RUNTIME_TOKEN
  if (!runtimeToken)
    throw new Error('Unable to get ACTIONS_TOKEN env variable')
  return runtimeToken
}

export function getIDToken() {
  const IDToken = _getIDToken()
  if (!IDToken)
    throw new Error('Unable to get IDToken')
  return IDToken
}

export function getRuntimeUrl(): string {
  const runtimeUrl = process.env.ACTIONS_RUNTIME_URL
  if (!runtimeUrl)
    throw new Error('Unable to get ACTIONS_RUNTIME_URL env variable')
  return runtimeUrl
}

export function getWorkFlowRunId(): string {
  const workFlowRunId = process.env.GITHUB_RUN_ID
  if (!workFlowRunId)
    throw new Error('Unable to get GITHUB_RUN_ID env variable')
  return workFlowRunId
}

export function getApiVersion(): string {
  return '6.0-preview'
}
