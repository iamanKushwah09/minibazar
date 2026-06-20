import useItemImgUpdateSubmit from "@/hooks/useItemImgUpdateSubmit";
import React from "react";
import Title from "../form/others/Title";
import DrawerButton from "../form/button/DrawerButton";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody } from "@windmill/react-ui";
import LabelArea from "@/components/form/selectOption/LabelArea";
import CategoryUploader from "../image-uploader/CategoryUploader";

const ItemImgUpdateDrawer = ({id}) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    isSubmitting,
    setNewImage,
    newImage,
  } = useItemImgUpdateSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          title={"Update Item Image"}
        />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Image" />
                  <div className="col-span-8 sm:col-span-4">
                    <CategoryUploader
                      folder="admin"
                      setNewImage={setNewImage}
                      initialImages={newImage}
                    />
                  </div>
                </div>
              </div>
              <DrawerButton
                id={id}
                title="Item Image"
                isSubmitting={isSubmitting}
              />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default ItemImgUpdateDrawer;
