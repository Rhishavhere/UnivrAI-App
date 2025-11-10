export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "technical" | "cultural" | "sports" | "academic";
  organizer: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Tech Symposium 2024",
    description: "Annual technical symposium featuring workshops, hackathons, and tech talks from industry experts.",
    date: "2024-03-15",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    category: "technical",
    organizer: "CSE Department",
  },
  {
    id: "2",
    title: "AI/ML Workshop",
    description: "Hands-on workshop on Machine Learning algorithms and real-world applications.",
    date: "2024-03-20",
    time: "10:00 AM - 4:00 PM",
    location: "Lab 301",
    category: "technical",
    organizer: "Tech Club",
  },
  {
    id: "3",
    title: "Annual Sports Meet",
    description: "Inter-department sports competition including cricket, football, basketball and athletics.",
    date: "2024-03-25",
    time: "8:00 AM - 6:00 PM",
    location: "Sports Complex",
    category: "sports",
    organizer: "Sports Committee",
  },
  {
    id: "4",
    title: "Cultural Fest - Resonance",
    description: "Three-day cultural extravaganza with music, dance, drama and art competitions.",
    date: "2024-04-05",
    time: "9:00 AM - 9:00 PM",
    location: "Open Air Theatre",
    category: "cultural",
    organizer: "Cultural Committee",
  },
  {
    id: "5",
    title: "Guest Lecture: Future of Cloud Computing",
    description: "Distinguished lecture by AWS Solutions Architect on emerging cloud technologies.",
    date: "2024-03-18",
    time: "2:00 PM - 4:00 PM",
    location: "Seminar Hall",
    category: "academic",
    organizer: "CSE Department",
  },
];
