# Database Table

## 1. DiscountModel Table

| Field Name   | Type             | Description                                                       |
| ------------ | ---------------- | ----------------------------------------------------------------- |
| `category`   | String (enum)    | Category of the discount (mainMenu, customizeOrder, etc.)         |
| `ranges`     | Array of Objects | Array containing ranges with min, max, percentage, isActive       |
| `created_by` | ObjectId (User)  | Reference to the admin who created this discount. Required field. |
| `createdAt`  | Date             | Timestamp of when the discount document was created.              |
| `updatedAt`  | Date             | Timestamp of the last update to the discount document.            |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 2. InstructorModel Table

| Field Name                 | Type            | Description                                                         |
| -------------------------- | --------------- | ------------------------------------------------------------------- |
| `lang`                     | String (enum)   | Language of the instructor (ar, en).                                |
| `image`                    | String          | Image path of the instructor.                                       |
| `instructor_name`          | String          | Name of the instructor. Required field.                             |
| `instructor_qualification` | String          | Qualification of the instructor. Required field.                    |
| `instructor_details`       | String          | Details or bio of the instructor. Required field.                   |
| `visible`                  | Boolean         | Visibility status of the instructor. Required field.                |
| `created_by`               | ObjectId (User) | Reference to the admin who created this instructor. Required field. |
| `createdAt`                | Date            | Timestamp of when the instructor document was created.              |
| `updatedAt`                | Date            | Timestamp of the last update to the instructor document.            |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 3. KetoAdminModel Table

| Field Name  | Type   | Description                                           |
| ----------- | ------ | ----------------------------------------------------- |
| `ALF1`      | Number |                                                       |
| `ALF2`      | Number |                                                       |
| `ALF3`      | Number |                                                       |
| `ALF4`      | Number |                                                       |
| `ALF5`      | Number |                                                       |
| `ALF6`      | Number |                                                       |
| `cam`       | Number |                                                       |
| `pm`        | Number |                                                       |
| `cm`        | Number |                                                       |
| `fm`        | Number |                                                       |
| `cal`       | Number |                                                       |
| `pl`        | Number |                                                       |
| `cl`        | Number |                                                       |
| `fl`        | Number |                                                       |
| `cage`      | Number |                                                       |
| `cagm`      | Number |                                                       |
| `caga`      | Number |                                                       |
| `came`      | Number |                                                       |
| `camm`      | Number |                                                       |
| `cama`      | Number |                                                       |
| `cale`      | Number |                                                       |
| `calm`      | Number |                                                       |
| `cala`      | Number |                                                       |
| `pge`       | Number |                                                       |
| `pgm`       | Number |                                                       |
| `pga`       | Number |                                                       |
| `pme`       | Number |                                                       |
| `pmm`       | Number |                                                       |
| `pma`       | Number |                                                       |
| `ple`       | Number |                                                       |
| `plm`       | Number |                                                       |
| `pla`       | Number |                                                       |
| `cge`       | Number |                                                       |
| `cgm`       | Number |                                                       |
| `cga`       | Number |                                                       |
| `cme`       | Number |                                                       |
| `cmm`       | Number |                                                       |
| `cma`       | Number |                                                       |
| `cle`       | Number |                                                       |
| `clm`       | Number |                                                       |
| `cla`       | Number |                                                       |
| `fge`       | Number |                                                       |
| `fgm`       | Number |                                                       |
| `fga`       | Number |                                                       |
| `fme`       | Number |                                                       |
| `fmm`       | Number |                                                       |
| `fma`       | Number |                                                       |
| `fle`       | Number |                                                       |
| `flm`       | Number |                                                       |
| `fla`       | Number |                                                       |
| `createdAt` | Date   | Timestamp of when the keto admin model was created.   |
| `updatedAt` | Date   | Timestamp of the last update to the keto admin model. |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 4. MainMealMenuModel Table

