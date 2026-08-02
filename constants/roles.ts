export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
  LEAVES_MANAGER: 'leavesManager',
  LEAVES_REQUESTER: 'leavesRequester',
  LEAVES_VIEWER: 'leavesViewer',
} as const;

export type RoleName = (typeof Roles)[keyof typeof Roles];
