// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// // import cloudinary from "cloudinary/lib/cloudinary";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { FiUploadCloud, FiXCircle } from "react-icons/fi";

// //internal import
// import useAsync from "@/hooks/useAsync";
// import SettingServices from "@/services/SettingServices";
// import { notifyError, notifySuccess } from "@/utils/toast";
// import Container from "@/components/image-uploader/Container";

// // cloudinary?.config({
// //   cloud_name: import.meta.env.VITE_APP_CLOUD_NAME,
// //   api_key: import.meta.env.VITE_APP_CLOUDINARY_API_KEY,
// //   api_secret: import.meta.env.VITE_APP_CLOUDINARY_API_SECRET,
// // });

// const Uploader = ({ setImageUrl, imageUrl, product, folder, setNewImage }) => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setError] = useState("");

//   const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
//   const { getRootProps, getInputProps, fileRejections } = useDropzone({
//     accept: {
//       "image/*": [".jpeg", ".jpg", ".png", ".webp"],
//     },
//     multiple: product ? true : false,
//     maxSize: 1000000000,
//     maxFiles: globalSetting?.number_of_image_per_product || 4,
//     onDrop: (acceptedFiles) => {
//       setFiles(
//         acceptedFiles.map((file) =>
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         )
//       );
//     },
//   });
//   const convertBase64 = (file) => {
//     if (file) {
//       return new Promise((resolve, reject) => {
//         const fileReader = new FileReader();
//         fileReader.readAsDataURL(file);
//         fileReader.onload = () => {
//           resolve(fileReader.result);
//         };
//         fileReader.onerror = (error) => {
//           reject(error);
//         };
//       });
//     }
//   };
//   useEffect(() => {
//     if (fileRejections) {
//       fileRejections.map(({ file, errors }) => (
//         <li key={file.path}>
//           {file.path} - {file.size} bytes
//           <ul>
//             {errors.map((e) => (
//               <li key={e.code}>
//                 {e.code === "too-many-files"
//                   ? notifyError(
//                     `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
//                   )
//                   : notifyError(e.message)}
//               </li>
//             ))}
//           </ul>
//         </li>
//       ));
//     }
//     // console.log({files})
//     if (files) {
//       files.forEach(async (file) => {
//         if (
//           product &&
//           imageUrl?.length + files?.length >
//           globalSetting?.number_of_image_per_product
//         ) {
//           return notifyError(
//             `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
//           );
//         }

//         setLoading(true);
//         setError("");
//         // setError("Uploading....");
//         if (product) {

//           const result = imageUrl?.find(
//             (img) => img === `${import.meta.env.VITE_APP_CLOUDINARY_URL}`
//           );
//           if (result) return setLoading(false);
//         }
//         const name = file.name.replaceAll(/\s/g, "");
//         const public_id = name?.substring(0, name.lastIndexOf("."));
//         if (!product && file) {
//           const base64File = await convertBase64(file);
//           console.log({ file: file.name, base64File })
//           setNewImage({ base64File, 'fileName': file.name })
//         }
//         if (product && file) {
//           const base64File = await convertBase64(file);
//           setNewImage(prevState => ([...prevState, { base64File, fileName: file.name }]));
//         }

//         // const formData = new FormData();
//         // formData.append("file", file);
//         // formData.append(
//         //   "upload_preset",
//         //   import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
//         // );
//         // formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
//         // formData.append("folder", folder);
//         // formData.append("public_id", public_id);

//         // setImageUrl(files[0])
//         // axios({
//         //   url: import.meta.env.VITE_APP_CLOUDINARY_URL,
//         //   method: "POST",
//         //   headers: {
//         //     "Content-Type": "application/x-www-form-urlencoded",
//         //   },
//         //   data: formData,
//         // })
//         //   .then((res) => {
//         //     notifySuccess("Image Uploaded successfully!");
//         //     setLoading(false);
//         //     if (product) {
//         //       setImageUrl((imgUrl) => [...imgUrl, res.data.secure_url]);
//         //     } else {
//         //       setImageUrl(res.data.secure_url);
//         //     }
//         //   })
//         //   .catch((err) => {
//         //     console.error("err", err);
//         //     notifyError(err.Message);
//         //     setLoading(false);
//         //   });