| Field Name            | Type                      | Description                                                   |
| --------------------- | ------------------------- | ------------------------------------------------------------- |
| `lang`                | String (enum)             | Language of the meal menu (ar, en).                           |
| `preference`          | ObjectId (MealPreference) | Reference to the meal preference. Required field.             |
| `type_of_meal`        | ObjectId (MealType)       | Reference to the meal type. Required field.                   |
| `image`               | String                    | Image path of the meal.                                       |
| `meal_name`           | String                    | Name of the meal. Required field.                             |
| `main_badge_tag`      | String                    | Main badge tag of the meal.                                   |
| `tags`                | Array of Strings          | Tags associated with the meal. Required field.                |
| `protein`             | Number                    | Protein content of the meal. Required field.                  |
| `fat`                 | Number                    | Fat content of the meal. Required field.                      |
| `carbs`               | Number                    | Carbohydrate content of the meal. Required field.             |
| `calories`            | Number                    | Calorie content of the meal. Required field.                  |
| `nutrition_facts`     | String                    | Path to nutrition facts image.                                |
| `ingredients`         | String                    | Ingredients used in the meal. Required field.                 |
| `heating_instruction` | String                    | Heating instructions for the meal. Required field.            |
| `old_price`           | Number                    | Old price of the meal. Default is 0.                          |
| `regular_price`       | Number                    | Regular price of the meal. Required field.                    |
| `visible`             | Boolean                   | Visibility status of the meal. Required field.                |
| `created_by`          | ObjectId (User)           | Reference to the admin who created this meal. Required field. |
| `createdAt`           | Date                      | Timestamp of when the meal document was created.              |
| `updatedAt`           | Date                      | Timestamp of the last update to the meal document.            |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 5. MealPreference Table

| Field Name         | Type            | Description                                                         |
| ------------------ | --------------- | ------------------------------------------------------------------- |
| `lang`             | String (enum)   | Language of the meal preference (ar, en).                           |
| `preference`       | String          | Preference type (keto, chef’s choice, etc.). Required field.        |
| `preference_image` | String          | Image path associated with the preference.                          |
| `preference_desc`  | String          | Description of the preference. Required field.                      |
| `visible`          | Boolean         | Visibility status of the preference. Required field.                |
| `created_by`       | ObjectId (User) | Reference to the admin who created this preference. Required field. |
| `createdAt`        | Date            | Timestamp of when the preference document was created.              |
| `updatedAt`        | Date            | Timestamp of the last update to the preference document.            |

**Note:** `versionKey` is set to

`false` to prevent the inclusion of the `__v` field in documents.

## 6. MealsPerDay Table

| Field Name    | Type            | Description                                                     |
| ------------- | --------------- | --------------------------------------------------------------- |
| `meals_count` | Number          | Number of meals per day. Required field.                        |
| `visible`     | Boolean         | Visibility status of the meals per day. Required field.         |
| `created_by`  | ObjectId (User) | Reference to the admin who created this object. Required field. |
| `createdAt`   | Date            | Timestamp of when the object was created.                       |
| `updatedAt`   | Date            | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 7. MealType Table

| Field Name     | Type            | Description                                                        |
| -------------- | --------------- | ------------------------------------------------------------------ |
| `lang`         | String (enum)   | Language of the meal type (ar, en).                                |
| `type_of_meal` | String          | Type of the meal (breakfast, lunch, etc.). Required field.         |
| `created_by`   | ObjectId (User) | Reference to the admin who created this meal type. Required field. |
| `createdAt`    | Date            | Timestamp of when the meal type document was created.              |
| `updatedAt`    | Date            | Timestamp of the last update to the meal type document.            |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 8. NotificationModel Table

| Field Name       | Type            | Description                                                             |
| ---------------- | --------------- | ----------------------------------------------------------------------- |
| `user_id`        | ObjectId (User) | Reference to the user associated with the notification. Required field. |
| `title.en`       | String          | Title of the notification in English. Required field.                   |
| `title.ar`       | String          | Title of the notification in Arabic. Required field.                    |
| `description.en` | String          | Description of the notification in English. Required field.             |
| `description.ar` | String          | Description of the notification in Arabic. Required field.              |
| `mark_as_read`   | Boolean         | Mark as read status of the notification. Default is false.              |
| `createdAt`      | Date            | Timestamp of when the notification was created.                         |
| `updatedAt`      | Date            | Timestamp of the last update to the notification.                       |

## 9. NotificationForAdminModel Table

| Field Name       | Type            | Description                                                             |
| ---------------- | --------------- | ----------------------------------------------------------------------- |
| `user_id`        | ObjectId (User) | Reference to the user associated with the notification. Required field. |
| `title.en`       | String          | Title of the notification in English. Required field.                   |
| `title.ar`       | String          | Title of the notification in Arabic. Required field.                    |
| `description.en` | String          | Description of the notification in English. Required field.             |
| `description.ar` | String          | Description of the notification in Arabic. Required field.              |
| `mark_as_read`   | Boolean         | Mark as read status of the notification. Default is false.              |
| `createdAt`      | Date            | Timestamp of when the notification was created.                         |
| `updatedAt`      | Date            | Timestamp of the last update to the notification.                       |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 10. NumberOfDays Table

