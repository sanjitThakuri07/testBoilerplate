import { Box, Stack, Typography } from '@mui/material';

export default function PdfTableOfContents({
  pagesWithSections,
  pages,
  currentLayout,
  isPrinting,
}: any) {
  const allContents = [
    { label: ' Abstract' },
    { label: 'Flagged Content' },
    { label: 'Assigned Summary' },
    { label: 'Inspection Result' },
    {
      label: 'Page',
      pages: pagesWithSections || [],
    },
    { label: 'Media Settings' },
  ];

  return (
    <>
      <Box sx={{ border: '1px solid gray' }}>
        <Box className="">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            Table of Contents
          </Box>
          <Box className="individual_box_container">
            {allContents.map((item: any, index: number) => {
              return (
                <Stack direction="column">
                  <Stack key={item.id} direction="row" justifyContent="space-between" mt={1}>
                    <Typography sx={{ fontWeight: 500, textTransform: 'none' }}>
                      {`${index + 1}. ${item?.label}`}
                    </Typography>
                    {/* <Box sx={{ mt: 0.3 }}>#</Box> */}
                  </Stack>

                  {item?.label === 'Page'
                    ? pagesWithSections?.map((page: any, pageIndex: any) => {
                        return (
                          <Stack direction="column">
                            <Stack
                              key={page.id}
                              direction="row"
                              justifyContent="space-between"
                              px={2}
                              mt={1}>
                              <Typography
                                sx={{ fontWeight: 500, textTransform: 'none', opacity: '0.85' }}>
                                {`${index + 1}.${pageIndex + 1}. ${page?.label}`}
                              </Typography>
                              {/* <Box sx={{ mt: 0.3 }}>#</Box> */}
                            </Stack>
                            {page?.sections?.map((section: any, sectionIndex: any) => {
                              return (
                                <Stack
                                  key={section?.id}
                                  direction="row"
                                  justifyContent="space-between"
                                  py={0.5}
                                  px={6}>
                                  <Box
                                    sx={{
                                      fontWeight: 500,
                                      opacity: '0.7',
                                      display: 'flex',
                                      gap: '1ch',
                                    }}>
                                    <Typography>
                                      {`${index + 1}.${pageIndex + 1}.${sectionIndex + 1}`}.
                                    </Typography>{' '}
                                    <Typography
                                      sx={{
                                        textTransform: 'none',
                                      }}>{`${section?.label}`}</Typography>
                                  </Box>
                                  {/* <Box sx={{ mt: 0.3 }}>#</Box> */}
                                </Stack>
                              );
                            })}
                          </Stack>
                        );
                      })
                    : null}
                </Stack>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}
