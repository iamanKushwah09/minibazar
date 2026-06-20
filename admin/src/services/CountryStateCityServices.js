import requests from "./httpService";

const CountryStateCityServices = {

    // role
    getCountry: async () => {
        return requests.get("/location/countries");
    },
    getState: async (id) => {
        if (!id) {
            throw new Error("Country ID is required to fetch states.");
        }
        return requests.get(`/location/states/${id}`);
    },
    getCity: async (country_id, state_id) => {
        return requests.get(`/location/cities/${country_id}/${state_id}`);
    },

};

export default CountryStateCityServices;
