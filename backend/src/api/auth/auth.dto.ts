import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
    /**
     * Email validation:
     * - Must be a valid email format
     * - Cannot be empty
     */
    @IsEmail({}, { message: "Please provide a valid email address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    /**
     * Username validation:
     * - Must be at least 3 characters long
     * - Cannot be empty
     * - Must be a string of letters, numbers, underscores
     */
    @IsString({ message: 'Username must be a string' })
    @IsNotEmpty({ message: "Username is required" })
    @MinLength(3, { message: "Username must be at least 3 characters long" })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores'
    })
    username: string;

    /**
     * Password validation:
     * - Must be at least 6 characters long
     * - Cannot be empty
     * - Must be a string
     */
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Password must contain at least one letter and one number'
    })
    password: string;
}

export class LoginDto {

    /**
     * Identifier can be either email or username
     */
    @IsString({ message: 'Please provide an email or username' })
    @IsNotEmpty({ message: 'Email or username is required' })
    identifier: string;

    /**
     * Password is required for login
     */
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}