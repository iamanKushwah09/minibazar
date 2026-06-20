// import React from 'react'
// import { Scrollbars } from "react-custom-scrollbars-2";
// import { Card, CardBody, Textarea, Select } from "@windmill/react-ui";
// import { useTranslation } from "react-i18next";
// import Error from "@/components/form/others/Error";
// import Title from "@/components/form/others/Title";
// import InputArea from "@/components/form/input/InputArea";
// import SelectOrder from "@/components/form/selectOption/SelectOrder";
// import DrawerButton from "@/components/form/button/DrawerButton";
// import LabelArea from "@/components/form/selectOption/LabelArea";
// import useCatalogValueSubmit from "@/hooks/useCatalogValueSubmit";
// import useDispatchSubmit from "@/hooks/useDispatchSubmit";
// import MultiSelectDropdown from "../form/selectOption/MultiSelectItem";
// import useShowSubmit from '@/hooks/useShowsubmit';

// const ShowDrawer = (id,selectedData) => {
//     const {
//         register,
//         handleSubmit,
//         onSubmit,
//         language,
//         errors,
//         isSubmitting,
//         handleSelectLanguage,
//         setSelectedOptions,
//         isCombination1,
//         isCombination2,
//         isCombination3,
//         handleIsCombination1,
//         handleIsCombination2,
//         handleIsCombination3,
//         setImageUrl,
//         setNewImage,
//         selectedOptions
//     } = useShowSubmit(id);

//      const { t } = useTranslation();
//   return (
//     <>
//       <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
//             A
//             </div>
//             <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
//                 <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
//                     <CardBody>
//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
//                                 <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//                                     <LabelArea label="Status" />
//                                     <div className="col-span-8 sm:col-span-4">
//                                         <Select name="status" {...register(`status`, { required: `Status is required!` })}
//                                             className="border text-sm block w-full bg-gray-100 border-gray-200"
//                                         >
//                                             <option value="" defaultValue hidden>Status </option>
//                                             <option value="Processing">Processing</option>
//                                             <option value="Dispatched">Dispatched</option>
//                                             <option value="Delivered">Delivered</option>
//                                             <option value="Cancelled">Cancelled</option>
//                                         </Select>
//                                         {/* <Error errorName={errors.status} /> */}
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//                                     <LabelArea label="Description" />
//                                     <div className="col-span-8 sm:col-span-4">
//                                         <Textarea
//                                             className="border text-sm block w-full bg-gray-100 border-gray-200"
//                                             {...register("description", {
//                                                 required: false,
//                                             })}
//                                             name="description"
//                                             placeholder="Description"
//                                             rows="2"
//                                             spellCheck="false"
//                                         />
//                                         {/* <Error errorName={errors.description} /> */}
//                                     </div>
//                                 </div>

//                             </div>
//                             <DrawerButton
//                                 id={id}
//                                 title="Show"
//                                 isSubmitting={isSubmitting}
//                             />
//                         </form>
//                     </CardBody>
//                 </Card>
//             </Scrollbars>
//     </>
//   )
// }

// export default ShowDrawer