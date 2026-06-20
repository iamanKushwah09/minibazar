import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiZoomIn, FiPrinter } from "react-icons/fi";
import Tooltip from "@/components/tooltip/Tooltip";
import { GrView } from "react-icons/gr";
import { FiPlay } from "react-icons/fi";

const EditDeleteButton = ({
  id,
  title,
  handleUpdate,
  handleModalOpen,
  isCheck,
  product,
  parent,
  children,
  flag = false,
  isShow = false,
  handleProcess,
  handlePrint,
  busyApiStatus
}) => {
  const { t } = useTranslation();
  
  // Disable all buttons if busyApiStatus is 'SUCCESS'
  const isDisabled = busyApiStatus === 'SUCCESS' || isCheck?.length > 0;

  return (
    <>
      <div className="flex justify-end text-right space-x-1">
        {children?.length > 0 ? (
          <>
            <Link
              to={`/categories/${parent?._id}`}
              className="p-2 cursor-pointer text-gray-400 hover:text-blue-600 focus:outline-none"
            >
              <Tooltip
                id="view"
                Icon={FiZoomIn}
                title={t("View")}
                bgColor="#10B981"
              />
            </Link>

            <button
              disabled={isDisabled}
              onClick={() => handleUpdate(id)}
              className={`p-2 cursor-pointer text-gray-400 hover:text-blue-600 focus:outline-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Tooltip
                id="edit"
                Icon={FiEdit}
                title={t("Edit")}
                bgColor="#10B981"
              />
            </button>
          </>
        ) : (
          <button
            disabled={isDisabled}
            onClick={() => handleUpdate(id)}
            className={`p-2 cursor-pointer text-gray-400 hover:text-blue-600 focus:outline-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Tooltip
              id="edit"
              Icon={isShow ? GrView : FiEdit}
              title={isShow ? t("View") : t("Edit")}
              bgColor="#10B981"
            />
          </button>
        )}

        {handleProcess && (
          <button
            disabled={isDisabled}
            onClick={() => handleProcess(id)}
            className={`p-2 cursor-pointer text-gray-400 hover:text-blue-600 focus:outline-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Busy Posting"
          >
            <Tooltip
              id="process"
              Icon={FiPlay}
              title="Busy Posting"
              bgColor="#3B82F6"
            />
          </button>
        )}

        {handlePrint && (
          <button
            // disabled={isDisabled}
            onClick={() => handlePrint(id)}
            // onClick={() => console.log(id,'idijlkjlkjlkjlk')}
            className={`p-2 cursor-pointer text-gray-400 hover:text-green-600 focus:outline-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Print Invoice"
            type="button"
          >
            <Tooltip
              id="print"
              Icon={FiPrinter}
              title="Print Invoice"
              bgColor="#10B981"
            />
          </button>
        )}

        {!isShow && !flag ? <button
          disabled={isDisabled}
          onClick={() => handleModalOpen(id, title, product)}
          className={`p-2 cursor-pointer text-gray-400 hover:text-red-600 focus:outline-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Tooltip
            id="delete"
            Icon={FiTrash2}
            title={t("Delete")}
            bgColor="#EF4444"
          />
        </button> : null}
      </div>
    </>
  );
};

export default EditDeleteButton;
