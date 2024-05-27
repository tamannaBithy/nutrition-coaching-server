const KetoAdminModel = require("../models/KetoCalcAdminModel");

/**
 * Function to calculate user's Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on user metrics.
 * @param {number} fat_percentage - User's body fat percentage.
 * @param {string} gender - User's gender ("man" or "woman").
 * @param {number} weight - User's weight in kilograms.
 * @param {number} height - User's height in centimeters.
 * @param {number} age - User's age in years.
 * @param {number} ALF - Activity Level Factor (1 to 6).
 * @param {number} ALF1 - Activity Level Factor 1.
 * @param {number} ALF2 - Activity Level Factor 2.
 * @param {number} ALF3 - Activity Level Factor 3.
 * @param {number} ALF4 - Activity Level Factor 4.
 * @param {number} ALF5 - Activity Level Factor 5.
 * @param {number} ALF6 - Activity Level Factor 6.
 * @returns {Object} - Object containing BMR and TDEE.
 */
async function calculateUserMetrics(
  fat_percentage,
  gender,
  weight,
  height,
  age,
  ALF,
  ALF1,
  ALF2,
  ALF3,
  ALF4,
  ALF5,
  ALF6
) {
  let f;
  let newALF = Number(ALF);

  // Calculate activity level factor (f) based on fat percentage
  if (5 <= fat_percentage && fat_percentage <= 9) {
    f = 0.07;
  } else if (10 <= fat_percentage && fat_percentage <= 14) {
    f = 0.07;
  } else if (15 <= fat_percentage && fat_percentage <= 19) {
    f = 0.17;
  } else if (20 <= fat_percentage && fat_percentage <= 24) {
    f = 0.22;
  } else if (25 <= fat_percentage && fat_percentage <= 29) {
    f = 0.27;
  } else if (30 <= fat_percentage && fat_percentage <= 34) {
    f = 0.32;
  } else if (35 <= fat_percentage && fat_percentage <= 39) {
    f = 0.37;
  } else if (40 <= fat_percentage) {
    f = 0.42;
  }

  // Calculate Basal Metabolic Rate (BMR) based on gender
  let BMR;

  if (gender === "man") {
    BMR =
      (10 * weight +
        6.25 * height -
        5 * age +
        5 +
        (370 + 21.6 * (1 - f) * weight)) /
      2;
  } else if (gender === "woman") {
    BMR =
      (10 * weight +
        6.25 * height -
        5 * age -
        161 +
        (370 + 21.6 * (1 - f) * weight)) /
      2;
  }

  // Calculate Total Daily Energy Expenditure (TDEE) based on Activity Level Factor (ALF)
  let TDEE;

  if (newALF === 1) {
    TDEE = BMR * ALF1;
  } else if (newALF === 2) {
    TDEE = BMR * ALF2;
  } else if (newALF === 3) {
    TDEE = BMR * ALF3;
  } else if (newALF === 4) {
    TDEE = BMR * ALF4;
  } else if (newALF === 5) {
    TDEE = BMR * ALF5;
  } else if (newALF === 6) {
    TDEE = BMR * ALF6;
  }

  return { BMR, TDEE };
}

/**
 * Service function to create a user's keto diet plan based on provided user data.
 * @param {Object} userData - User data containing weight, height, age, fat_percentage, ALF, diet_goal, gender, and body_type.
 * @returns {Object} - Result of the keto diet plan creation process.
 */
