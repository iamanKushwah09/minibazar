import { formatDateToMDY } from "@/utils/dateFormatter";
import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

const PartyLedgerTable = ({ partyLedgerData, lang }) => {
    console.log("partyLedgerDataTable ", partyLedgerData)
    return (
        <>
            <TableBody>
                {partyLedgerData?.Ledger?.map((e, index) => (
                    <TableRow key={index + 1}>
                        <TableCell>
                            <h2 className="text-sm font-medium">
                                {formatDateToMDY(e?.DATE)}
                            </h2>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e?.Account}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e?.VCHTYPE}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e?.VCHNO}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{Math.abs(e?.DebitAmt)}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e?.CreditAmt}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e?.SHORTNAR}</span>{" "}
                        </TableCell>
                    </TableRow>
                ))}
                {partyLedgerData?.showBalance && (
                    <TableRow className="bg-gray-100 dark:bg-gray-700 font-semibold text-blue-700 dark:text-blue-400">
                        <TableCell colSpan={4} className="text-right">
                            Closing Balance
                        </TableCell>
                        <TableCell colSpan={2}>
                            ₹{Number(partyLedgerData?.Balance?.ClosingBal || 0).toFixed(2)}
                        </TableCell>
                        <TableCell colSpan={1}></TableCell>
                    </TableRow>
                )}
            </TableBody>
        </>
    );
};

export default PartyLedgerTable;