| Field Name    | Type            | Description                                                     |
| ------------- | --------------- | --------------------------------------------------------------- |
| `days_number` | Number          | Number of days. Required field.                                 |
| `visible`     | Boolean         | Visibility status of the number of days. Required field.        |
| `created_by`  | ObjectId (User) | Reference to the admin who created this object. Required field. |
| `createdAt`   | Date            | Timestamp of when the object was created.                       |
| `updatedAt`   | Date            | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 11. OfferedMealMenuModel Table

| Field Name      | Type              | Description                                                     |
| --------------- | ----------------- | --------------------------------------------------------------- |
| `lang`          | String (enum)     | Language of the offered meal menu (ar, en).                     |
| `category`      | String            | Category of the offered meal menu. Required field.              |
| `package_image` | String            | Image path of the package.                                      |
| `package_name`  | String            | Name of the package. Required field.                            |
| `meals`         | Array of ObjectId | Array of offered meals associated with the package.             |
| `tags`          | Array of Strings  | Tags associated with the offered meal menu. Required field.     |
| `price`         | Number            | Price of the package. Required field.                           |
| `visible`       | Boolean           | Visibility status of the offered meal menu. Required field.     |
| `created_by`    | ObjectId (User)   | Reference to the admin who created this object. Required field. |
| `createdAt`     | Date              | Timestamp of when the object was created.                       |
| `updatedAt`     | Date              | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 12. OfferedMeal Table

| Field Name              | Type            | Description                                                  |
| ----------------------- | --------------- | ------------------------------------------------------------ |
| `image`                 | String          | Image path of the offered meal.                              |
| `meal_name`             | String          | Name of the offered meal. Required field.                    |
| `protein`               | Number          | Protein content of the meal. Required field.                 |
| `carbs`                 | Number          | Carbohydrate content of the meal. Required field.            |
| `fat`                   | Number          | Fat content of the meal. Required field.                     |
| `calories`              | Number          | Calorie content of the meal. Required field.                 |
| `nutrition_facts_image` | String          | Image path for the nutrition facts.                          |
| `ingredients`           | String          | Ingredients used in the meal. Required field.                |
| `heating_instruction`   | String          | Instructions for heating the meal. Required field.           |
| `created_by`            | ObjectId (User) | Reference to the admin who created the meal. Required field. |
| `createdAt`             | Date            | Timestamp of when the meal document was created.             |
| `updatedAt`             | Date            | Timestamp of the last update to the meal document.           |

## 13. MealsByDaySchema Table

| Field Name               | Type             | Description                                  |
| ------------------------ | ---------------- | -------------------------------------------- |
| `day`                    | String           | Day of the meal plan. Required field.        |
| `meals`                  | Array of Objects | Array containing meals for the specific day. |
| `price_for_specific_day` | Number           | Price for the specific day.                  |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 14. OrderListModel Table

| Field Name         | Type            | Description                                                       |
| ------------------ | --------------- | ----------------------------------------------------------------- |
| `order_details`    | Object          | Details of the order.                                             |
| `customer_details` | ObjectId (User) | Reference to the user who placed the order. Required field.       |
| `note_from_user`   | String          | Additional note from the user.                                    |
| `delivery_address` | String          | Address for delivery. Required field.                             |
| `payment_method`   | String          | Payment method for the order. Required field.                     |
| `paid_status`      | Boolean         | Status of payment. Required field.                                |
| `order_status`     | String (enum)   | Status of the order (pending, confirm, rejected). Required field. |
| `delivery_status`  | String (enum)   | Status of delivery (pending, shipped, delivered). Required field. |
| `createdAt`        | Date            | Timestamp of when the order was created.                          |
| `updatedAt`        | Date            | Timestamp of the last update to the order.                        |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 15. OTPModel Table

| Field Name   | Type            | Description                                                    |
| ------------ | --------------- | -------------------------------------------------------------- |
| `otp`        | Number          | One-time password for verification. Required field.            |
| `user_id`    | ObjectId (User) | Reference to the user associated with the OTP. Required field. |
| `verified`   | Boolean         | Verification status of the OTP. Required field.                |
| `expiryTime` | Date            | Expiry time of the OTP. Required field.                        |
| `createdAt`  | Date            | Timestamp of when the OTP was created.                         |
| `updatedAt`  | Date            | Timestamp of the last update to the OTP.                       |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 16. PopupAdsModel Table

