import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

console.log("BASE URL:", import.meta.env.VITE_BACKEND_URL);
//created RTK QUERY
// const COURSE_API="http://${import.meta.env.VITE_BACKEND_URL}/api/v1/course"
const COURSE_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/course`;

export const courseApi=createApi({
    reducerPath:"courseApi",
    tagTypes:['Refetch_Creator_Course','Refetch_Lecture'],
    baseQuery:fetchBaseQuery({
        baseUrl:COURSE_API,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        createCourse:builder.mutation({
            query:({courseTitle,category})=>({
                url:"",
                method:"POST",  
                body:{courseTitle,category}
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),
        getSearchCourse:builder.query({
            query:({searchQuery,categories,sortByPrice})=>{
                //build query string
                let queryString=`/search?query=${encodeURIComponent(searchQuery)}`;

                //append category
                if(categories && categories.length>0){
                    const categoriesString=categories.map(encodeURIComponent).join(",");
                    queryString += `&categories=${categoriesString}`
                }

                //append sortByPrice if available
                if(sortByPrice){
                    queryString+=`&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }

                return {
                    url:queryString,
                    method:"GET",
                }
                
            }
        }),
        getPublishedCourse:builder.query({
            query:()=>({
                url:'/published-courses',
                method:"GET"
            }),
            providesTags:['Refetch_Creator_Course']
        }),
        getCreatorCourse:builder.query({
            query:()=>({
                url:"",
                method:"GET"
            }),
            providesTags:['Refetch_Creator_Course']
        }),
        editCourse:builder.mutation({
            query:({courseId,formData})=>({
                url:`/${courseId}`,
                method:"PUT",
                body:formData,
                formData:true,
            }),
            invalidatesTags:["Refetch_Creator_Course","Course"],
        }),
        getCourseById:builder.query({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:"GET",
            }),
            providesTags:['Course']
        }),
        createLecture:builder.mutation({
            query:({lectureTitle,courseId})=>({
                url:`/${courseId}/lecture`,
                method:"POST",
                body:{lectureTitle}
            }),
            invalidatesTags:['Course']
        }),
        getCourseLecture:builder.query({
            query:(courseId)=>({
                url:`/${courseId}/lecture`,
                method:"GET",
            }),
            providesTags:['Refetch_Lecture']
        }),
        editLecture:builder.mutation({
            query:({lectureTitle,videoInfo,isPreviewFree,courseId,lectureId})=>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:"POST",
                body:{lectureTitle,videoInfo,isPreviewFree}
            }),
            invalidatesTags:['Refetch_Lecture']
        }),
        removeLecture:builder.mutation({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`,
                method:"DELETE",
            }),
            invalidatesTags:['Refetch_Lecture']
        }),
        getLectureById:builder.query({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`,
                method:"GET"
            })
        }),
        publishCourse:builder.mutation({
            query:({courseId,query})=>({
                url:`/${courseId}?publish=${query}`,
                method:"PATCH",
            }),
            invalidatesTags: ['Course']
        }),
        removeCourse:builder.mutation({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:"DELETE"
            }),
            invalidatesTags:['Refetch_Creator_Course','Course']
        })
    }),
});

export const {
    useCreateCourseMutation,
    useGetSearchCourseQuery,
    useGetPublishedCourseQuery,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useRemoveCourseMutation
}=courseApi
