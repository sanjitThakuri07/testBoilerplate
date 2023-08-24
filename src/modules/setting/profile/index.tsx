import { CircularProgress, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import PersonalDetails from "./PersonalDetails";
import ProfileFormat from "./ProfileFormat";
import { Profile as ProfilePayload, TenantProfile } from "src/interfaces/profile";
import { useFormik } from "formik";
import ProfileSchema from "src/validationSchemas/Profile";
import { useEffect } from "react";
import { useState } from "react";
import SettingFooter from "src/components/footer/SettingFooter";
import { FormikFormHelpers } from "src/interfaces/utils";
import { getAPI, putAPI } from "src/lib/axios";
import Billing from "./Billing";
import TenantProfileSchema from "src/validationSchemas/TenantProfile";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import useAppStore from "src/store/zustand/app";
import FullPageLoader from "src/components/FullPageLoader";

const initialValues: ProfilePayload = {
  brandColor: "#284493",
  country: "",
  dateFormat: "",
  email: "",
  fullName: "",
  language: "",
  phone: [],
  timeFormat: "",
  timeZone: "",
  company: "",
  designation: "",
  location: "",
  profilePicture: "",
};

const tenantInitialValues: TenantProfile = {
  ...initialValues,
  billing_plan: "",
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(true);

  const [initialProfile, setInitialProfile] = useState<ProfilePayload | null>(null);
  const { userType, setUserData, token, refresh_token, clientId, timezone } = userDataStore() || {};
  const isTenant = userType === "Tenant";

  const { enqueueSnackbar } = useSnackbar();
  const { user, fetchProfile, updateUser, loading: UserLoading }: any = useAppStore();

  const handleFormSubmit = async (values: ProfilePayload) => {
    const profileDetails = {
      profile: {
        company_name: values.company,
        designation: values.designation,
        country: values.country,
        phone: values.phone,
        location: values.location,
        photo: values.profilePicture?.includes("data:")
          ? values.profilePicture?.replace("data:", "")
          : values.profilePicture,
        full_name: values.fullName,
      },
      profile_format: {
        language: values.language,
        date_format: values.dateFormat,
        time_format: values.timeFormat,
        time_zone: values.timeZone,
        brand_color: values.brandColor,
      },
      billing_plan: values?.billing_plan,
    };
    const apiResponse = await updateUser({
      values: profileDetails,
      otherDatas: { login_id: values?.email },
    });
    // try {
    //   setLoading(true);
    //   //we should not update email
    // const profileDetails = {
    //   profile: {
    //     company_name: values.company,
    //     designation: values.designation,
    //     country: values.country,
    //     phone: values.phone,
    //     location: values.location,
    //     photo: values.profilePicture?.includes("data:")
    //       ? values.profilePicture?.replace("data:", "")
    //       : values.profilePicture,
    //     full_name: values.fullName,
    //   },
    //   profile_format: {
    //     language: values.language,
    //     date_format: values.dateFormat,
    //     time_format: values.timeFormat,
    //     time_zone: values.timeZone,
    //     brand_color: values.brandColor,
    //   },
    //   billing_plan: values?.billing_plan,
    // };
    // const data = await putAPI(`user/profile`, profileDetails);

    //   enqueueSnackbar(data?.data?.message || "updated successfully", {
    //     variant: "success",
    //   });
    //   setIsViewOnly(true);
    //   fetchProfile();
    //   return;
    // } catch (error: any) {
    //   enqueueSnackbar(error.response.data.message || "Something went wrong!", {
    //     variant: "error",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  const formikBags = useFormik({
    // initialValues: isTenant ? tenantInitialValues : initialValues,
    initialValues: isTenant
      ? tenantInitialValues
      : user
      ? {
          ...user,
          brandColor: user?.brand_color,
          country: user?.country,
          dateFormat: user?.date_format,
          email: user?.login_id,
          fullName: user?.full_name,
          language: user?.language,
          phone: user?.phone,
          timeFormat: user?.time_format,
          timeZone: user?.time_zone,
          company: user?.company_name,
          designation: user?.designation,
          location: user?.location,
          profilePicture: user?.photo,
        }
      : initialValues,
    validateOnChange: true,
    validationSchema: isTenant ? TenantProfileSchema : ProfileSchema,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  const {
    handleSubmit,
    setValues,
    setFieldValue,
    setFieldTouched,
    isValid,
    dirty,
    touched,
    resetForm,
    values,
    errors,
  } = formikBags;

  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  // const fetchProfile = async (): Promise<void> => {
  //   try {
  //     setLoading(true);
  //     const { status, data } = await getAPI(`user/profile`);
  //     const profileDetails: ProfilePayload = {
  //       brandColor: data?.brand_color,
  //       country: data?.country,
  //       dateFormat: data?.date_format,
  //       email: data?.login_id,
  //       fullName: data?.full_name,
  //       language: data?.language,
  //       phone: data?.phone,
  //       timeFormat: data?.time_format,
  //       timeZone: data?.time_zone,
  //       company: data?.company_name,
  //       designation: data?.designation,
  //       location: data?.location,
  //       profilePicture: data?.photo,
  //       ...data,
  //     };
  //     if (status === 200) {
  //       setValues(profileDetails);
  //       setInitialProfile(profileDetails);

  //       setUserData({
  //         token,
  //         refresh_token,
  //         userType,
  //         clientId,
  //         timezone,
  //         userName: data?.full_name,
  //         profilePicture: data?.photo,
  //       });

  //       return;
  //     }
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchProfile();
    fetchProfile({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    const brandColor = values.brandColor;
    resetForm();
    initialProfile &&
      setValues({
        ...initialProfile,
        brandColor: initialProfile?.brandColor || brandColor,
      });
  };

  const handleUploadImage = (image: File): Promise<void> => {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = (theFile) => {
        const image = theFile.target?.result;
        setFieldValue("profilePicture", image);
        setFieldTouched("profilePicture");
        res();
      };
    });
  };

  return (
    <form className={`profile-form ${isViewOnly ? "edit-mode" : ""}`} onSubmit={handleSubmit}>
      {(loading || UserLoading) && <FullPageLoader />}

      <div className="org_update ">
        <div>
          {" "}
          <Typography variant="h3" color="primary">
            Personal Details
          </Typography>
          <Typography variant="body1" component="p">
            Update your personal photo and details here.
          </Typography>
        </div>
        <div>
          <SettingFooter
            isViewOnly={isViewOnly}
            loading={loading}
            handleViewOnly={handleViewOnly}
            formikHelpers={formikHelpers}
          />
        </div>
      </div>
      {/* <SettingFooter
        isViewOnly={isViewOnly}
        loading={loading}
        handleViewOnly={handleViewOnly}
        formikHelpers={formikHelpers}
      /> */}

      <PersonalDetails
        formikBag={formikBags}
        isViewOnly={isViewOnly}
        handleUploadImage={handleUploadImage}
        loading={loading}
      />
      <Typography variant="h3" color="primary">
        Profile Formats
      </Typography>
      <Typography variant="body1" component="p">
        Update your personal format details here.
      </Typography>

      <ProfileFormat formikBag={formikBags} isViewOnly={isViewOnly} />

      {/* {isTenant && <Billing formikBag={formikBags as any} isViewOnly={isViewOnly} />} */}
      <SettingFooter
        isViewOnly={isViewOnly}
        loading={loading}
        handleViewOnly={handleViewOnly}
        formikHelpers={formikHelpers}
      />
    </form>
  );
};

export default Profile;
