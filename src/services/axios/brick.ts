import { OverviewData } from 'components/admin/adminOverview/AdminOverviewPage';
import { PDateFilter } from 'components/admin/bricksPlayed/BricksPlayedSidebar';
import { getApiQuestion } from 'components/build/questionService/QuestionService';
import { AssignmentBrick } from 'model/assignment';
import { Brick, BrickLengthEnum, BrickStatus, KeyWord, Subject } from 'model/brick';
import { Question } from 'model/question';

import { get, put, post, axiosDelete } from './index';
import { createQuestion } from './question';

export const getPublicBrickById = async (id: number) => {
  try {
    return await get<Brick>("/brick/public/" + id);
  } catch {
    return null;
  }
}

/**
 * Get all bricks
 * return list of bricks if success or null if failed
 */
export const getBricks = async () => {
  try {
    return await get<Brick[]>("/bricks");
  } catch {
    return null;
  }
}

export const getThreeColumnBricks = async () => {
  try {
    return await get<Brick[]>("/bricks/threeColumns");
  } catch {
    return null;
  }
}

export interface BrickStatusPerPage {
  isCore: boolean;
  subjectIds: number[];
  brickStatuses: BrickStatus[];
  page: number;
  pageSize: number;
  skipOne: boolean;
}

export interface BricksDataBW {
  bricks: Brick[];
  count: number;
  firstStatusCount: number;
}

export const getBricksByStatusPerPage = async (data: BrickStatusPerPage) => {
  try {
    return await post<BricksDataBW>("/bricks/byStatus/page", data);
  } catch {
    return null;
  }
}


export const getPersonalBricks = async () => {
  try {
    return await get<Brick[]>("/bricks/personal");
  } catch {
    return null;
  }
}

export const getPublicBricks = async () => {
  try {
    return await get<Brick[]>('/bricks/public');
  } catch {
    return null;
  }
}


export const getAdminBrickStatistic = async (brickId: number) => {
  try {
    return await get<any>("/admin/getAdminBrickStatistic/" + brickId);
  } catch {
    return null;
  }
}

interface BackToWorkStatistics {
  personalDraftCount?: number;
  personalPublishCount?: number;

  draftCount?: number;
  buildCount?: number;
  reviewCount?: number;

  publishedCount?: number;
}

export const getBackToWorkStatistics = async (getPersonal: boolean, getPublic: boolean, getThreeColumns: boolean) => {
  try {
    return await post<BackToWorkStatistics>('/bricks/backToWork/statistic', {getPersonal, getPublic, getThreeColumns});
  } catch {
    return null;
  }
}

export const adminGetBrickAtemptStatistic = async (dateFilter: PDateFilter) => {
  try {
    return await get<Brick[]>(`/institution/getAdminBricksStatistic/` + dateFilter);
  } catch {
    return false;
  }
}

export const getOverviewData = async (dateFilter: PDateFilter) => {
  try {
    return await get<OverviewData>(`/admin/getOverviewData/` + dateFilter);
  } catch {
    return false;
  }
}

export const getOverviewNewSignups = async (dateFilter: PDateFilter) => {
  try {
    return await get<any>(`/admin/getOverviewNewSignups/` + dateFilter);
  } catch {
    return false;
  }
} 

export const getOverviewPlayedData = async (dateFilter: PDateFilter) => {
  try {
    return await get<any>(`/admin/getOverviewPlayedData/` + dateFilter);
  } catch {
    return false;
  }
}

export const getOverviewCompetitionData = async (dateFilter: PDateFilter) => {
  try {
    return await get<any>(`/admin/getOverviewCompetitionData/` + dateFilter);
  } catch {
    return false;
  }
}

export const getOverviewAssignedData = async (dateFilter: PDateFilter) => {
  try {
    return await get<any>(`/admin/getOverviewAssignedData/` + dateFilter);
  } catch {
    return false;
  }
}

export const getAdminBricksPublished = async (dateFilter: PDateFilter) => {
  try {
    return await get<Brick[]>(`/admin/getAdminBricksPublished/` + dateFilter);
  } catch {
    return false;
  }
}

export const getLatestBrick = async () => {
  try {
    return await get<Brick>('/brick/public/latest');
  } catch {
    return null;
  }
}

/**
 * Get bricks by status
 * return list of bricks if success or null if failed
 */
