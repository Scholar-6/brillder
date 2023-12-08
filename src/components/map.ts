import { UserPreferenceType, User } from "model/user";
import { isAorP } from "./services/brickService";

export const Admin = '/admin';
export const AdminOverview = Admin + '/overview';
export const AdminBricksPlayed = Admin + '/bricks-played';
export const UsersEvents = Admin + '/users-events';
export const ClassesEvents = Admin + '/classes-events';
export const AssignmentEvents = Admin + '/assignment-events';

export const Login = '/login';
export const ActivateAccount = '/activateAccount';
export const SixthformChoices = '/sixthform-choices';
export const ActivateAccountEmail = ActivateAccount + '/email';
export const ResetPassword = '/resetPassword';
export const Build = '/build';
export const MainPage = '/home';
export const LeaderboardPage = '/leaderboard';
export const MyLibrary = '/my-library';
export const TermsPage = '/terms';
export const ChoosePlan = '/choose-plan';
export const SubscriptionTerms = '/subscription-terms';
export const Subscribe = '/subscribe';

export const MyLibrarySubject = (subjectId: number) => {
  return MyLibrary + '?subjectId=' + subjectId;
}

export const AssignmentsPage = '/assignments';
export const AssignmentsClassPage = AssignmentsPage + '/:classId';

export const buildBase = (brickId: number) => `${Build}/brick/` + brickId;

export const NewBrick = `${Build}/new-brick`;
export const ProposalBase = (brickId: number) => `${Build}/brick/${brickId}`;

export const BackToWorkPage = '/back-to-work';
export const BackToWorkPagePersonal = BackToWorkPage + '/personal';
export const BackToWorkPagePublished = BackToWorkPage + '/published';
export const backToWorkUserBased = (user: User) => 
  `${BackToWorkPage}${user.userPreference?.preferenceId === UserPreferenceType.Builder || isAorP(user.roles) ? '' : '/personal'}`

export const Onboarding = '/onboarding';
export const TermsSignUp = Onboarding + '/terms';
export const TermsOnlyAccept = TermsSignUp + '?onlyAcceptTerms=true';
export const ThankYouPage = Onboarding + '/thank-you';
export const SetUsername = Onboarding + '/set-username';
export const SelectSubjectPage = Onboarding + '/select-subjects';
export const UserPreferencePage = Onboarding + '/user-preference';
export const UserProfile = Onboarding + '/profile-page';
export const UserProfileNew = UserProfile + '/new';

export const StripeCredits = '/stripe-credits';
export const StripePage = '/stripe-subscription';
export const StripeLearner = StripePage + '/learner';
export const StripeEducator = StripePage + '/educator';

export const TeachAssignedTab = '/teach/assigned';
export const TeachAssignedArchiveTab = TeachAssignedTab + '/archive';

export const TeachAssignedClass = (classroomId: number) => {
  return classroomId ? (TeachAssignedTab + '?classroomId=' + classroomId) : TeachAssignedTab;
}

// query strings
export const NewTeachQuery = 'newTeacher=true';
export const QuickassignPrefix = 'quickassign';

export const ViewAllPage = '/play/dashboard';
export const ViewAllPageA = ViewAllPage + '?mySubject=true';
export const ViewAllPageB = ViewAllPage + '?mySubject=false';
export const ShareBricksPage = '/play/share-personal-bricks';
export const AllSubjects = ViewAllPage + '/all-subjects';
export const SubjectCategoriesPrefix = '/subject-categories';
export const SearchPublishPrefix = '/publish-search';
export const SubjectCategories = ViewAllPage + SubjectCategoriesPrefix;
export const SearchPublishBrickPage = ViewAllPage + SearchPublishPrefix;


export const BrickLinks = '/admin/brickLinks';
export const BrickSources = '/admin/brickSources';
export const BrickPersonalLinks = '/admin/brickPersonalLinks';

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
  return `${buildBase(brickId)}/plan`
};

// new brick link
export const ProposalStart = `${NewBrick}/start-building`;
export const ProposalSubjectLink = `${NewBrick}/subject`;
export const ProposalAlternateSubjectLink = `${NewBrick}/alternateSubject`;
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

export const postPlay = (brickId: number, userId: number, classId?: number) => {
  return PostPlay + '/' + brickId + '/' + userId + (classId ? '/' + classId : '');
}

export const postAssignment = (brickId: number, userId: number, classId?: number) => {
  return postPlay(brickId, userId, classId) + '?contentsAttempts=true';
}

export const postAssignmentBrief = (brickId: number, userId: number, classId?: number) => {
  return postPlay(brickId, userId, classId) + '?brief=true';
}

export const postAssignmentQuestion = (brickId: number, userId: number, questionId: number) => {
  return postPlay(brickId, userId) + '?questionNumber=' + questionId;
}


export default {
  AdminOverview,
  AdminBricksPlayed,
  ClassesEvents,
  AssignmentEvents,
  UsersEvents,
  
  Build,
  ActivateAccount,
  ActivateAccountEmail,
  ResetPassword,
  UserProfile,
  UserProfileNew,
  Login,
  MainPage,
  LeaderboardPage,
  Subscribe,
  ChoosePlan,
  StripeCredits,
  StripeLearner,
  StripeEducator,
  SubscriptionTerms,

  MyLibrary,
  MyLibrarySubject,
  
  TermsPage,
  TermsSignUp,
  TermsOnlyAccept,
  ThankYouPage,
  SetUsername,
  SelectSubjectPage,
  UserPreferencePage,
  SixthformChoices,

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
  ProposalAlternateSubjectLink,
  ProposalSubjectCoreLink,
  ProposalTitleLink,

  BackToWorkPage,
  BackToWorkPagePersonal,
  BackToWorkPagePublished,
  backToWorkUserBased,

  AssignmentsPage,
  AssignmentsClassPage,

  TeachAssignedTab,
  TeachAssignedArchiveTab,
  TeachAssignedClass,

  NewTeachQuery,

  ViewAllPage,
  ViewAllPageA,
  ViewAllPageB,
  ShareBricksPage,
  AllSubjects,
  SubjectCategoriesPrefix,
  SubjectCategories,
  SearchPublishPrefix,
  SearchPublishBrickPage,

  QuickassignPrefix,

  postPlay,
  postAssignment,
  postAssignmentBrief,
  postAssignmentQuestion,

  Proposal,
  InvestigationBuild,
  InvestigationSynthesis,
  investigationSynthesisSuggestions,
  investigationBuildQuestion,
  investigationBuildQuestionType,
  investigationQuestionSuggestions,

  BrickLinks,
  BrickSources,
  BrickPersonalLinks,
}
