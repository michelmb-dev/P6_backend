import Joi from "joi";
import sanitizeHtml from "sanitize-html";


/**
 * Validate a form authentification.
 *
 * @param {object} data
 * @returns {Joi.ValidationResult}
 */
export const authFormValidation = (data) => {
	const schema  = Joi.object({
		email: Joi.string().trim().email().regex(/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/).message("Please enter a valid email address.").required(),
		password: Joi.string().trim().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).message("The password must contain at least one Capital letter, 1 digit and a minimum length of 8 characters.").required()
	});
	return schema.validate(data);
}

/**
 * Create extension for sanitize html tag
 */
const customJoi = Joi.extend((Joi) => {
	return {
		type: "string",
		base: Joi.string(),
		rules: {
			htmlStrip: {
				validate(value) {
					return sanitizeHtml(value, {
						allowedTags: [],
						allowedAttributes: {},
					});
				},
			},
		},
	};
});

/**
 * Validate a form sauce.
 *
 * @param {object} data
 * @returns {customJoi.ValidationResult}
 */
export const sauceFormValidation = (data) => {
	const schema = customJoi.object({
		userId: customJoi.string().required(),
		name: customJoi.string().trim().min(3).max(64).htmlStrip().required(),
		manufacturer: customJoi.string().trim().min(3).max(32).htmlStrip().required(),
		description: customJoi.string().trim().min(6).htmlStrip().required(),
		imageUrl: customJoi.string().uri().optional(),
		mainPepper: customJoi.string().trim().min(3).max(32).htmlStrip().required(),
		heat: customJoi.number().integer().min(1).max(10).required()
	})

	return schema.validate(data);
}
