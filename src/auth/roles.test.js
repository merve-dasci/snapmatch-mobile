import { describe, it, expect } from 'vitest';
import { userFromRole } from './roles';

describe('userFromRole', () => {
  it('should return null for an invalid role', () => {
    expect(userFromRole('invalid_role')).toBeNull();
  });

  it('should generate correct user object with initials for business_admin', () => {
    const user = userFromRole('business_admin');
    expect(user).not.toBeNull();
    expect(user.role).toBe('business_admin');
    expect(user.name).toBe('Ezgi Çelik');
    expect(user.email).toBe('ezgi@snapmatch.me');
    expect(user.initials).toBe('EÇ');
  });

  it('should generate correct initials for multi-word names', () => {
    const user = userFromRole('platform_admin');
    expect(user.initials).toBe('DY'); // Deniz Yıldız
  });
});
