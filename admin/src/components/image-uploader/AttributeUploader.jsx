import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

const AttributeUploader = ({ initialImages = [], setNewImage, index, handleAttributeImage }) => {

  console.log(initialImages, "initialImagesaTTRIBUTE");
  // State to manage the files selected in the current session

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

      console.log("acceptedFiles:", acceptedFiles);

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
        console.log("newImages:", newImages);
        // Add to the current variant images
      // handleAttributeImage(index, [...initialImages, ...newImages]);
      handleAttributeImage(index, [...newImages]);
        // handleAttributeImage((prevVariants) => {
        //   const updatedVariants = [...prevVariants];
        //   const currentImages = updatedVariants[index]?.attribute_image || [];
        //   updatedVariants[index] = {
        //     ...updatedVariants[index],
        //     attribute_image: [...currentImages, ...newImages],
        //   };
        //   return updatedVariants;
        // });
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
        src={img?.base64File ? img.base64File : img}
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
  // const handleRemoveFile = (index) => {
  //   const newFiles = files.filter((_, i) => i !== index);
  //   console.log(newFiles, "newFiles");
  //   // Update the state with the new files array
  //   setFiles(newFiles);
  //   setNewImage((prevState) => Array.isArray(prevState) ? prevState.filter((_, i) => i !== index) : []);
  // };
  // const handleRemoveFile = (removeIndex) => {
  //   handleAttributeImage((prevVariants) => {
  //     const updatedVariants = [...prevVariants];
  //     const currentImages = updatedVariants[index]?.attribute_image || [];
  //     const filteredImages = currentImages.filter((_, i) => i !== removeIndex);
  //     updatedVariants[index] = {
  //       ...updatedVariants[index],
  //       attribute_image: filteredImages,
  //     };
  //     return updatedVariants;
  //   });
  
  //   const newFiles = files.filter((_, i) => i !== removeIndex);
  //   setFiles(newFiles);
  // };
  
  const handleRemoveFile = (removeIndex) => {
    const filteredImages = initialImages.filter((_, i) => i !== removeIndex);
    handleAttributeImage(index, filteredImages);
    setFiles(files.filter((_, i) => i !== removeIndex));
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
      <div className="text-blue-500">{loading && "Uploading..."}</div>
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

export default AttributeUploader;