| Field Name         | Type            | Description                                                     |
| ------------------ | --------------- | --------------------------------------------------------------- |
| `image`            | String          | Image path of the popup ad. Required field.                     |
| `visible_duration` | Date            | Duration for which the popup ad is visible. Required field.     |
| `visible`          | Boolean         | Visibility status of the popup ad. Required field.              |
| `created_by`       | ObjectId (User) | Reference to the admin who created this object. Required field. |
| `createdAt`        | Date            | Timestamp of when the object was created.                       |
| `updatedAt`        | Date            | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 17. ProfileModel Table

| Field Name         | Type            | Description                                    |
| ------------------ | --------------- | ---------------------------------------------- |
| `user_Id`          | ObjectId (User) | Reference to the user profile. Required field. |
| `name`             | String          | Name of the user.                              |
| `gender`           | String (enum)   | Gender of the user (male, female).             |
| `father_name`      | String          | Father's name of the user.                     |
| `grandfather_name` | String          | Grandfather's name of the user.                |
| `date_of_birth`    | Date            | Date of birth of the user.                     |
| `province`         | String          | Province of the user.                          |
| `district`         | String          | District of the user.                          |
| `locality`         | String          | Locality of the user.                          |
| `neighborhood`     | String          | Neighborhood of the user.                      |
| `alley`            | String          | Alley of the user.                             |
| `house_number`     | String          | House number of the user.                      |
| `notifications`    | Array           |

of Objects | Array containing push notification references. |
| `verified` | Boolean | Verification status of the profile. |
| `createdAt` | Date | Timestamp of when the profile was created. |
| `updatedAt` | Date | Timestamp of the last update to the profile. |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 18. PushNotificationModel Table

| Field Name           | Type                      | Description                                                                |
| -------------------- | ------------------------- | -------------------------------------------------------------------------- |
| `object_id`          | ObjectId (Auto-generated) | Auto-generated ObjectId for the push notification.                         |
| `notification_title` | String                    | Title of the push notification. Required field.                            |
| `notification_desc`  | String                    | Description or content of the push notification. Required field.           |
| `created_by`         | ObjectId (User)           | Reference to the admin who created this push notification. Required field. |
| `createdAt`          | Date                      | Timestamp of when the push notification document was created.              |
| `updatedAt`          | Date                      | Timestamp of the last update to the push notification document.            |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 19. SubscriptionModel Table

| Field Name       | Type   | Description                                                                  |
| ---------------- | ------ | ---------------------------------------------------------------------------- |
| `endpoint`       | String | Endpoint for the subscription. Required field.                               |
| `expirationTime` | Number | Expiration time of the subscription. Default is null.                        |
| `keys`           | Object | Object containing p256dh and auth keys for the subscription. Required field. |
| `createdAt`      | Date   | Timestamp of when the subscription was created.                              |
| `updatedAt`      | Date   | Timestamp of the last update to the subscription.                            |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 20. UserInputsForCustomizedMeal Table

| Field Name             | Type            | Description                                                          |
| ---------------------- | --------------- | -------------------------------------------------------------------- |
| `customer_details`     | ObjectId (User) | Reference to the user for the customized meal. Required field.       |
| `protein`              | Number          | Protein intake for the customized meal. Required field.              |
| `fat`                  | Number          | Fat intake for the customized meal. Required field.                  |
| `carbs`                | Number          | Carbohydrate intake for the customized meal. Required field.         |
| `meal_duration_repeat` | Number          | Duration for repeating the customized meal. Min 0, Max 7. Default 0. |
| `calories`             | Number          | Caloric intake for the customized meal.                              |
| `mealPerDay`           | Number          | Number of meals per day for the customized meal.                     |
| `createdAt`            | Date            | Timestamp of when the object was created.                            |
| `updatedAt`            | Date            | Timestamp of the last update to the object.                          |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 21. UserModel Table

| Field Name          | Type          | Description                                                                |
| ------------------- | ------------- | -------------------------------------------------------------------------- |
| `phone`             | String        | Phone number of the user.                                                  |
| `email`             | String        | Email address of the user.                                                 |
| `password`          | String        | Password of the user. Min length is 6.                                     |
| `disabled_by_admin` | Boolean       | Status indicating whether the user is disabled by admin. Default is false. |
| `role`              | String (enum) | Role of the user (admin, user). Default is user.                           |
| `createdAt`         | Date          | Timestamp of when the user was created.                                    |
| `updatedAt`         | Date          | Timestamp of the last update to the user.                                  |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 22. WeeklyMealCategory Table

