export function isUserAllowedToLogin(isActive: boolean): boolean {
  return isActive;
}

export function canManageUsers(role?: string): boolean {
  return role === "ADMIN";
}

export function canUpdateUserStatus(
  currentUserId: string | undefined,
  targetUserId: string,
  nextIsActive: boolean,
): boolean {
  if (currentUserId === targetUserId && !nextIsActive) {
    return false;
  }

  return true;
}
