const FAQModel = require("../models/FAQModel");

/**
 * Service function to create a new FAQ.
 * @param {string} lang - The lang of the FAQ.
 * @param {string} title - The title of the FAQ.
 * @param {string} description - The description of the FAQ.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.createFAQService = async (lang, title, description) => {
  try {
    const newFAQ = new FAQModel({ lang, title, description });
    await newFAQ.save();

    return {
      status: true,
      message: {
        en: "FAQ created successfully.",
        ar: "تم إنشاء الأسئلة الشائعة بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to create FAQ.",
        ar: "فشل إنشاء الأسئلة الشائعة",
      },
    };
  }
};

/**
 * Service function to get all FAQs.
 * @returns {Promise<Object>} - A promise that resolves to an object with status, message, and an array of FAQs.
 */
exports.getAllFAQsService = async (req) => {
  try {
    const lang = req?.query?.lang;
    const faqs = await FAQModel.find({ lang });
    return {
      status: true,
      data: faqs,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to retrieve FAQs.",
        ar: "فشل استرداد الأسئلة الشائعة",
      },
    };
  }
};

/**
 * Service function to update an existing FAQ.
 * @param {string} id - The ID of the FAQ to update.
 * @param {string} lang - The lang of the FAQ to update.
 * @param {string} title - The new title of the FAQ.
 * @param {string} description - The new description of the FAQ.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.updateFAQService = async (id, lang, title, description) => {
  try {
    const updatedFAQ = await FAQModel.findByIdAndUpdate(
      id,
      { lang, title, description },
      { new: true }
    );

    if (!updatedFAQ) {
      return {
        status: false,
        message: {
          en: "FAQ not found.",
          ar: "الأسئلة الشائعة غير موجودة",
        },
      };
    }

    return {
      status: true,
      message: {
        en: "FAQ updated successfully.",
        ar: "تم تحديث الأسئلة الشائعة بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to update FAQ.",
        ar: "فشل تحديث الأسئلة الشائعة",
      },
    };
  }
};

/**
 * Service function to delete an existing FAQ.
 * @param {string} id - The ID of the FAQ to delete.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message.
 */
exports.deleteFAQService = async (id) => {
  try {
    const deletedFAQ = await FAQModel.findByIdAndDelete(id);

    if (!deletedFAQ) {
      return {
        status: false,
        message: {
          en: "FAQ not found.",
          ar: "الأسئلة الشائعة غير موجودة",
        },
      };
    }

    return {
      status: true,
      message: {
        en: "FAQ deleted successfully.",
        ar: "تم حذف الأسئلة الشائعة بنجاح",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: {
        en: "Failed to delete FAQ.",
        ar: "فشل حذف الأسئلة الشائعة",
      },
    };
  }
};
