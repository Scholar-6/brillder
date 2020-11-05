export const Login = '/login';
export const Build = '/build';
export const MainPage = '/home';
export const ProposalBase = `${Build}/new-brick`;
export const BackToWorkPage = '/back-to-work';

export const BackToWorkTeachTab = BackToWorkPage + '/teach';
export const BackToWorkBuildTab = BackToWorkPage + '/build';
export const BackToWorkLearnTab = BackToWorkPage + '/learn';

export const TeachAssignedTab = '/teach/assigned';
export const ManageClassroomsTab = '/teach/manage-classrooms';

export const ViewAllPage = '/play/dashboard';

const investigation = (brickId: number) => {
  return `/build/brick/${brickId}/investigation`;
}

export const InvestigationBuild = (brickId: number) => {
  return `${investigation(brickId)}/question-component`;
}

export const InvestigationSynthesis = (brickId: number) => {
  return `${investigation(brickId)}/synthesis`;
}

export const investigationBuildQuestion = (brickId: number, questionId: number) => {
  return InvestigationBuild(brickId) + `/${questionId}`;
}

export const investigationQuestionSuggestions = (brickId: number, questionId: number) => {
  return investigationBuildQuestion(brickId, questionId) + '?suggestionsExpanded=true'
}

// proposal pages
export const ProposalSubject = `${ProposalBase}/subject`;
export const ProposalTitle = `${ProposalBase}/brick-title`;
export const ProposalOpenQuestion = `${ProposalBase}/open-question`;
export const ProposalBrief = `${ProposalBase}/brief`;
export const ProposalPrep = `${ProposalBase}/prep`;
export const ProposalLength = `${ProposalBase}/length`;
export const ProposalReview = `${ProposalBase}/proposal`;


// play preview
export const PlayPreviewBase = '/play-preview/brick';
export const PlayIntroLastPrefix = '/intro';

export const playPreview = (brickId: number) => {
  return  PlayPreviewBase + '/' + brickId;
}

export const playPreviewIntro = (brickId: number) => {
  return playPreview(brickId) + PlayIntroLastPrefix;
}

// play
export const PlayBase = '/play/brick';

export const realPlay = (brickId: number) => {
  return  PlayBase + '/' + brickId;
}

export const playIntro = (brickId: number) => {
  return realPlay(brickId) + PlayIntroLastPrefix;
}

// post play

export const PostPlay = '/post-play/brick';

export const postPlay = (brickId: number, userId: number) => {
  return PostPlay + '/' + brickId + '/' + userId;
}

export default {
  Build,
  Login,
  MainPage,
  ProposalBase,
  ProposalSubject,
  ProposalTitle,
  ProposalOpenQuestion,
  ProposalBrief,
  ProposalPrep,
  ProposalLength,
  ProposalReview,

  BackToWorkPage,
  BackToWorkTeachTab,
  BackToWorkBuildTab,
  BackToWorkLearnTab,

  TeachAssignedTab,
  ManageClassroomsTab,

  ViewAllPage,
  postPlay,

  InvestigationBuild,
  InvestigationSynthesis,
  investigationBuildQuestion,
  investigationQuestionSuggestions,
  playPreviewIntro,
  playIntro
}
