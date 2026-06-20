import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiZoomIn } from "react-icons/fi";
import Tooltip from "@/components/tooltip/Tooltip";
import { GrView } from "react-icons/gr";

const EditDeleteButtonTwo = ({
  id,
  title,
  handleUpdate,
  handleModalOpen,
  isCheck,
  product,
  parent,
  children,
  flag = false,
  isShow = false
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-end text-right">
        

        {!isShow && !flag ? <button
          disabled={isCheck?.length > 0}
          onClick={() => handleModalOpen(id, title, product)}
          className="p-2 cursor-pointer text-gray-400 hover:text-red-600 focus:outline-none"
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

export default EditDeleteButtonTwo;
