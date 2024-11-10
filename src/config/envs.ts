import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  HOST: string;
  PORT: number;
  DATABASE_URL: string;
  ORIGIN: string;
  JWT_SECRET: string;
  EMAIL: string;
  PASSWORD: string;
}
const envsSchema = Joi.object<EnvVars>({
  HOST: Joi.string().required(),
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  ORIGIN: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  EMAIL: Joi.string().required(),
  PASSWORD: Joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  host: envVars.HOST,
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  origin: envVars.ORIGIN,
  secret: envVars.JWT_SECRET,
  email: envVars.EMAIL,
  password: envVars.PASSWORD,
};
