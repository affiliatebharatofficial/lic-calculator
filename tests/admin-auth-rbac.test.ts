import { describe, it, expect } from 'vitest';
import { AdminAuth, PermissionManager } from '@/lib/admin';

describe('Admin Authentication & RBAC Permissions', () => {
  it('hashes passwords with salt and verifies in constant time', async () => {
    const password = 'StrongPassword@2026';
    const { hash, salt } = await AdminAuth.hashPassword(password);

    expect(hash).toBeDefined();
    expect(salt).toBeDefined();

    const isValid = await AdminAuth.verifyPassword(password, hash, salt);
    expect(isValid).toBe(true);

    const isWrong = await AdminAuth.verifyPassword('WrongPassword', hash, salt);
    expect(isWrong).toBe(false);
  });

  it('creates and validates session tokens', () => {
    const user = {
      id: 'usr_1',
      email: 'admin@lic-calculators.com',
      name: 'Admin User',
      role: 'super_admin' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { token, session } = AdminAuth.createSession(user);
    expect(token).toBeDefined();
    expect(session.userId).toBe('usr_1');
    expect(AdminAuth.isSessionValid(session)).toBe(true);

    // Expired session check
    const expiredSession = { ...session, expiresAt: '2020-01-01T00:00:00Z' };
    expect(AdminAuth.isSessionValid(expiredSession)).toBe(false);
  });

  it('enforces RBAC permissions per role', () => {
    expect(PermissionManager.hasPermission('super_admin', 'rules:publish')).toBe(true);
    expect(PermissionManager.hasPermission('admin', 'rules:publish')).toBe(true);
    expect(PermissionManager.hasPermission('editor', 'rules:publish')).toBe(false);
    expect(PermissionManager.hasPermission('reviewer', 'rules:publish')).toBe(false);

    expect(PermissionManager.hasPermission('editor', 'rules:create')).toBe(true);
    expect(PermissionManager.hasPermission('reviewer', 'rules:verify')).toBe(true);
    expect(PermissionManager.hasPermission('editor', 'rules:verify')).toBe(false);
  });

  it('enforces separation of duties (creator cannot self-verify without reviewer privileges)', () => {
    const creatorId = 'editor@lic-calculators.com';
    const currentUserId = 'editor@lic-calculators.com';

    // Editor trying to verify own rule
    const canSelfVerify = PermissionManager.canVerifyRule('editor', creatorId, currentUserId);
    expect(canSelfVerify).toBe(false);

    // Reviewer verifying an editor's rule
    const canReviewerVerify = PermissionManager.canVerifyRule('reviewer', creatorId, 'reviewer@lic-calculators.com');
    expect(canReviewerVerify).toBe(true);
  });
});
