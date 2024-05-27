const { ObjectId } = require("mongoose").Types;
const fs = require("fs");
const path = require("path");
const MainMealMenuModel = require("../models/MainMealMenuModel");
const { calculateCalories } = require("../utils/calculateCalories");
const { default: mongoose } = require("mongoose");

/**
 * Service function to create a new Main Meal Menu.
 * @param {string} user_id - The user ID creating the Main Meal Menu.
 * @param {Object} mealMenuData - Data for the new Main Meal Menu.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the Main Meal Menu creation process.
 */
exports.createMainMealMenuService = async (user_id, mealMenuData, req) => {
  try {
    let {
      lang,
      preference,
      type_of_meal,
      image,
      meal_name,
      main_badge_tag,
      tags,
      protein,
      fat,
      carbs,
      nutrition_facts,
      ingredients,
      heating_instruction,
      old_price,
      regular_price,
      visible,
    } = mealMenuData;

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // Create a new Main Meal Menu in the database
    const newMealMenu = await MainMealMenuModel.create({
      lang: lang || "en",
      preference,
      type_of_meal,
      image: "",
      meal_name: meal_name.toLowerCase(),
      main_badge_tag: main_badge_tag.toLowerCase() || "",
      tags,
      protein,
      fat,
      carbs,
      calories: await calculateCalories(protein, carbs, fat),
      nutrition_facts: "", // Initialize with an empty string
      ingredients,
      heating_instruction,
      old_price: old_price ?? 0,
      regular_price,
      visible,
      created_by: user_id,
    });

    const newMealMenuId = newMealMenu._id;

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Define the upload directory path for the meal menu image
    const uploadDir = path.join(
      publicPath,
      "uploads/mainMealMenus",
      newMealMenuId.toString()
    );

    // Execution after adding the image by admin
    if (req.files) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Handle image field (if present)
      if (req.files && req.files.image) {
        const mealImage = req.files.image;

        // Define allowed file extensions for the meal menu image
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

        const fileExtension = path.extname(mealImage.name).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          // Delete the newly created meal menu if the file type is invalid
          await MainMealMenuModel.findByIdAndDelete(newMealMenuId);

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
        newMealMenu.image = `/uploads/mainMealMenus/${newMealMenuId.toString()}/${uniqueImageName}`;
      }

      // Handle nutrition_facts field (if present)
      if (req.files.nutrition_facts) {
        const nutritionFactsImage = req.files.nutrition_facts;

        // Define allowed file extensions for the nutrition_facts image
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

        const fileExtension = path
          .extname(nutritionFactsImage.name)
          .toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          // Delete the newly created meal menu if the file type is invalid
          await MainMealMenuModel.findByIdAndDelete(newMealMenuId);

          return {
            message: {
              en: "Invalid file type. Only image files are allowed for nutrition facts.",
              ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور للمعلومات الغذائية",
            },
          };
        }

        // Generate a unique image name for nutrition facts using the meal_name and timestamp
        const uniqueImageName = `${meal_name}-nutrition-facts${fileExtension}`;

        // Define the path for the uploaded nutrition_facts image
        const nutritionFactsImagePath = path.join(uploadDir, uniqueImageName);

        // Move the uploaded image to the specified path
        nutritionFactsImage.mv(nutritionFactsImagePath, (err) => {
          if (err) {
            console.log("Error uploading nutrition facts image: ", err);
          }
        });

        // Update the meal menu with the nutrition_facts image path
        newMealMenu.nutrition_facts = `/uploads/mainMealMenus/${newMealMenuId.toString()}/${uniqueImageName}`;
      }
    } else if (
      typeof req.body.image === "string" ||
      typeof req.body.nutrition_facts === "string" ||
      typeof req.body.image === "boolean" ||
      typeof req.body.nutrition_facts === "boolean" ||
      req.body.image === "" ||
      req.body.image === null ||
      req.body.image === undefined ||
      req.body.nutrition_facts === "" ||
      req.body.nutrition_facts === null ||
      req.body.nutrition_facts === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of image and nutrition_facts empty string
       */
      newMealMenu.image = "";
      newMealMenu.nutrition_facts = "";
    } else {
      newMealMenu.image = "";
      newMealMenu.nutrition_facts = "";
    }

    // Save the updated meal menu to the database
    await newMealMenu.save();

    return {
      status: true,
      message: {
        en: "Main Meal Menu created successfully.",
        ar: "تم إنشاء قائمة الوجبات الرئيسية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error creating Main Meal Menu", error);
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
 * Service function to get all Main Meal Menus for the running week with preference and type_of_meal data.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing the Main Meal Menus for the running week with additional data.
 */
exports.getAllMainMealMenusForUsersService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Extract preferences from the request body
    const userPreferences = req.body.preference || [];

    // Aggregation method to match and lookup MealPreference and MealType data
    const matchAndLookup = [
      {
        $match: {
          lang: langCode,
          visible: true,
          preference: {
            $in: userPreferences.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $lookup: {
          from: "mealpreferences",
          localField: "preference",
          foreignField: "_id",
          as: "preferenceData",
        },
      },
      {
        $lookup: {
          from: "mealtypes",
          localField: "type_of_meal",
          foreignField: "_id",
          as: "mealTypeData",
        },
      },
    ];

    const addFieldsAndProject = [
      {
        $addFields: {
          preference: {
            $toUpper: { $arrayElemAt: ["$preferenceData.preference", 0] },
          },
          type_of_meal: {
            $toUpper: { $arrayElemAt: ["$mealTypeData.type_of_meal", 0] },
          },
          meal_name: {
            $toUpper: "$meal_name",
          },
          main_badge_tag: {
            $toUpper: "$main_badge_tag",
          },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          preference: 1,
          type_of_meal: 1,
          image: 1,
          meal_name: 1,
          main_badge_tag: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          old_price: 1,
          regular_price: 1,
        },
      },
    ];

    const groupAndProject = [
      {
        $group: {
          _id: "$type_of_meal",
          meals: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          type_of_meal: "$_id", // Rename _id to type_of_meal
          meals: 1,
          _id: 0, // Exclude the default _id field
        },
      },
    ];

    // Use aggregation to join with MealPreference and MealType collections
    const mealsForCurrentWeek = await MainMealMenuModel.aggregate([
      ...matchAndLookup,
      ...addFieldsAndProject,
      ...groupAndProject,
    ]);

    // Extract unique tags, preferences and all_type_of_meals for the filter options
    const allTags = Array.from(
      new Set(
        mealsForCurrentWeek.flatMap((meal) => meal.meals.flatMap((m) => m.tags))
      )
    );
    const allPreferences = Array.from(
      new Set(
        mealsForCurrentWeek.flatMap((meal) =>
          meal.meals.map((m) => m.preference)
        )
      )
    );
    const allTypeOfMeals = Array.from(
      new Set(mealsForCurrentWeek.map((meal) => meal.type_of_meal))
    );

    const outputData = {
      status: true,
      data: {
        filter_by_type_of_meal: allTypeOfMeals,
        filter_by_tag: allTags,
        filter_by_preferences: allPreferences,
        meals_data: mealsForCurrentWeek,
      },
    };

    return outputData;
  } catch (error) {
    console.error("Error fetching meals for the current week", error);
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
 * Service function to get a single Main Meal Menu by ID with additional data.
 * @param {string} mealMenuId - The ID of the Main Meal Menu to retrieve.
 * @returns {Object} - Result containing the Main Meal Menu data with additional data.
 */
exports.getMainMealMenuByIdService = async (mealMenuId) => {
  try {
    // Validate if mealMenuId is a valid ObjectId
    if (!ObjectId.isValid(mealMenuId)) {
      return {
        status: false,
        message: {
          en: "Invalid Main Meal Menu ID.",
          ar: "معرف قائمة الوجبات الرئيسية غير صالح",
        },
      };
    }

    // Convert the provided ID string to a MongoDB ObjectId
    const mealMenuObjectId = new ObjectId(mealMenuId);

    // Aggregation method to match and lookup MealPreference and MealType data
    const matchAndLookup = [
      {
        $match: {
          _id: mealMenuObjectId,
        },
      },
      {
        $lookup: {
          from: "mealpreferences",
          localField: "preference",
          foreignField: "_id",
          as: "preferenceData",
        },
      },
      {
        $lookup: {
          from: "mealtypes",
          localField: "type_of_meal",
          foreignField: "_id",
          as: "mealTypeData",
        },
      },
    ];

    // Aggregation method to addFields and project for the final output
    const addFieldsAndProject = [
      {
        $addFields: {
          preference: {
            $toUpper: { $arrayElemAt: ["$preferenceData.preference", 0] },
          },
          type_of_meal: {
            $toUpper: { $arrayElemAt: ["$mealTypeData.type_of_meal", 0] },
          },
          meal_name: {
            $toUpper: "$meal_name",
          },
          main_badge_tag: {
            $toUpper: "$main_badge_tag",
          },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          preference: 1,
          type_of_meal: 1,
          image: 1,
          meal_name: 1,
          main_badge_tag: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          old_price: 1,
          regular_price: 1,
        },
      },
    ];

    // Use aggregation to join with MealPreference and MealType collections
    const mainMealMenu = await MainMealMenuModel.aggregate([
      ...matchAndLookup,
      ...addFieldsAndProject,
    ]);

    // Check if the Main Meal Menu exists
    if (!mainMealMenu || mainMealMenu.length === 0) {
      return {
        status: false,
        message: {
          en: "Main Meal Menu not found.",
          ar: "لم يتم العثور على قائمة الوجبات الرئيسية",
        },
      };
    }

    return { status: true, data: mainMealMenu[0] };
  } catch (error) {
    console.error("Error fetching Main Meal Menu by ID", error);
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
 * Service function to delete a specific Main Meal Menu.
 * @param {string} mealMenuId - The ID of the Main Meal Menu.
 * @returns {Object} - Result of deleting the Main Meal Menu.
 */
exports.deleteMainMealMenuService = async (mealMenuId) => {
  try {
    // Fetch the Main Meal Menu by ID from the database
    const mealMenu = await MainMealMenuModel.findById(mealMenuId);

    if (!mealMenu) {
      return {
        status: false,
        message: {
          en: "Main Meal Menu not found.",
          ar: "القائمة الرئيسية للوجبات غير موجودة",
        },
      };
    }

    // Remove the image and their directories
    const uploadDir = path.join(
      __dirname,
      `../../public/uploads/mainMealMenus/${mealMenuId}`
    );
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach((file) => {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
      });
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the Main Meal Menu from the database
    await MainMealMenuModel.findByIdAndDelete(mealMenuId);

    return {
      status: true,
      message: {
        en: "Main Meal Menu deleted successfully.",
        ar: "تم حذف القائمة الرئيسية للوجبات بنجاح",
      },
    };
  } catch (error) {
    console.error("Error deleting Main Meal Menu", error);
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
 * Service function to update an existing Main Meal Menu.
 * @param {string} mealMenuId - The ID of the Main Meal Menu to update.
 * @param {Object} updateData - Data for updating the Main Meal Menu.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the Main Meal Menu update process.
 */
exports.updateMainMealMenuService = async (mealMenuId, updateData, req) => {
  try {
    let {
      lang,
      preference,
      type_of_meal,
      meal_name,
      main_badge_tag,
      tags,
      protein,
      fat,
      carbs,
      ingredients,
      heating_instruction,
      old_price,
      regular_price,
      visible,
    } = updateData;

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    // Find the existing Main Meal Menu by ID
    const existingMealMenu = await MainMealMenuModel.findById(mealMenuId);

    // Check if the Main Meal Menu exists
    if (!existingMealMenu) {
      return {
        status: false,
        message: {
          en: "Main Meal Menu not found.",
          ar: "لم يتم العثور على قائمة الوجبات الرئيسية",
        },
      };
    }

    // Update the existing Main Meal Menu with the provided data
    existingMealMenu.lang = lang || existingMealMenu.lang;
    existingMealMenu.preference = preference || existingMealMenu.preference;
    existingMealMenu.type_of_meal =
      type_of_meal || existingMealMenu.type_of_meal;
    existingMealMenu.meal_name =
      meal_name.toLowerCase() || existingMealMenu.meal_name.toLowerCase();
    existingMealMenu.main_badge_tag =
      main_badge_tag.toLowerCase() ||
      existingMealMenu.main_badge_tag.toLowerCase();
    existingMealMenu.tags = tags || existingMealMenu.tags;
    existingMealMenu.protein = protein || existingMealMenu.protein;
    existingMealMenu.fat = fat || existingMealMenu.fat;
    existingMealMenu.carbs = carbs || existingMealMenu.carbs;
    existingMealMenu.calories =
      (await calculateCalories(protein, carbs, fat)) ||
      existingMealMenu.calories;
    existingMealMenu.ingredients = ingredients || existingMealMenu.ingredients;
    existingMealMenu.heating_instruction =
      heating_instruction || existingMealMenu.heating_instruction;
    existingMealMenu.old_price = old_price || existingMealMenu.old_price;
    existingMealMenu.regular_price =
      regular_price || existingMealMenu.regular_price;
    existingMealMenu.visible = visible || existingMealMenu.visible;

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Define the upload directory path for the meal menu image
    const uploadDir = path.join(
      publicPath,
      "uploads/mainMealMenus",
      mealMenuId.toString()
    );

    // Ensure upload directory exists, create if not
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Execution after updating the image by admin
    if (req.files) {
      // Handle image field (if present)
      if (req.files.image) {
        // Delete existing image from the file system if it exists
        if (existingMealMenu.image && fs.existsSync(uploadDir)) {
          const existingMealImagePath = path.join(
            publicPath,
            existingMealMenu.image
          );
          if (fs.existsSync(existingMealImagePath)) {
            fs.unlinkSync(existingMealImagePath);
          }
        }

        // Move the uploaded image to the specified path
        const mealImage = req.files.image;
        const uniqueImageName = `${meal_name}${path
          .extname(mealImage.name)
          .toLowerCase()}`;
        const photoPath = path.join(uploadDir, uniqueImageName);
        try {
          await mealImage.mv(photoPath);
          existingMealMenu.image = `/uploads/mainMealMenus/${mealMenuId.toString()}/${uniqueImageName}`;
        } catch (error) {
          console.log("Error uploading meal menu image: ", error);
          return {
            status: false,
            message: {
              en: "Error uploading meal menu image.",
              ar: "حدث خطأ أثناء تحميل صورة قائمة الطعام الرئيسية",
            },
          };
        }
      }

      // Handle nutrition_facts field (if present)
      if (req.files.nutrition_facts) {
        // Delete existing image from the file system if it exists
        if (existingMealMenu.nutrition_facts && fs.existsSync(uploadDir)) {
          const existingNutritionFactsImagePath = path.join(
            publicPath,
            existingMealMenu.nutrition_facts
          );
          if (fs.existsSync(existingNutritionFactsImagePath)) {
            fs.unlinkSync(existingNutritionFactsImagePath);
          }
        }

        // Move the uploaded image to the specified path
        const nutritionFactsImage = req.files.nutrition_facts;
        const uniqueImageName = `${meal_name}-nutrition-facts${path
          .extname(nutritionFactsImage.name)
          .toLowerCase()}`;
        const nutritionFactsImagePath = path.join(uploadDir, uniqueImageName);
        try {
          await nutritionFactsImage.mv(nutritionFactsImagePath);
          existingMealMenu.nutrition_facts = `/uploads/mainMealMenus/${mealMenuId.toString()}/${uniqueImageName}`;
        } catch (error) {
          console.log("Error uploading nutrition facts image: ", error);
          return {
            status: false,
            message: {
              en: "Error uploading nutrition facts image.",
              ar: "حدث خطأ أثناء تحميل صورة المعلومات الغذائية",
            },
          };
        }
      }
    } else if (
      typeof req.body.image === "string" ||
      typeof req.body.nutrition_facts === "string" ||
      typeof req.body.image === "boolean" ||
      typeof req.body.nutrition_facts === "boolean" ||
      req.body.image === "" ||
      req.body.image === null ||
      req.body.image === undefined ||
      req.body.nutrition_facts === "" ||
      req.body.nutrition_facts === null ||
      req.body.nutrition_facts === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just using the previous value and don't deleting
       * the previous files from the file system
       */
      existingMealMenu.image = existingMealMenu.image;
      existingMealMenu.nutrition_facts = existingMealMenu.nutrition_facts;
    } else {
      existingMealMenu.image = existingMealMenu.image;
      existingMealMenu.nutrition_facts = existingMealMenu.nutrition_facts;
    }

    // Save the updated meal menu to the database
    await existingMealMenu.save();

    return {
      status: true,
      message: {
        en: "Main Meal Menu updated successfully.",
        ar: "تم تحديث قائمة الوجبات الرئيسية بنجاح",
      },
    };
  } catch (error) {
    console.error("Error updating Main Meal Menu", error);
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
 * Service function to get previous Main Meal Menus with pagination.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing the previous Main Meal Menus with pagination data.
 */
exports.getAllMainMealMenusForAdminService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Constants for pagination
    const showPerPage = req?.query?.showPerPage
      ? parseInt(req?.query?.showPerPage)
      : 10;
    const pageNo = req?.query?.pageNo ? parseInt(req?.query?.pageNo) : 1;

    // Extract searchKeyword from the request
    const searchKeyword = req?.query?.searchKeyword || "";

    // Aggregation method to match, lookup MealPreference and MealType data
    const matchAndLookup = [
      {
        $match: {
          lang: langCode,
          meal_name: { $regex: searchKeyword, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "mealpreferences",
          localField: "preference",
          foreignField: "_id",
          as: "preferenceData",
        },
      },
      {
        $lookup: {
          from: "mealtypes",
          localField: "type_of_meal",
          foreignField: "_id",
          as: "mealTypeData",
        },
      },
    ];

    // Aggregation method to addFields and project
    const addFieldsAndProject = [
      {
        $addFields: {
          preference: {
            _id: {
              $arrayElemAt: ["$preferenceData._id", 0],
            },
            value: {
              $toUpper: { $arrayElemAt: ["$preferenceData.preference", 0] },
            },
          },
          type_of_meal: {
            _id: {
              $arrayElemAt: ["$mealTypeData._id", 0],
            },
            value: {
              $toUpper: { $arrayElemAt: ["$mealTypeData.type_of_meal", 0] },
            },
          },
          meal_name: {
            $toUpper: "$meal_name",
          },
          main_badge_tag: {
            $toUpper: "$main_badge_tag",
          },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          lang: 1,
          preference: 1,
          type_of_meal: 1,
          image: 1,
          meal_name: 1,
          main_badge_tag: 1,
          tags: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
          calories: 1,
          nutrition_facts: 1,
          ingredients: 1,
          heating_instruction: 1,
          old_price: 1,
          regular_price: 1,
          visible: 1,
        },
      },
    ];

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
    ];

    // Use aggregation to join with MealPreference and MealType collections
    const previousMainMealMenus = await MainMealMenuModel.aggregate([
      ...matchAndLookup,
      ...addFieldsAndProject,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await MainMealMenuModel.countDocuments({
      lang: langCode,
      meal_name: { $regex: searchKeyword, $options: "i" },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalDataCount / showPerPage);

    // Generate array of page numbers
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate start and end items for showing
    const startItem = (pageNo - 1) * showPerPage + 1;
    const endItem = Math.min(pageNo * showPerPage, totalDataCount);

    return {
      status: true,
      data: previousMainMealMenus,
      totalDataCount,
      totalPages: pageArray,
      currentPage: pageNo,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
    };
  } catch (error) {
    console.error("Error fetching previous meals", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
