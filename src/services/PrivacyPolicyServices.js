const PrivacyPolicyModel = require("../models/PrivacyPolicyModel");

/**
 * Service function to create or update privacy policy.
 * @param {string} lang - The lang of the privacy policy.
 * @param {string} content - The content of the privacy policy.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.createOrUpdatePrivacyPolicyService = async ({ lang, content }) => {
  try {
    let privacyPolicy = await PrivacyPolicyModel.findOne({ lang });

    // If privacy policy already exists, update it; otherwise, create a new one
    if (privacyPolicy) {
      privacyPolicy.lang = lang;
      privacyPolicy.content = content;
      await privacyPolicy.save();
    } else {
      privacyPolicy = new PrivacyPolicyModel({ lang: lang, content: content });
      await privacyPolicy.save();
    }

    return {
      status: true,
      message: {
        en: "Privacy policy updated successfully.",
        ar: "تم تحديث سياسة الخصوصية بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to update privacy policy.",
        ar: "فشل تحديث سياسة الخصوصية",
      },
    };
  }
};

/**
 * Service function to get the privacy policy.
 * @returns {Promise<Object>} - A promise that resolves to an object with status, message, and privacy policy content.
 */
exports.getPrivacyPolicyService = async (req) => {
  try {
    const lang = req?.query?.lang;

    const privacyPolicy = await PrivacyPolicyModel.findOne({ lang });
    if (!privacyPolicy) {
      return {
        status: false,
        message: {
          en: "Privacy policy not found.",
          ar: "سياسة الخصوصية غير موجودة",
        },
      };
    }

    return {
      status: true,
      data: privacyPolicy?.content,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to retrieve privacy policy.",
        ar: "فشل استرداد سياسة الخصوصية.",
      },
    };
  }
};
