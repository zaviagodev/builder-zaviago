// Catch all unknown routes that starts with /api/auth (for user login or logout, for example)
// Reff: https://next-auth.js.org/getting-started/rest-api
import { connectDatabase } from '../../../src/db';
import { verifyPassword } from '../../../src/auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    secret:  process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        // updateAge: 24 * 60 * 60, // 24 hours
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {

                let client;
                try {
                    client = await connectDatabase();
                } catch (error) {
                    throw new Error('Connecting to the database failed.');
                }

                const db = client.db();

                const user = await db.collection('users').findOne({
                    email: credentials.email
                });
                if(!user) {
                    // User not found
                    await client.close();
                    throw new Error(`Sorry, we couldn't log you in. Please check that you have entered the correct account details.`);
                }

                if(user.inactive) {
                    // User inactive
                    await client.close();
                    throw new Error(`Sorry, we couldn't log you in.`);
                }

                const isValid = await verifyPassword(credentials.password, user.password);
                if(!isValid) {
                    // Incorrect password
                    await client.close();
                    throw new Error('Oops! The password you entered is incorrect. Please try again.');
                }

                await client.close();

                const userData = { name: user.username, email: user.email };
                return userData;

            }
        })
    ],
}

export default NextAuth(authOptions);