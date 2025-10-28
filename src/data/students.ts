export interface Student {
  usn: string;
  password: string;
  name: string;
  semester: number;
  branch: string;
  email: string;
  phone: string;
  section: string;
  cgpa: number;
}

export const studentsData: Student[] = [
  {
    usn: "1CR24AI104",
    password: "123",
    name: "Rhishav",
    semester: 3,
    branch: "B.E AIML",
    email: "rishav.aiml24@cmrit.ac.in",
    phone: "+91 9064942987",
    section: "B",
    cgpa: 8.5,
  },
  {
    usn: "1CR24AI100",
    password: "123",
    name: "Rajanya",
    semester: 6,
    branch: "Computer Science",
    email: "rajanya@campus.edu",
    phone: "+91 98765 43211",
    section: "A",
    cgpa: 9.2,
  },
];

export const classesInfo = {
    classes: {
      "Mon": {
        "day": "Mon",
        "subjects": [
          {
            "code": "CS601",
            "name": "Data Structures (DS)",
            "instructor": "Revathi S",
            "time": "8:00 AM to 9:00 AM",
            "room": "Block A, Room 301"
          },
          {
            "code": "CS603",
            "name": "Software Engineering",
            "instructor": "Dr. Emily Davis",
            "time": "2:00 PM to 3:30 PM",
            "room": "Block A, Room 405"
          }
        ]
      },
      "Tue": {
        "day": "Tue",
        "subjects": [
          {
            "code": "CS602",
            "name": "Operating System",
            "instructor": "Jhoshuva Sir",
            "time": "8:00 AM to 9:00 AM",
            "room": "D Block, Room LH102"
          },
          {
            "code": "CS602",
            "name": "Maths",
            "instructor": "Dr. Balaji C",
            "time": "9:00 AM to 10:00 AM",
            "room": "D Block, Room LH102"
          },
          {
            "code": "CS602",
            "name": "Data Structures Lab",
            "instructor": "Jhoshuva Sir",
            "time": "10:20 AM to 12:20 PM",
            "room": "D Block, Math Lab"
          },
          {
            "code": "CS602",
            "name": "Operating System",
            "instructor": "Jhoshuva Sir",
            "time": "1:00 PM to 2:00 PM",
            "room": "D Block, Room LH102"
          },
          {
            "code": "CS602",
            "name": "DDCO",
            "instructor": "Saurav Kumar",
            "time": "2:00 PM to 3:00 PM",
            "room": "D Block, Room LH102"
          },
          {
            "code": "CS602",
            "name": "Java",
            "instructor": "Ms Jeevathi R",
            "time": "3:00 PM to 4:00 PM",
            "room": "D Block, Room LH102"
          },
        ]
      },
      "Wed": {
        "day": "Wed",
        "subjects": [
          {
            "code": "CS601",
            "name": "Machine Learning",
            "instructor": "Dr. Sarah Johnson",
            "time": "9:00 AM to 10:00 AM",
            "room": "Block A, Room 301"
          },
          {
            "code": "CS603",
            "name": "Software Engineering",
            "instructor": "Dr. Emily Davis",
            "time": "2:00 PM to 3:30 PM",
            "room": "Block A, Room 405"
          }
        ]
      },
      "Thu": {
        "day": "Thu",
        "subjects": [
          {
            "code": "CS602",
            "name": "Operating System Lab",
            "instructor": "Sir Sachin",
            "time": "8:00 AM to 10:00 AM",
            "room": "D Block, Lab DL001"
          },
          {
            "code": "CS602",
            "name": "TYL Verbal",
            "instructor": "Ms Vinuta",
            "time": "10:20 AM to 11:20 AM",
            "room": "D Block, Room LH102"
          },
          {
            "code": "CS602",
            "name": "Data Structures",
            "instructor": "Revathi S",
            "time": "11:20 AM to 12:20 PM",
            "room": "D Block, Room LH102"
          },
          {
            "code": "CS602",
            "name": "DDCO",
            "instructor": "Saurav Kumar",
            "time": "01:00 PM to 02:20 PM",
            "room": "D Block, Room LH102"
          }
        ]
      },
      "Fri": {
        "day": "Fri",
        "subjects": [
          {
            "code": "CS601",
            "name": "Machine Learning",
            "instructor": "Dr. Sarah Johnson",
            "time": "9:00 AM to 10:00 AM",
            "room": "Block A, Room 301"
          }
        ]
      },
      "Sat": {
        "day": "Sat",
        "subjects": [
          {
            "code": "CS601",
            "name": "Machine Learning",
            "instructor": "Dr. Sarah Johnson",
            "time": "9:00 AM to 10:00 AM",
            "room": "Block A, Room 301"
          }
        ]
      }
    }
  }

export const campusInfo = {
  events: [
    {
      title: "TechFest 2025",
      date: "March 15-17, 2025",
      location: "Main Auditorium",
      description: "Annual technical festival featuring hackathons, workshops, and tech talks",
    },
    {
      title: "Industry Expert Lecture Series",
      date: "Every Friday, 4:00 PM",
      location: "Conference Hall",
      description: "Weekly lectures by industry professionals from leading tech companies",
    },
    {
      title: "Campus Placement Drive",
      date: "April 1-15, 2025",
      location: "Placement Cell",
      description: "On-campus recruitment by top companies",
    },
  ],
  facilities: [
    {
      name: "Central Library",
      timings: "8:00 AM - 10:00 PM",
      location: "Central Block",
    },
    {
      name: "Computer Labs",
      timings: "8:00 AM - 8:00 PM",
      location: "Block A & B",
    },
    {
      name: "Sports Complex",
      timings: "6:00 AM - 9:00 PM",
      location: "Near Main Gate",
    },
    {
      name: "Cafeteria",
      timings: "7:00 AM - 9:00 PM",
      location: "Ground Floor, Main Building",
    },
  ],
  tourSpots: [
    {
      name: "Main Entrance Gate",
      description: "The iconic entrance with the university name and emblem",
    },
    {
      name: "Central Library",
      description: "A modern 5-story library with over 100,000 books and digital resources",
    },
    {
      name: "Innovation Lab",
      description: "State-of-the-art facility for student projects and research",
    },
    {
      name: "Auditorium",
      description: "1500-seater auditorium for events, seminars, and performances",
    },
    {
      name: "Sports Complex",
      description: "Includes indoor and outdoor facilities for various sports",
    },
    {
      name: "Student Center",
      description: "Hub for student activities, clubs, and relaxation",
    },
  ],
};
