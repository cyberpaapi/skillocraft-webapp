export type UserRole = 'ADMIN' | 'CUSTOMER';

export type LoginUser = {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: UserRole;
};

export type RegisterRequest = {
  name: string;
  contact: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: LoginUser;
};

export type BannerLocation = 'HOME' | 'COURSE' | 'SUCCESS_STORY' | 'REFER' | 'LIVE' | 'MARKET' | 'BLOG' | 'BLOG_DETAILS';

export interface BlogCardProps {
  imageSrc: string;
  tagText: string;
  title: string;
  titleLink: string;
  description: string;
}

export interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export interface CourseCardProps {
  // title: string;
  // description: string;
  // price: number;
  // rating: number;
  // students: number;
  // imageSrc: string;
  // href: string;
  imageSrc: string,
    badgeTextPrimary: string,
    badgeTextSecondary: string,
    title: string,
    titleLink: string,
    authorName: string,
    description: string,
    rating: number,
    featured:boolean |false;
    ratingCount: number,
    newPrice: string,
    oldPrice: string
}

export interface CreatorCardProps {
  name: string;
  role: string;
  imageSrc: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  imageSrc: string;
  rating: number;
}

export interface StoryCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  imageSrc: string;
  href: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
}
export interface BlogCardProps {
  imageSrc: string;
  tagText: string;
  title: string;
  titleLink: string;
  description: string;
}

export interface Testimony {
  review: string | null | undefined;
  user:User;
  message: string | null;
}

export type CourseStatus = 'published' | 'draft' | 'archived';
export type Status = 'ACTIVE' | 'INACTIVE';


interface CoursesTableProps {
  courses: Course[];
  category: string;
  isLoading?: boolean;
}

// export type Subcategory = {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   image: string;
//   category: {
//     id: string;
//     name: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// };

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  status: Status;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

