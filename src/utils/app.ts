export function filterBranchType(me: any) {
  if (me.branch_id) {
    if (String(me.branch_id.branch_name).toLowerCase().includes("province")) {
      return { location: "province", id: me.branch_id.branch_id };
    }

    if (Number(me.branch_id.branch_id) === 999) {
      return { location: "head-office", id: me.department_id && me.department_id.id };
    }

    return { location: "branch", id: me.branch_id.branch_id };
  }
  return undefined;
}
