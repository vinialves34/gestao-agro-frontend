import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_IBGE_URL,
});

export const ibgeApi = {
  getStates: () => api.get("/estados?orderBy=nome"),
  getCitiesByState: (stateAcronym: string) =>
    api.get(`/estados/${stateAcronym}/municipios?orderBy=nome&view=nivelado`),
};
