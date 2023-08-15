import React from "react";
import { Box, Divider, Stack } from "@mui/material";
import PdfOverview from "./pdfOverview";
import PdfDisclaimer from "./pdfDisclaimer";
import PdfCountingDatas from "./pdfCountingDatas";
import PdfUnansweredQuestions from "./PdfUnansweredQuestions";
import PdfFlaggedItems from "./PdfFlaggedItems";
import PdfInstructions from "./PdfInstructions";
import PdfMediaSetting from "./PdfMediaSetting";
import PdfAssignedActivity from "./PdfAssignedActivity";
import PdfTableOfContents from "./PdfTableOfContents";
import PdfPageBreak from "./PdfPageBreak";

const PDFPreview = ({ layoutParams, layoutObj }: any) => {
  const {
    has_action,
    has_disclaimer,
    disclaimer_text,
    has_flagged,
    has_action_summary,
    has_table_of_contents,
    has_page_break,
    has_footer,
    has_inspection_result,
    has_media_summary,
    has_checked,
    has_unchecked,
    has_instruction,
    has_unanswered_questions,
    has_checkboxes,
    media_resolution,
    media_thumbnail,
    has_flagged_summary,
  } = layoutObj;

  return (
    <Box px={5}>
      {!layoutParams ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          height="30vh"
          direction="column"
          spacing={1}
        >
          <Box>
            <img src="/src/assets/icons/icon-feature.svg" alt="warning" />
          </Box>
          <Box>Please select your layout from left panel to load your layout datas</Box>
        </Stack>
      ) : (
        <Box className="activity_container" py={1}>
          <PdfOverview layoutObj={layoutObj} layoutParams={layoutParams} />
          <PdfCountingDatas
            has_flagged={has_flagged}
            has_action={has_action}
            has_checkboxes={has_checkboxes}
          />
          {/* <PdfPageBreak has_page_break={has_page_break} /> */}

          {/* dont display when table of contents is off */}
          {has_table_of_contents && <PdfPageBreak has_page_break={has_page_break} />}
          <PdfTableOfContents has_table_of_contents={has_table_of_contents} />

          {/* dont show when disclaimer is off */}
          {has_disclaimer && <PdfPageBreak has_page_break={has_page_break} />}
          <PdfDisclaimer disclaimer_text={disclaimer_text} has_disclaimer={has_disclaimer} />

          {/* dont show when action summary and flagged summary is off */}
          {(has_action_summary || has_flagged_summary) && (
            <PdfPageBreak has_page_break={has_page_break} />
          )}
          <PdfAssignedActivity has_action_summary={has_action_summary} has_action={has_action} />
          <PdfFlaggedItems has_flagged_summary={has_flagged_summary} has_flagged={has_flagged} />

          {/* dont show when unanswered questions and instruction is off */}
          {(has_unanswered_questions || has_instruction) && (
            <PdfPageBreak has_page_break={has_page_break} />
          )}
          <PdfUnansweredQuestions has_unanswered_questions={has_unanswered_questions} />
          <PdfInstructions has_instruction={has_instruction} />

          {/* dont show when media is off */}
          {has_media_summary && <PdfPageBreak has_page_break={has_page_break} />}
          <PdfMediaSetting
            has_media_summary={has_media_summary}
            media_thumbnail={media_thumbnail}
          />
        </Box>
      )}
    </Box>
  );
};

export default PDFPreview;
