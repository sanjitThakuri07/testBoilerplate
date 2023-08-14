import { Box, Container } from "@mui/material";
import BackButton from "src/components/buttons/back";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import TemplateTopBar from "src/modules/layout/TemplateTopBar/TemplateTopBar";
import TopBar from "src/modules/layout/topBar";
import { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface IFullPageProps {
  children: ReactNode;
  publicPage?: boolean;
  hideeBackButton?: boolean;
  className?: string;
  containerClassName?: string;
  showTopbar?: boolean;
}

const FullPageOutlet: FC<IFullPageProps> = ({
  children,
  publicPage,
  hideeBackButton = false,
  className,
  containerClassName,
  showTopbar = true,
}) => {
  const layoutStore = useLayoutStore((state) => state);
  const location = useLocation();

  const TemplateTopBarAccess = [
    "template/create",
    "template/edit",
    "template/layout",
    "bookings",
    "quotation",
  ];

  return (
    <div
      style={{ background: "transparent" }}
      className={`layout-container ${layoutStore.theme} ${
        publicPage ? "full-page" : ""
      } ${containerClassName}`}
    >
      <div className={`page-section`}>
        {TemplateTopBarAccess.some((val) => location.pathname.includes(val)) ? (
          <TemplateTopBar hasLogo publicPage={publicPage} urls={TemplateTopBarAccess} />
        ) : showTopbar ? (
          <TopBar hasLogo publicPage={publicPage} />
        ) : null}

        <div className={`children-container ${showTopbar ? "" : "override-children-container"}`}>
          <div className="page-container ">
            <Box
              sx={{
                padding: 5,
              }}
              className="full-page-holder"
            >
              <Container
                maxWidth="xl"
                className={`container ${className ? className : ""} ${
                  showTopbar ? "" : "override-container"
                }`}
              >
                {!hideeBackButton &&
                  !TemplateTopBarAccess.filter((el) => el.includes(location.pathname)) && (
                    <BackButton />
                  )}
                <Box>{children}</Box>
              </Container>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageOutlet;
