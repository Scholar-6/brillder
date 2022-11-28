import { ESubjectCategory, PDateFilter } from 'components/admin/bricksPlayed/BricksPlayedSidebar';
import {AdminDashboardBricksFilters} from './types';

export interface AdminBricksFilters {
  dateFilter: PDateFilter;
  subjectCategory: ESubjectCategory;
  selectedSubjectIds: number[];
}

export function GetAdminBricksFilters() {
  const dateFilter = localStorage.getItem(AdminDashboardBricksFilters);
  if (dateFilter) {
    try {
      return JSON.parse(dateFilter) as AdminBricksFilters;
    } catch {}
  }
  return null;
}

export function UnsetAdminBricksFilters() {
  localStorage.removeItem(AdminDashboardBricksFilters);
}

export function SetAdminBricksFilters(filters: AdminBricksFilters) {
  localStorage.setItem(AdminDashboardBricksFilters, JSON.stringify(filters));
}
