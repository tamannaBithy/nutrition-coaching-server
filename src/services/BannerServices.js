const fs = require("fs");
const path = require("path");
const BannerModel = require("../models/BannerModel");

/**
 * Service function to create a new banner.
 * @param {string} userId - ID of the user creating the banner.
 * @param {Object} blogData - Data for the new banner.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the banner creation process.
 */
exports.createBannerService = async (userId, blogData, req) => {
  try {
    const { banner_heading, banner_paragraph, visible, lang } = blogData;

    // Create a new banner
    const newBanner = await BannerModel.create({
      image: "",
      banner_heading,
      banner_paragraph,
      visible,
      created_by: userId,
      lang: lang || "en",
    });

    // If the new banner is set to be visible, set other banners with the same language to invisible
    if (newBanner?.visible === true) {
      // Set visible field to false for existing banners
      await BannerModel.updateMany(
        { _id: { $ne: newBanner._id }, lang },
        { $set: { visible: false } }
      );
    }

    const newBannerId = newBanner._id;

    const publicPath = path.join(__dirname, "../../public");

    const uploadDir = path.join(
      publicPath,
      "uploads/banners",
      newBannerId.toString()
    );

    // If image is provided in the request
    if (req.files && req.files.image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photo = req.files.image;

      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(photo.name).toLowerCase();

      // Validate file extension
      if (!allowedExtensions.includes(fileExtension)) {
        // Delete the newly created banner if the file type is invalid
        await BannerModel.findByIdAndDelete(newBannerId);

        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      const photoPath = path.join(uploadDir, `banner-img${fileExtension}`);

      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading banner image: ", err);
        }
      });

      // Set the image path for the banner and save changes
      newBanner.image = `/uploads/banners/${newBannerId.toString()}/banner-img${fileExtension}`;
    } else {
      // Delete the newly created banner if the image file is missing
      await BannerModel.findByIdAndDelete(newBannerId);
    }

    await newBanner.save();

    // Return success message
    return {
      status: true,
      message: {
        en: "Banner created successfully.",
        ar: "تم إنشاء البانر بنجاح",
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
 * Service function to update an existing banner.
 * @param {string} bannerId - ID of the banner to update.
 * @param {Object} updatedData - Updated data for the banner.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the banner update process.
 */
exports.updateBannerService = async (bannerId, updatedData, req) => {
  try {
    let { banner_heading, banner_paragraph, visible, lang } = updatedData;

    // Find the existing banner by ID
    const existingBanner = await BannerModel.findById(bannerId);

    // If the banner doesn't exist, return an error message
    if (!existingBanner) {
      return {
        message: {
          en: "Banner not found.",
          ar: "البانر غير موجود",
        },
      };
    }

    // Specify the absolute path for the "public" folder
    const publicPath = path.join(__dirname, "../../public");

    // Extracting the filename from the existing image URL
    const existingImageFilename = path.basename(existingBanner.image);

    // Remove the existing image file and directory
    const existingImagePath = path.join(
      publicPath,
      "uploads/banners",
      bannerId,
      existingImageFilename
    );

    if (fs.existsSync(existingImagePath)) {
      fs.unlinkSync(existingImagePath);
      console.log("Existing Image Deleted Successfully");
    }

    // Define the upload directory for the banner
    const uploadDir = path.join(publicPath, "uploads/banners", bannerId);

    // If image is provided in the request
    if (req.files && req.files.image) {
      // Create the upload directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photo = req.files.image;

      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      const fileExtension = path.extname(photo.name).toLowerCase();

      // Validate the file extension
      if (!allowedExtensions.includes(fileExtension)) {
        return {
          message: {
            en: "Invalid file type. Only image files are allowed.",
            ar: "نوع الملف غير صالح. يُسمح فقط بملفات الصور",
          },
        };
      }

      // Define the path for the updated banner image
      const photoPath = path.join(uploadDir, `banner-img${fileExtension}`);

      // Move the uploaded image to the specified path
      photo.mv(photoPath, (err) => {
        if (err) {
          console.log("Error uploading banner image: ", err);
        }
      });

      // Set the image path for the banner
      existingBanner.image = `/uploads/banners/${bannerId}/banner-img${fileExtension}`;
    } else if (
      typeof req.body.image === "string" ||
      typeof req.body.image === "boolean" ||
      req.body.image === "" ||
      req.body.image === null ||
      req.body.image === undefined
    ) {
      /* If the image is  coming inside of the body and it is string or empty string or null or undefined or boolean,
       * then just assigning the value of image empty string
       */
      existingBanner.image = existingBanner.image;
    } else {
      existingBanner.image = existingBanner.image;
    }

    // Update the banner properties
    (existingBanner.banner_heading = banner_heading),
      (existingBanner.banner_paragraph = banner_paragraph),
      (existingBanner.visible = visible),
      (existingBanner.created_by = req.user._id),
      (existingBanner.lang = lang || "en"),
      // Save the changes to the banner
      await existingBanner.save();

    // If the banner is set to visible, set other banners with the same language to invisible
    if (existingBanner?.visible === true) {
      // Set visible field to false for existing banners
      await BannerModel.updateMany(
        { _id: { $ne: existingBanner._id }, lang },
        { $set: { visible: false } }
      );
    }

    // Return success message
    return {
      status: true,
      message: {
        en: "Banner updated successfully.",
        ar: "تم تحديث البانر بنجاح",
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
 * Service function to delete an existing banner.
 * @param {string} bannerId - ID of the banner to delete.
 * @returns {Object} - Result of the banner deletion process.
 */
exports.deleteBannerService = async (bannerId) => {
  try {
    // Find the existing banner by ID
    const existingBanner = await BannerModel.findById(bannerId);

    // If the banner doesn't exist, return an error message
    if (!existingBanner) {
      return {
        message: {
          en: "Banner not found.",
          ar: "البانر غير موجود",
        },
      };
    }

    // Remove the image file and directory
    if (fs.existsSync(existingBanner.image)) {
      fs.unlinkSync(existingBanner.image);
    }

    // Define the upload directory path
    const uploadDir = path.join(
      __dirname,
      "../../public/uploads/banners",
      bannerId
    );

    // Remove the directory containing the banner images
    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
    }

    // Delete the banner from the database
    await BannerModel.findByIdAndDelete(bannerId);

    // Return success message
    return {
      status: true,
      message: {
        en: "Banner deleted successfully.",
        ar: "تم حذف البانر بنجاح",
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
 * Service function to retrieve all banners based on language code.
 * @param {Object} req - Express request object containing query parameters.
 * @returns {Object} - Result of the operation, including the status and data.
 */
exports.getAllBannerService = async (req) => {
  try {
    // Extracting the language code from the query parameters
    const langCode = req?.query?.langCode;

    // Aggregate query to retrieve banners based on the specified language code
    const allBanners = await BannerModel.aggregate([
      {
        $match: { lang: langCode }, // Match banners with the specified language code
      },
      {
        $project: {
          created_by: 0, // Exclude the 'created_by' field from the result
          createdAt: 0, // Exclude the 'createdAt' field from the result
          updatedAt: 0, // Exclude the 'updatedAt' field from the result
        },
      },
    ]);

    // Return the status and retrieved banner data
    return { status: true, data: allBanners };
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
 * Service function to retrieve the visible banner based on the provided language code.
 * @param {Object} req - Express request object containing query parameters.
 * @returns {Object} - Result of the operation, including the status and data.
 */
exports.getVisibleBannerService = async (req) => {
  try {
    // Extracting the language code from the query parameters
    const langCode = req?.query?.langCode;

    // Stage to match visible banners with the specified language code
    const matchedStage = {
      $match: {
        visible: true, // Match banners that are marked as visible
        lang: langCode, // Match banners with the specified language code
      },
    };

    // Projection stage to exclude internal fields
    const projectionStage = {
      $project: {
        created_by: 0, // Exclude the 'created_by' field from the result
        createdAt: 0, // Exclude the 'createdAt' field from the result
        updatedAt: 0, // Exclude the 'updatedAt' field from the result
      },
    };

    // Aggregate query to retrieve the visible banner
    const visibleBanner = await BannerModel.aggregate([
      matchedStage,
      projectionStage,
    ]);

    // Return the status and retrieved visible banner data
    return { status: true, data: visibleBanner[0] };
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
