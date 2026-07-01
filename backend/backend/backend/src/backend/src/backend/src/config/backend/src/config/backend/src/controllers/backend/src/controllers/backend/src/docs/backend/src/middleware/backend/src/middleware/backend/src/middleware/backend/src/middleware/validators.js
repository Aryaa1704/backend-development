import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const taskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(1000).allow('').default(''),
  status: Joi.string().valid('todo', 'in-progress', 'done').default('todo'),
  dueDate: Joi.date().iso().optional(),
});

export const updateTaskSchema = taskSchema.fork(['title'], (field) => field.optional()).min(1);
