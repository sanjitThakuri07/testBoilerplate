import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function PdfCountingDatas({
  has_flagged,
  has_action,
  has_checkboxes,
}: any) {
  // const countingDatas = [
  //   { label: "Inspection Score", count: "0%", isTriggered: true },
  //   { label: "Flagged Items", count: "1", isTriggered: has_flagged },
  //   { label: "Created Actions", count: "1", isTriggered: has_action },
  // ];

  function createData(name: string, count: string, isTriggered: boolean) {
    return { name, count, isTriggered };
  }

  const rows: any = [
    createData("Is Checked", has_checkboxes ? "Yes" : "No", has_checkboxes),
    createData("Inspection Score", "0%", true),
    createData("Flagged Items", "1", has_flagged),
    createData("Created Actions", "1", has_action),
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableBody>
            {rows.map((row: any) => (
              <>
                {row?.isTriggered && (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "14px", opacity: "0.8" }}
                    >
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
