import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditCourseMutation, useGetCourseByIdQuery, useGetCourseLectureQuery, usePublishCourseMutation, useRemoveCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params=useParams();
  const courseId=params.courseId;
  
  console.log("Course ID:", courseId);

  const {data:courseByIdData,isLoading:courseByIdLoading,refetch}=
  useGetCourseByIdQuery(courseId);

  const {data:lectureData}=
  useGetCourseLectureQuery(courseId);

  const [publishCourse,{}]
  =usePublishCourseMutation();

  const [removeCourse]=
  useRemoveCourseMutation();
  

  useEffect(() => {
    if (courseByIdData?.course) {
      const course=courseByIdData?.course;
      setInput({
        courseTitle: course.courseTitle ,
        subTitle: course.subTitle ,
        description: course.description,
        category: course.category ,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: ""
      });
    }
  }, [courseByIdData]); 


  const [previewThumbnail,setPreviewThumbnail]=useState("");

  const navigate=useNavigate();
  
  const [editCourse,{data,isLoading,isSuccess,error}]
  =useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory=(value)=>{
    setInput({...input,category:value});
  }
  const selectCourseLevel=(value)=>{
    setInput({...input,courseLevel:value});
  }

  const selectThumbnail=(e)=>{
    const file=e.target.files?.[0];
    if(file){
      setInput({...input,courseThumbnail:file});
      const fileReader=new FileReader();
      fileReader.onloadend=()=>setPreviewThumbnail(fileReader.result)
      fileReader.readAsDataURL(file);
    }
  }

  const updateCourseHandler=async()=>{
    const formData=new FormData();

    formData.append("courseTitle",input.courseTitle);
    formData.append("subTitle",input.subTitle);
    formData.append("description",input.description);
    formData.append("category",input.category);
    formData.append("courseLevel",input.courseLevel);
    formData.append("coursePrice",input.coursePrice);
    formData.append("file",input.courseThumbnail);


    await editCourse({formData,courseId});
    
  }

  const publishStatusHandler=async(action)=>{
    try {
      const response=await publishCourse({courseId,query:action});
      if(response.data){
        refetch();
        toast.success(response.data.message);
      }
    } catch (error){
      console.log(error);
        toast.error("Failed to publish or unpublish course.")
    }
  }

  const handleRemoveCourse=async()=>{
    try {
      await removeCourse(courseId).unwrap();
      toast.success("Course deleted successfully");

      //redirect after delete
      navigate("/admin/course");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete course.")
      
    }
  }

  useEffect(()=>{
    if(isSuccess){
      toast.success(data.message || "Course updated.");
    }
    if(error){
      toast.error(error?.data?.message || "Failed to update course.");
    }
  },[isSuccess,error])    
  
  if(courseByIdLoading)  return <Loader2 className='h-4 w-4 animate-spin'/>

  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button disabled={!lectureData?.lectures?.length } variant="outline" onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ? "false":"true")}>
            {courseByIdData?.course.isPublished? "Unpublished" : "Publish"}
          </Button>
          <Button onClick={handleRemoveCourse}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="EX. Fullstack developer"
            />
          </div>
        </div>
        <div className="space-y-4 mt-5">
          <div>
            <Label>SubTitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a FullStack developer from zero to hero in 2 months "
            />
          </div>
        </div>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="Enter price in INR"
                className="w-fit"
              />
            </div>
          </div>
          <div>
              <Label>Course Thumbnail</Label>
              <Input type="file" onChange={selectThumbnail} accept="image/*" className="w-fit" />
              {
                previewThumbnail && (
                  <img src={previewThumbnail} className="w-64 h-64 my-2 object-cover"  alt="Course Thumbnail" />
                )
              }
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => navigate("/admin/course")}>Cancel</Button>
              <Button disabled={isLoading} onClick={updateCourseHandler}>
                {
                  isLoading?(
                    <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    Please wait
                    </>
                  ):"Save"
                }
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
