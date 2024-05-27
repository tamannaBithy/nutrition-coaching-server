const fs = require("fs");
const path = require("path");
const { calculateCalories } = require("../utils/calculateCalories");
const OfferedMealMenuModel = require("../models/OfferedMealMenuModel");
const OfferedMeal = require("../models/OfferedMealsModel");
const { default: mongoose } = require("mongoose");

/**
 * Service function to create a new Offered Meal Packages.
 * @param {string} user_id - The user ID creating the Offered Meal.
 * @param {Object} mealData - Data for the new Offered Meal and Offered Meal Menu.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the Offered Package creation process.
 */
exports.createOfferedMealPackageService = async (user_id, mealData, req) => {
  try {
    const { lang, package_name, tags, price, visible } = mealData;

    // Create an Offered Meal Menu
    const newOfferedMealMenu = await OfferedMealMenuModel.create({
      lang: lang || "en",
      category: "Offer Meal",
      package_name,
      meals: [],
      tags,
      price,
      package_image: "", // Initialize with an empty string
      visible,
      created_by: user_id,
    });

    const newOfferedMealMenuId = newOfferedMealMenu._id;

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Define the upload directory path for the offered meal menu image
    const uploadDir = path.join(
      publicPath,
      "uploads/offeredMealPackages",
      newOfferedMealMenuId.toString()
    );

    // Execution after adding the package_image by admin
    if (req.files && req.files.package_image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Handle image field
      const mealMenuImage = req.files.package_image;

      // Define allowed file extensions for the offered meal menu image
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(mealMenuImage.name).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        // Delete the newly created offered meal menu if the file type is invalid
        await OfferedMealMenuModel.findByIdAndDelete(newOfferedMealMenuId);

        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Generate a unique image name using the package_name and timestamp
      const uniqueImageName = `${package_name}-menu${fileExtension}`;

      // Define the path for the uploaded offered meal menu image
      const menuImagePath = path.join(uploadDir, uniqueImageName);

      // Move the uploaded image to the specified path
      mealMenuImage.mv(menuImagePath, (err) => {
        if (err) {
          console.log("Error uploading offered meal menu image: ", err);
        }
      });

      // Update the offered meal menu with the image path
      newOfferedMealMenu.package_image = `/uploads/offeredMealPackages/${newOfferedMealMenuId.toString()}/${uniqueImageName}`;
    } else if (
      typeof req.body.package_image === "string" ||
      typeof req.body.package_image === "boolean" ||
      req.body.package_image === "" ||
      req.body.package_image === null ||
      req.body.package_image === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of image and nutrition_facts empty string
       */
      newOfferedMealMenu.image = "";
      newOfferedMealMenu.nutrition_facts = "";
    } else {
      newOfferedMealMenu.image = "";
      newOfferedMealMenu.nutrition_facts = "";
    }

    // Save the updated offered meal menu to the database
    await newOfferedMealMenu.save();

    return {
      status: true,
      message: {
        en: "Offered Meal created successfully.",
        ar: "تم إنشاء الوجبة المقدمة بنجاح",
      },
    };
  } catch (error) {
    console.error("Error creating Offered Meal", error);
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
 * Service function to insert a new Offered Meal to the specific package.
 * @param {string} user_id - The user ID creating the Offered Meal.
 * @param {Object} mealData - Data for the new Offered Meal and Offered Meal Menu.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the Offered Meal creation process.
 */
exports.createOfferedMealForPackageService = async (
  user_id,
  offeredMealData,
  req
) => {
  try {
    const {
      package_id,
      meal_name,
      protein,
      carbs,
      fat,
      ingredients,
      heating_instruction,
    } = offeredMealData;

    // checking if the package available or not
    const packageAvailableOrNot = await OfferedMealMenuModel.findById(
      package_id
    );

    // if not available then send a message
    if (!packageAvailableOrNot) {
      return {
        status: false,
        message: {
          en: "Meal Package Not Found",
          ar: "لم يتم العثور على حزمة الوجبات",
        },
      };
    }

    // Create a new Offered Meal
    const newOfferedMeal = await OfferedMeal.create({
      meal_name: meal_name.toLowerCase(),
      protein,
      carbs,
      fat,
      calories: await calculateCalories(protein, carbs, fat),
      ingredients,
      heating_instruction,
      created_by: user_id,
    });

    const newOfferedMealId = newOfferedMeal._id;

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    const mealUploadDir = path.join(
      publicPath,
      "uploads/offeredMeals",
      newOfferedMealId.toString()
    );

    // Execution after adding the images by admin
    if (req.files && req.files.image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(mealUploadDir)) {
        fs.mkdirSync(mealUploadDir, { recursive: true });
      }

      // Handle image field
      const offeredMealImage = req.files.image;

      // Define allowed file extensions for the offered meal image
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(offeredMealImage.name).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        // Delete the newly created offered meal if the file type is invalid
        await OfferedMeal.findByIdAndDelete(newOfferedMealId);

        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Generate a unique image name using the meal_name and timestamp
      const uniqueImageName = `${meal_name}${fileExtension}`;

      // Define the path for the uploaded offered meal image
      const mealImagePath = path.join(mealUploadDir, uniqueImageName);

      // Move the uploaded image to the specified path
      await offeredMealImage.mv(mealImagePath);

      // Update the offered meal with the image path
      newOfferedMeal.image = `/uploads/offeredMeals/${newOfferedMealId.toString()}/${uniqueImageName}`;
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
      newOfferedMeal.image = "";
    } else {
      newOfferedMeal.image = "";
    }

    // Handle nutrition_facts_image field
    if (req.files && req.files.nutrition_facts_image) {
      const nutritionFactsImage = req.files.nutrition_facts_image;

      // Define allowed file extensions for the nutrition_facts image
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path
        .extname(nutritionFactsImage.name)
        .toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        // Delete the newly created offered meal if the file type is invalid
        await OfferedMeal.findByIdAndDelete(newOfferedMealId);

        return {
          message: {
            en: "Invalid file type. Only image files are allowed for nutrition facts.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور للقيم الغذائية",
          },
        };
      }

      // Generate a unique image name for nutrition facts using the meal_name and timestamp
      const uniqueNutritionFactsImageName = `${meal_name}-nutrition-facts${fileExtension}`;

      // Define the path for the uploaded nutrition_facts image
      const nutritionFactsImagePath = path.join(
        mealUploadDir,
        uniqueNutritionFactsImageName
      );

      // Move the uploaded image to the specified path
      await nutritionFactsImage.mv(nutritionFactsImagePath);

      // Update the offered meal with the nutrition_facts image path
      newOfferedMeal.nutrition_facts_image = `/uploads/offeredMeals/${newOfferedMealId.toString()}/${uniqueNutritionFactsImageName}`;
    } else if (
      typeof req.body.nutrition_facts_image === "string" ||
      typeof req.body.nutrition_facts_image === "boolean" ||
      req.body.nutrition_facts_image === "" ||
      req.body.nutrition_facts_image === null ||
      req.body.nutrition_facts_image === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of nutrition_facts empty string
       */
      newOfferedMeal.nutrition_facts_image = "";
    } else {
      newOfferedMeal.nutrition_facts_image = "";
    }

    // Save the updated offered meal to the database
    await newOfferedMeal.save();

    // Add the Offered Meal ID to the Offered Meal Menu's meals array
    packageAvailableOrNot.meals.push(newOfferedMealId);
    await packageAvailableOrNot.save();

    return {
      status: true,
      message: {
        en: "Offered meal created successfully.",
        ar: "تم إنشاء الوجبة المعروضة بنجاح",
      },
      newOfferedMeal,
    };
  } catch (error) {
    console.error("Error creating Offered Meal", error);
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
 * Service function to get the list of packages.
 * @param {Object} req - Express request object.
 * @returns {Promise<Array>} List of packages with their images.
 */
exports.getPackagesListService = async (req) => {
  try {
    // Using aggregation pipeline to capitalize package_image and project only necessary fields
    const packages = await OfferedMealMenuModel.aggregate([
      {
        $project: {
          _id: 1,
          package_name: { $toUpper: "$package_name" }, // Capitalizing package_image
        },
      },
    ]);

    return { status: true, data: packages };
  } catch (error) {
    console.error("Error fetching all offered meals packages", error);
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
 * Service function to get all offered meals with capitalized package_name.
 * @returns {Object} - Result containing all offered meals with capitalized package_name.
 */
exports.getAllOfferedMealsService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Use aggregate to get all offered meals with capitalized package_name
    const offeredMeals = await OfferedMealMenuModel.aggregate([
      {
        $match: {
          lang: langCode,
          visible: true,
        },
      },
      {
        $lookup: {
          from: "offeredmeals",
          localField: "meals",
          foreignField: "_id",
          as: "meals",
        },
      },
      {
        $project: {
          category: { $toUpper: "$category" },
          package_name: { $toUpper: "$package_name" },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
          price: 1,
          package_image: 1,
        },
      },
    ]);

    return { status: true, data: offeredMeals };
  } catch (error) {
    console.error("Error fetching all offered meals", error);
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
 * Service function to get details of a specific offered meal by ID.
 * @param {string} mealMenuId - The ID of the Offered Meal Menu.
 * @returns {Object} - Result containing details of the specified offered meal.
 */
exports.getOfferedMealsByIdService = async (mealMenuId) => {
  try {
    // Fetch the Offered Meal Menu by ID with associated Offered Meals using aggregate
    const offeredMealMenu = await OfferedMealMenuModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(mealMenuId) } },
      {
        $lookup: {
          from: "offeredmeals",
          localField: "meals",
          foreignField: "_id",
          as: "meals",
        },
      },
      {
        $project: {
          package_name: { $toUpper: "$package_name" },
          category: { $toUpper: "$category" },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
          meals: {
            $map: {
              input: "$meals",
              as: "meal",
              in: {
                $mergeObjects: [
                  "$$meal",
                  {
                    meal_name: { $toUpper: "$$meal.meal_name" },
                  },
                ],
              },
            },
          },
          price: 1,
          image: 1,
        },
      },
    ]);

    if (!offeredMealMenu || offeredMealMenu.length === 0) {
      return {
        status: false,
        message: {
          en: "Offered Meal Menu not found.",
          ar: "قائمة الوجبات المعروضة غير موجودة",
        },
      };
    }

    return { status: true, data: offeredMealMenu[0] };
  } catch (error) {
    console.error("Error fetching offered meal by ID", error);
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
 * Service function to delete an Offered Meal Package and its associated meals and images.
 * @param {string} package_id - The ID of the Offered Meal Package to delete.
 * @returns {Object} - Result of the deletion process.
 */
exports.deleteOfferedMealPackageService = async (package_id) => {
  try {
    // Find the Offered Meal Package by ID
    const packageToDelete = await OfferedMealMenuModel.findById(package_id);

    if (!packageToDelete) {
      return {
        status: false,
        message: {
          en: "Offered Meal Package not found.",
          ar: "لم يتم العثور على حزمة الوجبة المعروضة",
        },
      };
    }

    // Delete all associated meals and their images
    for (const mealId of packageToDelete.meals) {
      const mealToDelete = await OfferedMeal.findById(mealId);
      if (mealToDelete) {
        // Remove the image file and directory
        if (
          fs.existsSync(
            mealToDelete.image ||
              mealToDelete.nutrition_facts_image ||
              (mealToDelete.image && mealToDelete.nutrition_facts_image)
          )
        ) {
          fs.unlinkSync(mealToDelete.image);
          fs.unlinkSync(mealToDelete.nutrition_facts_image);
        }
        const uploadDir = path.join(
          __dirname,
          `../../public/uploads/offeredMeals/${mealId}`
        );
        if (fs.existsSync(uploadDir)) {
          fs.rmdirSync(uploadDir, { recursive: true });
        }
        // Delete meal document from database
        await OfferedMeal.deleteOne();
      }
    }

    // Delete package image if exists and the directory also
    if (fs.existsSync(packageToDelete.package_image)) {
      fs.unlinkSync(packageToDelete.package_image);
    }
    const uploadDir = path.join(
      __dirname,
      `../../public/uploads/offeredMealPackages/${package_id}`
    );
    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the Offered Meal Package document from database
    await OfferedMealMenuModel.deleteOne({ _id: package_id });

    return {
      status: true,
      message: {
        en: "Offered Meal Package and associated meals deleted successfully.",
        ar: "تم حذف حزمة الوجبة المعروضة والوجبات المرتبطة بنجاح",
      },
    };
  } catch (error) {
    console.error("Error deleting Offered Meal Package", error);
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
 * Service function to get all offered meals for admin dashboard with pagination.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result containing all offered meals with pagination data.
 */
exports.getAllOfferedMealsDashboardService = async (req) => {
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

    // Aggregation method to match offeredMeals
    const matchOfferedMeals = [
      {
        $match: {
          lang: langCode,
          package_name: { $regex: searchKeyword, $options: "i" },
        },
      },
    ];

    // Aggregation method to lookup OfferedMeals data
    const lookupOfferedMeals = [
      {
        $lookup: {
          from: "offeredmeals",
          localField: "meals",
          foreignField: "_id",
          as: "mealsData",
        },
      },
    ];

    // Aggregation method to capitalize fields
    const capitalizeFields = [
      {
        $project: {
          category: { $toUpper: "$category" },
          package_name: { $toUpper: "$package_name" },
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toUpper: "$$tag" },
            },
          },
          price: 1,
          package_image: 1,
        },
      },
    ];

    // Aggregation method to sort and paginate
    const sortAndPaginate = [
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (pageNo - 1) * showPerPage,
      },
      {
        $limit: showPerPage,
      },
    ];

    // Use aggregation to join with OfferedMeals collection
    const offeredMeals = await OfferedMealMenuModel.aggregate([
      ...matchOfferedMeals,
      ...lookupOfferedMeals,
      ...capitalizeFields,
      ...sortAndPaginate,
    ]);

    // Get total data count for pagination
    const totalDataCount = await OfferedMealMenuModel.countDocuments({
      lang: langCode,
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
      data: offeredMeals,
      totalDataCount,
      totalPages: pageArray,
      currentPage: pageNo,
      showingEnglish: `Showing ${startItem} - ${endItem} out of ${totalDataCount} items`,
      showingArabic: `عرض ${startItem} - ${endItem} من أصل ${totalDataCount} من العناصر`,
    };
  } catch (error) {
    console.error("Error fetching all offered meals", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
