import PasswordValidator from "password-validator";

export const passwordSchema = new PasswordValidator();

passwordSchema
  .is()
  .min(8)
  .is()
  .max(32)
  .has()
  .not()
  .spaces()
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits();
