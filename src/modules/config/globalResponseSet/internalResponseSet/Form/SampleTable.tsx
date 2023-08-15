// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import { checkValue } from 'src/components/CustomPopup';

// const SampleTable = ({ format }: any) => {
//   const { headers, items = [] } = format;

//   return (
//     <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
//       <Table stickyHeader size="small" sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             {Object.keys(headers || {})
//               // ?.filter((dt: any) => dt !== 'id' || dt !== 'attachments')
//               .map((key: any) => {
//                 return (
//                   <TableCell
//                     sx={{
//                       backgroundColor: '#d6d6d6',
//                       whiteSpace: 'nowrap',
//                     }}
//                     key={key}>
//                     {headers[key]}
//                   </TableCell>
//                 );
//               })}

//             {/* {Object?.entries(items[0])?.map((item: any) => (
//               <TableCell
//                 style={{
//                   backgroundColor: '#d6d6d6',
//                 }}
//                 key={item[0]}>
//                 {item[0]}
//               </TableCell>
//             ))} */}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {items.map((item: any) => (
//             <TableRow key={item.id}>
//               {Object.keys(headers || {})
//                 // .filter((item: any) => headers_key.includes(item))
//                 .map((key: any) => (
//                   <>
//                     <TableCell
//                       key={key}
//                       sx={{
//                         whiteSpace: 'nowrap',
//                       }}>
//                       {typeof item[key] === 'string' || typeof item[key] === 'number'
//                         ? checkValue({ value: item[key], skipColumn: ['id'], currentColumn: key })
//                         : typeof item[key] === 'object' && item[key]?.length > 0
//                         ? Object.keys(item[key])?.map((it: any) =>
//                             typeof item[key][it] === 'string' || typeof item[key][it] === 'number'
//                               ? checkValue({
//                                   value: item[key][it],
//                                   skipColumn: ['id'],
//                                   currentColumn: key,
//                                 }) + ' '
//                               : ' ',
//                           )
//                         : 'N/A'}
//                     </TableCell>
//                   </>
//                 ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default SampleTable;

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const SampleTable = ({ format }: any) => {
  const { headers, items = [] } = format;

  return (
    <>
      {items?.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {items?.length > 0 &&
                  Object?.entries(items[0] || {})?.map((item: any) => (
                    <TableCell
                      style={{
                        backgroundColor: "#d6d6d6",
                      }}
                      key={item[0]}
                    >
                      {item[0]}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {items?.length > 0 &&
                items?.map((item: any) => (
                  <TableRow key={item?.id}>
                    {Object.keys(item || {})
                      // .filter((item: any) => headers_key.includes(item))
                      .map((key: any) => (
                        <>
                          <TableCell key={key}>
                            {typeof item[key] === "string" || typeof item[key] === "number"
                              ? item[key]
                              : typeof item[key] === "object" && item[key]?.length > 0
                              ? Object.keys(item[key])?.map((it: any) =>
                                  typeof item[key][it] === "string" ||
                                  typeof item[key][it] === "number"
                                    ? item[key][it] + " "
                                    : " ",
                                )
                              : "N/A"}
                          </TableCell>
                        </>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ""
      )}
    </>
  );
};

export default SampleTable;
