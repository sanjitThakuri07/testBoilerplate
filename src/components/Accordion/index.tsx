import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

function Index({ header = "header", children = "sample data", expanded = false }: any) {
  return (
    <Accordion
      sx={{
        "&:before": {
          opacity: "1 !important",
        },
      }}
      expanded={expanded}
      elevation={0}
    >
      <AccordionSummary
        // expandIcon={<ArrowDropDown />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ width: "100%" }}
      >
        {header}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

export default Index;
