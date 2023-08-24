export const checkPermission = ({ permission = [], permissions = [] }: any) => {
  let perm = Array.isArray(permission) ? permission?.filter(Boolean) : permission;

  if (!perm || !perm.length) return true;

  const result =
    !permission ||
    !permission.length ||
    (permissions.length && Array.isArray(permission)
      ? permissions.some((v: any) => permission?.includes(v))
      : permissions?.includes(permission));

  return result;
};
