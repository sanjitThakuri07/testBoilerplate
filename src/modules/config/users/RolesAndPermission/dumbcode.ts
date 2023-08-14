// <table>
//   <thead>
//     <tr>
//       <th
//         style={{
//           position: 'relative',
//         }}>
//         <input
//           style={{ cursor: 'pointer' }}
//           type="checkbox"
//           checked={true}
//           className={disabled ? 'disabled' : ''}
//           onClick={(e) => {
//             e.stopPropagation();
//           }}
//         />{' '}
//         Modules
//       </th>

//       <th>Create</th>
//       <th>Read</th>
//       <th>Delete</th>
//       <th>Edit</th>
//       <th>Export</th>
//     </tr>
//   </thead>
//   <tbody>
//     {Object.entries(dynamic_permission_obj)?.map((entry: any) => {
//       let codes = [];
//       let codesDetail = [];
//       let methods = new Set();

//       const title = entry[0];

//       Object.entries(entry[1])?.map((entry: any) => {
//         codes.push(entry[0]);
//         codesDetail.push(entry[1]);
//         Object.keys(entry[1])?.map((key) => methods.add(key));
//       });

//       let accordionPermission: any = [];

//       Object.values(entry[1])?.map((entry: any) => {
//         accordionPermission = [...accordionPermission, ...Object.values(entry)];
//       });

//       return (
//         <tr>
//           <td colSpan={6} className="individual__table">
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ position: 'relative' }}>
//                     <RoleChecker
//                       permission={accordionPermission}
//                       permissions={permissions}
//                       setFieldValue={setFieldValue}
//                       label={_.startCase(_.toLower(title))}
//                       disabled={disabled}
//                     />
//                     <FontAwesomeIcon
//                       icon={faChevronDown as IconProp}
//                       cursor={'pointer'}
//                       onClick={(pre) => setIsActive(!isActive)}
//                       style={{
//                         position: 'absolute',
//                         right: '10px',
//                         top: '30%',
//                       }}
//                     />
//                   </th>
//                   {Array.from(methods)?.map((method: any) => (
//                     <th>
//                       <RoleChecker
//                         permission={accordionPermission.filter((item: any) =>
//                           item.includes(`${method}_`),
//                         )}
//                         permissions={permissions}
//                         setFieldValue={setFieldValue}
//                         disabled={disabled}
//                         //     label={_.startCase(_.toLower(method))}
//                       />
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {isActive && (
//                   <>
//                     {Object.entries(entry[1])?.map((entry: any) => {
//                       return (
//                         <tr>
//                           <th
//                             style={{
//                               position: 'relative',
//                             }}>
//                             <div>
//                               <RoleChecker
//                                 permission={Object.values(entry[1])}
//                                 permissions={permissions}
//                                 setFieldValue={setFieldValue}
//                                 label={_.startCase(_.toLower(entry[0]))}
//                                 disabled={disabled}
//                               />
//                             </div>
//                             <Tooltip
//                               title={`Manage ${_.startCase(_.toLower(entry[0]))}`}
//                               style={{
//                                 position: 'absolute',
//                                 right: '10px',
//                                 top: '30%',
//                               }}>
//                               <FontAwesomeIcon icon={faCircleInfo as IconProp} cursor={'pointer'} />
//                             </Tooltip>
//                           </th>
//                           {Array.from(methods)?.map((method) => {
//                             const permission = `${method}_${entry[0]}`;

//                             return (
//                               <td>
//                                 {Object.entries(entry[1])?.map(
//                                   (list) =>
//                                     list[0] === method && (
//                                       <RoleChecker
//                                         title={permission}
//                                         permission={[permission]}
//                                         permissions={permissions}
//                                         setFieldValue={setFieldValue}
//                                         disabled={disabled}
//                                       />
//                                     ),
//                                 )}
//                               </td>
//                             );
//                           })}
//                         </tr>
//                       );
//                     })}
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </td>
//           {/* <td>yes</td>
//         <td>kjsda</td>
//         <td>asdf</td>
//         <td>asdf</td>
//         <td>sdfgs</td> */}
//         </tr>
//       );
//     })}
//   </tbody>
// </table>;
