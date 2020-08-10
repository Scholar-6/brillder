import { ProposalCashe } from './types'

export function clearProposal() {
  localStorage.removeItem(ProposalCashe);
}

export function setLocalBrick(data: any) {
  localStorage.setItem(ProposalCashe, JSON.stringify(data));
}

export function getLocalBrick() {
  try {
    const brickString = localStorage.getItem(ProposalCashe) as string;
    return JSON.parse(brickString);
  } catch { }
  return null;
}
