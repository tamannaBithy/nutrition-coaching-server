const TermsAndConditionsModel = require("../models/TermsAndConditionsModel");

/**
 * Service function to create or update terms and conditions.
 * @param {string} content - The content of the terms and conditions.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.createOrUpdateTermsAndConditionsService = async (lang, content) => {
  try {
    let termsAndConditions = await TermsAndConditionsModel.findOne({ lang });

    if (termsAndConditions) {
      // If terms and conditions exist, update them
      termsAndConditions.lang = lang;
      termsAndConditions.content = content;
      await termsAndConditions.save();
    } else {
      // If terms and conditions don't exist, create new ones
      termsAndConditions = new TermsAndConditionsModel({ lang, content });
      await termsAndConditions.save();
    }

    return {
      status: true,
      message: {
        en: "Terms and conditions updated successfully.",
        ar: "تم تحديث شروط الخدمة بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to update terms and conditions.",
        ar: "فشل تحديث شروط الخدمة",
      },
    };
  }
};

/**
 * Service function to get the terms and conditions.
 * @returns {Promise<Object>} - A promise that resolves to an object with status, message, and terms and conditions content.
 */
exports.getTermsAndConditionsService = async (req) => {
  try {
    const lang = req?.query?.lang;
    const termsAndConditions = await TermsAndConditionsModel.findOne({ lang });
    if (!termsAndConditions) {
      // If terms and conditions don't exist, return error message
      return {
        status: false,
        message: {
          en: "Terms and conditions not found.",
          ar: "شروط الخدمة غير موجودة.",
        },
      };
    }

    return {
      status: true,
      data: termsAndConditions?.content,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to retrieve terms and conditions.",
        ar: "فشل استرداد شروط الخدمة",
      },
    };
  }
};