| Field Name             | Type            | Description                                                             |
| ---------------------- | --------------- | ----------------------------------------------------------------------- |
| `lang`                 | String (enum)   | Language of the weekly meal category (ar, en).                          |
| `weekly_meal_category` | String          | Category of the weekly meal (ready made, add on, etc.). Required field. |
| `created_by`           | ObjectId (User) | Reference to the admin who created this object. Required field.         |
| `createdAt`            | Date            | Timestamp of when the object was created.                               |
| `updatedAt`            | Date            | Timestamp of the last update to the object.                             |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 23. WeeklyMealMenu Table

| Field Name            | Type                          | Description                                                        |
| --------------------- | ----------------------------- | ------------------------------------------------------------------ |
| `lang`                | String (enum)                 | Language of the weekly meal menu (ar, en).                         |
| `category`            | ObjectId (WeeklyMealCategory) | Reference to the weekly meal category. Required field.             |
| `image`               | String                        | Image path of the weekly meal.                                     |
| `meal_name`           | String                        | Name of the weekly meal. Required field.                           |
| `main_badge_tag`      | String                        | Main badge tag of the weekly meal.                                 |
| `tags`                | Array of Strings              | Tags associated with the weekly meal. Required field.              |
| `protein`             | Number                        | Protein content of the weekly meal. Required field.                |
| `fat`                 | Number                        | Fat content of the weekly meal. Required field.                    |
| `carbs`               | Number                        | Carbohydrate content of the weekly meal. Required field.           |
| `calories`            | Number                        | Calorie content of the weekly meal. Required field.                |
| `nutrition_facts`     | String                        | Path to nutrition facts image.                                     |
| `ingredients`         | String                        | Ingredients used in the weekly meal. Required field.               |
| `heating_instruction` | String                        | Heating instructions for the weekly meal. Required field.          |
| `available_from`      | Date                          | Starting date of availability for the weekly meal. Required field. |
| `unavailable_from`    | Date                          | Ending date of availability for the weekly meal. Required field.   |
| `visible`             | Boolean                       | Visibility status of the weekly meal. Required field.              |
| `created_by`          | ObjectId (User)               | Reference to the admin who created this object. Required field.    |
| `createdAt`           | Date                          | Timestamp of when the object was created.                          |
| `updatedAt`           | Date                          | Timestamp of the last update to the object.                        |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 24. MealsPerDay Table

| Field Name    | Type            | Description                                                     |
| ------------- | --------------- | --------------------------------------------------------------- |
| `meals_count` | Number          | Number of meals per day. Required field.                        |
| `visible`     | Boolean         | Visibility status of meals per day. Required field.             |
| `created_by`  | ObjectId (User) | Reference to the admin who created this object. Required field. |
| `createdAt`   | Date            | Timestamp of when the object was created.                       |
| `updatedAt`   | Date            | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 25. NumberOfDays Table

| Field Name    | Type            | Description                                                     |
| ------------- | --------------- | --------------------------------------------------------------- |
| `days_number` | Number          | Number of days. Required field.                                 |
| `visible`     | Boolean         | Visibility status of the number of days. Required field.        |
| `created_by`  | ObjectId (User) | Reference to the admin who created this object. Required field. |
| `createdAt`   | Date            | Timestamp of when the object was created.                       |
| `updatedAt`   | Date            | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

## 26. OfferedMealMenu Table

| Field Name      | Type               | Description                                                     |
| --------------- | ------------------ | --------------------------------------------------------------- |
| `lang`          | String (enum)      | Language of the offered meal menu (ar, en).                     |
| `category`      | String             | Category of the offered meal menu. Required field.              |
| `package_image` | String             | Image path of the package for the offered meal menu.            |
| `package_name`  | String             | Name of the package for the offered meal menu. Required field.  |
| `meals`         | Array of ObjectIds | Array containing references to offered meals.                   |
| `tags`          | Array of Strings   | Tags associated with the offered meal menu. Required field.     |
| `price`         | Number             | Price of the offered meal menu. Required field.                 |
| `visible`       | Boolean            | Visibility status of the offered meal menu. Required field.     |
| `created_by`    | ObjectId (User)    | Reference to the admin who created this object. Required field. |
| `createdAt`     | Date               | Timestamp of when the object was created.                       |
| `updatedAt`     | Date               | Timestamp of the last update to the object.                     |

**Note:** `versionKey` is set to `false` to prevent the inclusion of the `__v` field in documents.

These are the remaining tables. Let me know if you need further assistance!
