export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
}

export const emails: Email[] = [
  {
    id: "1",
    from: "CSE Department",
    fromEmail: "cse@msce.edu.in",
    subject: "Important: Mid-Term Exam Schedule",
    snippet: "Dear Students, The mid-term examination schedule has been published...",
    body: "Dear Students,\n\nThe mid-term examination schedule has been published on the college portal. Please check your respective subjects and timings. The exams will be conducted from March 15-20, 2024.\n\nAll the best!\n\nCSE Department",
    date: "2024-03-10",
    time: "10:30 AM",
    isRead: false,
  },
  {
    id: "2",
    from: "Library",
    fromEmail: "library@msce.edu.in",
    subject: "Book Return Reminder",
    snippet: "This is a friendly reminder that the following books are due...",
    body: "This is a friendly reminder that the following books are due for return by March 12, 2024:\n\n1. Design Patterns - Gang of Four\n2. Clean Code - Robert Martin\n\nPlease return them to avoid late fees.\n\nThank you,\nCentral Library",
    date: "2024-03-09",
    time: "2:15 PM",
    isRead: true,
  },
  {
    id: "3",
    from: "Tech Club",
    fromEmail: "techclub@msce.edu.in",
    subject: "Hackathon Registration Open",
    snippet: "We're excited to announce our annual 24-hour hackathon...",
    body: "We're excited to announce our annual 24-hour hackathon - CodeBlitz 2024!\n\nDate: March 22-23, 2024\nPrize Pool: ₹50,000\n\nRegister now at: hackathon.msce.edu.in\n\nLimited slots available!\n\nTech Club Team",
    date: "2024-03-08",
    time: "4:45 PM",
    isRead: false,
  },
  {
    id: "4",
    from: "Placement Cell",
    fromEmail: "placement@msce.edu.in",
    subject: "Campus Drive - TechCorp Inc.",
    snippet: "TechCorp Inc. will be conducting a campus recruitment drive...",
    body: "Dear Final Year Students,\n\nTechCorp Inc. will be conducting a campus recruitment drive on March 25, 2024.\n\nEligibility: CGPA > 7.0, No backlogs\nPackage: 6-8 LPA\n\nInterested students please register through the placement portal.\n\nPlacement Cell",
    date: "2024-03-07",
    time: "11:00 AM",
    isRead: true,
  },
  {
    id: "5",
    from: "Principal's Office",
    fromEmail: "principal@msce.edu.in",
    subject: "Annual Day Celebration",
    snippet: "We are pleased to invite you to our Annual Day celebration...",
    body: "We are pleased to invite you to our Annual Day celebration on March 30, 2024.\n\nTime: 5:00 PM onwards\nVenue: Open Air Theatre\n\nThe evening will feature cultural performances, award ceremonies, and a keynote address by our distinguished alumnus.\n\nYour presence will be highly appreciated.\n\nPrincipal",
    date: "2024-03-06",
    time: "9:00 AM",
    isRead: false,
  },
];
