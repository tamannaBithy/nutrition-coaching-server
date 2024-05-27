const {
  createBannerService,
  updateBannerService,
  deleteBannerService,
  getAllBannerService,
  getVisibleBannerService,
} = require("../services/BannerServices");

// Controller function to create a new banner (specifically for admin users)
exports.createBannerController = async (req, res) => {
  const result = await createBannerService(req.user._id, req.body, req);
  return res.status(201).send(result);
};

// Controller function to update an existing banner (specifically for admin users)
exports.updateBannerController = async (req, res) => {
  const result = await updateBannerService(req.params.id, req.body, req);
  return res.status(200).send(result);
};

// Controller function to delete a banner (specifically for admin users)
exports.deleteBannerController = async (req, res) => {
  const result = await deleteBannerService(req.params.id);
  return res.status(200).send(result);
};

// Controller function to get all banners (specifically for admin users)
exports.getAllBannersController = async (req, res) => {
  const result = await getAllBannerService(req);
  return res.status(200).send(result);
};

// Controller function to get visible banners
exports.getVisibleBannersController = async (req, res) => {
  const result = await getVisibleBannerService(req);
  return res.status(200).send(result);
};