export interface Course {
  id: string;
  name: string;
  imageLink: string;
  shortDescription: string;
  featured:boolean |false;
  status: Status;
  price: number;
  productCount: number;
  orderCount: number;
  creator: Creator;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subCategory: SubCategory;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  videoLink: string;
  duration?: number;
  formattedDuration?: string;
  thumbnail?: string;
  course?:{
    id: string;
    name: string;
    shortDescription: string;
    creator?:Creator;
    product?:ProductData[]    
  };
  status: Status;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductData {
  id: string;
  name: string;
  discription: string;
  courseId: string;
  videoLink: string;
  duration?: number;
  formattedDuration?: string;
  status: Status;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetails {
  id: string;
  name: string;
  imageLink: string;
  teaserVideo: string;
  shortDescription: string;
  featured: boolean;
  longDescription: string;
  price: string;
  discountedPrice?: string | null;
  language?: string;
  status: Status;
  creator: Creator;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  pdfLink?: string;
  category: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
  products: Product[];
  reviews: Review;
  similarCourses:{
    id: string,
    name: string,
    image: string,
    shortDescription: string,
    price: string,
    language: string,
    featured: boolean,
    rating: number,
    totalLessons: number
  }[]
}

export interface Review {
  count: number;
  data: ReviewData[];
}

export interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  customer: {
    id: string;
    name: string; // This contains the customer email
    user: {
      id: string;
      avatarUrl: string | null;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  imageLink: string;
  description: string;
  ratting:string;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  featured: boolean | false;
  icon?: string;
  status: Status;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  subCategory: SubCategory[];
}

export interface Banner {
  id: string;
  name: string;
  imageLink: string;
  description: string;
  status: Status;
  bannerLocation: BannerLocation;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCardProps {
  imageSrc: string;
  rating: number;
  name: string;
  description: string;
}

export interface BlogPost {
  id: string;
  category:Category;
  title: string;
  content: string;
  imageSrc: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
}

export interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  [key: string]: string | boolean | undefined; // Index signature for dynamic property access
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  profileImage: string;
}

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   instructor: string;
//   price: number;
//   rating: number;
//   students: number;
//   duration: string;
//   level: 'Beginner' | 'Intermediate' | 'Advanced';
//   category: Category;
//   image: string;
//   createdAt: string;
//   updatedAt: string;
// }


export interface BlogListResponseData {
  id: string;
  title: string;
  image: string;
  authorId: string;
  categoryId: string;
  shortDescription: string;
  longDesription: string;
  featured: boolean;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    imageLink: string;
  };
}

export interface BlogDetailsResponseData{
  id: string,
  title: string,
  image: string,
  authorId: string,
  categoryId: string,
  shortDescription: string,
  longDesription: string,
  featured: boolean,
  status: string,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  category: {
    id: string,
    name: string,
  },
  author: {
    id: string,
    name: string,
    imageLink: string,
  }
}

export interface Author {
  id: string;
  name: string;
  imageLink: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: Status;
}

export interface Creator {
    id: string;
    name: string;
    imageLink: string;
    designation: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  description: string;
  brand: string;
  earning: string;
  imageLink: string;
  coverPhoto: string;
  status: "ACTIVE" | "INACTIVE";
  category: Category
}

export interface UserDetailsCourse {
  id: string;
  name: string;
  price: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DiscountCoupon {
  id: string;
  couponId: string;
  amount: string;
  amountType: 'PERCENT' | 'FIXED';
}

export interface Order {
  id: string;
  customerId: string;
  totalAmount: string;
  paidAmount: string;
  transactionId: string;
  TransactionType: 'DEBIT' | 'CREDIT';
  paymentType: 'DEBITCARD' | 'CREDITCARD' | 'NETBNKING' | 'UPI' | 'WALLET';
  description: string;
  status: 'ACTIVE' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  course: UserDetailsCourse[];
  discountCoupon?: DiscountCoupon;
  customer?: {
    id: string;
    user: {
      id: string;
      email: string;
    };
  };
}

export interface WishlistItem {
  id: string;
  course: UserDetailsCourse;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  course: UserDetailsCourse;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerUser {
  id: string;
  email: string;
  contact: string;
  role: 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  user: CustomerUser;
  address: Address[];
}

export interface CourseCustomer {
  id: string;
  name: string;
  createdAt: string;
  user?: {
    email: string;
  };
  email: string;
  orderDate: string;
}

export interface CourseAnalytics {
  courseId: string;
  purchaseInfo: {
    hasPurchased: boolean;
    purchaseDate: string;
  };
  courseSummary: {
    totalVideoTime: number;
    totalVideoTimeFormatted: string;
    totalProductsAvailable: number;
    completedProducts: number;
    totalWatchTime: number;
    totalWatchTimeFormatted: string;
  };
  productProgress: {
    productId: string;
    productName: string;
    productDescription: string;
    videoLink: string;
    watchDuration: number;
    watchDurationFormatted: string;
    totalTime: number;
    totalTimeFormatted: string;
    completionRate: number;
    lastWatched: string | null;
    isCompleted: boolean;
    isWatched: boolean;
  }[];
}

export interface CourseFaq {
  id: string,
  question: string,
  answer: string,
  courseId: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  course: {
    id: string,
    name: string
  }
}

export interface GeneralFaq {
  id: string,
  question: string,
  answer: string,
  status: string,
  createdAt: string,
  updatedAt: string
}

export interface FeaturedBand {
  id: string,
  title: string,
  logo: string,
  description: string,
  status: string,
  createdAt: string,
  updatedAt: string
}

export interface FeatureGallery {
  id: string,
  title: string,
  imageLink: string,
  description:string,
  status: string,
  createdAt: string,
  updatedAt: string
}

export interface StaffRole {
  id: string,
  name: string,
  description: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  accessCount: number,
  StaffAccess: StaffAccess[]
  }

    export interface StaffAccess{
      id: string,
      routeName: string,
      status: string,
      createdAt: string,
      updatedAt: string
    }