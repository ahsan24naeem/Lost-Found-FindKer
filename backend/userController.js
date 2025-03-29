import sql from "mssql"; // Ensure you have mssql installed
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dbConfig from "./dbConfig.js"; // Import database config

dotenv.config();

// Login function
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Connect to database
        let pool = await sql.connect(dbConfig);
        
        // Execute stored procedure
        let result = await pool
            .request()
            .input("Email", sql.NVarChar, email)
            .execute("GetUserCredentials");

        // Check if user exists
        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid email or password"});
        }

        const user = result.recordset[0];

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.UserID, email: user.Email, role: user.UserRole },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// User Registration
export const registerUser = async (req, res) => {
    const { fullName, gender, email, password, phoneNumber, oauthProvider, oauthID } = req.body;

    try {
        // Hash the password before storing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Connect to database
        let pool = await sql.connect(dbConfig);

        // Execute the stored procedure
        let result = await pool
            .request()
            .input("FullName", sql.NVarChar, fullName)
            .input("Gender", sql.Char, gender)
            .input("Email", sql.NVarChar, email)
            .input("PasswordHash", sql.NVarChar, hashedPassword)
            .input("PhoneNumber", sql.NVarChar, phoneNumber)
            .input("OAuthProvider", sql.NVarChar, oauthProvider || null)
            .input("OAuthID", sql.NVarChar, oauthID || null)
            .execute("InsertUser");

        res.status(201).json({
            message: "User registered successfully",
            userId: result.recordset[0].UserID,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get user profile details
export const getUserProfile = async (req, res) => {
    const { userID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("UserID", userID)
            .execute("GetUserProfileDetails");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user profile", error: err.message });
    }
};

// Get user item details
export const getUserItems = async (req, res) => {
    const { userID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("UserID", userID)
            .execute("GetUserItemDetails");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user items", error: err.message });
    }
};

// Get user claims
export const getUserClaims = async (req, res) => {
    const { userID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input("UserID", userID)
            .execute("GetUserClaimDetails");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user claims", error: err.message });
    }
};

// Update user details
export const updateUser = async (req, res) => {
    const { userID } = req.params;
    const { fullName, passwordHash, phoneNumber } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("UserID", userID)
            .input("FullName", fullName)
            .input("PasswordHash", passwordHash)
            .input("PhoneNumber", phoneNumber)
            .execute("UpdateUser");
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    const { userID } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input("UserID", userID)
            .execute("DeleteUser");
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};

// Get public profile details (excluding sensitive data)
export const getPublicUserProfile = async (req, res) => {
    const { userID } = req.params;
    try {
        let pool = await sql.connect(dbConfig); // Get the database connection
        const result = await pool
            .request()
            .input('UserID', sql.Int, userID) // Use parameterized queries to prevent SQL injection
            .query(`SELECT * FROM otherUsersProfile WHERE UserID = @UserID`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user profile", error: err.message });
    }
};
