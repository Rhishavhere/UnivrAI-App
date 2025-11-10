export interface Department {
  name: string;
  head: string;
  email: string;
  phone: string;
  location: string;
}

export interface Facility {
  name: string;
  description: string;
  location: string;
  timings: string;
}

export interface CollegeInfo {
  name: string;
  established: number;
  address: string;
  phone: string;
  email: string;
  website: string;
  about: string;
  departments: Department[];
  facilities: Facility[];
}

export const collegeInfo: CollegeInfo = {
  name: "Modern Science College of Engineering",
  established: 1998,
  address: "123 Tech Park Road, Bangalore, Karnataka - 560001",
  phone: "+91 80 12345678",
  email: "info@msce.edu.in",
  website: "www.msce.edu.in",
  about: "Modern Science College of Engineering is a premier institution dedicated to excellence in technical education and research. With state-of-the-art facilities and distinguished faculty, we nurture innovative minds and shape future leaders in technology.",
  departments: [
    {
      name: "Computer Science and Engineering",
      head: "Dr. Ramesh Babu",
      email: "cse@msce.edu.in",
      phone: "+91 80 12345679",
      location: "Block A, 3rd Floor",
    },
    {
      name: "Electronics and Communication",
      head: "Dr. Lakshmi Narayan",
      email: "ece@msce.edu.in",
      phone: "+91 80 12345680",
      location: "Block B, 2nd Floor",
    },
    {
      name: "Mechanical Engineering",
      head: "Dr. Suresh Kumar",
      email: "mech@msce.edu.in",
      phone: "+91 80 12345681",
      location: "Block C, 1st Floor",
    },
    {
      name: "Civil Engineering",
      head: "Dr. Anand Rao",
      email: "civil@msce.edu.in",
      phone: "+91 80 12345682",
      location: "Block D, Ground Floor",
    },
  ],
  facilities: [
    {
      name: "Central Library",
      description: "Modern library with over 50,000 books, digital resources, and quiet study areas.",
      location: "Central Block",
      timings: "8:00 AM - 8:00 PM (Mon-Sat)",
    },
    {
      name: "Sports Complex",
      description: "Fully equipped sports facilities including indoor and outdoor courts.",
      location: "Behind Main Campus",
      timings: "6:00 AM - 7:00 PM",
    },
    {
      name: "Computer Labs",
      description: "Advanced computing labs with latest software and high-speed internet.",
      location: "Block A & B",
      timings: "9:00 AM - 5:00 PM",
    },
    {
      name: "Cafeteria",
      description: "Spacious dining area serving healthy and hygienic food.",
      location: "Ground Floor, Main Block",
      timings: "7:30 AM - 6:30 PM",
    },
  ],
};
