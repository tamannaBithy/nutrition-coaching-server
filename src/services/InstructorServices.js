const fs = require("fs");
const path = require("path");
const InstructorModel = require("../models/InstructorModel");

/**
 * Service function to create a new instructor.
 * @param {string} userId - ID of the user creating the instructor.
 * @param {Object} instructorData - Data of the instructor to be created.
 * @param {Object} req - Request object containing files for image upload.
 * @returns {Object} - Result of the instructor creation process.
 */
exports.createInstructorService = async (userId, instructorData, req) => {
  try {
    // Destructure instructorData
    let {
      lang,
      instructor_name,
      instructor_qualification,
      instructor_details,
      visible,
    } = instructorData;

    // Create the instructor in the database
    const newInstructor = await InstructorModel.create({
      lang: lang || "en",
      image: "",
      instructor_name,
      instructor_qualification,
      instructor_details,
      visible,
      created_by: userId,
    });

    // Get the ID of the newly created instructor
    const newInstructorId = newInstructor._id;

    // Define paths for file manipulation
    const publicPath = path.join(__dirname, "../../public");

    const uploadDir = path.join(
      publicPath,
      "uploads/instructors",
      newInstructorId.toString()
    );

    // Check if an image was uploaded
    if (req.files && req.files.image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Extract and validate image file extension
      const photo = req.files.image;

      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(photo.name).toLowerCase();

      // Check if the file extension is allowed
      if (!allowedExtensions.includes(fileExtension)) {
        // Delete the instructor and return error message if file type is invalid
        await InstructorModel.findByIdAndDelete(newInstructorId);
        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Define the path for the uploaded image
      const photoPath = path.join(
        uploadDir,
        `${newInstructor.instructor_name}-instructor${fileExtension}`
      );

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading instructor image: ", err);
        }
      });

      // Update the instructor's image field in the database
      newInstructor.image = `/uploads/instructors/${newInstructorId.toString()}/${
        newInstructor.instructor_name
      }-instructor${fileExtension}`;
      await newInstructor.save();
    } else if (
      typeof req.body.image === "string" ||
      typeof req.body.image === "boolean" ||
      req.body.image === "" ||
      req.body.image === null ||
      req.body.image === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of image empty string
       */
      newInstructor.image = "";
    } else {
      newInstructor.image = "";
    }

    return {
      status: true,
      message: {
        en: "Instructor created successfully.",
        ar: "تم إنشاء المدرب بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to update an existing instructor.
 * @param {string} instructorId - ID of the instructor to be updated.
 * @param {Object} updatedData - Updated data for the instructor.
 * @param {Object} req - Request object containing files for image update.
 * @returns {Object} - Result of the instructor update process.
 */
exports.updateInstructorService = async (instructorId, updatedData, req) => {
  try {
    // Destructure updatedData
    const {
      lang,
      instructor_name,
      instructor_qualification,
      instructor_details,
      visible,
    } = updatedData;

    // Find the existing instructor by ID
    const existingInstructor = await InstructorModel.findById(instructorId);

    // Return error message if instructor not found
    if (!existingInstructor) {
      return {
        message: {
          en: "Instructor not found.",
          ar: "لم يتم العثور على المدرب",
        },
      };
    }

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Extracting the filename from the existing image URL
    const existingImageFilename = path.basename(existingInstructor.image);

    // Remove the existing image file and directory
    const existingImagePath = path.join(
      publicPath,
      "uploads/instructors",
      instructorId,
      existingImageFilename
    );

    if (fs.existsSync(existingImagePath)) {
      fs.unlinkSync(existingImagePath);
      console.log("Existing Image Deleted Successfully");
    }

    // Define the upload directory path
    const uploadDir = path.join(
      publicPath,
      "uploads/instructors",
      instructorId
    );

    if (req.files && req.files.image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Extract and validate image file extension
      const photo = req.files.image;

      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(photo.name).toLowerCase();

      // Check if the file extension is allowed
      if (!allowedExtensions.includes(fileExtension)) {
        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Define the updated filename
      const updatedInstructorName =
        instructor_name || existingInstructor.instructor_name;
      const photoPath = path.join(
        uploadDir,
        `${updatedInstructorName}-instructor${fileExtension}`
      );

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading instructor image: ", err);
        }
      });

      // Update the instructor's image field in the database
      existingInstructor.image = `/uploads/instructors/${instructorId}/${updatedInstructorName}-instructor${fileExtension}`;
    } else if (
      typeof req.body.image === "string" ||
      typeof req.body.image === "boolean" ||
      req.body.image === "" ||
      req.body.image === null ||
      req.body.image === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of image empty string
       */
      existingInstructor.image = existingInstructor.image;
    } else {
      existingInstructor.image = existingInstructor.image;
    }

    // Update the instructor's fields in the database
    (existingInstructor.lang = lang),
      (existingInstructor.instructor_name = instructor_name),
      (existingInstructor.instructor_qualification = instructor_qualification),
      (existingInstructor.instructor_details = instructor_details),
      (existingInstructor.created_by = req.user._id),
      (existingInstructor.visible = visible);

    await existingInstructor.save();

    return {
      status: true,
      message: {
        en: "Instructor updated successfully.",
        ar: "تم تحديث المدرب بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to delete an existing instructor.
 * @param {string} instructorId - ID of the instructor to be deleted.
 * @returns {Object} - Result of the instructor deletion process.
 */
exports.deleteInstructorService = async (instructorId) => {
  try {
    // Find the existing instructor by ID
    const existingInstructor = await InstructorModel.findById(instructorId);

    // Return error message if instructor not found
    if (!existingInstructor) {
      return {
        message: {
          en: "Instructor not found.",
          ar: "المدرب غير موجود",
        },
      };
    }

    // Remove the image file and directory
    if (fs.existsSync(existingInstructor.image)) {
      fs.unlinkSync(existingInstructor.image);
    }
    const uploadDir = path.join(
      __dirname,
      "../../public/uploads/instructors",
      instructorId
    );
    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the instructor from the database
    await InstructorModel.findByIdAndDelete(instructorId);

    return {
      status: true,
      message: {
        en: "Instructor deleted successfully.",
        ar: "تم حذف المدرب بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to retrieve all instructors for a specific language with pagination.
 * @param {Object} req - Request object containing pagination parameters.
 * @returns {Object} - Result of fetching all instructors with pagination information.
 */
exports.getAllInstructorService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Constants for pagination
    const showPerPage = req?.query.showPerPage
      ? parseInt(req?.query.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Aggregation matching stage
    const matchingStage = {
      $match: {
        visible: true,
        lang: langCode,
      },
    };

    // Aggregation stages
    const projectStage = {
      $project: {
        instructor_name: 1,
        instructor_qualification: 1,
        instructor_details: 1,
        image: 1,
        visible: 1,
      },
    };

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
    ];

    // Execute aggregation pipeline
    const allInstructor = await InstructorModel.aggregate([
      matchingStage,
      projectStage,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await InstructorModel.countDocuments({
      lang: langCode,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the range of items being displayed
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    // Return result with pagination information
    return {
      status: true,
      data: allInstructor,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: ` عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage: pageNo,
    };
  } catch (error) {
    console.error("Error fetching instructors", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to retrieve all instructors for administration with pagination and search.
 * @param {Object} req - Request object containing pagination and search parameters.
 * @returns {Object} - Result of fetching all instructors with pagination information for administration.
 */
exports.getAllInstructorForAdminService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Constants for pagination
    const showPerPage = req?.query.showPerPage
      ? parseInt(req?.query.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Extract searchKeyword from the request
    const searchKeyword = req?.query?.searchKeyword || "";

    // Aggregation matching stage
    const matchingStage = {
      $match: {
        lang: langCode,
        instructor_name: { $regex: searchKeyword, $options: "i" },
      },
    };

    // Aggregation stages
    const projectStage = {
      $project: {
        instructor_name: 1,
        instructor_qualification: 1,
        instructor_details: 1,
        image: 1,
        visible: 1,
      },
    };

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
    ];

    // Execute aggregation pipeline
    const allInstructor = await InstructorModel.aggregate([
      matchingStage,
      projectStage,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await InstructorModel.countDocuments({
      lang: langCode,
      instructor_name: { $regex: searchKeyword, $options: "i" },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the range of items being displayed
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    // Return result with pagination information
    return {
      status: true,
      data: allInstructor,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: ` عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage: pageNo,
    };
  } catch (error) {
    console.error("Error fetching instructors", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
