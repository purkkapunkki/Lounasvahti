interface Course {
  name: string;
  price: string;
  diets: string;
}

interface DailyMenu {
  courses: Course[];
}

interface DailyCourse {
  date: string;
  courses: Course[];
}

interface WeeklyMenu {
  days: DailyCourse[];
}

export type {Course, DailyMenu, WeeklyMenu};
