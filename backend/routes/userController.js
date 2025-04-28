import sql from "mssql"; // Ensure you have mssql installed
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dbConfig from "../dbConfig.js"; // Import database config

dotenv.config();

// Login function
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    try {
        // Connect to database
        let pool = await sql.connect(dbConfig);
        console.log('Database connected successfully');
        
        // Execute stored procedure
        let result = await pool
            .request()
            .input("Email", sql.NVarChar, email)
            .execute("GetUserCredentials");
        
        console.log('Query result:', result.recordset);

        // Check if user exists
        if (result.recordset.length === 0) {
            console.log('No user found with email:', email);
            return res.status(401).json({ error: "Invalid email or password"});
        }

        const user = result.recordset[0];
        console.log('User found:', { 
            userId: user.UserID, 
            email: user.Email, 
            role: user.UserRole 
        });

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.UserID, email: user.Email, role: user.UserRole },
            process.env.JWT_SECRET || 'your-secret-key', // Fallback secret key
            { expiresIn: "1h" }
        );

        console.log('Login successful, token generated');
        
        // Set the auth cookie
        res.cookie('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour in milliseconds
        });

        res.json({ 
            message: "Login successful", 
            user: {
                id: user.UserID,
                email: user.Email,
                role: user.UserRole
            }
        });
    } catch (error) {
        console.error("Login error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            number: error.number
        });
        res.status(500).json({ 
            error: "Server error",
            details: error.message 
        });
    }
};

// User Registration
export const registerUser = async (req, res) => {
    const { fullName, email, password, phoneNumber, gender } = req.body;

    try {
        // Connect to database
        let pool = await sql.connect(dbConfig);
        
        // Check if user already exists
        const checkResult = await pool
            .request()
            .input("Email", sql.NVarChar, email)
            .query("SELECT Email FROM Users WHERE Email = @Email");

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const result = await pool
            .request()
            .input("FullName", sql.NVarChar, fullName)
            .input("Email", sql.NVarChar, email)
            .input("PasswordHash", sql.NVarChar, hashedPassword)
            .input("PhoneNumber", sql.NVarChar, phoneNumber || null)
            .input("Gender", sql.Char, gender || null)
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, Gender)
                VALUES (@FullName, @Email, @PasswordHash, @PhoneNumber, @Gender);
                SELECT SCOPE_IDENTITY() AS UserID;
            `);

        const userId = result.recordset[0].UserID;

        res.status(201).json({
            message: "User registered successfully",
            userId: userId
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


// Add this function to verify tokens
export const verifyUserToken = async (req, res) => {
    try {
      // The verifyToken middleware has already validated the token
      // and attached the user data to req.user
      if (!req.user) {
        return res.status(401).json({ error: 'Invalid token' })
      }
  
      // Return the user data (excluding sensitive information)
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role
        }
      })
    } catch (error) {
      console.error('Token verification error:', error)
      res.status(401).json({ error: 'Token verification failed' })
    }
  }

// Logout function
export const logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    // Return success response
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}; 