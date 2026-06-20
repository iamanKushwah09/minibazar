// import React, { useState, useRef, useEffect } from "react";
// import { DateRange } from "react-date-range";
// import { format } from "date-fns";
// // import "react-date-range/dist/styles.css";
// // import "react-date-range/dist/theme/default.css";

// // Outside click hook
// const useOutsideClick = (ref, callback) => {
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         callback();
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, [ref, callback]);
// };

// const DateRangeSelectorWithDateRange = ({ onChange }) => {
//   const [dateRange, setDateRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const pickerRef = useRef(null);

//   useOutsideClick(pickerRef, () => setShowDatePicker(false));

//   const handleSelect = (ranges) => {
//     setDateRange([ranges.selection]);
//     if (onChange) {
//       onChange(ranges.selection);
//     }
//   };

//   const formattedRange = `${format(dateRange[0].startDate, "MM/dd/yyyy")} - ${format(
//     dateRange[0].endDate,
//     "MM/dd/yyyy"
//   )}`;

//   return (
//     <div className="relative w-full md:w-auto" ref={pickerRef}>
//       <input
//         type="text"
//         value={formattedRange}
//         onChange={(e) => {
//           const [startStr, endStr] = e.target.value.split(" - ");
//           const startDate = new Date(startStr);
//           const endDate = new Date(endStr);

//           if (!isNaN(startDate) && !isNaN(endDate)) {
//             const newRange = {
//               startDate,
//               endDate,
//               key: "selection",
//             };
//             setDateRange([newRange]);
//             if (onChange) {
//               onChange(newRange);
//             }
//           }
//         }}
//         onFocus={() => setShowDatePicker(true)}
//         className="w-full h-12 px-4 border border-gray-300 rounded-md mb-2"
//       />
// {/* 
//       <button
//         type="button"
//         onClick={() => setShowDatePicker((prev) => !prev)}
//         className="w-full h-12 px-4 text-left border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white"
//       >
//         {formattedRange}
//       </button> */}

//       {showDatePicker && (
//         <div className="absolute z-50 mt-2 bg-white shadow-lg">
//           <DateRange
//             editableDateInputs={true}
//             onChange={handleSelect}
//             moveRangeOnFirstSelection={false}
//             ranges={dateRange}
//             rangeColors={["#10B981"]}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateRangeSelectorWithDateRange;


import React, { useState, useEffect } from "react";
// import { format, parseISO } from "date-fns";



const DateRangeSelectorWithDateRange = ({ onChange }) => {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  // const formattedDate = format(parseISO("2025-07-24"), "dd-MMM-yyyy"); 

  // Update parent component when dates change
  useEffect(() => {
    if (onChange) {
      onChange([
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          key: "selection",
        },
      ]);
    }
  }, [startDate, endDate, onChange]);

  // const getFormattedDate = (dateString) => {
  //   try {
  //     return format(parseISO(dateString), "dd-MMM-yyyy"); // Example: "24-Jul-2025"
  //   } catch {
  //     return dateString;
  //   }
  // };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full md:w-auto h-12 px-4 border border-gray-300 rounded-md"
      />
      <span className="self-center">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full md:w-auto h-12 px-4 border border-gray-300 rounded-md"
      />
      
    </div>
  );
};

export default DateRangeSelectorWithDateRange;
