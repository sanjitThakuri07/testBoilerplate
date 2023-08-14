import RealtimeSpeechToText from './RealtimeSpeechToText';

// let stop: any = null;
// let recorder: any = null;
// const MobileSpeechRecognition = ({
//   dataItem,
//   handleFormikFields,
//   errors,
//   disabled,
//   onTextBoxChange,
// }: any) => {
//   const [recongizedSpeechText, setRecognizedSpeechText] = useState('');
//   const [audioRecorderState, setAudioRecorderState] = useState<
//     'inactive' | 'recording' | 'paused' | null
//   >('inactive');
//   const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
//   const [isSpeechLoading, setIsSpeechLoading] = useState(false);
//   const { enqueueSnackbar } = useSnackbar();

//   const clearTextbox = () => setRecognizedSpeechText('');

//   const onAudioChunk = (message: any) => {
//     if (!message || !message?.data) return;
//     setRecognizedSpeechText((prev) => prev.concat(message.data));
//     // const parsedMessage = JSON.parse(message?.data);
//     // const { text } = parsedMessage;
//     // if (text) {
//     //   const { event, payload } = JSON.parse(text);
//     //   if (event === 'audio-chunks') {
//     //     handleAudioChunk({ event, payload });
//     //   }
//     // }
//   };

//   // auto scroll textarea
//   useEffect(() => {
//     var textarea: any = document.getElementById('recongizedText');
//     if (textarea) textarea.scrollTop = textarea.scrollHeight;
//   }, [recongizedSpeechText]);

//   useEffect(() => {
//     onTextBoxChange(recongizedSpeechText);
//   }, [recongizedSpeechText]);

//   const stopListening = () => {
//     // if (stop) stop();
//     if (recorder) recorder.stop();
//   };

//   const startListening = useCallback(() => {
//     // if (!socket) return;
//     // streamAudioFileToSocket({
//     //   socket,
//     //   setAudioRecorderState,
//     //   setIsSpeaking,
//     // }).then((stopAudioActivity) => {
//     //   stop = stopAudioActivity;
//     // });

//     setRecognizedSpeechText('');
//     speechToText({
//       setAudioRecorderState,
//       setIsSpeaking,
//       setRecognizedSpeechText,
//       setIsSpeechLoading,
//       enqueueSnackbar,
//     })
//       .then((res) => {
//         recorder = res;
//       })
//       .catch((err) => {
//         enqueueSnackbar(`Something Went Wrong:${err?.message}`, { variant: 'error' });
//       });
//   }, [setIsSpeaking, setAudioRecorderState]);

//   useEffect(() => {
//     startListening();
//   }, []);

//   return (
//     <div id="MobileSpeechRecognition">
//       {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
//         <div>Speaking: {isSpeaking ? 'YES' : 'NO'}</div>
//         <div>Socket Connection: {connected ? 'ON' : 'OFF'}</div>
//       </div> */}

//       <div style={{ borderRadius: '4px', padding: 4 }}>
//         <div
//           id="analyser-container"
//           style={{
//             borderTopLeftRadius: '8px',
//             borderTopRightRadius: '8px',
//             borderBottom: 'none',
//             overflow: 'hidden',
//             marginBottom: -5,
//           }}
//         />
//         {audioRecorderState === 'recording' ? (
//           <ShowWithAnimation
//             isMounted={true}
//             style={{
//               overflow: 'hidden',
//               borderBottomLeftRadius: '8px',
//               borderBottomRightRadius: '8px',
//             }}>
//             <Stack direction={'row'} alignItems={'center'}>
//               <Button
//                 variant="contained"
//                 sx={{
//                   border: 'none',
//                   borderRadius: '0px',
//                   width: '100%',
//                   cursor: 'not-allowed',
//                   height: '55px',
//                 }}>
//                 <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
//                   <Box>
//                     <WaveLoader />
//                   </Box>
//                   <Box>Listening</Box>
//                 </Stack>
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={stopListening}
//                 sx={{
//                   height: '55px',
//                   border: '1px solid gray',
//                   borderRadius: '0px',
//                   borderBottomRightRadius: '8px',
//                 }}>
//                 <StopCircleOutlinedIcon sx={{ width: '20px', marginRight: '4px' }} /> Stop
//               </Button>
//             </Stack>
//           </ShowWithAnimation>
//         ) : (
//           <Stack direction={'row'} gap={1}>
//             <Button
//               variant="contained"
//               sx={{ width: '100%', height: '55px' }}
//               onClick={startListening}>
//               <Stack direction="row" alignItems={'center'} gap={1}>
//                 <MicNoneIcon sx={{ width: 24 }} />
//                 <Box>Speak Again</Box>
//               </Stack>
//             </Button>
//           </Stack>
//         )}
//       </div>

