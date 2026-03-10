export interface CityOption {
  value: string;
  label: string;
}

const CITIES: CityOption[] = [
  // United States
  { value: "New York", label: "New York" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Chicago", label: "Chicago" },
  { value: "Houston", label: "Houston" },
  { value: "Phoenix", label: "Phoenix" },
  { value: "Philadelphia", label: "Philadelphia" },
  { value: "San Antonio", label: "San Antonio" },
  { value: "San Diego", label: "San Diego" },
  { value: "Dallas", label: "Dallas" },
  { value: "San Francisco", label: "San Francisco" },
  { value: "Seattle", label: "Seattle" },
  { value: "Miami", label: "Miami" },
  { value: "Boston", label: "Boston" },
  { value: "Atlanta", label: "Atlanta" },
  { value: "Denver", label: "Denver" },
  // United Kingdom
  { value: "London", label: "London" },
  { value: "Birmingham", label: "Birmingham" },
  { value: "Manchester", label: "Manchester" },
  { value: "Leeds", label: "Leeds" },
  { value: "Glasgow", label: "Glasgow" },
  { value: "Liverpool", label: "Liverpool" },
  { value: "Edinburgh", label: "Edinburgh" },
  { value: "Bristol", label: "Bristol" },
  { value: "Sheffield", label: "Sheffield" },
  { value: "Cardiff", label: "Cardiff" },
  // United Arab Emirates
  { value: "Dubai", label: "Dubai" },
  { value: "Abu Dhabi", label: "Abu Dhabi" },
  { value: "Sharjah", label: "Sharjah" },
  { value: "Ajman", label: "Ajman" },
  { value: "Al Ain", label: "Al Ain" },
  // Saudi Arabia
  { value: "Riyadh", label: "Riyadh" },
  { value: "Jeddah", label: "Jeddah" },
  { value: "Mecca", label: "Mecca" },
  { value: "Medina", label: "Medina" },
  { value: "Dammam", label: "Dammam" },
  // India
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Chennai", label: "Chennai" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Pune", label: "Pune" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Kochi", label: "Kochi" },
  // Australia
  { value: "Sydney", label: "Sydney" },
  { value: "Melbourne", label: "Melbourne" },
  { value: "Brisbane", label: "Brisbane" },
  { value: "Perth", label: "Perth" },
  { value: "Adelaide", label: "Adelaide" },
  // Canada
  { value: "Toronto", label: "Toronto" },
  { value: "Vancouver", label: "Vancouver" },
  { value: "Montreal", label: "Montreal" },
  { value: "Calgary", label: "Calgary" },
  { value: "Ottawa", label: "Ottawa" },
  // Germany
  { value: "Berlin", label: "Berlin" },
  { value: "Munich", label: "Munich" },
  { value: "Hamburg", label: "Hamburg" },
  { value: "Frankfurt", label: "Frankfurt" },
  { value: "Cologne", label: "Cologne" },
  // France
  { value: "Paris", label: "Paris" },
  { value: "Marseille", label: "Marseille" },
  { value: "Lyon", label: "Lyon" },
  { value: "Toulouse", label: "Toulouse" },
  { value: "Nice", label: "Nice" },
  // China
  { value: "Beijing", label: "Beijing" },
  { value: "Shanghai", label: "Shanghai" },
  { value: "Guangzhou", label: "Guangzhou" },
  { value: "Shenzhen", label: "Shenzhen" },
  { value: "Chengdu", label: "Chengdu" },
  // Japan
  { value: "Tokyo", label: "Tokyo" },
  { value: "Osaka", label: "Osaka" },
  { value: "Kyoto", label: "Kyoto" },
  { value: "Yokohama", label: "Yokohama" },
  { value: "Nagoya", label: "Nagoya" },
  // Brazil
  { value: "São Paulo", label: "São Paulo" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro" },
  { value: "Brasília", label: "Brasília" },
  { value: "Salvador", label: "Salvador" },
  { value: "Fortaleza", label: "Fortaleza" },
  // South Africa
  { value: "Johannesburg", label: "Johannesburg" },
  { value: "Cape Town", label: "Cape Town" },
  { value: "Durban", label: "Durban" },
  { value: "Pretoria", label: "Pretoria" },
  // Pakistan
  { value: "Karachi", label: "Karachi" },
  { value: "Lahore", label: "Lahore" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Rawalpindi", label: "Rawalpindi" },
  // Egypt
  { value: "Cairo", label: "Cairo" },
  { value: "Alexandria", label: "Alexandria" },
  { value: "Giza", label: "Giza" },
  // Turkey
  { value: "Istanbul", label: "Istanbul" },
  { value: "Ankara", label: "Ankara" },
  { value: "Izmir", label: "Izmir" },
  // Qatar
  { value: "Doha", label: "Doha" },
  // Kuwait
  { value: "Kuwait City", label: "Kuwait City" },
  // Bahrain
  { value: "Manama", label: "Manama" },
  // Oman
  { value: "Muscat", label: "Muscat" },
  // Singapore
  { value: "Singapore", label: "Singapore" },
  // Malaysia
  { value: "Kuala Lumpur", label: "Kuala Lumpur" },
  { value: "Penang", label: "Penang" },
  { value: "Johor Bahru", label: "Johor Bahru" },
  // Philippines
  { value: "Manila", label: "Manila" },
  { value: "Cebu City", label: "Cebu City" },
  // Indonesia
  { value: "Jakarta", label: "Jakarta" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Bandung", label: "Bandung" },
  // Thailand
  { value: "Bangkok", label: "Bangkok" },
  { value: "Chiang Mai", label: "Chiang Mai" },
  // Nigeria
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Kano", label: "Kano" },
  // Kenya
  { value: "Nairobi", label: "Nairobi" },
  { value: "Mombasa", label: "Mombasa" },
  // Morocco
  { value: "Casablanca", label: "Casablanca" },
  { value: "Rabat", label: "Rabat" },
  { value: "Marrakech", label: "Marrakech" },
  // Russia
  { value: "Moscow", label: "Moscow" },
  { value: "Saint Petersburg", label: "Saint Petersburg" },
  // Netherlands
  { value: "Amsterdam", label: "Amsterdam" },
  { value: "Rotterdam", label: "Rotterdam" },
  { value: "The Hague", label: "The Hague" },
  // Spain
  { value: "Madrid", label: "Madrid" },
  { value: "Barcelona", label: "Barcelona" },
  { value: "Valencia", label: "Valencia" },
  // Italy
  { value: "Rome", label: "Rome" },
  { value: "Milan", label: "Milan" },
  { value: "Naples", label: "Naples" },
  // Sweden
  { value: "Stockholm", label: "Stockholm" },
  { value: "Gothenburg", label: "Gothenburg" },
  // Norway
  { value: "Oslo", label: "Oslo" },
  { value: "Bergen", label: "Bergen" },
  // Switzerland
  { value: "Zurich", label: "Zurich" },
  { value: "Geneva", label: "Geneva" },
  { value: "Bern", label: "Bern" },
];

export default CITIES;