exports.createUserKetoService = async (userData) => {
  try {
    const { weight, height, age, fat_percentage, ALF, diet_goal, gender } =
      userData;

    // Fetch keto data from admin settings
    const allKetoData = await KetoAdminModel.findOne(
      {},
      {
        _id: 0,
        ALF1: 1,
        ALF2: 1,
        ALF3: 1,
        ALF4: 1,
        ALF5: 1,
        ALF6: 1,
        cam: 1,
        pm: 1,
        cm: 1,
        fm: 1,
        cal: 1,
        pl: 1,
        cl: 1,
        fl: 1,
      }
    ).lean();

    const allKetoDataResult = allKetoData || {};

    const {
      ALF1,
      ALF2,
      ALF3,
      ALF4,
      ALF5,
      ALF6,
      cam,
      pm,
      cm,
      fm,
      cal,
      pl,
      cl,
      fl,
    } = allKetoDataResult;

    // Calculate user metrics using reusable function
    const resultFromReusableFunc = await calculateUserMetrics(
      fat_percentage,
      gender,
      weight,
      height,
      age,
      ALF,
      ALF1,
      ALF2,
      ALF3,
      ALF4,
      ALF5,
      ALF6
    );

    const { BMR, TDEE } = resultFromReusableFunc;

    // Initialize variables for macronutrients
    let protein;
    let carb;
    let fat;
    let calories;

    // Calculate macronutrients based on diet goal
    if (diet_goal === "maintain weight & muscles") {
      calories = TDEE * cam;
      protein = (pm * calories) / 4;
      carb = (cm * calories) / 4;
      fat = (fm * calories) / 4;
    } else if (diet_goal === "loss fat") {
      calories = TDEE * cal;
      protein = (pl * calories) / 4;
      carb = (cl * calories) / 4;
      fat = (fl * calories) / 4;
    }

    // Prepare final result object
    const finalResult = {
      BMR,
      TDEE,
      calories,
      protein,
      carb,
      fat,
    };

    return { status: true, data: finalResult };
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
 * Service function to create a user's macro diet plan based on provided user data.
 * @param {Object} userData - User data containing weight, height, age, fat_percentage, ALF, diet_goal, gender, and body_type.
 * @returns {Object} - Result of the macro diet plan creation process.
 */
exports.createUserMacroService = async (userData) => {
  try {
    const {
      weight,
      height,
      age,
      fat_percentage,
      ALF,
      diet_goal,
      gender,
      body_type,
    } = userData;

    // Fetch keto data from admin settings
    const allKetoData = await KetoAdminModel.findOne(
      {},
      {
        _id: 0,
        cam: 0,
        pm: 0,
        cm: 0,
        fm: 0,
        cal: 0,
        pl: 0,
        cl: 0,
        fl: 0,
      }
    ).lean();

    const allKetoDataResult = allKetoData || {};

    const {
      ALF1,
      ALF2,
      ALF3,
      ALF4,
      ALF5,
      ALF6,
      cage,
      cagm,
      caga,
      came,
      camm,
      cama,
      cale,
      calm,
      cala,
      pge,
      pgm,
      pga,
      pme,
      pmm,
      pma,
      ple,
      plm,
      pla,
      cge,
      cgm,
      cga,
      cme,
      cmm,
      cma,
      cle,
      clm,
      cla,
      fge,
      fgm,
      fga,
      fme,
      fmm,
      fma,
      fle,
      flm,
      fla,
    } = allKetoDataResult;

    // Calculate user metrics using reusable function
    const resultFromReusableFunc = await calculateUserMetrics(
      fat_percentage,
      gender,
      weight,
      height,
      age,
      ALF,
      ALF1,
      ALF2,
      ALF3,
      ALF4,
      ALF5,
      ALF6
    );

    const { BMR, TDEE } = resultFromReusableFunc;

    // Initialize variables for macronutrients
    let protein;
    let carb;
    let fat;
    let calories;

    // Calculate macronutrients based on diet goal and body type
    if (diet_goal === "gain muscles" && body_type === "ectomorph") {
      calories = TDEE * cage;
      protein = (pge * calories) / 4;
      carb = (cge * calories) / 4;
      fat = (fge * calories) / 9;
    } else if (diet_goal === "gain muscles" && body_type === "mesomorph") {
      calories = TDEE * cagm;
      protein = (pgm * calories) / 4;
      carb = (cgm * calories) / 4;
      fat = (fgm * calories) / 9;
    } else if (diet_goal === "gain muscles" && body_type === "andromorph") {
      calories = TDEE * caga;
      protein = (pga * calories) / 4;
      carb = (cga * calories) / 4;
      fat = (fga * calories) / 9;
    } else if (diet_goal === "maintain muscles" && body_type === "ectomorph") {
      calories = TDEE * came;
      protein = (pme * calories) / 4;
      carb = (cme * calories) / 4;
      fat = (fme * calories) / 9;
    } else if (diet_goal === "maintain muscles" && body_type === "mesomorph") {
      calories = TDEE * camm;
      protein = (pmm * calories) / 4;
      carb = (cmm * calories) / 4;
      fat = (fmm * calories) / 9;
    } else if (diet_goal === "maintain muscles" && body_type === "andromorph") {
      calories = TDEE * cama;
      protein = (pma * calories) / 4;
      carb = (cma * calories) / 4;
      fat = (fma * calories) / 9;
    } else if (diet_goal === "loss fat" && body_type === "ectomorph") {
      calories = TDEE * cale;
      protein = (ple * calories) / 4;
      carb = (cle * calories) / 4;
      fat = (fle * calories) / 9;
    } else if (diet_goal === "loss fat" && body_type === "mesomorph") {
      calories = TDEE * calm;
      protein = (plm * calories) / 4;
      carb = (clm * calories) / 4;
      fat = (flm * calories) / 9;
    } else if (diet_goal === "loss fat" && body_type === "andromorph") {
      calories = TDEE * cala;
      protein = (pla * calories) / 4;
      carb = (cla * calories) / 4;
      fat = (fla * calories) / 9;
    }

    // Prepare final result object
    const finalResult = {
      BMR,
      TDEE,
      calories,
      protein,
      carb,
      fat,
    };

    return { status: true, data: finalResult };
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
 * Service function to create admin keto data settings.
 * @param {Object} adminData - Admin keto data settings.
 * @returns {Object} - Result of the admin keto data creation process.
 */
exports.createAdminKetoService = async (adminData) => {
  try {
    // Check if there is already an existing keto admin record
    const existingKetoDataCount = await KetoAdminModel.countDocuments();

    if (existingKetoDataCount > 0) {
      return {
        status: false,
        message: {
          en: "A keto admin record already exists. You cannot create another one.",
          ar: "توجد بالفعل سجلات كيتو المشرف. لا يمكنك إنشاء واحدة أخرى",
        },
      };
    }

    // Create new keto admin data record
    const newKetoData = await KetoAdminModel.create(adminData);

    return {
      status: true,
      message: {
        en: "Admin created keto data successfully.",
        ar: "تم إنشاء بيانات كيتو المشرف بنجاح",
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
 * Service function to update existing admin keto data settings.
 * @param {Object} updatedData - Updated admin keto data settings.
 * @returns {Object} - Result of the admin keto data update process.
 */
exports.updateAdminKetoService = async (updatedData) => {
  try {
    // Check if there is an existing record to update
    const existingKetoData = await KetoAdminModel.findOne();

    if (!existingKetoData) {
      return {
        status: false,
        message: {
          en: "No existing keto admin record found for update.",
          ar: "لم يتم العثور على سجل كيتو المشرف الحالي للتحديث",
        },
      };
    }

    Object.assign(existingKetoData, updatedData);

    // Save the updated record
    await existingKetoData.save();

    return {
      status: true,
      message: {
        en: "Admin keto data updated successfully.",
        ar: "تم تحديث بيانات كيتو المشرف بنجاح",
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
