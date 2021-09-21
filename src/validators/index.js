import { blogSchema } from "./schemas";

const validInputBlog = input => {
  return blogSchema.validateAsync(input);
};

export { validInputBlog };
