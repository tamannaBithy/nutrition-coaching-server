const CustomizedMealMenuModel = require("../models/CustomizedMealMenuModel");
const fs = require("fs");
const path = require("path");
const UserInputsForCustomizedMeal = require("../models/UserInputsForCustomizedMealModel");
const { ObjectId } = require("mongoose").Types;

/**
 * Service function to handle the creation of a customized meal menu.
 * @param {Object} mealData - Data for the customized meal menu.
 * @param {Object} req - Request object containing files for image upload.
 * @returns {Object} - Result of the customized meal menu creation process.
 */
exports.customizedMealService = async (mealData, req) => {
  try {
    // Destructure mealData
    let {
      lang,
      image,
      meal_name,
      tags,
      protein,
      fadd,
      carbs,
      prp,
      prc,
      prf,
      mf,
      sf,
      of,
      fmf,
      select_diet,
      ingredients,
      heating_instruction,
      visible,
    } = mealData;

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // Create the customized meal menu in the database
    const newMealMenu = await CustomizedMealMenuModel.create({
      lang: lang || "en",
      image: "",
      meal_name: meal_name.toLowerCase(),
      tags,
      protein,
      fadd,
      carbs,
      prp,
      prc,
      prf,
      mf,
      sf,
      of,
      fmf,
      select_diet,
      ingredients,
      heating_instruction,
      visible,
    });

    // Get the ID of the newly created meal menu
    const newMealId = newMealMenu?._id;

    // Get the ID of the newly created meal menu
    const publicPath = path.join(__dirname, "../../public");

    const uploadDir = path.join(
      publicPath,
      "uploads/customizedMeals",
      newMealId.toString()
    );

    // Check if files were uploaded
    if (req.files) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // // Handle images field (if present)
      if (req.files && req.files.image) {
        const mealImage = req.files.image;

        // Define allowed file extensions for the meal menu image
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

        const fileExtension = path.extname(mealImage.name).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          // Delete the newly created meal menu if the file type is invalid
          await CustomizedMealMenuModel.findByIdAndDelete(newMealId);

          return {
            message: {
              en: "Invalid file type. Only image files are allowed.",
              ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
            },
          };
        }

        // Generate a unique image name using the meal_name and incrementing string
        const uniqueImageName = `${meal_name}${fileExtension}`;

        // Define the path for the uploaded meal menu image
        const photoPath = path.join(uploadDir, uniqueImageName);

        // Move the uploaded image to the specified path
        mealImage.mv(photoPath, (err) => {
          if (err) {
            console.log("Error uploading meal menu image: ", err);
          }
        });

        // Update the meal menu with the image path
        newMealMenu.image = `/uploads/customizedMeals/${newMealId.toString()}/${uniqueImageName}`;
      }
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
      newMealMenu.image = "";
    } else {
      newMealMenu.image = "";
    }

    // Save the updated meal menu to the database
    await newMealMenu.save();

    return {
      status: true,
      message: {
        en: "Customized Meal Menu created successfully.",
        ar: "تم إنشاء قائمة الوجبات المخصصة بنجاح",
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
 * Service function to delete a customized meal menu and its associated images.
 * @param {string} mealMenuId - The ID of the customized meal menu to delete.
 * @returns {Object} - Result of the deletion process.
 */
exports.deleteCustomizedMealService = async (mealMenuId) => {
  try {
    // Fetch the Main Meal Menu by ID from the database
    const mealMenu = await CustomizedMealMenuModel.findById(mealMenuId);

    // Check if the meal menu exists
    if (!mealMenu) {
      return {
        status: false,
        message: {
          en: "Customized Meal Menu not found.",
          ar: "لم يتم العثور على قائمة الوجبات المخصصة",
        },
      };
    }

    // Remove the images and their directories
    const uploadDir = path.join(
      __dirname,
      `../../public/uploads/customizedMeals/${mealMenuId}`
    );

    // Define the path for storing meal menu images
    if (fs.existsSync(uploadDir)) {
      // Remove all images in the directory
      fs.readdirSync(uploadDir).forEach((file) => {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
      });
      // Remove the upload directory itself
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the Main Meal Menu from the database
    await CustomizedMealMenuModel.findByIdAndDelete(mealMenuId);

    return {
      status: true,
      message: {
        en: "Customized Meal Menu deleted successfully.",
        ar: "تم حذف قائمة الوجبات المخصصة بنجاح",
      },
    };
  } catch (error) {
    console.error("Error deleting Customized Meal Menu", error);
    return {
      success: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to retrieve all customized meal menus based on the provided language code and pagination parameters.
 * @param {Object} req - The request object containing query parameters.
 * @returns {Object} - Result containing customized meal menus with pagination details.
 */
exports.getAllCustomizedMealService = async (req) => {
  try {
    // Extract language code, page number, and items per page from request query parameters
    const langCode = req?.query?.langCode;
    const pageNo = parseInt(req?.query?.pageNo) || 1;
    const showPerPage = parseInt(req?.query?.showPerPage) || 10;

    const pipeline = [
      {
        $match: { customer_details: req.user._id },
      },
      {
        $project: { category: 1, _id: 0 },
      },
    ];

    const userMealCategory = await UserInputsForCustomizedMeal.aggregate(
      pipeline
    );

    const mealCategory = userMealCategory[0]?.category;

    // Calculate the number of documents to skip for pagination
    const skip = (pageNo - 1) * showPerPage;

    // Count total documents matching the language code
    const totalDataCount = await CustomizedMealMenuModel.countDocuments({
      lang: langCode,
      select_diet: mealCategory,
      visible: true,
    });

    // Aggregate to fetch customized meal menus based on language code, skip, and limit
    const allMeals = await CustomizedMealMenuModel.aggregate([
      {
        $match: {
          select_diet: mealCategory,
          lang: langCode,
          visible: true,
        },
      },
      {
        $project: {
          lang: 1,
          image: 1,
          select_diet: 1,
          meal_name: 1,
          tags: 1,
          protein: 1,
          fadd: 1,
          carbs: 1,
          prp: 1,
          prc: 1,
          prf: 1,
          mf: 1,
          sf: 1,
          of: 1,
          fmf: 1,
          ingredients: 1,
          heating_instruction: 1,
          visible: 1,
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

    return {
      success: true,
      data: allMeals,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

/**
 * Service function to retrieve a single customized meal menu by its ID.
 * @param {string} mealMenuId - The ID of the customized meal menu to retrieve.
 * @returns {Object} - Result containing the retrieved customized meal menu or error message.
 */
exports.getSingleCustomizedMealService = async (mealMenuId) => {
  try {
    // Validate if mealMenuId is a valid ObjectId
    if (!ObjectId.isValid(mealMenuId)) {
      return {
        success: false,
        message: {
          en: "Invalid Customized Meal Menu ID.",
          ar: "معرف قائمة الوجبات المخصصة غير صالح",
        },
      };
    }

    // Convert mealMenuId to ObjectId
    const mealMenuObjectId = new ObjectId(mealMenuId);

    // Aggregate query to find the customized meal menu by its ID
    const customizedMealMenu = await CustomizedMealMenuModel.aggregate([
      {
        $match: {
          _id: mealMenuObjectId,
        },
      },
    ]);

    // Check if the customized meal menu exists
    if (!customizedMealMenu || customizedMealMenu.length === 0) {
      return {
        success: false,
        message: {
          en: "Customized Meal Menu not found.",
          ar: "لم يتم العثور على قائمة الوجبات المخصصة",
        },
      };
    }

    // Return the retrieved customized meal menu
    return { success: true, data: customizedMealMenu[0] };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to retrieve all customized meal menus for admin purposes.
 * @param {Object} req - The request object containing query parameters like langCode, pageNo, and showPerPage.
 * @returns {Object} - Result containing an array of customized meal menus, pagination details, and success status or error message.
 */
exports.getAdminCustomizedMealService = async (req) => {
  try {
    // Extract query parameters
    const langCode = req?.query?.langCode;
    const pageNo = parseInt(req?.query?.pageNo) || 1;
    const showPerPage = parseInt(req?.query?.showPerPage) || 10;
    const searchKeyword = req?.query?.searchKeyword || "";

    // Calculate pagination skip value
    const skip = (pageNo - 1) * showPerPage;

    // Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          lang: langCode,
          ...(searchKeyword && {
            $or: [{ meal_name: { $regex: searchKeyword, $options: "i" } }],
          }),
        },
      },
      {
        $project: {
          lang: 1,
          image: 1,
          select_diet: 1,
          meal_name: 1,
          tags: 1,
          protein: 1,
          fadd: 1,
          carbs: 1,
          prp: 1,
          prc: 1,
          prf: 1,
          mf: 1,
          sf: 1,
          of: 1,
          fmf: 1,
          ingredients: 1,
          heating_instruction: 1,
          visible: 1,
        },
      },
      { $skip: skip },
      { $limit: showPerPage },
    ];

    // Count total number of customized meal menus
    const totalDataCountQuery = {
      lang: langCode,
      ...(searchKeyword && {
        $or: [{ meal_name: { $regex: searchKeyword, $options: "i" } }],
      }),
    };
    const totalDataCount = await CustomizedMealMenuModel.countDocuments(
      totalDataCountQuery
    );

    // Retrieve customized meal menus with pagination
    const allMeals = await CustomizedMealMenuModel.aggregate(pipeline);

    // Calculate pagination details
    const totalPages = Math.ceil(totalDataCount / showPerPage);
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);
    const currentPage = pageNo;

    return {
      success: true,
      data: allMeals,
      totalDataCount,
      totalPages: pageArray,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
      currentPage,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};

/**
 * Service function to update the visibility status of a customized meal menu.
 * @param {Object} mealData - The data containing the visibility status to be updated.
 * @param {string} mealMenuId - The ID of the customized meal menu to be updated.
 * @returns {Object} - Result indicating the success status of the update operation and a corresponding message.
 */
exports.updateCustomizedMealService = async (mealData, mealMenuId) => {
  try {
    // Extract visibility status from mealData
    const { visible } = mealData;

    // Find the existing Main Meal Menu by ID
    const existingMealMenu = await CustomizedMealMenuModel.findById(mealMenuId);
    // Check if the Main Meal Menu exists
    if (!existingMealMenu) {
      return {
        status: false,
        message: {
          en: "Main Meal Menu not found.",
          ar: "قائمة الوجبات الرئيسية غير موجودة",
        },
      };
    }

    // Update the visibility status if provided, otherwise keep the existing status
    existingMealMenu.visible = visible || existingMealMenu.visible;

    // Save the updated meal menu to the database
    await existingMealMenu.save();

    return {
      success: true,
      message: {
        en: "Customized Meal Menu updated successfully.",
        ar: "تم تحديث قائمة الوجبات المخصصة بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
