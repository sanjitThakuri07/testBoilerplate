import React, { SetStateAction, useEffect, useState } from "react";
import { Box, Button, OutlinedInput, Stack } from "@mui/material";
import NoDataFoundImg from "src/assets/images/no_data_found.svg";
import CheckIcon from "src/assets/icons/tick_icon.svg";
import RightArrowIcon from "src/assets/icons/left_arrow.svg";
import "./UserAlertModule.scss";

interface SearchModuleI {
  datas: {
    app_id?: number;
    id: number;
    name: string;
    tag?: string;
  }[];
  searchSubmitHandler: React.FormEventHandler<HTMLFormElement>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSearchModule: React.Dispatch<React.SetStateAction<any>>;
  isProceedButtonDisabled: boolean;
  setAlertContainerValue: any;
  alertContainerValue: string;
  disabled?: boolean;
}

interface NewModuleInterface {
  alpha: any;
  datas: {
    app_id?: number;
    id: number;
    name: string;
    tag?: string;
  }[];
}

export default function UserAlertModal({
  datas,
  searchSubmitHandler,
  search,
  setSearch,
  setSelectedSearchModule,
  isProceedButtonDisabled,
  setAlertContainerValue,
  disabled,
}: SearchModuleI) {
  let newModules: Array<NewModuleInterface> = [];
  const alphabetsHammer = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [activeHammer, setActiveHammer] = React.useState<string>("");

  // modify the response pushing the alphabet and filtering according to the aplhabet
  alphabetsHammer.forEach((da) => {
    newModules.push({
      alpha: da,
      datas: datas.filter((val) => val.name.startsWith(da)),
    });
  });

  //   scrolling to dynamic sections
  const scrollToSection = (alphabet: string) => {
    setActiveHammer(alphabet);
    const moduleContainer = document.querySelector(`#dynamic-${alphabet}`);
    if (moduleContainer) {
      moduleContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  // clearing the active when search value is empty
  useEffect(() => {
    if (!search) {
      setActiveHammer("");
    }
  }, [search]);

  const selectedHandler = (data: { app_id?: number; id: number; name: string }) => {
    setSelectedId(data?.id);

    // setting the selected id and name
    setSelectedSearchModule(data);
  };

  return (
    <Box>
      {/* search box component */}
      <Stack direction="column">
        <form onSubmit={searchSubmitHandler}>
          <Box sx={{ color: "#344054", fontWeight: 500, mt: 1.5 }}>Search for User Activities</Box>
          <Stack direction="row" spacing={1} sx={{ mt: 0.3 }}>
            <OutlinedInput
              size="small"
              id="searchValue"
              type="search"
              fullWidth
              sx={{ marginTop: "5px" }}
              placeholder="Search here"
              className="form_input"
              value={search}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value);
              }}
            />
            <Button type="submit" variant="contained" sx={{ width: "110px" }}>
              Search
            </Button>
          </Stack>
        </form>
      </Stack>
      <Box className="search-list-main-container">
        <Box className={`${datas?.length > 0 && `search-list-container`}`}>
          {datas?.length > 0 && (
            <Stack direction="row">
              {/* search list */}
              <Box className="search-module-container">
                {newModules?.map((module, index) => {
                  const { alpha, datas } = module;
                  if (datas.length === 0) {
                    delete module.alpha;
                    return;
                  }
                  return (
                    <Stack direction="column" key={index} id={`dynamic-${alpha}`}>
                      <Box>
                        {!(datas.length === 0) && (
                          <Box sx={{ fontWeight: 500, px: 1.5 }}>{alpha}</Box>
                        )}
                        <Box sx={{ py: 1 }}>
                          {datas?.map((data, index) => {
                            return (
                              <Box
                                onClick={() => selectedHandler(data)}
                                className={`${
                                  selectedId === data?.id && `selected-user-module`
                                } module-inner-container`}
                                key={index}
                              >
                                <Stack
                                  sx={{ px: 1 }}
                                  direction="row"
                                  justifyContent="space-between"
                                >
                                  <Box>{data?.name}</Box>
                                  {selectedId === data?.id && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <img src={CheckIcon} alt="check" />
                                    </Box>
                                  )}
                                </Stack>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </Stack>
                  );
                })}
              </Box>
              {/* right alphabet hammer container */}
              <Stack className="alphabet-list-container" spacing={0.3}>
                {newModules?.map((alphabet, index) => {
                  return (
                    alphabet?.alpha && (
                      <Box
                        key={index}
                        onClick={() => scrollToSection(alphabet?.alpha)}
                        className={`${activeHammer === alphabet?.alpha && `popup-active-hammer`}`}
                        sx={{
                          fontSize: "11px",
                          cursor: "pointer",
                          padding: "0px 5px",
                          "&:hover": { color: "#1F2840", fontWeight: 700 },
                        }}
                      >
                        {alphabet?.alpha}
                      </Box>
                    )
                  );
                })}
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
      {/* proceed to next component */}
      {datas?.length > 0 && (
        <Box sx={{ width: "100%", display: "flex", alignItems: "end", justifyContent: "end" }}>
          <Button
            onClick={() => setAlertContainerValue("sign-up-alert")}
            sx={{ mt: 3 }}
            variant="outlined"
            disabled={isProceedButtonDisabled ? true : false}
          >
            <Stack direction="row" spacing={1}>
              <Box sx={{ mt: 0.2 }}>Proceed</Box>
              <Box>
                <img src={RightArrowIcon} className="proceed-button-icon" alt="right" />
              </Box>
            </Stack>
          </Button>
        </Box>
      )}
      {/* no search reasults found */}
      {datas?.length === 0 && (
        <Stack className="no-alert-user-found-container">
          <Box>
            <img
              src={NoDataFoundImg}
              style={{ height: "120px", width: "120px" }}
              alt="no_data_found"
            />
          </Box>
          <Box>No search results found</Box>
        </Stack>
      )}
    </Box>
  );
}
