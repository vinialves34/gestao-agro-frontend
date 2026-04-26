import axios from "axios";

const api = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades",
});

export const ibgeApi = {
  getStates: () => api.get("/estados?orderBy=nome"),
  getCitiesByState: (stateAcronym: string) =>
    api.get(`/estados/${stateAcronym}/municipios?orderBy=nome&view=nivelado`),
};
