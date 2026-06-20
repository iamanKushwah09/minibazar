import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { useState } from "react";
// import {watch} from "useform";
// Internal imports
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
// import useVendorGroupSubmit from "@/hooks/useVendorGroupSubmit";
import useItemGroupSubmit from "@/hooks/useItemGroupSubmit";
import SelectRole from "@/components/form/selectOption/SelectRole";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import CheckBox from "@/components/form/others/CheckBox";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";
import SelectItemGroup from "../form/selectOption/SelectItemGroup";

const ItemGroupDrawer = ({ id }) => {

    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        imageUrl,
        setImageUrl,
        setNewImage,
        isSubmitting,
        selectedDate,
        setSelectedDate,
        handleSelectLanguage,
        setValue,
        handleIsCombination,
        isCombination,
        setCheckedState,
        checkedState,
        watch,
        newImage
    } = useItemGroupSubmit(id);
    const { t } = useTranslation();
    const [moq, setMoq] = useState(1);



    return (
        <>
            <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Title
                    register={register}
                    handleSelectLanguage={handleSelectLanguage}
                    title={id ? t("Update Item Group") : t("Add Item Group")}
                //   description={
                //     id ? t("UpdateRoledescription") : t("AddRoledescription")
                //   }
                />
            </div>
            <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
                <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label="Image" status={true} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <Uploader
                                            folder="itemgroup"
                                            setNewImage={setNewImage}
                                            initialImages={newImage}
                                        />
                                    </div>
                                </div>
                                {/* Name */}
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label="Name" status={true} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <InputArea
                                            required
                                            register={register}
                                            label="Name"
                                            name="name"
                                            type="text"
                                            autoComplete="username"
                                            placeholder="Name"
                                        />
                                        <Error errorName={errors.name} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label="MOQ" status={true} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <InputArea
                                            label="MOQ"
                                            name="moq"
                                            type="number"
                                            register={register}
                                            placeholder="Enter MOQ"
                                            className="w-full"
                                        />
                                        <Error errorName={errors.moq} />
                                    </div>
                                </div>


                                {/* Description */}
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label="Alias" />
                                    <div className="col-span-8 sm:col-span-4">
                                        <InputArea
                                            // required
                                            register={register}
                                            label="Alias"
                                            name="alias"
                                            type="text"
                                            placeholder="Alias"
                                        />
                                        {/* <Error errorName={errors.alias} /> */}
                                    </div>
                                </div>
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label="Discount" />
                                    <div className="col-span-8 sm:col-span-4">
                                        <InputArea
                                            // required
                                            register={register}
                                            label="Discount"
                                            name="discount"
                                            type="number"
                                            placeholder="Discount"
                                        />
                                        {/* <Error errorName={errors.discount} /> */}
                                    </div>
                                </div>

                                <SwitchToggleForCombination
                                    product
                                    handleProcess={handleIsCombination}
                                    processOption={isCombination}
                                />

                                {isCombination ? <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <LabelArea label="Under group" status={true} />
                                    <div className="col-span-8 sm:col-span-4">
                                        <SelectItemGroup
                                            register={register}
                                            setValue={setValue} label="Under group" name="parent_id"
                                            value={watch("parent_id")}
                                        />

                                        <Error errorName={errors.parent_id} />
                                    </div>
                                </div> : null}

                            </div>
                            <DrawerButton id={id} title="Item Group" isSubmitting={isSubmitting} />
                        </form>
                    </CardBody>
                </Card>
            </Scrollbars>
        </>
    );
};

export default ItemGroupDrawer;
