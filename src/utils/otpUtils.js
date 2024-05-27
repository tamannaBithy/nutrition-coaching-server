/**
 * Generates a random OTP of specified length.
 * @param {number} length - Length of the OTP to be generated.
 * @returns {number} - The generated OTP.
 */
exports.generateOTP = async (length) => {
  if (length <= 0 || length > 10) {
    throw new Error("Invalid OTP length. Length should be between 1 and 10.");
  }

  const otp = Math.floor(
    10 ** (length - 1) + Math.random() * (9 * 10 ** (length - 1))
  );
  return otp;
};
