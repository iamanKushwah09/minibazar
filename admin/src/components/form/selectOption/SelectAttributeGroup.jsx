import React, { useState, useEffect } from "react";
import SearchableDropdown from "@/pages/SearchableDropdown";
import AttributeGroupServices from "@/services/AttributeGroupServices";

const SelectAttributeGroup = ({ setRole, register, name, label, setValue, value }) => {
    const [options, setOptions] = useState([]);

    const getAttributeGroups = async () => {
        try {
            const res = await AttributeGroupServices.getActiveAllAttributeGroup();
            console.log("Attribute Groups loaded:", res);
            if (res) {
                const formatted = res.map((group) => ({
                    value: group._id,
                    label: group.name,
                }));
                setOptions(formatted);
                
                // If we have a value and options are loaded, ensure it's set
                if (value && formatted.length > 0) {
                    setValue(name, value);
                }
            }
        } catch (err) {
            console.log("Error loading attribute groups:", err);
        }
    };

    useEffect(() => {
        getAttributeGroups();
    }, []);

    // Update value when it changes (e.g., when editing)
    useEffect(() => {
        if (value && options.length > 0 && setValue) {
            // Handle case where value might be an object or string
            const valueToSet = (value && typeof value === 'object' && value !== null) ? value._id || value.value : value;
            setValue(name, valueToSet);
        }
    }, [value, options, setValue, name]);

    const handleSelect = (selectedOption) => {
        console.log("Attribute Group selected:", selectedOption);
        const valueToSet = selectedOption?.value || selectedOption;
        if (setRole) {
            setRole(valueToSet);
        }
        if (setValue) {
            setValue(name, valueToSet);
        }
    };

    // Find the selected option for display
    // Handle both string and object values, with null/undefined checks
    const valueToCompare = (value && typeof value === 'object' && value !== null) ? value._id || value.value : value;
    const selectedOption = valueToCompare ? options.find(option => {
        // Compare as strings to handle any type mismatches
        return String(option.value) === String(valueToCompare);
    }) : null;

    return (
        <>
            <SearchableDropdown
                options={options}
                onChange={handleSelect}
                placeholder={`Select ${label}`}
                value={selectedOption}
            />

            <input
                type="hidden"
                {...register(`${name}`, {
                    required: `${label} is required!`,
                })}
            />
        </>
    );
};

export default SelectAttributeGroup;
