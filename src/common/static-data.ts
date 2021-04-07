export enum ErrorCode {
  USER_CANCELLED = 'auth/user-cancelled',
  OAUTH_EXCEPTION = 'OAuthException',
  INVALID_ACTION_CODE = 'auth/invalid-action-code',
  USER_DISABLED = 'auth/user-disable',
  GENERIC_FAILURE = 102,
  FACEBOOK_PERMISSION_FAILURE = 10,
  FACEBOOK_EXCEEDED_APPS = 341,
  FACEBOOK_TEMPORARY_BAN = 368,
}
