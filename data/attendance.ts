export interface AttendanceRecord {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
}

export const attendanceData: Record<string, AttendanceRecord[]> = {
  "1MS21CS001": [
    {
      subjectCode: "CS601",
      subjectName: "Machine Learning",
      attended: 38,
      total: 45,
      percentage: 84,
    },
    {
      subjectCode: "CS602",
      subjectName: "DBMS",
      attended: 28,
      total: 35,
      percentage: 80,
    },
    {
      subjectCode: "CS603",
      subjectName: "Software Engineering",
      attended: 30,
      total: 35,
      percentage: 86,
    },
    {
      subjectCode: "CS604",
      subjectName: "Computer Networks",
      attended: 25,
      total: 35,
      percentage: 71,
    },
    {
      subjectCode: "CS605",
      subjectName: "Cloud Computing",
      attended: 18,
      total: 20,
      percentage: 90,
    },
  ],
  "1MS21CS002": [
    {
      subjectCode: "CS601",
      subjectName: "Machine Learning",
      attended: 43,
      total: 45,
      percentage: 96,
    },
    {
      subjectCode: "CS602",
      subjectName: "DBMS",
      attended: 33,
      total: 35,
      percentage: 94,
    },
    {
      subjectCode: "CS603",
      subjectName: "Software Engineering",
      attended: 34,
      total: 35,
      percentage: 97,
    },
    {
      subjectCode: "CS604",
      subjectName: "Computer Networks",
      attended: 32,
      total: 35,
      percentage: 91,
    },
    {
      subjectCode: "CS605",
      subjectName: "Cloud Computing",
      attended: 19,
      total: 20,
      percentage: 95,
    },
  ],
};
