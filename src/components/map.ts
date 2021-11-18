import { RolePreference, User } from "model/user";
import { isAorP } from "./services/brickService";

export const Login = '/login';
export const ActivateAccount = '/activateAccount';
export const ResetPassword = '/resetPassword';
export const Build = '/build';
export const MainPage = '/home';
export const LeaderboardPage = '/leaderboard';
export const MyLibrary = '/my-library';
export const TermsPage = '/terms';

export const AssignmentsPage = '/assignments';
export const AssignmentsClassPage = AssignmentsPage + '/:classId';

export const buildBase = (brickId: number) => `${Build}/brick/` + brickId;

export const NewBrick = `${Build}/new-brick`;
export const ProposalBase = (brickId: number) => `${Build}/brick/${brickId}`;

export const BackToWorkPage = '/back-to-work';
export const BackToWorkPersonal = BackToWorkPage + '?isCore=false';
export const BackToWorkPublic = BackToWorkPage + '?isCore=true';
export const backToWorkUserBased = (user: User) => 
  `${BackToWorkPage}?isCore=${user.rolePreference?.roleId === RolePreference.Builder || isAorP(user.roles) ? 'true' : 'false'}`

export const Onboarding = '/onboarding';
export const TermsSignUp = Onboarding + '/terms';
export const ThankYouPage = Onboarding + '/thank-you';
export const SetUsername = Onboarding + '/set-username';
export const SelectSubjectPage = Onboarding + '/select-subjects';
export const UserPreference = Onboarding + '/user-preference';
export const UserProfile = Onboarding + '/profile-page';

export const TeachAssignedTab = '/teach/assigned';
export const TeachAssignedArchiveTab = TeachAssignedTab + '/archive';
export const ManageClassroomsTab = '/teach/manage-classrooms';


// query strings
export const NewTeachQuery = 'newTeacher=true';


export const ViewAllPage = '/play/dashboard';
export const AllSubjects = ViewAllPage + '/all-subjects';
export const SubjectCategoriesPrefix = '/subject-categories';
export const SearchPublishPrefix = '/publish-search';
export const SubjectCategories = ViewAllPage + SubjectCategoriesPrefix;
export const SearchPublishBrickPage = ViewAllPage + SearchPublishPrefix;


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
export const ProposalStart = `${NewBrick}/start-building`;
export const ProposalSubjectLink = `${NewBrick}/subject`;
export const ProposalSubjectCoreLink = (isCore: boolean) => `${NewBrick}/subject?isCore=` + isCore;
export const ProposalTitleLink = `${NewBrick}/brick-title`;

// play preview
export const PlayPreviewBase = '/play-preview/brick';

export const playPreview = (brickId: number) => {
  return  PlayPreviewBase + '/' + brickId;
}

// play
export const PlayBase = '/play/brick';

export const realPlay = (brickId: number) => {
  return  PlayBase + '/' + brickId;
}

// post play

export const PostPlay = '/post-play/brick';

export const postPlay = (brickId: number, userId: number) => {
  return PostPlay + '/' + brickId + '/' + userId;
}

export const postAssignment = (brickId: number, userId: number) => {
  return postPlay(brickId, userId) + '?contentsAttempts=true';
}

export const postAssignmentBrief = (brickId: number, userId: number) => {
  return postPlay(brickId, userId) + '?brief=true';
}

export default {
  Build,
  ActivateAccount,
  ResetPassword,
  UserProfile,
  Login,
  MainPage,
  MyLibrary,
  LeaderboardPage,

  TermsPage,
  TermsSignUp,
  ThankYouPage,
  SetUsername,
  SelectSubjectPage,
  UserPreference,

  NewBrick,
  ProposalStart,
  ProposalBase,
  ProposalSubject,
  ProposalTitle,
  ProposalOpenQuestion,
  ProposalBrief,
  ProposalPrep,
  ProposalLength,
  ProposalReview,
  ProposalSubjectLink,
  ProposalSubjectCoreLink,
  ProposalTitleLink,

  BackToWorkPage,
  BackToWorkPublic,
  BackToWorkPersonal,
  backToWorkUserBased,

  AssignmentsPage,
  AssignmentsClassPage,

  TeachAssignedTab,
  TeachAssignedArchiveTab,
  ManageClassroomsTab,

  NewTeachQuery,

  ViewAllPage,
  AllSubjects,
  SubjectCategoriesPrefix,
  SubjectCategories,
  SearchPublishPrefix,
  SearchPublishBrickPage,

  postPlay,
  postAssignment,
  postAssignmentBrief,

  Proposal,
  InvestigationBuild,
  InvestigationSynthesis,
  investigationSynthesisSuggestions,
  investigationBuildQuestion,
  investigationBuildQuestionType,
  investigationQuestionSuggestions,
}
