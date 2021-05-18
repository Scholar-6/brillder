export const Login = '/login';
export const ActivateAccount = '/activateAccount';
export const ResetPassword = '/resetPassword';
export const Build = '/build';
export const MainPage = '/home';

export const buildBase = (brickId: number) => `${Build}/brick/` + brickId;

export const NewBrick = `${Build}/new-brick`;
export const ProposalBase = (brickId: number) => `${Build}/brick/${brickId}`;
export const BackToWorkPage = '/back-to-work';
export const AssignmentsPage = '/assignments';
export const AssignmentsClassPage = AssignmentsPage + '/:classId';
export const MyLibrary = '/my-library';
export const Onboarding = '/onboarding';
export const TermsPage = '/terms';


export const TermsSignUp = Onboarding + '/terms';
export const SetUsername = Onboarding + '/set-username';
export const MobileUsername = Onboarding + '/mobile-username';
export const SelectSubjectPage = Onboarding + '/select-subjects';
export const UserPreference = Onboarding + '/user-preference';
export const UserProfile = Onboarding + '/profile-page';


export const BackToWorkTeachTab = BackToWorkPage + '/teach';
export const BackToWorkBuildTab = BackToWorkPage + '/build';
export const BackToWorkLearnTab = BackToWorkPage + '/learn';

export const TeachAssignedTab = '/teach/assigned';
export const TeachAssignedArchiveTab = TeachAssignedTab + '/archive';
export const ManageClassroomsTab = '/teach/manage-classrooms';


// query strings
export const NewTeachQuery = 'newTeacher=true';


export const ViewAllPage = '/play/dashboard';
export const AllSubjects = ViewAllPage + '/all-subjects';

const investigation = (brickId: number) => {
  return `/build/brick/${brickId}/investigation`;
}

export const InvestigationBuild = (brickId: number) => {
  return `${investigation(brickId)}/question-component`;
}

export const InvestigationSynthesis = (brickId: number) => {
  return `/build/brick/${brickId}/synthesis`;
}

export const investigationBuildQuestion = (brickId: number, questionId: number) => {
  return InvestigationBuild(brickId) + `/${questionId}`;
}

export const investigationBuildQuestionType = (brickId: number, questionId: number) => {
  return investigation(brickId) + `/question/${questionId}`;
}

export const investigationQuestionSuggestions = (brickId: number, questionId: number) => {
  return investigationBuildQuestion(brickId, questionId) + '?suggestionsExpanded=true'
}

export const investigationSynthesisSuggestions = (brickId: number) => {
  return `${InvestigationSynthesis(brickId)}?suggestionsExpanded=true`;
}

// proposal pages
export const ProposalSubject = (brickId: number) => `${ProposalBase(brickId)}/subject`;
export const ProposalTitle = (brickId: number) => `${ProposalBase(brickId)}/brick-title`;
export const ProposalOpenQuestion = (brickId: number) => `${ProposalBase(brickId)}/open-question`;
export const ProposalBrief = (brickId: number) => `${ProposalBase(brickId)}/brief`;
export const ProposalPrep = (brickId: number) => `${ProposalBase(brickId)}/prep`;
export const ProposalLength = (brickId: number) => `${ProposalBase(brickId)}/length`;
export const ProposalReview = (brickId: number) => `${ProposalBase(brickId)}/plan`;

export const Proposal = (brickId: number) => {
  console.log(`${buildBase(brickId)}/plan`);
  return `${buildBase(brickId)}/plan`
};

// new brick link
export const ProposalSubjectLink = `${NewBrick}/subject`;
export const ProposalTitleLink = `${NewBrick}/brick-title`;

// play preview
export const PlayPreviewBase = '/play-preview/brick';
export const PlayIntroLastPrefix = '/intro';

export const playPreview = (brickId: number) => {
  return  PlayPreviewBase + '/' + brickId;
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
  ActivateAccount,
  ResetPassword,
  UserProfile,
  Login,
  MainPage,
  MyLibrary,

  TermsPage,
  TermsSignUp,
  SetUsername,
  MobileUsername,
  SelectSubjectPage,
  UserPreference,

  NewBrick,
  ProposalBase,
  ProposalSubject,
  ProposalTitle,
  ProposalOpenQuestion,
  ProposalBrief,
  ProposalPrep,
  ProposalLength,
  ProposalReview,
  ProposalSubjectLink,
  ProposalTitleLink,

  BackToWorkPage,
  AssignmentsPage,
  AssignmentsClassPage,
  BackToWorkTeachTab,
  BackToWorkBuildTab,
  BackToWorkLearnTab,

  TeachAssignedTab,
  TeachAssignedArchiveTab,
  ManageClassroomsTab,

  NewTeachQuery,

  ViewAllPage,
  AllSubjects,

  postPlay,
  Proposal,

  InvestigationBuild,
  InvestigationSynthesis,
  investigationSynthesisSuggestions,
  investigationBuildQuestion,
  investigationBuildQuestionType,
  investigationQuestionSuggestions,
  playIntro
}
