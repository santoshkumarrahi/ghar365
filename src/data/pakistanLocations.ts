export interface PakistaniProvince {
  name: string;
  districts: {
    name: string;
    cities: {
      name: string;
      areas: string[];
    }[];
  }[];
}

export const PAKISTAN_LOCATIONS: PakistaniProvince[] = [
  {
    name: 'Sindh',
    districts: [
      {
        name: 'Tharparkar',
        cities: [
          {
            name: 'Mithi',
            areas: [
              'Shahi Bazaar',
              'Kashmir Chowk',
              'Main Hospital Road',
              'Saddar Mithi',
              'Naukot Road',
              'Sonar Colony',
              'Post Office Area',
              'Govt Degree College Area',
            ],
          },
          {
            name: 'Islamkot',
            areas: ['Islamkot Town Centre', 'Bheel Colony', 'Airport Road', 'Sant Nenuram Ashram Area'],
          },
          {
            name: 'Chachro',
            areas: ['Chachro Bazaar', 'Khipro Road', 'Civil Hospital Area'],
          },
          {
            name: 'Diplo',
            areas: ['Diplo Main Bazaar', 'Kaloi Road', 'Old Town'],
          },
        ],
      },
      {
        name: 'Karachi Central & South',
        cities: [
          {
            name: 'Karachi',
            areas: [
              'Clifton Block 2',
              'Clifton Block 5',
              'DHA Phase 5',
              'DHA Phase 6',
              'Gulshan-e-Iqbal Block 13',
              'North Nazimabad Block H',
              'PECHS Block 2',
              'Saddar Empress Market',
              'Bahria Town Karachi',
            ],
          },
        ],
      },
      {
        name: 'Hyderabad',
        cities: [
          {
            name: 'Hyderabad',
            areas: ['Latifabad Unit 7', 'Qasimabad Phase 1', 'Saddar Cantt', 'Auto Bhan Road'],
          },
        ],
      },
      {
        name: 'Mirpurkhas',
        cities: [
          {
            name: 'Mirpurkhas',
            areas: ['Satellite Town', 'Station Road', 'Sir Syed Colony'],
          },
        ],
      },
    ],
  },
  {
    name: 'Punjab',
    districts: [
      {
        name: 'Lahore',
        cities: [
          {
            name: 'Lahore',
            areas: ['Gulberg III', 'DHA Phase 4', 'Model Town Block C', 'Johar Town Phase 2', 'Anarkali Bazaar'],
          },
        ],
      },
      {
        name: 'Rawalpindi',
        cities: [
          {
            name: 'Rawalpindi',
            areas: ['Saddar Cantt', 'Bahria Town Phase 4', 'Satellite Town Commercial', 'Westridge'],
          },
        ],
      },
      {
        name: 'Faisalabad',
        cities: [
          {
            name: 'Faisalabad',
            areas: ['D Ground Peoples Colony', 'Kohinoor City', 'Madina Town'],
          },
        ],
      },
    ],
  },
  {
    name: 'Islamabad Capital Territory',
    districts: [
      {
        name: 'Islamabad',
        cities: [
          {
            name: 'Islamabad',
            areas: ['Sector F-6 Super Market', 'Sector F-7 Jinnah Super', 'Sector F-10 Markaz', 'Sector G-9 Karachi Company', 'Blue Area Commercial'],
          },
        ],
      },
    ],
  },
  {
    name: 'Khyber Pakhtunkhwa',
    districts: [
      {
        name: 'Peshawar',
        cities: [
          {
            name: 'Peshawar',
            areas: ['Hayatabad Phase 3', 'University Town', 'Karkhano Market', 'Saddar Peshawar'],
          },
        ],
      },
    ],
  },
  {
    name: 'Balochistan',
    districts: [
      {
        name: 'Quetta',
        cities: [
          {
            name: 'Quetta',
            areas: ['Jinnah Town', 'Cantt Area', 'Liaquat Bazaar', 'Chaman Housing Scheme'],
          },
        ],
      },
    ],
  },
  {
    name: 'Gilgit-Baltistan',
    districts: [
      {
        name: 'Gilgit',
        cities: [
          {
            name: 'Gilgit',
            areas: ['Naya Bazaar', 'Airport Road', 'Jutial'],
          },
        ],
      },
    ],
  },
  {
    name: 'Azad Jammu and Kashmir',
    districts: [
      {
        name: 'Muzaffarabad',
        cities: [
          {
            name: 'Muzaffarabad',
            areas: ['Madina Market', 'Upper Chattar', 'Plate Area'],
          },
        ],
      },
    ],
  },
];
