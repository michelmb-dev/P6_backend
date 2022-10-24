import Joi from "joi";

export const authFormValidation = (data) => {
	const schema  = Joi.object({
		email: Joi.string().trim().required().email(),
		password: Joi.string().trim().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).message("The password must contain at least one Capital letter, 1 digit and a minimum length of 8 characters.").required()
	})
	return schema.validate(data)
}

export const sauceFormValidation = (data) => {
	const schema = Joi.object({
		userId: Joi.string().required(),
		name: Joi.string().trim().min(3).max(64).required(),
		manufacturer: Joi.string().trim().min(3).max(32).required(),
		description: Joi.string().trim().min(6).required(),
		mainPepper: Joi.string().trim().min(3).max(32).required(),
		heat: Joi.integer().min(1).max(10).required()
	})
	return schema.validate(data)
}

