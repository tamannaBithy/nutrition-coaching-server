const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  meal: {
    images: [
      {
        type: String,
      },
    ],
    meal_name: String,
  },
  quantityOfOil: Number,
  extraOil: Number,
  quantityOfStarch: Number,
  quantityOfMeat: Number,
  mealId: mongoose.Schema.Types.ObjectId,
});

const mealsByDaySchema = new mongoose.Schema({
  day: String,
  meals: [mealSchema],
  price_for_specific_day: Number,
});

const orderListModelSchema = new mongoose.Schema(
  {
    order_details: {
      type: {
        mainMealCart: [
          {
            _id: false, // Exclude _id from mainMealCart sub-document
            order_type: String,
            menus: [
              {
                quantity: Number,
                sub_total: Number,
                mealDetails: {
                  preference: String,
                  images: [String],
                  meal_name: String,
                  old_price: Number,
                  regular_price: Number,
                  visible: Boolean,
                },
                _id: false,
              },
            ],
            subtotal: {
              type: Number,
            },
            discount: {
              type: Number,
            },
            discountPercentage: {
              type: Number,
            },
            subtotalAfterDiscount: {
              type: Number,
            },
            number_of_meals_per_day: {
              type: Number,
            },
            plan_duration: {
              type: Number,
            },
            box_size: {
              type: String,
            },
          },
        ],
        offeredMealCart: [
          {
            _id: false, // Exclude _id from offeredMealCart sub-document
            ordered_meals_type: String,
            menus: [
              {
                quantity: Number,
                sub_total: Number,
                mealDetails: {
                  category: String,
                  image: String,
                  package_name: String,
                  price: Number,
                  visible: Boolean,
                },
                _id: false,
              },
            ],
            subtotal: {
              type: Number,
            },
            discount: {
              type: Number,
            },
            discountPercentage: {
              type: Number,
            },
            subtotalAfterDiscount: {
              type: Number,
            },
          },
        ],

        customizedMealCart: [
          {
            ordered_meals_type: String,
            mealsByDay: [mealsByDaySchema],
            subtotal: Number,
            discount: Number,
            discountPercentage: Number,
            subtotalAfterDiscount: Number,
          },
        ],

        _id: false, // Exclude _id from order_details
        grandTotal: {
          type: Number,
        },
        discount: {
          type: Number,
        },
        discountPercentageOnGrandTotal: {
          type: Number,
        },
        grandTotalAfterDiscount: {
          type: Number,
        },
      },
      required: false,
    },
    customer_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note_from_user: {
      type: String,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
      default: "COD - (Cash On Delivery)",
    },
    paid_status: {
      type: Boolean,
      required: true,
      default: false,
    },
    order_status: {
      type: String,
      enum: ["pending", "confirm", "rejected"],
      required: true,
    },
    delivery_status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const OrderListModel = mongoose.model("OrderList", orderListModelSchema);

module.exports = OrderListModel;
