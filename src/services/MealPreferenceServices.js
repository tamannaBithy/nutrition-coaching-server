const fs = require("fs");
const path = require("path");

const MealPreference = require("../models/MealPreferenceModel");

/**
 * Service function to create a new Meal Preference.
 * @param {string} user_id - The user ID creating the meal preference.
 * @param {Object} preferenceData - Data for the new meal preference.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the meal preference creation process.
 */
exports.createMealPreferenceService = async (user_id, preferenceData, req) => {
  try {
    let { lang, preference, preference_desc, visible } = preferenceData;

    // Ensure the preference is in lowercase and trimmed
    preference = preference.toLowerCase().trim();

    if (await MealPreference.exists({ preference })) {
      return {
        message: {
          en: "Preference is already exist.",
          ar: "التفضيل موجود بالفعل",
        },
      };
    }

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Create a new meal preference in the database
    const newPreference = await MealPreference.create({
      lang: lang || "en",
      preference,
      preference_image: "", // Initialize with an empty string
      preference_desc,
      visible,
      created_by: user_id, // Set the created_by field to the user_id
    });

    const newPreferenceId = newPreference._id;

    // Define the upload directory path for the meal preference images
    const uploadDir = path.join(
      publicPath,
      "uploads/mealPreferences",
      newPreferenceId.toString()
    );

    // Execution after adding the image by admin
    if (req.files && req.files.preference_image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photo = req.files.preference_image;

      // Define allowed file extensions for the meal preference image
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(photo.name).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        // Delete the newly created meal preference if the file type is invalid
        await MealPreference.findByIdAndDelete(newPreferenceId);

        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Define the path for the uploaded meal preference image
      const photoPath = path.join(
        uploadDir,
        `${newPreference.preference}-preference${fileExtension}`
      );

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading meal preference image: ", err);
        }
      });

      // Update the meal preference with the image path and save
      newPreference.preference_image = `/uploads/mealPreferences/${newPreferenceId.toString()}/${
        newPreference.preference
      }-preference${fileExtension}`;
    } else if (
      typeof req.body.preference_image === "string" ||
      typeof req.body.preference_image === "boolean" ||
      req.body.preference_image === "" ||
      req.body.preference_image === null ||
      req.body.preference_image === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of preference_image empty string
       */
      newPreference.preference_image = "";
    } else {
      newPreference.preference_image = "";
    }

    // Save the updated meal preference to the database
    await newPreference.save();

    return {
      status: true,
      message: {
        en: "Meal Preference created successfully.",
        ar: "تم إنشاء تفضيل الوجبة بنجاح",
      },
    };
  } catch (error) {
    console.error("Error creating meal preference", error);
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
 * Service function to get all meal preferences.
 * @returns {Object} - Result of fetching all meal preferences.
 */
exports.getAllMealPreferencesService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;

    // Aggregate to transform the 'preference' field to uppercase
    const mealPreferences = await MealPreference.aggregate([
      {
        $match: {
          lang: langCode,
          visible: true,
        },
      },
      {
        $project: {
          preference: { $toUpper: "$preference" },
          preference_image: 1,
          preference_desc: 1,
        },
      },
    ]);

    return { status: true, data: mealPreferences };
  } catch (error) {
    console.error("Error fetching meal preferences", error);
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
 * Service function to get details of a specific meal preference by ID.
 * @param {string} preferenceId - The ID of the meal preference.
 * @returns {Object} - Result of fetching the meal preference by ID.
 */
exports.getMealPreferenceByIdService = async (preferenceId) => {
  try {
    // Fetch the meal preference by ID from the database
    const mealPreference = await MealPreference.findById(preferenceId, {
      created_by: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    if (!mealPreference) {
      return {
        message: {
          en: "Meal preference not found.",
          ar: "لم يتم العثور على تفضيل الوجبة",
        },
      };
    }

    return { status: true, mealPreference };
  } catch (error) {
    console.error("Error fetching meal preference by ID", error);
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
 * Service function to update details of a specific meal preference.
 * @param {string} preferenceId - The ID of the meal preference.
 * @param {Object} updatedData - Updated data for the meal preference.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of updating the meal preference.
 */
exports.updateMealPreferenceService = async (
  preferenceId,
  updatedData,
  req
) => {
  try {
    const { lang, preference, preference_desc, visible } = updatedData;

    // Checking if the preference already exists or not
    const preferenceExistOrNot = await MealPreference.find({
      _id: { $ne: preferenceId }, // Exclude the current preference by ID
      preference: preference,
      preference_desc: preference_desc,
      visible: visible,
    });

    if (preferenceExistOrNot.length > 0) {
      return {
        status: false,
        message: {
          en: "Meal preference already exists, so you can't set this preference.",
          ar: "تفضيل الوجبة موجود بالفعل، لذلك لا يمكنك تعيين هذا التفضيل",
        },
      };
    }

    // Fetch the existing meal preference from the database
    const existingPreference = await MealPreference.findById(preferenceId);

    if (!existingPreference) {
      return {
        message: {
          en: "Meal preference not found.",
          ar: "لم يتم العثور على تفضيلات الوجبة",
        },
      };
    }

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Extracting the filename from the existing image URL
    const existingImageFilename = path.basename(
      existingPreference.preference_image
    );

    // Remove the existing image file and directory
    const existingImagePath = path.join(
      publicPath,
      "uploads/mealPreferences",
      preferenceId,
      existingImageFilename
    );

    if (fs.existsSync(existingImagePath)) {
      fs.unlinkSync(existingImagePath);
      console.log("Existing Image Deleted Successfully");
    }

    // Define the upload directory path for the meal preference images
    const uploadDir = path.join(
      publicPath,
      "uploads/mealPreferences",
      preferenceId
    );

    if (req.files && req.files.preference_image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photo = req.files.preference_image;

      // Define allowed file extensions for the meal preference image
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(photo.name).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Define the path for the uploaded meal preference image
      const updatedPreferenceName = preference || existingPreference.preference;
      const photoPath = path.join(
        uploadDir,
        `${updatedPreferenceName}-preference${fileExtension}`
      );

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading meal preference image: ", err);
        }
      });

      // Update the meal preference with the new image path and save
      existingPreference.preference_image = `/uploads/mealPreferences/${preferenceId}/${updatedPreferenceName}-preference${fileExtension}`;
    } else if (
      typeof req.body.preference_image === "string" ||
      typeof req.body.preference_image === "boolean" ||
      req.body.preference_image === "" ||
      req.body.preference_image === null ||
      req.body.preference_image === undefined
    ) {
      /* If the images are coming inside of the body and they are string or empty string or null or undefined or boolean,
       * then just assigning the value of preference_image empty string
       */
      existingPreference.preference_image = existingPreference.preference_image;
    } else {
      existingPreference.preference_image = existingPreference.preference_image;
    }

    // Update the existing meal preference data
    existingPreference.preference = (
      preference || existingPreference.preference
    )
      .toLowerCase()
      .trim();
    existingPreference.lang = lang || existingPreference.lang;
    existingPreference.preference_desc =
      preference_desc || existingPreference.preference_desc;

    // Save the updated meal preference to the database
    await existingPreference.save();

    return {
      status: true,
      message: {
        en: "Meal Preference updated successfully.",
        ar: "تم تحديث تفضيلات الوجبة بنجاح",
      },
    };
  } catch (error) {
    console.error("Error updating meal preference", error);
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
 * Service function to delete a specific meal preference.
 * @param {string} preferenceId - The ID of the meal preference.
 * @returns {Object} - Result of deleting the meal preference.
 */
exports.deleteMealPreferenceService = async (preferenceId) => {
  try {
    // Fetch the meal preference by ID from the database
    const mealPreference = await MealPreference.findById(preferenceId);

    if (!mealPreference) {
      return {
        message: {
          en: "Meal preference not found.",
          ar: "لم يتم العثور على تفضيلات الوجبة",
        },
      };
    }

    // Remove the image file and directory
    if (fs.existsSync(mealPreference.preference_image)) {
      fs.unlinkSync(mealPreference.preference_image);
    }
    const uploadDir = path.join(
      __dirname,
      "../../public/uploads/mealPreferences",
      preferenceId
    );
    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the meal preference from the database
    await MealPreference.findByIdAndDelete(preferenceId);

    return {
      status: true,
      message: {
        en: "Meal Preference deleted successfully.",
        ar: "تم حذف تفضيلات الوجبة بنجاح",
      },
    };
  } catch (error) {
    console.error("Error deleting meal preference", error);
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
 * Service function to get all meal preferences.
 * @returns {Object} - Result of fetching all meal preferences.
 */
exports.getAllMealPreferencesForAdminService = async (req) => {
  try {
    // Getting the lang code from the request query
    const langCode = req?.query?.langCode;
    // Aggregate to transform the 'preference' field to uppercase
    const mealPreferences = await MealPreference.aggregate([
      {
        $match: {
          lang: langCode,
        },
      },
      {
        $project: {
          lang: 1,
          preference: { $toUpper: "$preference" },
          preference_image: 1,
          preference_desc: 1,
          visible: 1,
        },
      },
    ]);

    return { status: true, data: mealPreferences };
  } catch (error) {
    console.error("Error fetching meal preferences", error);
    return {
      status: false,
      message: {
        en: "Something went wrong.",
        ar: "حدث خطأ ما",
      },
    };
  }
};
