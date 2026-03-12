export interface NigerianState {
  name: string;
  capital: string;
  lat: number;
  lon: number;
}

export const nigerianStates: NigerianState[] = [
  { name: "Abia", capital: "Umuahia", lat: 5.524, lon: 7.486 },
  { name: "Adamawa", capital: "Yola", lat: 9.233, lon: 12.460 },
  { name: "Akwa Ibom", capital: "Uyo", lat: 5.008, lon: 7.850 },
  { name: "Anambra", capital: "Awka", lat: 6.210, lon: 7.074 },
  { name: "Bauchi", capital: "Bauchi", lat: 10.310, lon: 9.843 },
  { name: "Bayelsa", capital: "Yenagoa", lat: 4.922, lon: 6.267 },
  { name: "Benue", capital: "Makurdi", lat: 7.733, lon: 8.533 },
  { name: "Borno", capital: "Maiduguri", lat: 11.846, lon: 13.160 },
  { name: "Cross River", capital: "Calabar", lat: 4.958, lon: 8.326 },
  { name: "Delta", capital: "Asaba", lat: 6.198, lon: 6.733 },
  { name: "Ebonyi", capital: "Abakaliki", lat: 6.325, lon: 8.114 },
  { name: "Edo", capital: "Benin City", lat: 6.335, lon: 5.627 },
  { name: "Ekiti", capital: "Ado-Ekiti", lat: 7.621, lon: 5.221 },
  { name: "Enugu", capital: "Enugu", lat: 6.441, lon: 7.498 },
  { name: "FCT", capital: "Abuja", lat: 9.058, lon: 7.489 },
  { name: "Gombe", capital: "Gombe", lat: 10.290, lon: 11.167 },
  { name: "Imo", capital: "Owerri", lat: 5.485, lon: 7.035 },
  { name: "Jigawa", capital: "Dutse", lat: 11.756, lon: 9.338 },
  { name: "Kaduna", capital: "Kaduna", lat: 10.520, lon: 7.433 },
  { name: "Kano", capital: "Kano", lat: 12.000, lon: 8.517 },
  { name: "Katsina", capital: "Katsina", lat: 13.008, lon: 7.601 },
  { name: "Kebbi", capital: "Birnin Kebbi", lat: 12.454, lon: 4.199 },
  { name: "Kogi", capital: "Lokoja", lat: 7.802, lon: 6.733 },
  { name: "Kwara", capital: "Ilorin", lat: 8.500, lon: 4.550 },
  { name: "Lagos", capital: "Ikeja", lat: 6.524, lon: 3.379 },
  { name: "Nasarawa", capital: "Lafia", lat: 8.496, lon: 8.516 },
  { name: "Niger", capital: "Minna", lat: 9.614, lon: 6.557 },
  { name: "Ogun", capital: "Abeokuta", lat: 7.155, lon: 3.346 },
  { name: "Ondo", capital: "Akure", lat: 7.250, lon: 5.195 },
  { name: "Osun", capital: "Osogbo", lat: 7.771, lon: 4.557 },
  { name: "Oyo", capital: "Ibadan", lat: 7.378, lon: 3.947 },
  { name: "Plateau", capital: "Jos", lat: 9.896, lon: 8.858 },
  { name: "Rivers", capital: "Port Harcourt", lat: 4.815, lon: 7.050 },
  { name: "Sokoto", capital: "Sokoto", lat: 13.060, lon: 5.240 },
  { name: "Taraba", capital: "Jalingo", lat: 8.893, lon: 11.358 },
  { name: "Yobe", capital: "Damaturu", lat: 11.747, lon: 11.966 },
  { name: "Zamfara", capital: "Gusau", lat: 12.170, lon: 6.661 },
];

export const getStateByName = (name: string) => nigerianStates.find(s => s.name === name);
