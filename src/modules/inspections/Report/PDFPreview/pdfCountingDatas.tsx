import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useReportDataSets } from "src/store/zustand/inspectionTemp/inspection";

export default function PdfCountingDatas({ has_flagged, has_action, has_checkboxes, datass }: any) {
  // const countingDatas = [
  //   { label: "Inspection Score", count: "0%", isTriggered: true },
  //   { label: "Flagged Items", count: "1", isTriggered: has_flagged },
  //   { label: "Created Actions", count: "1", isTriggered: has_action },
  // ];
  const { initialState, setInitialState } = useReportDataSets();
  let created_date = "";

  const date_ = new Date(initialState?.created_at);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  };
  created_date = date_.toLocaleDateString("en-US", options);

  function createData(name: string, count: string, isTriggered: boolean) {
    return { name, count, isTriggered };
  }

  const rows: any = [
    createData("Conducted By", initialState?.inspected_by, true),
    createData("Conducted On", created_date, true),
    createData("Inspection Score", "0%", true),
    createData("Flagged Items", datass?.flaggedQuestions?.length, has_flagged),
    createData("Created Actions", datass?.actions?.length, has_action),
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            {rows.map((row: any) => (
              <>
                {row?.isTriggered && (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontSize: "14px", opacity: "0.8" }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
