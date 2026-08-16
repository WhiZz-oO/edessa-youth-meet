// EDESSA Youth Meet Mock Data

export const EVENT_DETAILS = {
  title: "EDESSA",
  subtitle: "Called to Witness",
  organizer: "SMYM Chemmalamattom Unit",
  date: "25 August 2026",
  day: "Tuesday",
  targetDateStr: "2026-08-25T10:00:00+05:30",
  venue: "12 Apostles Auditorium, Chemmalamattom",
  time: "10:00 AM – 7:00 PM",
  registrationFee: "₹100 / Participant",
  gpayNumber: "+91 98765 43210",
  gpayUpiId: "smymchemmalamattom@okicici",
};

export const SCHEDULE_DATA = [
  {
    time: "10:00 AM",
    title: "Registration & Welcome Reception",
    description: "Delegate kit distribution, badging, and warm traditional welcome.",
    category: "Registration",
    iconName: "UserCheck",
  },
  {
    time: "10:30 AM – 1:00 PM",
    title: "Onam Programmes",
    description: "Traditional celebrations, Pookkalam competition, and cultural performances by SMYM Youth.",
    category: "Cultural",
    iconName: "Sparkles",
  },
  {
    time: "1:00 PM – 2:00 PM",
    title: "Onam Feast (Sadhya) / Lunch",
    description: "Grand traditional Kerala Sadhya for all participants & guests.",
    category: "Food",
    iconName: "Utensils",
  },
  {
    time: "2:00 PM onwards",
    title: "EDESSA Youth Meet - Main Session",
    description: "Official inaugural ceremony, keynote session 'Called to Witness', interactive workshop, and dynamic youth power talk.",
    category: "Keynote",
    iconName: "Flame",
  },
  {
    time: "5:00 PM – 5:30 PM",
    title: "Tea Break & Refreshments",
    description: "Networking tea break, live music jam, and delegate interaction.",
    category: "Break",
    iconName: "Coffee",
  },
  {
    time: "5:30 PM – 6:00 PM",
    title: "Holy Rosary & Marian Devotion",
    description: "Solemn candlelit Marian Rosary session for spiritual strength.",
    category: "Spiritual",
    iconName: "Heart",
  },
  {
    time: "6:00 PM – 7:00 PM",
    title: "Closing Ceremonies & Musical Night",
    description: "Valedictory function, prize distribution, and energetic musical conclusion.",
    category: "Closing",
    iconName: "Music",
  },
];

export const RESOURCE_PERSONS = [
  {
    id: 1,
    name: "Rev. Fr. Joseph Vattathara",
    designation: "Youth Director & Renowned Motivational Speaker",
    bio: "Inspirational youth mentor with over 15 years of experience empowering young minds across Palai diocese.",
    topic: "Empowering Youth as Living Witnesses",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    badge: "Keynote Speaker",
  },
  {
    id: 2,
    name: "Dr. Anna Maria Kuriakose",
    designation: "Psychologist & Leadership Coach",
    bio: "Specializes in youth mental health, emotional resilience, and Christian leadership strategies in modern society.",
    topic: "Faith in the Digital Age: Standing Strong",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    badge: "Resource Person",
  },
  {
    id: 3,
    name: "Br. Thomas Chacko",
    designation: "Worship Leader & Gospel Musician",
    bio: "Acclaimed music minister leading youth retreats and worship experiences across Kerala.",
    topic: "Worship & Youth Culture",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    badge: "Session Lead",
  },
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "EDESSA Youth Gathering Highlight",
    type: "photo",
    category: "Highlights",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    caption: "Over 500 youth gathered in faith and fellowship",
  },
  {
    id: 2,
    title: "Holy Rosary & Candlelight Session",
    type: "photo",
    category: "Spiritual",
    url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800",
    caption: "Candlelight prayer session during EDESSA previous edition",
  },
  {
    id: 3,
    title: "Cultural Onam Celebrations",
    type: "photo",
    category: "Cultural",
    url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=800",
    caption: "Vibrant Onam celebration and traditional Pookkalam",
  },
  {
    id: 4,
    title: "Keynote Talk by Resource Person",
    type: "photo",
    category: "Sessions",
    url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
    caption: "Engaging youth speech on 'Called to Witness'",
  },
  {
    id: 5,
    title: "Worship Night Music Performance",
    type: "photo",
    category: "Cultural",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    caption: "Praise & Worship musical team live performance",
  },
  {
    id: 6,
    title: "SMYM Unit Volunteers Team",
    type: "photo",
    category: "Highlights",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    caption: "Organizing committee SMYM Chemmalamattom Unit team",
  },
];

export const SPONSORS_DATA = {
  titleSponsors: [
    { name: "Chemmalamattom Parish Trust", logo: "⛪", category: "Title Partner" },
    { name: "St. Thomas Enterprises", logo: "✝️", category: "Co-Sponsor" },
  ],
  goldSponsors: [
    { name: "Apostles Media & Print", logo: "📜", category: "Media Partner" },
    { name: "Highland Builders", logo: "🏗️", category: "Gold Sponsor" },
    { name: "Grace Bakes & Refreshments", logo: "☕", category: "Food Partner" },
  ],
  silverSponsors: [
    { name: "Royal Digital Studio", logo: "📷", category: "Photography Partner" },
    { name: "Kottayam Youth Forum", logo: "🌟", category: "Support Partner" },
    { name: "Mercy Healthcare Clinic", logo: "🏥", category: "Wellness Partner" },
  ]
};

export const CONTACT_INFO = {
  location: "12 Apostles Auditorium, Chemmalamattom, Kerala 686508",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.284394982618!2d76.7725843!3d9.6563721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07ce4a5db2293f%3A0x6b8408cf5796277b!2s12%20Apostles%20Auditorium%2C%20Chemmalamattom!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  contacts: [
    { title: "SMYM Unit President", name: "Albin Joseph", phone: "+91 94961 23456" },
    { title: "SMYM Unit Secretary", name: "Anju Augustine", phone: "+91 97452 87654" },
    { title: "Youth Convener", name: "Jobin K. Mani", phone: "+91 98473 11223" },
  ],
  email: "smymchemmalamattom@gmail.com",
  socials: {
    instagram: "https://instagram.com/smym_chemmalamattom",
    facebook: "https://facebook.com/smymchemmalamattom",
    youtube: "https://youtube.com/@smymchemmalamattom",
    whatsapp: "https://wa.me/919496123456",
  }
};
