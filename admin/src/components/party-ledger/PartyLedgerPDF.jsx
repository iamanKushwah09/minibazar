import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import React from "react";

Font.register({
    family: "Open Sans",
    fonts: [
        {
            src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
            fontWeight: 600,
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: "Open Sans",
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#111",
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 10,
        textAlign: "center",
        color: "#666",
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    infoText: {
        fontSize: 10,
        color: "#333",
    },
    balanceBox: {
        backgroundColor: "#F9FAF7",
        padding: 8,
        borderRadius: 4,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    balanceText: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#059669",
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "14.28%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#F9FAFB",
        padding: 5,
    },
    tableCol: {
        width: "14.28%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 8,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    tableCell: {
        fontSize: 8,
    },
    footer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    closingBalance: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#059669",
    },
});

const PartyLedgerPDF = ({ data, vendorName, startDate, endDate }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Party Ledger</Text>
                    <Text style={styles.subTitle}>Selection Footwear</Text>
                </View>

                <View style={styles.infoContainer}>
                    <View>
                        <Text style={[styles.infoText, { fontWeight: "bold" }]}>Party Name: {vendorName}</Text>
                    </View>
                    <View>
                        <Text style={styles.infoText}>Period: {startDate} to {endDate}</Text>
                    </View>
                </View>

                <View style={styles.balanceBox}>
                    <Text style={styles.balanceText}>
                        Opening Balance: ₹{Number(data?.Balance?.OpeningBal || 0).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Date</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Account</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Vch Type</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Vch No</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Debit</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Credit</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Narrative</Text></View>
                    </View>

                    {data?.Ledger?.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{new Date(item.DATE).toLocaleDateString()}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.Account}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.VCHTYPE}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.VCHNO}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{Math.abs(item.DebitAmt).toFixed(2)}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.CreditAmt.toFixed(2)}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.SHORTNAR}</Text></View>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.closingBalance}>
                        Closing Balance: ₹{Number(data?.Balance?.ClosingBal || 0).toFixed(2)}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default PartyLedgerPDF;
