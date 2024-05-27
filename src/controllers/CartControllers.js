const {
  addToCustomizedMealCartService,
  getPriceOfCustomizedMealService,
  deleteMealFromCustomizedMealCartService,
  populateMealsForRemainingDaysService,
} = require("../services/CartForCustomizedMealServices");
const {
  addToMainMealCartService,
  addToOfferedMealCartService,
  getAllCartsService,
  /*  updateMealQuantityInMainMealCartService,
  updateMealQuantityInOfferedMealCartService, */
  deleteMealFromMainMealCartService,
  deleteMealFromOfferedMealCartService,
} = require("../services/CartServices");

// Add to Main Meal Cart
exports.addToMainMealCartController = async (req, res) => {
  const result = await addToMainMealCartService(req.body, req.user._id);
  return res.status(201).send(result);
};

// Add to Offered Meal Cart
exports.addToOfferedMealCartController = async (req, res) => {
  const result = await addToOfferedMealCartService(req.body, req.user._id);
  return res.status(201).send(result);
};

exports.addToCustomizedMealCartController = async (req, res) => {
  const result = await addToCustomizedMealCartService(
    req.body,
    req.user._id,
    req
  );
  return res.status(201).send(result);
};

exports.populateMealsForRemainingDaysController = async (req, res) => {
  const result = await populateMealsForRemainingDaysService(req.user._id, req);
  return res.status(201).send(result);
};

// Get all Carts
exports.getAllCartsController = async (req, res) => {
  const result = await getAllCartsService(req.user._id);
  return res.status(200).send(result);
};

exports.getPriceOfCustomizedMeal = async (req, res) => {
  const result = await getPriceOfCustomizedMealService(req.user._id);
  return res.status(200).send(result);
};

// Delete Meal from Main Meal Cart
exports.deleteMealFromMainMealCartController = async (req, res) => {
  const result = await deleteMealFromMainMealCartService(
    req.params.cartId,
    req.params.menuId
  );
  return res.status(200).send(result);
};

// Delete Meal from Offered Meal Cart
exports.deleteMealFromOfferedMealCartController = async (req, res) => {
  const result = await deleteMealFromOfferedMealCartService(
    req.params.cartId,
    req.params.menuId
  );
  return res.status(200).send(result);
};

exports.deleteMealFromCustomizedMealCartController = async (req, res) => {
  const result = await deleteMealFromCustomizedMealCartService(
    req.params.cartId,
    req.params.mealId
  );
  return res.status(200).send(result);
};
