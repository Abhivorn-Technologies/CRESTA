export interface ServiceableArea {
  pincode: string;
  city: string;
}

export const serviceableAreas: ServiceableArea[] = [
  { pincode: "110001", city: "New Delhi" },
  { pincode: "110016", city: "New Delhi" },
  { pincode: "400001", city: "Mumbai" },
  { pincode: "400051", city: "Mumbai" },
  { pincode: "560001", city: "Bengaluru" },
  { pincode: "560034", city: "Bengaluru" },
  { pincode: "600001", city: "Chennai" },
  { pincode: "700001", city: "Kolkata" },
  { pincode: "500001", city: "Hyderabad" },
  { pincode: "411001", city: "Pune" },
  { pincode: "380001", city: "Ahmedabad" },
  { pincode: "302001", city: "Jaipur" },
];

export function findServiceableArea(pincode: string): ServiceableArea | undefined {
  return serviceableAreas.find((area) => area.pincode === pincode);
}
