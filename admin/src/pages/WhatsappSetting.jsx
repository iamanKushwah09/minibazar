import React, { useEffect, useState } from "react";
import WhatsappSettingServices from "@/services/WhatsappSettingServices";
import useAsync from "@/hooks/useAsync";
import { notifySuccess, notifyError } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { FiPlus, FiMinus } from "react-icons/fi";
import { Button, Card, CardBody } from "@windmill/react-ui";
import AnimatedContent from "@/components/common/AnimatedContent";

const WhatsappSetting = () => {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [header, setHeader] = useState([{ id: "", value: "" }]);
  const [params, setParams] = useState([{ id: "", value: "" }]);
  const [requestMethod, setRequestMethod] = useState("GET");


  const { t } = useTranslation();

  const handleHeaderChange = (index, field, value) => {
    const newHeader = [...header];
    newHeader[index][field] = value;
    setHeader(newHeader);
  };

  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const handleAddHeader = () => setHeader([...header, { id: "", value: "" }]);
  const handleAddParam = () => setParams([...params, { id: "", value: "" }]);

  const handleRemoveHeader = (index) => {
    if (header.length > 1) {
      setHeader(header.filter((_, i) => i !== index));
    }
  };

  const handleRemoveParam = (index) => {
    if (params.length > 1) {
      setParams(params.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    const payload = { whatsappUrl, requestMethod, header, params };
    try {
      await WhatsappSettingServices.createWhatsappSetting(payload);
      //  handleReset();
      notifySuccess("WhatsApp setting saved successfully!");
    } catch (error) {
      notifyError("Failed to save WhatsApp setting.");
    }
  };

  const handleReset = () => {
    setWhatsappUrl("");
    setRequestMethod("GET");
    setHeader([{ id: "", value: "" }]);
    setParams([{ id: "", value: "" }]);
  };

  useEffect(() => {
    const fetchWhatsappSetting = async () => {
      try {
        const response = await WhatsappSettingServices.getWhatsappSettings();
        if (response) {
          response.forEach((item) => {
            setWhatsappUrl(item.whatsappUrl || "");
            setRequestMethod(item.requestMethod || "GET");
            setHeader(item.header || [{ id: "", value: "" }]);
            setParams(item.params || [{ id: "", value: "" }]);
          });
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    fetchWhatsappSetting();
  }, []);

  return (
    <>
      <h1 className="p-4 font-semibold text-lg">WhatsApp Setting</h1>
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="bg-white text-black p-4 sm:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="w-full">
  <label className="text-md font-semibold">Request Method</label>
  <select
    value={requestMethod}
    onChange={(e) => setRequestMethod(e.target.value)}
    className="w-full p-3 border border-white rounded bg-gray-100"
  >
    <option value="GET">GET</option>
    <option value="POST">POST</option>
  </select>
</div>


                {/* WhatsApp URL */}
                <input
                  type="text"
                  placeholder="Enter WhatsApp URL"
                  className="w-full p-3 border border-white rounded bg-gray-100"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                />

                {/* Headers */}
                <h2 className="text-md font-semibold">Headers</h2>
                {header.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-stretch sm:items-center">
                    <input
                      type="text"
                      placeholder="Enter Header Id"
                      className="flex-1 p-2 border border-white rounded bg-gray-100"
                      value={item.id}
                      onChange={(e) => handleHeaderChange(index, "id", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Enter Value"
                      className="flex-1 p-2 border border-white rounded bg-gray-100"
                      value={item.value}
                      onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveHeader(index)}
                      className="px-3 py-1 border bg-red-600 text-white hover:bg-red-400 w-full sm:w-auto"
                    >
                      <FiMinus />
                    </Button>
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleAddHeader}
                    className="px-6 py-2 border bg-blue-600 text-white rounded-md hover:bg-blue-400 w-full sm:w-auto"
                  >
                    <span className="inline-flex items-center"><FiPlus className="mr-2" />Add Header</span>
                  </Button>
                </div>

                {/* Params */}
                <h2 className="text-md font-semibold">Params</h2>
                {params.map((param, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-stretch sm:items-center">
                    <input
                      type="text"
                      placeholder="Enter Parameter Id"
                      className="flex-1 p-2 border border-white rounded bg-gray-100"
                      value={param.id}
                      onChange={(e) => handleParamChange(index, "id", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Enter Value"
                      className="flex-1 p-2 border border-white rounded bg-gray-100"
                      value={param.value}
                      onChange={(e) => handleParamChange(index, "value", e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveParam(index)}
                      className="px-3 py-1 border bg-red-600 text-white hover:bg-red-400 w-full sm:w-auto"
                    >
                      <FiMinus />
                    </Button>
                  </div>
                ))}

                {/* Add Param Button */}
                <div className="flex flex-col sm:flex-row justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleAddParam}
                    className="px-6 py-2 border bg-blue-600 text-white rounded-md hover:bg-blue-400 w-full sm:w-auto"
                  >
                    <span className="inline-flex items-center"><FiPlus className="mr-2" />Add Parameter</span>
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    onClick={handleReset}
                    className="px-6 py-2 border bg-blue-600 text-white rounded hover:bg-blue-400 w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="px-6 py-2 border bg-red-500 text-white rounded hover:bg-red-400 w-full sm:w-auto"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default WhatsappSetting;

















// import React, { useEffect, useState } from "react";
// import WhatsappSettingServices from "@/services/WhatsappSettingServices";
// import useAsync from "@/hooks/useAsync";
// import { notifySuccess, notifyError } from "@/utils/toast";
// import { useTranslation } from "react-i18next";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import { Button, Card, CardBody , Input } from "@windmill/react-ui";
// import AnimatedContent from "@/components/common/AnimatedContent";
// import MainDrawer from "@/components/drawer/MainDrawer";
// import PageTitle from "@/components/common/PageTitle";
// import { set } from "date-fns";

// const WhatsappSetting = () => {
//   const [whatsappUrl, setWhatsappUrl] = useState("");
//   const [header, setHeader] = useState([{ id: "", value: "" }]);
//   const [params, setParams] = useState([{ id: "", value: "" }]);
//   const [res, setRes] = useState([]);

//   const { t } = useTranslation();

//   const handleHeaderChange = (index, field, value) => {
//     const newHeader = [...header];
//     newHeader[index][field] = value;
//     setHeader(newHeader);
//   };
//   const handleParamChange = (index, field, value) => {
//     const newParams = [...params];
//     newParams[index][field] = value;
//     setParams(newParams);
//   };

//   const handleAddHeader = () => {
//     setHeader([...header, { id: "", value: "" }]);
//   };
//   const handleAddParam = () => {
//     setParams([...params, { id: "", value: "" }]);
//   };

//   const handleRemoveHeader = (removeIndex) => {
//     console.log("Removing param at index:", removeIndex);
//     if (header.length > 1) {
//       setHeader(header.filter((_, index) => index !== removeIndex));
//     }
//   };

//   const handleRemoveParam = (removeIndex) => {
//     console.log("Removing param at index:", removeIndex);
//     if (params.length > 1) {
//       setParams(params.filter((_, index) => index !== removeIndex));
//     }
//   };

//   const handleSave = async () => {
//     const payload = {
//       whatsappUrl,
//       header,
//       params,
//     };

//     try {
//       await WhatsappSettingServices.createWhatsappSetting(payload);
//       notifySuccess("WhatsApp setting saved successfully!");
//       handleReset();
//     } catch (error) {
//       console.error("Save failed:", error);
//       notifyError("Failed to save WhatsApp setting.");
//     }
//   };

//   const handleReset = () => {
//     setWhatsappUrl("");
//     setHeader([{ id: "", value: "" }]);
//     setParams([{ id: "", value: "" }]);
//   };

//   useEffect(() => {
//     const fetchWhatsappSetting = async () => {
//       try {
//         const response = await WhatsappSettingServices.getWhatsappSettings();
//         console.log("Fetched WhatsApp setting:", response);
//         if (response) {
//           setRes(response);
//           response.map((item) => {
//             console.log("Setting item:", item);
//             setWhatsappUrl(item.whatsappUrl || "");
//             setParams(item.params || [{ id: "", value: "" }]);
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch WhatsApp setting:", error);
//       }
//     };
//     fetchWhatsappSetting();
// },[]);

//   return (
//     // <>
//     //   <PageTitle>{t("Whatsapp Setting")}</PageTitle>
//     //   <AnimatedContent>
//     //     <div className=" bg-white text-black p-8">
//     //       <div className="max-w-xl mx-auto space-y-6">
//     //         <input
//     //           type="text"
//     //           placeholder="Enter WhatsApp URL"
//     //           className="w-full p-3 border border-white rounded bg-gray-100"
//     //           value={whatsappUrl}
//     //           onChange={(e) => setWhatsappUrl(e.target.value)}
//     //         />

//     //         {params.map((param, index) => (
//     //           <div key={index} className="flex space-x-2 items-center justify-between">
//     //             <input
//     //               type="text"
//     //               placeholder="Enter Param Id"
//     //               className="flex-1 p-2 border border-white rounded bg-gray-100"
//     //               value={param.id}
//     //               onChange={(e) => handleParamChange(index, "id", e.target.value)}
//     //             />
//     //             <input
//     //               type="text"
//     //               placeholder="Enter Value"
//     //               className="flex-1 p-2 border border-white rounded bg-gray-100"
//     //               value={param.value}
//     //               onChange={(e) =>
//     //                 handleParamChange(index, "value", e.target.value)
//     //               }
//     //             />
//     //             <Button
//     //               type="button"
//     //               onClick={() => handleRemoveParam(index)}
//     //               className="px-3 py-1 border bg-red-600 text-white border-red  hover:bg-red-400 hover:text-white  "
//     //             >
//     //               <FiMinus />
//     //             </Button>
//     //           </div>
//     //         ))}
//     //         <div className="flex justify-center space-x-4 pt-4">
//     //           <Button
//     //             type="button"
//     //             onClick={handleAddParam}
//     //             className="px-10 py-2 border bg-blue-600 text-white border-white rounded-md hover:bg-blue-400 hover:text-white"
//     //           >
//     //             <span className="mr-3"><FiPlus /></span>Add Fields
//     //           </Button>
//     //         </div>

//     //         <div className="flex justify-center space-x-4 pt-4">
//     //           <Button
//     //             onClick={handleReset}
//     //             className="px-6 py-2 border bg-blue-600 text-white border-white rounded hover:bg-blue-400 hover:text-white"
//     //           >
//     //             Reset
//     //           </Button>
//     //           <Button
//     //             onClick={handleSave}
//     //             className="px-6 py-2 border bg-red-500 text-white border-white rounded hover:bg-red-400 hover:text-white"
//     //           >
//     //             Save
//     //           </Button>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </AnimatedContent>
//     // </>
//     <>
//       <h1 className="p-4 font-semibols">WhatsApp Setting</h1>
//       <AnimatedContent>
//         <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
//           <CardBody>
//             <div className=" bg-white text-black p-8">
//           <div className="max-w-xl mx-auto space-y-6">
//             <input
//               type="text"
//               placeholder="Enter WhatsApp URL"
//               className="w-full p-3 border border-white rounded bg-gray-100"
//               value={whatsappUrl}
//               onChange={(e) => setWhatsappUrl(e.target.value)}
//             />

//             <div className="">Headers</div>
//             {header.map((header, index) => (
//               <div key={index} className="flex space-x-2 items-center justify-between">
//                 <input
//                   type="text"
//                   placeholder="Enter header Id"
//                   className="flex-1 p-2 border border-white rounded bg-gray-100"
//                   value={header.id}
//                   onChange={(e) => handleHeaderChange(index, "id", e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Enter Value"
//                   className="flex-1 p-2 border border-white rounded bg-gray-100"
//                   value={header.value}
//                   onChange={(e) =>
//                     handleHeaderChange(index, "value", e.target.value)
//                   }
//                 />
//                 <Button
//                   type="button"
//                   onClick={() => handleRemoveHeader(index)}
//                   className="px-3 py-1 border bg-red-600 text-white border-red  hover:bg-red-400 hover:text-white  "
//                 >
//                   <FiMinus />
//                 </Button>
//               </div>
//             ))}
//             <h1>Params</h1>
//             {params.map((param, index) => (
//               <div key={index} className="flex space-x-2 items-center justify-between">
//                 <input
//                   type="text"
//                   placeholder="Enter Param Id"
//                   className="flex-1 p-2 border border-white rounded bg-gray-100"
//                   value={param.id}
//                   onChange={(e) => handleParamChange(index, "id", e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Enter Value"
//                   className="flex-1 p-2 border border-white rounded bg-gray-100"
//                   value={param.value}
//                   onChange={(e) =>
//                     handleParamChange(index, "value", e.target.value)
//                   }
//                 />
//                 <Button
//                   type="button"
//                   onClick={() => handleRemoveParam(index)}
//                   className="px-3 py-1 border bg-red-600 text-white border-red  hover:bg-red-400 hover:text-white  "
//                 >
//                   <FiMinus />
//                 </Button>
//               </div>
//             ))}
//             <div className="flex justify-center space-x-4 pt-4">
//               <Button
//                 type="button"
//                 onClick={handleAddParam}
//                 className="px-10 py-2 border bg-blue-600 text-white border-white rounded-md hover:bg-blue-400 hover:text-white"
//               >
//                 <span className="mr-3"><FiPlus /></span>Add Fields
//               </Button>
//             </div>

//             <div className="space-x-4 pt-4 flex justify-end">
//               <Button
//                 onClick={handleReset}
//                 className="px-6 py-2 border bg-blue-600 text-white border-white rounded hover:bg-blue-400 hover:text-white"
//               >
//                 Reset
//               </Button>
//               <Button
//                 onClick={handleSave}
//                 className="px-6 py-2 border bg-red-500 text-white border-white rounded hover:bg-red-400 hover:text-white"
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </div>
//           </CardBody>
//         </Card>
//       </AnimatedContent>
            
//     </>
//   );
// };

// export default WhatsappSetting;
