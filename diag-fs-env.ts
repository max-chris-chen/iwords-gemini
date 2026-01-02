// diag-fs-env.ts
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');

console.log(`Checking for .env file at: ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log('✅ .env file found.');
    try {
        const content = fs.readFileSync(envPath, 'utf-8');
        console.log('--- .env file content ---');
        console.log(content);
        console.log('-------------------------');

        if (content.includes('DEEPSEEK_API_KEY') && !content.includes('your_deepseek_api_key_here')) {
             console.log('✅ DEEPSEEK_API_KEY seems to be set.');
        } else {
             console.error('❌ ERROR: DEEPSEEK_API_KEY is missing or is still the placeholder value.');
        }

    } catch (error) {
        console.error('❌ Error reading .env file:', error);
    }
} else {
    console.error('❌ .env file not found.');
}
