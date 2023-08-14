import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { RegionProps } from "interfaces/configs";
import { useEffect, useState } from "react";
import RegionForm from "./InspectionForm";
import UploadCsv from "../upload/UploadCsv";
import RegionCard from "./InspectionCard";
import { useParams } from "react-router-dom";
import { useConfigStore } from "globalStates/config";
import { deleteAPI, getAPI } from "src/lib/axios";
import { ConfigTableUrlUtils } from "../OrganizationConfiguration";

const AddInspectionStatusConfig = () => {
  const [isRegionExpanded, setIsRegionExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [opeCsvModal, setOpenCsvModal] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<RegionProps>({
    code: "",
    name: "",
    status: "Active",
    notes: "",
    notification_email: [],
  });
  const { regionId } = useParams();
  const {
    regions: { items },
    setRegions,
    deleteRegions,
  } = useConfigStore();
  const [loading, setLoading] = useState(false);

  const handleDeleteRegion = (id?: number) => {
    if (!id) return;
    const region = items.find((rg) => rg.id === id);
    region && setCurrentRegion(region);
    setOpenModal(true);
  };

  const editRegion = (id?: number) => {
    if (!id) return;
    const region = items.find((rg) => rg.id === id);
    region && setCurrentRegion(region);
    const reginForm = document.querySelector(".region-form-holder");
    reginForm?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const [urlUtils, setUrlUtils] = useState<ConfigTableUrlUtils>({
    page: 1,
    size: 5,
    archived: "",
    q: "",
  });

  const setCurrentRegionFromLocal = (tempRegion: RegionProps) => {
    if (regionId) {
      setCurrentRegion(tempRegion);
    }
  };

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const { status, ...response } = await getAPI(
        `region/?q=${urlUtils.q}&archived=${urlUtils.archived}&page=${urlUtils.page}&size=${urlUtils.size}`,
      );

      if (status === 200) {
        const { data } = response;
        setRegions(data);
        setCurrentRegionFromLocal(data.items.find((rg: any) => rg.id === Number(regionId)));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    <Link key="0" href="/">
      <img src="/assets/icons/home.svg" alt="home" />
    </Link>,
    <Link underline="hover" key="1" color="inherit" href="/">
      General Settings
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/">
      Regions
    </Link>,
    <Typography key="3" color="text.primary">
      Add Regions
    </Typography>,
  ];

  const deleteRegion = async () => {
    try {
      await deleteAPI("region/", { region_ids: [currentRegion.id] });
      currentRegion.id && deleteRegions(currentRegion.id);
    } catch (error) {}
  };

  useEffect(() => {
    if (items.length === 0) {
      fetchRegions();
    } else {
      const currRegion = items.find((rg) => rg.id === Number(regionId));
      currRegion && setCurrentRegion(currRegion);
    }
  }, []);

  const transformArr = (arr: RegionProps[]): RegionProps[] => {
    if (!isRegionExpanded) return arr.filter((_, index) => index < 3);
    return arr;
  };

  return (
    <div className="add-region-config-holder">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={deleteRegion}
        confirmationHeading={`Do you want to delete region ${currentRegion?.name}?`}
        confirmationDesc={"This region will be deleted."}
        status="warning"
        confirmationIcon="/assets/icons/icon-feature.svg"
      />
      <UploadCsv
        sampleLink="/"
        uploadUri="/"
        onClose={() => setOpenCsvModal(false)}
        open={opeCsvModal}
      />
      <div className="header-block">
        <BackButton />
        <div className="breadcrumbs-holder">
          <Breadcrumbs
            separator={<img src="/assets/icons/chevron-right.svg" alt="right" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left">
            <Typography variant="h3" color="primary">
              Add Regions
            </Typography>
            <Typography variant="body1" component="p">
              Add all the details of your regions here.
            </Typography>
          </div>
          <div className="right">
            <Button
              variant="outlined"
              startIcon={<img src="/assets/icons/icon-upload.svg" alt="icon-upload" />}
              onClick={() => setOpenCsvModal(true)}
            >
              Upload CSV
            </Button>
          </div>
        </Stack>
      </div>
      <div className="border-wrapper">
        <div className="regions">
          <div className="regions-area" key={Number(loading)}>
            {transformArr(items).map((rg) => (
              <RegionCard
                {...rg}
                key={rg.id}
                handleDeleteRegion={handleDeleteRegion}
                editRegion={editRegion}
              />
            ))}
          </div>
          {items?.length > 6 && (
            <div className="btn-holder">
              <Button variant="contained" onClick={() => setIsRegionExpanded(!isRegionExpanded)}>
                View {isRegionExpanded ? "Less" : "More"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <RegionForm region={currentRegion} />
    </div>
  );
};

export default AddInspectionStatusConfig;
