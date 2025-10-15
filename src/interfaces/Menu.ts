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

export {Course, DailyMenu, WeeklyMenu};
