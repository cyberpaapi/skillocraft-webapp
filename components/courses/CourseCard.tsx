import Image from 'next/image';
import { Course } from '@/types';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BsCollectionPlay } from 'react-icons/bs';
import { imgSrc } from '@/lib/imgSrc';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const hasDiscount =
    course.discountedPrice != null &&
    parseFloat(String(course.discountedPrice)) > 0 &&
    parseFloat(String(course.discountedPrice)) < Number(course.price);

  // Shrink the category badge font when it contains a long word (e.g.
  // "Confectionary") so it doesn't get cut off on small screens.
  const longestCategoryWord = (course.category?.name || '')
    .split(/\s+/)
    .reduce((max, word) => Math.max(max, word.length), 0);
  const categorySizeClass = longestCategoryWord > 9 ? 'text-[9px]' : 'text-xs';
  return (
    <Link 
      href={`/courses/${course.id}`} 
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    >
      <div className="relative h-48 w-full bg-gradient-to-br from-primary/10 to-primary/5">
        <Image
          src={imgSrc(course.imageLink, '/courses_1.png')}
          alt={course.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`font-sans absolute top-2 right-2 bg-secondary text-white ${categorySizeClass} font-semibold px-2 py-1 rounded max-w-[calc(100%-1rem)] leading-tight break-words text-right`}>
          {course.category.name}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-secondary font-medium">{course.creator.name}</span>
          <div className="flex items-center font-sans text-primary">
            <FiStar className="fill-current mr-1" />
            {/* <span className="text-sm font-medium text-gray-700">{course.rating}</span> */}
          </div>
        </div>
        
        <h3 className="font-sans font-bold text-lg mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {course.name}
        </h3>
        
        <p className="font-sans font-normal text-gray-600 text-sm mb-4 line-clamp-2">
          {course.shortDescription}
        </p>
        
        <div className="font-sans flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <BsCollectionPlay className="mr-1" />
            <span>{course.productCount}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{hasDiscount ? course.discountedPrice : course.price}
            {hasDiscount && (
              <span className="ml-2 text-sm font-normal text-gray-400 line-through">₹{course.price}</span>
            )}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="group-hover:bg-secondary group-hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
            <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
