export interface GOOGLE_DATA {
  [0]: {
    address_components: [],
    formatted_address: string,
    geometry: {
      location: {
        lat: any,
        lng: any
      },
      location_type: string,
      viewport: {
        northeast: {
          lat: number,
          lng: number
        },
        southwest: {
          lat: number,
          lng: number
        }
      }
    },
    place_id: string,
    plus_code: {
      compound_code: string,
      global_code: string
    },
    types: [
      string
    ]
  },
}

export interface Address {
  address: string,
  address_info?: any,
  zip: string,
  city: string,
  lat: number,
  lng: number
}