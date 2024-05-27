const fs = require("fs");
const path = require("path");
const BlogModel = require("../models/BlogModel");

/**
 * Service function to create a new blog.
 * @param {string} userId - ID of the user creating the blog.
 * @param {Object} blogData - Data for the new blog.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the blog creation process.
 */
exports.createBlogService = async (userId, blogData, req) => {
  try {
    let { blog_title, blog_description, tags, lang } = blogData;

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // Create a new blog entry in the database
    const newBlog = await BlogModel.create({
      blog_image: "",
      blog_title,
      blog_description,
      tags,
      created_by: userId,
      lang: lang || "en",
    });

    const newBlogId = newBlog._id;

    // Define the path for uploading files
    const publicPath = path.join(__dirname, "../../public");
    const uploadDir = path.join(
      publicPath,
      "uploads/blogs",
      newBlogId.toString()
    );

    // Check if there is an image file in the request
    if (req.files && req.files.blog_image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photo = req.files.blog_image;

      // Define allowed file extensions
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      // Get the file extension of the uploaded image
      const fileExtension = path.extname(photo.name).toLowerCase();

      // Check if the file extension is allowed
      if (!allowedExtensions.includes(fileExtension)) {
        // If the file extension is not allowed, delete the newly created blog entry
        await BlogModel.findByIdAndDelete(newBlogId);

        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Define the path where the image will be saved
      const photoPath = path.join(
        uploadDir,
        `${newBlog.blog_title.slice(0, 10)}-blog${fileExtension}`
      );

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading blog image: ", err);
        }
      });

      // Set the path to the image in the new blog entry
      newBlog.blog_image = `/uploads/blogs/${newBlogId.toString()}/${newBlog.blog_title.slice(
        0,
        10
      )}-blog${fileExtension}`;
    } else if (
      typeof req.body.blog_image === "string" ||
      typeof req.body.blog_image === "boolean" ||
      req.body.blog_image === "" ||
      req.body.blog_image === null ||
      req.body.blog_image === undefined
    ) {
      // If the image is not uploaded but provided in other forms (string, boolean, empty, null, undefined), set the blog image to empty string
      newBlog.blog_image = "";
    } else {
      // If no image is provided, set the blog image to empty string
      newBlog.blog_image = "";
    }

    // Save the new blog entry
    await newBlog.save();

    return {
      status: true,
      message: {
        en: "Blog created successfully.",
        ar: "تم إنشاء المدونة بنجاح",
      },
    };
  } catch (error) {
    // If an error occurs during the process, log the error and return an error message
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
 * Service function to update an existing blog.
 * @param {string} blogId - ID of the blog to be updated.
 * @param {Object} updatedData - Updated data for the blog.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the blog update process.
 */
exports.updateBlogService = async (blogId, updatedData, req) => {
  try {
    let { blog_title, blog_description, tags, lang } = updatedData;

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // Find the existing blog by its ID
    const existingBlog = await BlogModel.findById(blogId);

    // If the blog doesn't exist, return an error message
    if (!existingBlog) {
      return {
        message: {
          en: "Blog not found.",
          ar: "المدونة غير موجودة",
        },
      };
    }

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Extract the filename from the existing image URL
    const existingImageFilename = path.basename(existingBlog.blog_image);

    // Remove the existing image file and directory
    const existingImagePath = path.join(
      publicPath,
      "uploads/blogs",
      blogId,
      existingImageFilename
    );

    if (fs.existsSync(existingImagePath)) {
      fs.unlinkSync(existingImagePath);
      console.log("Existing Image Deleted Successfully");
    }

    // Define the directory for uploading files
    const uploadDir = path.join(publicPath, "uploads/blogs", blogId);

    // Check if there is a new image file in the request
    if (req.files && req.files.blog_image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photo = req.files.blog_image;

      // Define allowed file extensions
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      // Get the file extension of the uploaded image
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

      // Define the updated blog name based on the request or keep the existing one
      const updatedBlogName = blog_title || existingBlog.blog_title;

      // Define the path where the image will be saved
      const photoPath = path.join(
        uploadDir,
        `${updatedBlogName.slice(0, 10)}-blog${fileExtension}`
      );

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading blog image: ", err);
        }
      });

      // Set the path to the image in the existing blog entry
      existingBlog.blog_image = `/uploads/blogs/${blogId}/${updatedBlogName.slice(
        0,
        10
      )}-blog${fileExtension}`;
    } else if (
      // If the image is not uploaded but provided in other forms (string, boolean, empty, null, undefined), keep the existing image URL
      typeof req.body.blog_image === "string" ||
      typeof req.body.blog_image === "boolean" ||
      req.body.blog_image === "" ||
      req.body.blog_image === null ||
      req.body.blog_image === undefined
    ) {
      existingBlog.blog_image = existingBlog.blog_image;
    } else {
      existingBlog.blog_image = existingBlog.blog_image;
    }

    // Update the existing blog with the new data
    existingBlog.blog_title = blog_title;
    existingBlog.blog_description = blog_description;
    existingBlog.tags = tags;
    existingBlog.lang = lang || "en";
    existingBlog.created_by = req.user._id;

    // Save the updated blog entry
    await existingBlog.save();

    return {
      status: true,
      message: {
        en: "Blog updated successfully.",
        ar: "تم تحديث المدونة بنجاح",
      },
    };
  } catch (error) {
    // If an error occurs during the process, log the error and return an error message
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
 * Service function to delete an existing blog.
 * @param {string} blogId - ID of the blog to be deleted.
 * @returns {Object} - Result of the blog deletion process.
 */
exports.deleteBlogService = async (blogId) => {
  try {
    // Find the existing blog by its ID
    const existingBlog = await BlogModel.findById(blogId);

    // If the blog doesn't exist, return an error message
    if (!existingBlog) {
      return {
        message: {
          en: "Blog not found.",
          ar: "المدونة غير موجودة",
        },
      };
    }

    // Remove the image file and directory if they exist
    if (fs.existsSync(existingBlog.blog_image)) {
      fs.unlinkSync(existingBlog.blog_image);
    }
    const uploadDir = path.join(
      __dirname,
      "../../public/uploads/blogs",
      blogId
    );
    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the blog entry from the database
    await BlogModel.findByIdAndDelete(blogId);

    return {
      status: true,
      message: {
        en: "Blog deleted successfully.",
        ar: "تم حذف المدونة بنجاح",
      },
    };
  } catch (error) {
    // If an error occurs during the process, log the error and return an error message
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
 * Service function to retrieve all blogs with pagination and search.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing paginated and filtered blogs.
 */
exports.getAllBlogService = async (req) => {
  try {
    // Extract language code from the request query
    const langCode = req?.query?.langCode;

    // Extract page number and items per page from the request query
    const pageNo = parseInt(req?.query?.pageNo) || 1;
    const showPerPage = parseInt(req?.query?.showPerPage) || 10;

    // Calculate the skip value for pagination
    const skip = (pageNo - 1) * showPerPage;

    // Extract search keyword from the request query
    const searchKeyword = req?.query?.searchKeyword || "";

    // Create a match stage for global search
    const matchStage = {
      $match: {
        $or: [
          { blog_title: { $regex: searchKeyword, $options: "i" } },
          { blog_description: { $regex: searchKeyword, $options: "i" } },
        ],
        lang: langCode, // Filter by language code
      },
    };

    // Get the total count of all blogs with search filter
    const totalDataCount = await BlogModel.countDocuments(matchStage.$match);

    // Get paginated blogs with search filter
    const allBlogs = await BlogModel.aggregate([
      matchStage,
      {
        $project: {
          blog_title: 1,
          blog_description: 1,
          tags: 1,
          blog_image: 1,
          lang: 1,
          createdAt: 1,
        },
      },
      { $skip: skip },
      { $limit: showPerPage },
    ]);

    // Calculate pagination details
    const totalPages = Math.ceil(totalDataCount / showPerPage);
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);
    const currentPage = pageNo;

    // Return success message with pagination details
    return {
      status: true,
      data: allBlogs,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage,
    };
  } catch (error) {
    // Handle any unexpected errors
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
 * Service function to retrieve a single blog by ID.
 * @param {string} blogId - ID of the blog to be retrieved.
 * @returns {Object} - Result containing the single blog.
 */
exports.getSingleBlogService = async (blogId) => {
  try {
    // Find the blog by its ID and project only necessary fields
    const singleBlog = await BlogModel.findById(blogId, {
      blog_title: 1,
      blog_description: 1,
      tags: 1,
      blog_image: 1,
      createdAt: 1,
    });

    // If the blog is not found, return an error message
    if (!singleBlog) {
      return {
        message: {
          en: "Blog not found.",
          ar: "المدونة غير موجودة",
        },
      };
    }

    // Return success message with the blog data
    return { status: true, data: singleBlog };
  } catch (error) {
    // Handle any unexpected errors
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
 * Service function to retrieve all blogs for admin users with pagination and search.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing paginated and filtered blogs for admin users.
 */
exports.getAllBlogsForAdminService = async (req) => {
  try {
    // Extract language code from the request query
    const langCode = req?.query?.langCode;

    // Extract page number and items per page from the request query
    const pageNo = parseInt(req?.query?.pageNo) || 1;
    const showPerPage = parseInt(req?.query?.showPerPage) || 10;

    // Calculate the skip value for pagination
    const skip = (pageNo - 1) * showPerPage;

    // Extract search keyword from the request query
    const searchKeyword = req?.query?.searchKeyword || "";

    // Create a match stage for global search
    const matchStage = {
      $match: {
        $or: [
          { blog_title: { $regex: searchKeyword, $options: "i" } },
          { blog_description: { $regex: searchKeyword, $options: "i" } },
        ],
        lang: langCode, // Filter by language code
      },
    };

    // Get the total count of all blogs with search filter
    const totalDataCount = await BlogModel.countDocuments(matchStage.$match);

    // Get paginated blogs with search filter
    const allBlogs = await BlogModel.aggregate([
      matchStage,
      {
        $project: {
          blog_title: 1,
          blog_description: 1,
          tags: 1,
          blog_image: 1,
          lang: 1,
          createdAt: 1,
        },
      },
      { $skip: skip },
      { $limit: showPerPage },
    ]);

    // Calculate pagination details
    const totalPages = Math.ceil(totalDataCount / showPerPage);
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);
    const currentPage = pageNo;

    // Return success message with pagination details
    return {
      status: true,
      data: allBlogs,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage,
    };
  } catch (error) {
    // Handle any unexpected errors
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
