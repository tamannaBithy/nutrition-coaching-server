/**
 * Async utility function to calculate calories based on protein, carbs, and fat.
 * @param {number} protein - Amount of protein in grams.
 * @param {number} carbs - Amount of carbohydrates in grams.
 * @param {number} fat - Amount of fat in grams.
 * @returns {Promise<number>} - Promise resolving to the calculated calories.
 */
exports.calculateCalories = async (protein, carbs, fat) => {
  try {
    // Ensure the input values are valid numbers
    if (isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
      throw new Error(
        "Invalid input. Please provide valid numeric values for protein, carbs, and fat."
      );
    }

    // Calculate calories based on the formula: calories = (protein * 4) + (carbs * 4) + (fat * 9)
    const calories = protein * 4 + carbs * 4 + fat * 9;

    // Return the calculated calories
    return calories;
  } catch (error) {
    // Handle any errors and reject the promise
    throw new Error(`Error calculating calories: ${error.message}`);
  }
};
