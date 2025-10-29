// interface ICourseData {
//   order: number;
//   title: string;
//   description: string;
//   videoUrl: {
//     public_id: string;
//     url: string;
//   };
//   videoPlayer: string;
//   videoSection: string;
//   videoLength: number;
//   links: ILink[];
//   suggestion: string;
//   questions: IComment[];
//   quizzes: string[]; // Array of Quiz IDs
//   isCompleted: boolean;
//   isPublished: boolean;
//   isPublishedSection: boolean;
//   isFree: boolean;
//   sectionOrder: number;
//   lessonOrder: number;
// }

// export interface Course {
//   _id: string;
//   name: string;
//   subTitle?: string;
//   description?: string;
//   authorId: {
//     _id: string;
//     name: string;
//     email: string;
//     avatar?: {
//       public_id: string;
//       url: string;
//     };
//     profession: string;
//   };
//   price?: number;
//   estimatedPrice?: number;
//   thumbnail: {
//     public_id: string;
//     url: string;
//   };
//   tags?: string;
//   level: string; // Level ID
//   demoUrl?: {
//     public_id: string;
//     url: string;
//   };
//   benefits: Array<{ title: string }>;
//   prerequisites: Array<{ title: string }>;
//   reviews: IReview[];
//   courseData: ICourseData[];
//   rating: number;
//   purchased: number;
//   isPublished: boolean;
//   isFree: boolean;
//   category: string; // Category ID
//   subCategory?: string; // SubCategory ID
//   createdAt: string;
//   updatedAt: string;
// }

// export interface TeacherCourseCardProps {
//   course: Course;
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// }

// export interface StudentCourseCardProps {
//   course: Course;
//   onEnroll?: (id: string) => void;
// }

// export interface CourseFormData {
//   name: string;
//   subTitle?: string;
//   description?: string;
//   price?: number;
//   estimatedPrice?: number;
//   thumbnail: {
//     public_id: string;
//     url: string;
//   };
//   tags?: string;
//   level: string;
//   demoUrl?: {
//     public_id: string;
//     url: string;
//   };
//   benefits: Array<{ title: string }>;
//   prerequisites: Array<{ title: string }>;
//   category: string;
//   subCategory?: string;
// }

// interface IReviewReply {
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     role: string;
//     avatar?: string;
//   };
//   comment: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface IReview {
  _id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    avatar?: {
      thumbnail?: string;
      url?: string;
    };
    createdAt?: Date;
  };
  commentReplies?: Array<{
    user: {
      name: string;
      avatar: string;
    };
    comment: string;
  }>;
  createdAt?: Date;
}

interface ILink {
  title: string;
  url: string;
}

interface IComment {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  question: string;
  questionReplies: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
    answer: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface ISection {
  _id: string;
  title: string;
  order: number;
  lessons: ILesson[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ILesson {
  _id: string;
  order: number;
  title: string;
  description?: string;
  videoUrl: {
    public_id: string;
    url: string;
  };
  videoPlayer?: string;
  videoLength?: number; // in minutes
  links?: ILink[];
  suggestion?: string;
  questions?: IComment[];
  quizzes?: string[]; // quiz IDs
  isCompleted?: boolean;
  isPublished?: boolean;
  isFree?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Course {
  _id: string;
  name: string;
  subTitle?: string;
  description?: string;
  overview?: string;
  price?: number;
  estimatedPrice?: number;
  thumbnail: { url: string };
  tags?: string[];
  level?: string | { _id: string; name: string } | null;
  demoUrl?: {
    public_id: string;
    url: string;
  };
  benefits: Array<{ title: string }>;
  prerequisites: Array<{ title: string }>;
  reviews: IReview[];
  sections: ISection[]; // Refactored: replaces `courseData`
  rating: number;
  purchased: number;
  isPublished: boolean;
  isFree: boolean;
  category?: string | { _id: string; title: string } | null;
  subCategory?: string | { _id: string; title: string } | null;
  duration?: number;
  durationText?: string;
  isDraft?: boolean;
  createdAt: string;
  updatedAt: string;
  publisher: {
    _id: string;
    name: string;
    avatar: {
      public_id: string;
      url: string;
    };
    email: string;
    profession: string;
    description: string;
    rating: number;
    students: number;
    courses: number;
    role?: string;
  };
}

// export interface CourseDetail {
//   _id: string;
//   name: string;
//   subTitle?: string;
//   description?: string;
//   overview: string;
//   topics: string[];
//   thumbnail: {
//     public_id: string;
//     url: string;
//   };
//   demoUrl?: {
//     public_id: string;
//     url: string;
//   };
//   price?: number;
//   estimatedPrice?: number;
//   isFree: boolean;
//   purchased?: number;
//   rating?: number;
//   totalLessons?: number;
//   durationText?: string;
//   level?: {
//     _id: string;
//     name: string;
//   };
//   category?: string;
//   subCategory?: string;

//   publisher: {
//     _id: string;
//     name: string;
//     email: string;
//     avatar: {
//       public_id: string;
//       url: string;
//     };
//     uploadedCourses?: Array<{ _id: string }>;
//     profession: string;
//     introduce?: string;
//     rating?: number;
//     reviews?: number;
//     students?: number;
//     courses?: number;
//     updatedAt?: Date;
//   };

//   sections: Array<{
//     _id: string;
//     title: string;
//     order: number;
//     isPublished: boolean;
//     lessons: Array<{
//       _id: string;
//       title: string;
//       order: number;
//       isPublished: boolean;
//       isFree: boolean;
//       videoUrl?: {
//         public_id: string;
//         url: string;
//       };
//     }>;
//   }>;

//   reviews: Array<{
//     _id: string;
//     rating: number;
//     comment: string;
//     user: {
//       name: string;
//       avatar: string;
//     };
//     commentReplies?: Array<{
//       user: {
//         name: string;
//         avatar: string;
//       };
//       comment: string;
//     }>;
//   }>;
// }