//       });
//     }
//     setImageUrl(files)

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [files]);

//   const thumbs = files.map((file) => (
//     <div key={file.name}>
//       <div>
//         <img
//           className="inline-flex border-2 border-gray-100 w-24 max-h-24"
//           src={file.preview}
//           alt={file.name}
//         />
//         <button
//           type="button"
//           className="absolute top-0 right-0 text-red-500"
//           onClick={() => setImageUrl("")}
//         >
//         <FiXCircle />
//         </button>
//       </div>
//     </div>
//   ));

//   useEffect(
//     () => () => {
//       // Make sure to revoke the data uris to avoid memory leaks
//       files.forEach((file) => URL.revokeObjectURL(file.preview));
//     },
//     [files]
//   );

//   const handleRemoveImage = async (img) => {
//     try {
//       // const url = img.substring(img.length - 25);
//       // const url = img.split("/").pop().split(".")[0];
//       // const public_id = `${folder}/${url}`;

//       // const res = await cloudinary.v2.uploader.destroy(public_id);

//       setLoading(false);
//       // notifyError(
//       //   res.result === "ok" ? "Image delete successfully!" : res.result
//       // );

//       notifyError("Image delete successfully!");
//       if (product) {
//         const result = imageUrl?.filter((i) => i !== img);
//         setImageUrl(result);
//       } else {
//         // setImageUrl("");
//       }
//     } catch (err) {
//       console.error("err", err);
//       notifyError(err.Message);
//       setLoading(false);
//     }
//   };
//   const initialThumb = imageUrl && (
//     <div className="relative mt-4">
//       <img
//         className="inline-flex border rounded-md border-gray-100 w-24 max-h-24"
//         src={`http://localhost:5055/${imageUrl}`}
//         // src={`https://api.VTC shoe.com/${imageUrl}`}
//         alt="Existing"
//       />
//       <button
//         type="button"
//         className="absolute top-0 right-0 text-red-500"
//         onClick={() => setImageUrl("")}
//       >
//         <FiXCircle />
//       </button>
//     </div>
//   );

//   return (
//     // <div className="w-full text-center">
//     //   <div
//     //     className="border-2 border-gray-300 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
//     //     {...getRootProps()}
//     //   >
//     //     <input {...getInputProps()} />
//     //     <FiUploadCloud className="text-3xl text-blue-500 mx-auto" />
//     //     <p className="text-sm mt-2">Drag your image here, or click to select one</p>
//     //     <em className="text-xs text-gray-400">Only .jpeg, .jpg, .png, .webp formats allowed</em>
//     //   </div>
//     //   <aside className="flex flex-wrap mt-4">
//     //     {initialThumb || thumbs}
//     //   </aside>
//     // </div>
//     <div className="w-full text-center">
//       <div
//         className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
//         {...getRootProps()}
//       >
//         <input {...getInputProps()} />
//         <span className="mx-auto flex justify-center">
//           <FiUploadCloud className="text-3xl text-blue-500" />
//         </span>
//         <p className="text-sm mt-2">{t("DragYourImage")}</p>
//         <em className="text-xs text-gray-400">{t("imageFormat")}</em>
//       </div>

