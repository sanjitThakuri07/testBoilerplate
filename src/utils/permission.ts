export const checkPermission = ({ permission, permissions = [] }:any) => {
    const result =
      !permission ||
      !permission.length ||
      (permissions.length && Array.isArray(permission)
        ? permissions.some((v:any) => permission?.includes(v))
        : permissions?.includes(permission));
    return result;
  };