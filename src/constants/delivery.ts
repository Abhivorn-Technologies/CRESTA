export interface ServiceableArea {
  pincode: string;
  city: string;
  distanceKm: number;
}

export const serviceableAreas: ServiceableArea[] = [
  { pincode: "500019", city: "Nallagandla, Lingampally, Serilingampally", distanceKm: 3 },
  { pincode: "500046", city: "Gopanpally", distanceKm: 6 },
  { pincode: "502032", city: "Tellapur, Osman Nagar", distanceKm: 8 },
  { pincode: "500050", city: "Chandanagar", distanceKm: 7 },
  { pincode: "500049", city: "Madinaguda, Hafeezpet, Miyapur", distanceKm: 10 },
  { pincode: "500084", city: "Kondapur", distanceKm: 11 },
  { pincode: "500032", city: "Gachibowli, Nanakramguda, Financial District", distanceKm: 12 },
  { pincode: "500075", city: "Manikonda, Kokapet, Narsingi", distanceKm: 18 },
  { pincode: "500008", city: "Khajaguda", distanceKm: 16 },
  { pincode: "502300", city: "Kollur", distanceKm: 14 },
  { pincode: "500090", city: "Bachupally", distanceKm: 19 },
];

export function findServiceableArea(pincode: string): ServiceableArea | undefined {
  return serviceableAreas.find((area) => area.pincode === pincode);
}
