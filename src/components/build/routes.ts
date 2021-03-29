import { Build } from "components/map";

const baseBuild = Build + '/brick';
const baseBuildRoute = baseBuild + '/:brickId';

const build = (brickId: number) => baseBuild + '/' + brickId;

export const BuildSubjectLastPrefix = '/subject';
export const BuildTitleLastPrefix = '/brick-title';
export const BuildOpenQuestionLastPrefix = '/open-question';
export const BuildLengthLastPrefix = '/length';
export const BuildBriefLastPrefix = '/brief';
export const BuildPrepLastPrefix = '/prep';
export const BuildPlanLastPrefix = '/plan';
export const BuildSynthesisLastPrefix = '/synthesis';

export const subjectRoute = baseBuildRoute + BuildSubjectLastPrefix;
export const titleRoute = baseBuildRoute + BuildTitleLastPrefix;
export const openQuestionRoute = baseBuildRoute + BuildOpenQuestionLastPrefix;
export const lengthRoute = baseBuildRoute + BuildLengthLastPrefix;
export const briefRoute = baseBuildRoute + BuildBriefLastPrefix;
export const prepRoute = baseBuildRoute + BuildPrepLastPrefix;
export const planRoute = baseBuildRoute + BuildPlanLastPrefix;
export const synthesisRoute = baseBuildRoute + BuildSynthesisLastPrefix;

export const buildSubject = (brickId: number) => build(brickId) + BuildSubjectLastPrefix;
export const buildTitle = (brickId: number) => build(brickId) + BuildTitleLastPrefix;
export const buildOpenQuestion = (brickId: number) => build(brickId) + BuildOpenQuestionLastPrefix;
export const buildLength = (brickId: number) => build(brickId) + BuildLengthLastPrefix;
export const buildBrief = (brickId: number) => build(brickId) + BuildBriefLastPrefix;
export const buildPrep = (brickId: number) => build(brickId) + BuildPrepLastPrefix;
export const buildPlan = (brickId: number) => build(brickId) + BuildPlanLastPrefix;
export const buildSynthesis = (brickId: number) => build(brickId) + BuildSynthesisLastPrefix;

export default {
  BuildSubjectLastPrefix,
  BuildTitleLastPrefix,
  BuildOpenQuestionLastPrefix,
  BuildLengthLastPrefix,
  BuildBriefLastPrefix,
  BuildPrepLastPrefix,
  BuildPlanLastPrefix,
  BuildSynthesisLastPrefix,

  baseBuildRoute,
  subjectRoute,
  titleRoute,
  openQuestionRoute,
  lengthRoute,
  briefRoute,
  prepRoute,
  planRoute,
  synthesisRoute,

  buildSubject,
  buildTitle,
  buildOpenQuestion,
  buildLength,
  buildBrief,
  buildPrep,
  buildPlan,
  buildSynthesis,
}
