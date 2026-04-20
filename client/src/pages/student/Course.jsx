import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@radix-ui/react-avatar'
import React from 'react'
import { Link } from 'react-router-dom'

const Course = ({course}) => {

  return (
    <Link to={`/course-detail/${course._id}`}>
    <Card className="
      overflow-hidden 
      rounded-lg 
      dark:bg-gray-800 bg-white 
      shadow-lg transition-all duration-300
      md:hover:shadow-2xl md:hover:scale-105
      flex flex-col
    ">

      <div className='w-full h-40 overflow-hidden'>
          <img
        src={course?.courseThumbnail || "https://demo.dynamicpixel.co.in/theme/image.php/mb2nl/theme/1771328438/course-default"}
        alt="course"
        className="w-full h-full object-cover"
        key={course?.courseThumbnail}
      />
      </div>

      

      <CardContent className="px-5 py-4 flex flex-col flex-1 space-y-3">

        <h1 className="font-bold text-lg hover:underline line-clamp-2 min-h-14">
          {course?.courseTitle}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course?.creator?.photoUrl ||  "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{course?.creator?.name}</span>
          </div>

          <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
            {course?.courseLevel}
          </Badge>
        </div>

        <div className="mt-auto text-lg font-bold">
          ₹{course?.coursePrice}
        </div>

      </CardContent>
    </Card>
    </Link>
    
  )
}

export default Course
