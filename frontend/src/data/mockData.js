// EDESSA Youth Meet Mock Data

export const EVENT_DETAILS = {
  title: "EDESSA",
  subtitle: "Called to Witness",
  organizer: "SMYM Chemmalamattom Unit",
  date: "25 August 2026",
  day: "Tuesday",
  targetDateStr: "2026-08-25T10:00:00+05:30",
  venue: "12 Apostles Auditorium, Chemmalamattom",
  time: "10:00 AM onwards",
  scriptureRef: "Isaiah 60:1",
  tagline: "Arise. Shine. Witness.",
  audience: "Only for Chemmalamattom Parish Youth",
  registrationFee: "Registration Required",
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
    title: "EDESSA Youth Meet – Main Session",
    description: "Official inaugural ceremony, keynote sessions, 'Called to Witness' programme, and dynamic youth talks by resource persons.",
    category: "Keynote",
    iconName: "Flame",
  },
  {
    time: "5:00 PM – 5:30 PM",
    title: "Tea Break & Refreshments",
    description: "Networking tea break, fellowship time, and delegate interaction.",
    category: "Break",
    iconName: "Coffee",
  },
  {
    time: "5:30 PM – 6:00 PM",
    title: "Holy Rosary & Marian Devotion",
    description: "Solemn candlelit Marian Rosary session – praying together for our families, youth, and nation.",
    category: "Spiritual",
    iconName: "Heart",
  },
  {
    time: "6:00 PM – 7:00 PM",
    title: "Closing Ceremonies",
    description: "Valedictory function, blessing, and musical closing night.",
    category: "Closing",
    iconName: "Music",
  },
];

export const RESOURCE_PERSONS = [
  {
    id: 1,
    name: "Fr. Joseph Kuzhinjalil",
    designation: "Vicar, St. Mary's Church, Edadu",
    bio: "A deeply inspiring shepherd of youth and faith, Fr. Joseph Kuzhinjalil serves as the Vicar of St. Mary's Church, Edadu. His vibrant homilies and pastoral care have ignited a passion for Christ among hundreds of young people in the diocese.",
    topic: "Called to Witness – Living the Gospel",
    image: "/edessa-youth-meet/assets/fr-joseph.jpg",
    badge: "Chief Resource Person",
    icon: "cross",
  },
  {
    id: 2,
    name: "Edwin Josy",
    designation: "Physics Educator | Leadership Consultant | Career Mentor",
    bio: "Edwin Josy is a celebrated Physics educator, renowned public speaker, leadership consultant, and career mentor who has guided thousands of youth toward their purpose and potential through faith-based leadership.",
    topic: "Arise & Shine – Leadership with Faith",
    image: "/edessa-youth-meet/assets/edwin-josy.jpg",
    badge: "Resource Person",
    icon: "star",
  },
  {
    id: 3,
    name: "Jose Vince",
    designation: "Teacher | Speaker | Motivator | Educational Mentor",
    bio: "Jose Vince is a passionate educator, motivational speaker, and educational mentor known for transforming young minds with practical wisdom, Christian values, and an unwavering commitment to excellence.",
    topic: "Witness – Your Life as a Testimony",
    image: "/edessa-youth-meet/assets/jose-vince.jpg",
    badge: "Resource Person",
    icon: "mic",
  },
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "EDESSA Youth Keynote Session",
    type: "photo",
    category: "Sessions",
    url: new URL("../assets/gallery_keynote_session.jpg", import.meta.url).href,
    caption: "Powerful keynote session with hundreds of Chemmalamattom Parish youth",
  },
  {
    id: 2,
    title: "Holy Rosary & Candlelight Prayer",
    type: "photo",
    category: "Spiritual",
    url: new URL("../assets/gallery_rosary_candlelight.jpg", import.meta.url).href,
    caption: "Solemn candlelit Holy Rosary session – praying together in faith",
  },
  {
    id: 3,
    title: "Onam Celebrations – Pookkalam",
    type: "photo",
    category: "Cultural",
    url: new URL("../assets/gallery_youth_onam.jpg", import.meta.url).href,
    caption: "Kerala youth celebrating Onam with vibrant Pookkalam at the church courtyard",
  },
  {
    id: 4,
    title: "Youth Prayer & Worship",
    type: "photo",
    category: "Spiritual",
    url: new URL("../assets/gallery_youth_worship.jpg", import.meta.url).href,
    caption: "Young hearts united in fervent prayer inside the sacred church",
  },
  {
    id: 5,
    title: "Praise & Worship Night",
    type: "photo",
    category: "Cultural",
    url: new URL("../assets/gallery_praise_worship.jpg", import.meta.url).href,
    caption: "Electrifying praise and worship session with youth singing for the Lord",
  },
  {
    id: 6,
    title: "SMYM Chemmalamattom Organizing Team",
    type: "photo",
    category: "Highlights",
    url: new URL("../assets/gallery_smym_team.jpg", import.meta.url).href,
    caption: "The dedicated SMYM Chemmalamattom Unit team – the heart of EDESSA 2026",
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
