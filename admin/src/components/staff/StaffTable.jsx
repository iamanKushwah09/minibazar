import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";

const StaffTable = ({ staffs, lang }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();
  // console.log("staffs: ", staffs);

  const { showDateFormat, showingTranslateValue } = useUtilsFunction();
  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <StaffDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {staffs?.map((staff) => {
          return <TableRow key={staff._id}>
            <TableCell>
              <div className="flex items-center">
                <img
                  src={`${import.meta.env.VITE_APP_ADMIN_URL}${staff.image}`}
                  height={40}
                  width={40}
                />
                <div>
                  <h2 className="text-sm font-medium">
                    {showingTranslateValue(staff?.name)}
                  </h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">{staff.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {staff.joiningData}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">{staff?.role_name}</span>
            </TableCell>
            <TableCell className="text-center text-xs">
              <Status status={staff.status} />
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton id={staff._id} status={staff.is_active} />
            </TableCell>

            <TableCell className="text-center">
              <ActiveInActiveButton
                id={staff?._id}
                staff={staff}
                option="staff"
                status={staff.status}
              />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={staff._id}
                staff={staff}
                isSubmitting={isSubmitting}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleResetPassword={handleResetPassword}
                title={showingTranslateValue(staff?.name)}
              />
            </TableCell>
          </TableRow>
        })}
      </TableBody>
      {/* <TableBody>
        {staffs?.map((staff) => {
          return <TableRow key={staff._id}>
            <TableCell>
              <div className="flex items-center">
                <img
                  src={`http://localhost:5055${staff.image}`}
                  height={40}
                  width={40}
                />
                <div>
                  <h2 className="text-sm font-medium">
                    {showingTranslateValue(staff?.name)}
                  </h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">{staff.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {staff.joiningData}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">{staff?.role_name}</span>
            </TableCell>
           
            <TableCell className="text-center">
              <ShowHideButton id={staff._id} status={staff.is_active} />
            </TableCell>

            <TableCell className="text-center">
              <ActiveInActiveButton
                id={staff?._id}
                staff={staff}
                option="staff"
                status={staff.status}
              />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={staff._id}
                staff={staff}
                isSubmitting={isSubmitting}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleResetPassword={handleResetPassword}
                title={showingTranslateValue(staff?.name)}
              />
            </TableCell>
          </TableRow>
        })}
      </TableBody> */}
    </>
  );
};

export default StaffTable;