export const getPublishedBricks = async () => {
  try {
    let bricks = await get<Brick[]>(`/bricks/byStatus/${BrickStatus.Publish}`);
    if (bricks) {
      /*eslint-disable-next-line*/
      bricks = bricks.filter(b => b.status == 4);
    }
    return bricks;
  } catch {
    return null;
  }
}


export interface PageBricks {
  pageCount: number;
  bricks: Brick[];
  subjects: Subject[];
}

/**
 * Get bricks by status
 * return list of bricks if success or null if failed
 */
export const getPublishedBricksByPage = async (
  pageSize: number, page: number, isCore: boolean,
  level: number[], length: BrickLengthEnum[], subjectIds: number[],
  onlyCompetitions: boolean
) => {
  try {

    let data = {
      isCore,
      pageSize,
      level,
      length,
      subjectIds,
      onlyCompetitions,
    } as any;

    return await post<PageBricks>(`/bricks/byStatus/${BrickStatus.Publish}/page/${page}`, data);
  } catch {
    return null;
  }
}


/**
 * Get bricks by status
 * return list of bricks if success or null if failed
 */
 export const getUnauthPublishedBricksByPage = async (
  pageSize: number, page: number, level: number[], length: BrickLengthEnum[],
  subjectIds: number[], onlyCompetitions: boolean, subjectGroup?: number | null
) => {
  try {

    let data = {
      pageSize,
      level,
      length,
      subjectIds,
      onlyCompetitions,
    } as any;

    if (subjectGroup) {
      data.subjectGroup = subjectGroup;
    }

    return await post<PageBricks>(`/bricks/byStatusUnauth/${BrickStatus.Publish}/page/${page}`, data);
  } catch {
    return null;
  }
}


/**
 * Get current user bricks
 * return list of bricks if success or null if failed
 */
export const getCurrentUserBricks = async () => {
  try {
    return (await get<Brick[]>("/bricks/currentUser/short"))?.filter(b => b.status !== BrickStatus.Deleted);
  } catch (e) {
    return null;
  }
}

export const getAssignedBricks = async () => {
  try {
    return await get<AssignmentBrick[]>("/bricks/assigned");
  } catch (e) {
    return null;
  }
}

export const sharedPersonalBricks = async (brickIds: number[], emails: string[]) => {
  try {
    return await post<any>("/brick/personal/share", {brickIds, emails});
  } catch (e) {
    return null;
  }
}

export const getLibraryBricks = async <T>(userId: number, classroomId?: number) => {
  try {
    let obj:any = {userId};
    if (classroomId) {
      obj = { userId, classroomId };
    }
    console.log(obj)
    return await post<T[]>("/play/library", obj);
  } catch (e) {
    return null;
  }
}

