import { ConflictException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../../prisma/prisma.service";

/**
 * UserService handles all user-related database operations.
 * This includes creating users, finding user, and validation passwords.
 */
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new user in the database
     * @param email - User's email address
     * @param username - User's chose username
     * @param password - User's plain text password (will be encrypted when stored)
     * @returns the created user (without the password for security)
     * @throws ConflictException if a user with the same email or username already exists
     */
    async createUser(email: string, username: string, password: string) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('A user with this email already exists');
            }
            if (existingUser.username === username) {
                throw new ConflictException('A user with this username already exists');
            }
        }

        //Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Find a user by their email or username
     * This is used during login when we don't know if they provided email or username
     * @param identifier - Either email or username
     * @returns User if found, null if not found
     */
    async findByEmailOrUsername(identifier: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });
    }

    /**
     * Find a user by their ID
     * This is used when we have a JWT token and need to get the user's full information
     * @param id - User's ID
     * @returns User if found, null if not found
     */
    async findById(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Validate a user's password
     * @param password - Plain text password from login attempt
     * @param hashedPassword - Hashed password stored in the database
     * @returns true if the password matches, false otherwise
     */
    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

}