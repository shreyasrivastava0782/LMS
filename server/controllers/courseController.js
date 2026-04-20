import { Course } from "../models/courseModel.js";
import { Lecture } from "../models/lectureModel.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if ((!courseTitle, !category)) {
      return res.status(400).json({
        message: "Course title and category is required",
      });
    }

    let courseThumbnail;

    if (req.file) {
      const uploaded = await uploadMedia(req.file.path);
      courseThumbnail = uploaded.secure_url;
    }

    const course = await Course.create({
      courseTitle,
      category: category.toLowerCase().replace(/\s+/g, ""),
      creator: req.id,
      courseThumbnail,
    });

    return res.status(200).json({
      course,
      message: "Course created.",
    });
  } catch (error) {
    console.log(error);
    return (
      res.status(500),
      json({
        message: "Failed to create course",
      })
    );
  }
};

// export const searchCourse = async (req, res) => {
//   try {
//     // const { query = "", categories = [], sortByPrice = "" } = req.query;
//     let { query = "", categories = [], sortByPrice = "" } = req.query;

//     // ensure categories is always array
//     if (typeof categories === "string") {
//       categories = [categories];
//     }


// // 🔥 normalize categories
// categories = categories.map(cat =>
//   cat.toLowerCase().replace(/\s+/g, "")
// );

//     //create search query
//     // const searchCriteria = {
//     //   isPublished: true,
//     //   $or: [
//     //     { courseTitle: { $regex: query, $options: "i" } },
//     //     { subTitle: { $regex: query, $options: "i" } },
//     //     { category: { $regex: query, $options: "i" } },
//     //   ],
//     // };
//     const searchCriteria = {
//       isPublished: true,
//     };

//     // apply search ONLY if query exists
//     if (query) {
//       searchCriteria.$or = [
//         { courseTitle: { $regex: query, $options: "i" } },
//         { subTitle: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } },
//       ];
//     }

//     //if categories are selected
//     // if(categories.length>0){
//     //     searchCriteria.category={$in:categories};
//     // }
//     if (categories.length > 0) {
//       searchCriteria.category = {
//         $in: categories.map(
//           (cat) => new RegExp(cat.replace(/\s+/g, ""), "i"), // remove spaces
//         ),
//       };
//     }

//     //define sorting order
//     const sortOptions = {};
//     if (sortByPrice === "low") {
//       sortOptions.coursePrice = 1; //ascending
//     } else if (sortByPrice === "high") {
//       sortOptions.coursePrice = -1; //descending
//     }

//     let courses = await Course.find(searchCriteria)
//       .populate({ path: "creator", select: "name photoUrl" })
//       .sort(sortOptions);

//     return res.status(200).json({
//       successs: true,
//       courses: courses || [],
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Failed to search courses",
//     });
//   }
// };


export const searchCourse = async (req, res) => {
  try {
    let { query = "", categories = [], sortByPrice = "" } = req.query;

    // ensure categories is always array
    if (typeof categories === "string") {
      categories = [categories];
    }

    // 🔥 normalize categories (VERY IMPORTANT)
    categories = categories.map(cat =>
      cat.toLowerCase().replace(/\s+/g, "")
    );

    // 🔥 base query
    const searchCriteria = {
      isPublished: true,
    };

    // 🔥 search text (ONLY if query exists)
    if (query) {
      searchCriteria.$or = [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
      ];
    }

    // 🔥 category filter (BEST WAY)
    if (categories.length > 0) {
      searchCriteria.category = {
        $in: categories
      };
    }

    // 🔥 sorting
    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    else if (sortByPrice === "high") sortOptions.coursePrice = -1;

    // 🔥 final query
    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });

  } catch (error) {
    console.log("Search Error:", error);
    return res.status(500).json({
      message: "Failed to search courses",
    });
  }
};


export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    return res.status(200).json({
      courses,
      message: "Courses fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Failed to get published courses",
      })
    
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
      message: "Courses  fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get creator courses",
    });
  }
};

// export const editCourse=async(req,res)=>{
//     try {
//         const courseId=req.params.courseId;
//         const {courseTitle,subTitle,category,description,courseLevel,coursePrice}=req.body;

//         const thumbnail=req.file;

//         // let course=await Course.findByIdAndUpdate(courseId);
//         let course=await Course.findById(courseId);

//         if(!course){
//             return res.status(404).json({
//                 message:"Course not found!"
//             })
//         }

//         let courseThumbnail = course.courseThumbnail;

//         if(thumbnail){
//             if(course.courseThumbnail){
//                 const publicId=course.courseThumbnail.split("/").pop().split(".")[0];
//                 //delete old image
//                 await deleteMediaFromCloudinary(publicId);

//             // upload new image
//             const uploaded = await uploadMedia(thumbnail.path);
//             courseThumbnail = uploaded.secure_url;

//             // //upload new thumbanail on cloudinary
//             // courseThumbnail=await uploadMedia(thumbnail.path);
//             }

//             const updateData={courseTitle,subTitle,category,description,courseLevel,coursePrice,courseThumbnail:courseThumbnail?.secure_url};

//             course=await Course.findByIdAndUpdate(courseId,updateData,{new:true});

//             return res.status(200).json({
//                 course,
//                 message:"Course updated successfully."
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to update course"
//         })
//     }
// }

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      category,
      description,
      courseLevel,
      coursePrice,
    } = req.body;

    const thumbnail = req.file;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    let courseThumbnail = course.courseThumbnail;

    // ✅ If new image uploaded
    if (thumbnail) {
      // delete old image if exists
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // ✅ ALWAYS upload new image
      const uploaded = await uploadMedia(thumbnail.path);
      courseThumbnail = uploaded.secure_url;
    }

    // ✅ ALWAYS update (even without image)
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseTitle,
        subTitle,
        category,
        description,
        courseLevel,
        coursePrice,
        courseThumbnail, // ✅ FIXED (no .secure_url here)
      },
      { new: true },
    );

    return res.status(200).json({
      course: updatedCourse,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("lectures")
      .populate("creator", "name");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    const course = await Course.findById(courseId);

    // ✅ FIRST check course
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });

    // ✅ THEN fix lectures array
    if (!course.lectures) {
      course.lectures = [];
    }

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully.",
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    //update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    //ensure the course still has the lecutre id if it was not already added;
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    //delete the lecture from cloudinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    //remove the lecture reference from the associated course
    await Course.updateOne(
      { lectures: lectureId }, //find the course that contains lecture
      { $pull: { lectures: lectureId } }, // remove the lecture id from lectures array
    );

    return res.status(200).json({
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture.",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture by id",
    });
  }
};

//publish unpublish course logic

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    //publish status based on the query parameter
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";

    return res.status(200).json({
      message: `Course ${statusMessage} successfully.`,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    //delete all lectures
    const lectures = await Lecture.find({ _id: { $in: course.lectures } });

    for (const lecture of lectures) {
      //delete video from cloudinary
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
    }

    await Lecture.deleteMany({ _id: { $in: course.lectures } });

    //delete thumbnail
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    //delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course and all lectures deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course.",
    });
  }
};
