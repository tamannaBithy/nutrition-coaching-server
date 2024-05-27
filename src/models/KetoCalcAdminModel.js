const mongoose = require("mongoose");

const ketoAdminModelSchema = new mongoose.Schema(
  {
    ALF1: {
      type: Number,
      default: 1.2,
    },
    ALF2: {
      type: Number,
      default: 1.375,
    },
    ALF3: {
      type: Number,
      default: 1.465,
    },
    ALF4: {
      type: Number,
      default: 1.55,
    },
    ALF5: {
      type: Number,
      default: 1.725,
    },
    ALF6: {
      type: Number,
      default: 1.9,
    },
    cam: {
      type: Number,
    },
    pm: {
      type: Number,
    },
    cm: {
      type: Number,
    },
    fm: {
      type: Number,
    },
    cal: {
      type: Number,
    },
    pl: {
      type: Number,
    },
    cl: {
      type: Number,
    },
    fl: {
      type: Number,
    },
    cage: {
      type: Number,
    },
    cagm: {
      type: Number,
    },
    caga: {
      type: Number,
    },
    came: {
      type: Number,
    },
    camm: {
      type: Number,
    },
    cama: {
      type: Number,
    },
    cale: {
      type: Number,
    },
    calm: {
      type: Number,
    },
    cala: {
      type: Number,
    },
    pge: {
      type: Number,
    },
    pgm: {
      type: Number,
    },
    pga: {
      type: Number,
    },
    pme: {
      type: Number,
    },
    pmm: {
      type: Number,
    },
    pma: {
      type: Number,
    },
    ple: {
      type: Number,
    },
    plm: {
      type: Number,
    },
    pla: {
      type: Number,
    },
    cge: {
      type: Number,
    },
    cgm: {
      type: Number,
    },
    cga: {
      type: Number,
    },
    cme: {
      type: Number,
    },
    cmm: {
      type: Number,
    },
    cma: {
      type: Number,
    },
    cle: {
      type: Number,
    },
    clm: {
      type: Number,
    },
    cla: {
      type: Number,
    },
    fge: {
      type: Number,
    },
    fgm: {
      type: Number,
    },
    fga: {
      type: Number,
    },
    fme: {
      type: Number,
    },
    fmm: {
      type: Number,
    },
    fma: {
      type: Number,
    },
    fle: {
      type: Number,
    },
    flm: {
      type: Number,
    },
    fla: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const KetoAdminModel = mongoose.model(
  "KetoCalculatorInput",
  ketoAdminModelSchema
);

module.exports = KetoAdminModel;