export const getNumberOfAttempts = async () => {
  try {
    const nubmerOfAttempts = await get<number>("/user/playCount/");
    if (nubmerOfAttempts) {
      return nubmerOfAttempts;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export const getStudentAssignments = async (studentId: number) => {
  try {
    return await get<AssignmentBrick[]>("/bricks/assignedTo/" + studentId);
  } catch {
    return null;
  }
}

export const getSuggestedKeywords = async (suggestion: string) => {
  try {
    return await get<KeyWord[]>("/keywords/suggest/" + suggestion);
  } catch {
    return null;
  }
}

interface BrickSuggest {
  body: Brick;
  id: number;
}

export const getSuggestedByTitles = async (suggestion: string) => {
  try {
    return await get<BrickSuggest[]>("/brick/suggest/title/" + suggestion);
  } catch {
    return null;
  }
}

export const searchBricks = async (searchString: string = '') => {
  try {
    return await post<Brick[]>("/bricks/search", { searchString });
  } catch {
    return null;
  }
}

interface SearchCoreBrickStatuses {
  searchString: string;
  brickStatuses: BrickStatus[];
  isCore: boolean;
  page: number;
  pageSize: number;
}

export const searchCoreBricksByStatus = async (data: SearchCoreBrickStatuses) => {
  try {
    return await post<BricksDataBW>("/bricks/byStatus/search/page", data);
  } catch {
    return null;
  }
}

export const searchPaginateBricks = async (searchString: string = '', page: number, pageSize: number, isCore: boolean, subjectIds?: number[], isKeyword?: boolean) => {
  try {
    return await post<PageBricks>(`/bricks/search/public/page/${page}`, {
      searchString, pageSize, isCore,
      subjectIds: subjectIds ? subjectIds : [],
      isKeyword: isKeyword ? isKeyword : false
    });
  } catch {
    return null;
  }
}

export const searchPublicBricks = async (searchString: string = '') => {
  try {
    return await post<Brick[]>("/bricks/search/public", { searchString });
  } catch {
    return null;
  }
}

export const publishBrick = async (brickId: number) => {
  try {
    const brick = await post<Brick>(`/brick/publish/${brickId}`, {});
    if (brick && brick.status === BrickStatus.Publish) {
      return true;
    }
    return null;
  } catch {
    return null;
  }
}

export const inviteUser = async (brickId: number, userId: number) => {
  try {
    await post<Brick>(`/brick/inviteToBrick/${brickId}`, { userIds: [userId] });
    return true;
  } catch {
    return false;
  }
}

export const shareByEmails = async (brickId: number, emails:  string[]) => {
  try {
    await post<Brick>(`/brick/share/${brickId}`, { emails });
    return true;
  } catch {
    return false;
  }
}

export const setCoreLibrary = async (brickId: number, isCore?: boolean) => {
  try {
    const core = isCore ? true : false;
    await put<Brick>(`/brick/setCoreLibrary/${brickId}/${core}`, {});
    return true;
  } catch {
    return false;
  }
}

export const updateBrick = async (brick: Brick) => {
  try {
    await put<Brick>(`/brick`, brick);
    return true;
  } catch {
    return false;
  }
}

export const sendToPublisher = async (brickId: number) => {
  try {
    await post<any>(`/brick/sendToPublisher/${brickId}`, {});
    return true;
  } catch {
    return false;
  }
}

export const deleteComment = async (brickId: number, commentId: number) => {
  try {
    return await axiosDelete(`/brick/${brickId}/comment/${commentId}`);
  } catch {
    return false;
  }
}

export const returnToAuthor = async (brickId: number) => {
  try {
    await post<Brick>(`/brick/returnToAuthor`, { brickId });
    return true;
  } catch {
    return false;
  }
}

export const returnToEditor = async (brickId: number, userId: number) => {
  try {
    await post<any>(`/brick/returnToEditor`, { brickId, userId });
    return true;
  } catch {
    return false;
  }
}

/**
 * return false or null if error. brick if success
 * @param brickId BrickId to adapt
 */
export const adaptBrick = async (brickId: number) => {
  try {
    const copyBrick = await post<Brick>(`/brick/adapt/${brickId}`, {});
    return copyBrick;
  } catch {
    return false;
  }
}

export const sendAssignmentReminder = async (assignmentId: number) => {
  try {
    return await post<any>(`/brick/assignment/${assignmentId}/reminder`, {});
  } catch {
    return false;
  }
}

export const archiveAssignment = async (assignmentId: number) => {
  try {
    return await post<AssignmentBrick>(`/brick/assignment/${assignmentId}/archive`, {});
  } catch {
    return false;
  }
}

export const unarchiveAssignment = async (assignmentId: number) => {
  try {
    return await post<AssignmentBrick>(`/brick/assignment/${assignmentId}/unarchive`, {});
  } catch {
    return false;
  }
}

export const deleteQuestion = async (questionId: number) => {
  try {
    return await axiosDelete(`/question/${questionId}`);
  } catch {
    return false;
  }
}

export interface CoverImageData {
  brickId: number;
  coverImage: string;
  coverImageSource: string;
}

export const setBrickCover = async (data: CoverImageData) => {
  try {
    return await post<any>(`/brick/cover`, data);
  } catch {
    return false;
  }
}

export const getKeywords = async () => {
  try {
    return await get<KeyWord[]>(`/bricks-keywords`);
  } catch {
    return false;
  }
}

export const copyBrick = async (brick: Brick, questions: Question[]) => {
  try {
    const copy = Object.assign({}, brick) as any;
    copy.isCore = true;
    copy.status = BrickStatus.Draft;
    copy.questions = [];
    copy.id = null;
    console.log(copy)
    const res = await post<Brick>('/brick', copy);
    if (res) {
      res.isCore = true;
      await put<Brick>('/brick', res);
      for (let question of questions) {
        const q = getApiQuestion(question);
        q.brickQuestionId = undefined;
        q.id = undefined;
        await createQuestion(res.id, q);
      }
    }
    return true;
  } catch {
    return false;
  }
}

export default {
  sendToPublisher
}
