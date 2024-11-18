import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  HOST: string;
  PORT: number;
  DATABASE_URL: string;
  ORIGIN: string;
  JWT_SECRET: string;
  EMAIL_ADDRESS: string;
  EMAIL_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD: string;
}
const envsSchema = Joi.object<EnvVars>({
  HOST: Joi.string().required(),
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  ORIGIN: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  EMAIL_ADDRESS: Joi.string().email().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().empty(''),
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
  emailAddress: envVars.EMAIL_ADDRESS,
  emailPassword: envVars.EMAIL_PASSWORD,
  redisHost: envVars.REDIS_HOST,
  redisPort: envVars.REDIS_PORT,
  redisPassword: envVars.REDIS_PASSWORD,
};
