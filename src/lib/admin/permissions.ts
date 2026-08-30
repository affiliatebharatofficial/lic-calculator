/**
 * Role-Based Access Control (RBAC) Permissions Matrix
 */

import type { AdminRole } from './types';

export type AdminPermission =
  | 'plans:view'
  | 'plans:create'
  | 'plans:edit'
  | 'plans:archive'
  | 'rules:view'
  | 'rules:create'
  | 'rules:edit'
  | 'rules:review'
  | 'rules:verify'
  | 'rules:publish'
  | 'rules:disable'
  | 'rules:rollback'
  | 'sources:view'
  | 'sources:create'
  | 'sources:verify'
  | 'content:view'
  | 'content:create'
  | 'content:edit'
  | 'content:review'
  | 'content:publish'
  | 'translations:edit'
  | 'translations:publish'
  | 'glossary:manage'
  | 'faq:manage'
  | 'audit:view'
  | 'admins:manage';

export const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  super_admin: [
    'plans:view',
    'plans:create',
    'plans:edit',
    'plans:archive',
    'rules:view',
    'rules:create',
    'rules:edit',
    'rules:review',
    'rules:verify',
    'rules:publish',
    'rules:disable',
    'rules:rollback',
    'sources:view',
    'sources:create',
    'sources:verify',
    'content:view',
    'content:create',
    'content:edit',
    'content:review',
    'content:publish',
    'translations:edit',
    'translations:publish',
    'glossary:manage',
    'faq:manage',
    'audit:view',
    'admins:manage'
  ],

  admin: [
    'plans:view',
    'plans:create',
    'plans:edit',
    'plans:archive',
    'rules:view',
    'rules:create',
    'rules:edit',
    'rules:review',
    'rules:verify',
    'rules:publish',
    'rules:disable',
    'rules:rollback',
    'sources:view',
    'sources:create',
    'sources:verify',
    'content:view',
    'content:create',
    'content:edit',
    'content:review',
    'content:publish',
    'translations:edit',
    'translations:publish',
    'glossary:manage',
    'faq:manage',
    'audit:view'
  ],

  reviewer: [
    'plans:view',
    'rules:view',
    'rules:review',
    'rules:verify',
    'sources:view',
    'sources:verify',
    'content:view',
    'content:review',
    'audit:view'
  ],

  editor: [
    'plans:view',
    'rules:view',
    'rules:create',
    'rules:edit',
    'sources:view',
    'sources:create',
    'content:view',
    'content:create',
    'content:edit',
    'translations:edit',
    'glossary:manage',
    'faq:manage'
  ]
};

export class PermissionManager {
  public static hasPermission(role: AdminRole, permission: AdminPermission): boolean {
    const perms = ROLE_PERMISSIONS[role];
    if (!perms) return false;
    return perms.includes(permission);
  }

  public static canManagePlans(role: AdminRole): boolean {
    return this.hasPermission(role, 'plans:edit');
  }

  public static canCreateRule(role: AdminRole): boolean {
    return this.hasPermission(role, 'rules:create');
  }

  public static canVerifyRule(role: AdminRole, creatorId: string, currentUserId: string): boolean {
    if (!this.hasPermission(role, 'rules:verify')) return false;
    // Separation of duties: Editors/Creators cannot self-verify unless Super Admin
    if (role !== 'super_admin' && creatorId === currentUserId) {
      return false;
    }
    return true;
  }

  public static canPublishRule(role: AdminRole): boolean {
    return this.hasPermission(role, 'rules:publish');
  }

  public static canManageContent(role: AdminRole): boolean {
    return this.hasPermission(role, 'content:edit');
  }

  public static canPublishContent(role: AdminRole): boolean {
    return this.hasPermission(role, 'content:publish');
  }

  public static canViewAudit(role: AdminRole): boolean {
    return this.hasPermission(role, 'audit:view');
  }
}
