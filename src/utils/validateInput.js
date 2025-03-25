const { z } = require('zod');

const renderSchema = z.object({
  html: z.string().min(1, 'HTML content is required.'),
  width: z.number().optional(),
  height: z.number().optional(),
  outputFormat: z.enum(['base64', 'binary']).default('binary'),
  outputType: z.enum(['png', 'jpeg']).default('png'),
});

function validateInput(body) {
  const result = renderSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new Error(JSON.stringify(errors));
  }
  return result.data;
}

module.exports = validateInput;
