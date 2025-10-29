export interface Instructor {
    name: string;
    email: string;
    avatar: string;
  }
  
  export interface Course {
    id: number;
    instructor: Instructor;
    title: string;
    category: string;
    requestDate: string;
    progress: number;
    status: string;
  }