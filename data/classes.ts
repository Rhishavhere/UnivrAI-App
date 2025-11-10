export interface Class {
  id: string;
  name: string;
  code: string;
  instructor: string;
  schedule: {
    day: string;
    time: string;
    room: string;
  }[];
  credits: number;
}

export const classes: Class[] = [
  {
    id: "1",
    name: "Machine Learning",
    code: "CS601",
    instructor: "Dr. Priya Sharma",
    schedule: [
      { day: "Monday", time: "9:00 AM - 10:30 AM", room: "Lab 301" },
      { day: "Wednesday", time: "9:00 AM - 10:30 AM", room: "Lab 301" },
      { day: "Friday", time: "9:00 AM - 10:30 AM", room: "Lab 301" },
    ],
    credits: 4,
  },
  {
    id: "2",
    name: "Database Management Systems",
    code: "CS602",
    instructor: "Prof. Rajesh Kumar",
    schedule: [
      { day: "Tuesday", time: "11:00 AM - 12:30 PM", room: "Room 204" },
      { day: "Thursday", time: "11:00 AM - 12:30 PM", room: "Room 204" },
    ],
    credits: 3,
  },
  {
    id: "3",
    name: "Software Engineering",
    code: "CS603",
    instructor: "Dr. Anita Desai",
    schedule: [
      { day: "Monday", time: "2:00 PM - 3:30 PM", room: "Room 105" },
      { day: "Wednesday", time: "2:00 PM - 3:30 PM", room: "Room 105" },
    ],
    credits: 3,
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS604",
    instructor: "Prof. Vikram Singh",
    schedule: [
      { day: "Tuesday", time: "2:00 PM - 3:30 PM", room: "Lab 402" },
      { day: "Thursday", time: "2:00 PM - 3:30 PM", room: "Lab 402" },
    ],
    credits: 3,
  },
  {
    id: "5",
    name: "Cloud Computing",
    code: "CS605",
    instructor: "Dr. Meera Nair",
    schedule: [
      { day: "Friday", time: "11:00 AM - 12:30 PM", room: "Room 302" },
    ],
    credits: 3,
  },
];