//       <div className="text-blue-500">{loading && err}</div>
//       <aside className="flex flex-row flex-wrap mt-4">
//         {product ? (
//           <DndProvider backend={HTML5Backend}>
//             <Container
//               setImageUrl={setImageUrl}
//               imageUrl={imageUrl}
//               handleRemoveImage={handleRemoveImage}
//             />
//           </DndProvider>
//         ) : !product && imageUrl ? (
//           <div className="relative">
//             {" "}
//             {/* <img
//             className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
//             src={imageUrl}
//             alt="product"
//           />
//           <button
//             type="button"
//             className="absolute top-0 right-0 text-red-500 focus:outline-none"
//             onClick={() => handleRemoveImage(imageUrl)}
//           >
//             <FiXCircle />
//           </button> */}
//           </div>
//         ) : (
//           initialThumb || thumbs
//           // thumbs
//           // thumbs || <img src={`http://localhost:5055${newImage.fileName}`} />
//           // newImage ? <img src={`http://localhost:5055${newImage.fileName}`} /> : thumbs
//         )}
//       </aside>
//     </div>
//   );
// };

// export default Uploader;


import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

const Uploader = ({ initialImages = [], setNewImage }) => {

  const [files, setFiles] = useState([]); // Files selected in the current session
  const [loading, setLoading] = useState(false); // Loading state for uploads
  const [err, setError] = useState(""); // Error message state
  // Dropzone configuration 
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"], // Allowed formats
    },
    multiple: true, // Allow multiple files
    maxSize: 10000000, // Max file size: 10MB
    onDrop: (acceptedFiles) => {
      // Add files to state with previews
      setFiles((prev) =>
        [...prev, ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )]);
    },
  });

  // Convert file to Base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Process newly added files
  useEffect(() => {
    const processFiles = async () => {
      if (files.length > 0) {
        setLoading(true); // Show loading
        const newImages = [];
        for (const file of files) {
          try {
            const base64File = await convertBase64(file);
            newImages.push({ base64File, fileName: file.name });
          } catch (error) {
            setError("Failed to convert file to Base64");
            console.error("Error converting file to Base64:", error);
          }
        }
        // Update the parent state with new images
        setNewImage((prevState) => {
          return Array.isArray(prevState) && prevState.length > 0 ? [...prevState, ...newImages] : [...newImages];
        });
        setLoading(false); // Hide loading
      }
    };

    processFiles();
    // Cleanup previews to avoid memory leaks
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files, setNewImage]);

  // Render thumbnails for initial images
  const initialThumbs = initialImages?.map((img, index) => (
    <div key={`initial-${index}`} className="relative m-2">
      <img
        className="inline-flex border rounded-md border-gray-100 w-24 max-h-24"
        src={img?.base64File ? img.base64File : `${import.meta.env.VITE_APP_SOCKET_URL}/${img}`}
        alt={img?.fileName ? img.fileName : `Initial image ${index}`}
      />
      <button
        type="button"
        className="absolute top-0 right-0 text-red-500"
        onClick={() => handleRemoveFile(index)}
      >
        <FiXCircle />
      </button>
    </div>
  ));

  // Render thumbnails for newly uploaded files
  const newThumbs = files.map((file, index) => (
    <div key={`new-${index}`} className="relative m-2">
      <img
        className="inline-flex border rounded-md border-gray-100 w-24 max-h-24"
        src={file.preview}
        alt={file.name}
      />
      <button
        type="button"
        className="absolute top-0 right-0 text-red-500"
        onClick={() => handleRemoveFile(index)}
      >
        <FiXCircle />
      </button>
    </div>
  ));

  // Remove a file from the state
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    console.log(newFiles, "newFiles");
    // Update the state with the new files array
    setFiles(newFiles);
    setNewImage((prevState) => Array.isArray(prevState) ? prevState.filter((_, i) => i !== index) : []);
  };


  return (
    <div className="w-full text-center">
      {/* Dropzone */}
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-blue-500" />
        </span>
        <p className="text-sm mt-2">Drag your images here, or click to select files</p>
        <em className="text-xs text-gray-400">Only .jpeg, .jpg, .png, .webp formats allowed</em>
      </div>
      {/* Loading and error messages */}
      <div className="text-blue-500">{loading}</div>
      <div className="text-red-500">{err}</div>
      {/* Previews */}
      <aside className="flex flex-wrap mt-4">
        {
          files.length > 0 ? newThumbs:initialThumbs
        }
      </aside>
    </div>
  );
};

export default Uploader;
