import { config } from "dotenv";
import { join } from "path";

const envPath = join(__dirname, '../../.env');

config({ path: envPath });

export default {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    url: process.env.URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiToken: process.env.CLOUDINARY_API_TOKEN,
};