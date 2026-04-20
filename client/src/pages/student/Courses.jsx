import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import Course from './Course';
import { useGetPublishedCourseQuery } from '@/features/api/courseApi';


const Courses = () => {
  const {data,isLoading,isError}=useGetPublishedCourseQuery();
  
  if(isError){
    return <h1>Some error occurred while fetching courses.</h1>
  }
  


  return (
    <div className="bg-gray-50 dark:bg-[#141414">
      <div className="max-w-7xl mx-auto p-6">
        
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses && data.courses.map((course, index) => <Course key={index} course={course} />)}

        </div>
      </div>
    </div>
  );
};

export default Courses;


const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
      <Skeleton className="w-full aspect-video" />
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        <Skeleton className="h-4 w-1/4" />

        <Skeleton className="h-4 w-10 mt-auto" />
      </div>
    </div>
  );
};