//       <Stack gap={1} style={{ marginTop: 10 }}>
//         <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
//           <Box>Speech to Text Engine</Box>
//           <Box>
//             <Button variant="outlined" onClick={clearTextbox}>
//               Clear
//             </Button>
//           </Box>
//         </Stack>

//         {isSpeechLoading ? (
//           <div className="loader__parent">
//             <FullPageLoader
//               style={{ width: '100%', height: '100%', minHeight: 100, overflow: 'hidden' }}
//               className="custom__page-loader"
//             />
//           </div>
//         ) : (
//           <Formik
//             initialValues={{}}
//             enableReinitialize
//             validationSchema={undefined}
//             onSubmit={async (values, formikHelpers) => {}}>
//             {(props: FormikProps<any>) => {
//               const {
//                 values,
//                 touched,
//                 errors,
//                 handleBlur,
//                 handleChange,
//                 handleSubmit,
//                 isValid,
//                 dirty,
//                 isSubmitting,
//                 setFieldValue,
//                 setFieldTouched,
//               } = props;

//               return (
//                 <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//                   <textarea
//                     id="recongizedText"
//                     name="recongizedText"
//                     value={recongizedSpeechText}
//                     onChange={(e) => {
//                       const { value } = e.target;
//                       setRecognizedSpeechText(value);
//                     }}
//                     style={{
//                       width: '100%',
//                       fontSize: '1.1em',
//                       lineHeight: '20px',
//                       resize: 'none',
//                       height: 200,
//                       border: '1px solid #2833524e',
//                       borderRadius: 4,
//                       padding: '1rem',
//                       boxSizing: 'border-box',
//                     }}
//                   />
//                 </form>
//               );
//             }}
//           </Formik>
//         )}
//       </Stack>

//       <>
//         {errors &&
//           errorValue?.map((err: any) => {
//             return Object?.keys(errors || [])?.includes(err) ? (
//               <ErrorComponent>{errors?.[err]}</ErrorComponent>
//             ) : (
//               <></>
//             );
//           })}
//       </>
//       {/* <div>
//         <ExtraUserFields
//           item={dataItem}
//           handleFormikFields={handleFormikFields}
//           disabled={disabled}
//         />
//       </div> */}
//     </div>
//   );
// };

// const SpeechPage = ({
//   dataItem,
//   handleFormikFields,
//   errors,
//   disabled,
//   onConfirm = () => {},
// }: any) => {
//   const speechID = localStorage.getItem('speechID');
//   // const { socket, connected, setSocketConnected, setSocketDisconnected, connectSocket } =
//   //   useSocketManagement({ url: commonUrl?.socket(speechID) });

//   // useReconnectingSocket({
//   //   maxReconnectAttempt: 1,
//   //   reconnectInterval: 5000,
//   //   pingInterval: 3000,
//   //   connectOnMount: true,
//   //   socket,
//   //   me: {},
//   //   connected,
//   //   connectSocket,
//   //   setSocketConnected,
//   //   setSocketDisconnected,
//   //   showLog: true,
//   // });

//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState('');
//   const handleClose = () => setOpen(false);

//   const handleConfirm = () => {
//     onConfirm(text);
//     handleClose();
//   };

//   return (
//     <div>
//       <div title={'Click to Speak'}>
//         <Button
//           // disabled={!connected}
//           onClick={() => setOpen(true)}
//           style={{ margin: -5, marginRight: 2, marginLeft: 2, padding: 0, minWidth: 10 }}>
//           <MicNoneIcon sx={{ width: 24, color: '#475467' }} />
//         </Button>
//       </div>
//       <CustomDialog
//         open={open}
//         handleClose={handleClose}
//         title="Speech to Text"
//         actions={
//           <Stack direction={'row'} gap={1}>
//             <Button variant="outlined" onClick={handleClose}>
//               Close
//             </Button>
//             <Button variant="contained" onClick={handleConfirm}>
//               Confirm
//             </Button>
//           </Stack>
//         }>
//         <MobileSpeechRecognition
//           onTextBoxChange={(data: string) => setText(data)}
//           {...{ dataItem, handleFormikFields, errors, disabled }}
//         />
//       </CustomDialog>
//     </div>
//   );
// };

// uncomment for http instead of web socket
// export default SpeechPage;

export default RealtimeSpeechToText;
