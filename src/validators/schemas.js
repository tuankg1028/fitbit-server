const Joi = require("joi");

const blogSchema = Joi.object().keys({
  title: Joi.string().required()
});

export { blogSchema };
