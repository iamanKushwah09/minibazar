import requests from "./httpService";

const PartyLedgerServices = {
  getPartyLedger: async (body) => {
    return requests.post("/customer/party-ledger", body);
  },
  downloadPartyLedgerPDF: async (body, config) => {
    return requests.post("/customer/party-ledger-pdf", body, { responseType: 'blob', ...config });
  }
};

export default PartyLedgerServices;
