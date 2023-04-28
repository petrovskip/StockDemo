import axios from "axios";

const baseUrl = 'http://localhost:5000'

export function getCompanies(){
    return axios
        .get(`${baseUrl}/companies`)
        .then(res => res.data)
}

export function getCompanyTS(companyCode: string) {
    return axios
        .get(`${baseUrl}/companyTS/${companyCode}`)
        .then(res => res.data)
}