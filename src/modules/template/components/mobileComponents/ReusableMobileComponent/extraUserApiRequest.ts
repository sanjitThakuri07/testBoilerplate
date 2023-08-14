import { deleteAPI } from "src/lib/axios";

export const deleteHandler = async ({ id, enqueueSnackbar, url, setterFunction }: any) => {
  try {
    await deleteAPI(`${url}/`, {
      config_ids: [id],
    });
    enqueueSnackbar?.("Activity deleted succesfully");
    return true;
  } catch (error: any) {
    enqueueSnackbar?.(error.message || `Unable to delete activity`, { variant: "error" });
    return false;
  }
};

// useEffect(() => {
//     if (isEdit) {
//       console.log('here');
//       setInitialValues({
//         title: ' assignData?.title',
//         description: assignData?.description,
//         // type: '',
//         // user_department_id: '',
//         user_department: assignData?.user_department,
//         users: assignData?.users,
//         territory: [],
//         priority: assignData?.priority,
//         due_date: new Date(),
//         status: assignData?.status?.id,
//         message: assignData?.message,
//         document: assignData?.document,
//         id: assignData?.id,
//       });
//     }
//   }, [isEdit]);
