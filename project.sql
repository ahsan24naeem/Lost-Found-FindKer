-- =========================
-- 📦 DATABASE CREATION
-- =========================
drop login lostfound
CREATE LOGIN lostfound WITH PASSWORD = 'lostfound12345';
CREATE USER lostfound FOR LOGIN lostfound;
ALTER ROLE db_owner ADD MEMBER lostfound;

CREATE DATABASE projectDB;
GO
USE projectDB;
GO

-- =========================
-- 📄 TABLES
-- =========================

-- USERS
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(255) NOT NULL,
    Gender CHAR(1) CHECK (Gender IN ('M', 'F', 'O')),
    Email NVARCHAR(255) UNIQUE NOT NULL CHECK (Email LIKE '%@lhr.nu.edu.pk'),
    PasswordHash NVARCHAR(255),
    PhoneNumber NVARCHAR(11) CHECK (LEN(PhoneNumber) = 11),
    UserRole NVARCHAR(50) CHECK (UserRole IN ('User', 'Admin')) DEFAULT 'User',
    ProfilePic NVARCHAR(MAX) NOT NULL DEFAULT 'https://www.google.com/imgres?q=wolf&imgurl=https%3A%2F%2Fanimalfactguide.com%2Fwp-content%2Fuploads%2F2024%2F01%2Fgray-wolf-2.jpg&imgrefurl=https%3A%2F%2Fanimalfactguide.com%2Fanimal-facts%2Fgray-wolf%2F&docid=17M4gx2EFuvlXM&tbnid=RCaegHjO0ylwQM&vet=12ahUKEwin6dv-gPiMAxWMRqQEHd2rDAIQM3oECF4QAA..i&w=1000&h=710&hcb=2&ved=2ahUKEwin6dv-gPiMAxWMRqQEHd2rDAIQM3oECF4QAA',

    CreatedAt DATETIME DEFAULT GETDATE()
);

-- CATEGORIES
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) UNIQUE NOT NULL
);

-- ITEMS (POSTS)
CREATE TABLE Items (
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title NVARCHAR(255) NOT NULL,
    ItemDescription NVARCHAR(MAX),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    ItemStatus NVARCHAR(50) CHECK (ItemStatus IN ('Lost', 'Found', 'Claimed')) NOT NULL,
    ItemLocation NVARCHAR(255) NOT NULL,
    DateReported DATETIME DEFAULT GETDATE(),
    ImageURL NVARCHAR(255),
	   QRCode NVARCHAR(255) UNIQUE,
    PrivateDetails NVARCHAR(255),
    IsFlagged INT DEFAULT 0,
    ClaimedBy INT NULL FOREIGN KEY REFERENCES Users(UserID)
);

-- CLAIMS
CREATE TABLE Claims (
    ClaimID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT NOT NULL FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    ClaimDetails NVARCHAR(255) NOT NULL,
    ClaimsStatus NVARCHAR(50) CHECK (ClaimsStatus IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    AdminReviewedBy INT NULL FOREIGN KEY REFERENCES Users(UserID)
);

-- NOTIFICATIONS
CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ItemID INT NULL FOREIGN KEY REFERENCES Items(ItemID) ON DELETE SET NULL,
    Message NVARCHAR(255) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- FLAGS (REPORTS)
CREATE TABLE Flags (
    FlagID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    ReportedBy INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Reason NVARCHAR(255) NOT NULL,
    Status NVARCHAR(50) CHECK (Status IN ('Pending', 'Reviewed', 'Dismissed')) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- COMMUNITY VERIFICATION (VOTING ON CLAIMS)
CREATE TABLE CommunityVerification (
    VerificationID INT IDENTITY(1,1) PRIMARY KEY,
    ClaimID INT FOREIGN KEY REFERENCES Claims(ClaimID) ON DELETE CASCADE,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    VoteType NVARCHAR(10) CHECK (VoteType IN ('Upvote', 'Downvote')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT claim_user_unique UNIQUE(ClaimID, UserID)
);

-- LOCATIONS (MAP COORDINATES)
CREATE TABLE Locations (
    LocationID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    Latitude DECIMAL(9,6),
    Longitude DECIMAL(9,6)
);

-- COMMENTS
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    PostID INT FOREIGN KEY REFERENCES Items(ItemID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    CommentText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsFlagged BIT DEFAULT 0
);

-- MESSAGES
CREATE TABLE Messages (
    MessageID INT IDENTITY(1,1) PRIMARY KEY,
    SenderID INT FOREIGN KEY REFERENCES Users(UserID),
    ReceiverID INT FOREIGN KEY REFERENCES Users(UserID),
    PostID INT FOREIGN KEY REFERENCES Items(ItemID),
    MessageText NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);


GO 
CREATE OR ALTER PROCEDURE AdminProcessClaim
    @ClaimID INT,
    @AdminID INT,
    @Decision NVARCHAR(10) -- 'Approve' or 'Reject'
AS
BEGIN
    -- Verify the user is an admin
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @AdminID AND UserRole = 'Admin')
    BEGIN
        RAISERROR('Only administrators can process claims.', 16, 1);
        RETURN;
    END

    -- Get the claim and item information
    DECLARE @ItemID INT;
    DECLARE @ClaimantID INT;
    DECLARE @CurrentClaimStatus NVARCHAR(50);
    DECLARE @ItemOwnerID INT;
    
    SELECT 
        @ItemID = c.ItemID,
        @ClaimantID = c.UserID,
        @CurrentClaimStatus = c.ClaimsStatus,
        @ItemOwnerID = i.UserID
    FROM Claims c
    JOIN Items i ON c.ItemID = i.ItemID
    WHERE c.ClaimID = @ClaimID;
    
    -- Check if claim exists
    IF @ItemID IS NULL
    BEGIN
        RAISERROR('Claim not found.', 16, 1);
        RETURN;
    END
    
    -- Check if claim is already processed
    IF @CurrentClaimStatus != 'Pending'
    BEGIN
        RAISERROR('This claim has already been processed.', 16, 1);
        RETURN;
    END
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF @Decision = 'Approve'
        BEGIN
            -- Update claim status
            UPDATE Claims 
            SET ClaimsStatus = 'Approved', 
                AdminReviewedBy = @AdminID
            WHERE ClaimID = @ClaimID;
            
            -- Update item status to Claimed and set ClaimedBy
            UPDATE Items
            SET ItemStatus = 'Claimed',
                ClaimedBy = @ClaimantID
            WHERE ItemID = @ItemID;
            
            -- Notify the claimant
            INSERT INTO Notifications (UserID, ItemID, Message)
            VALUES (@ClaimantID, @ItemID, 'Your claim has been approved! Please contact the item owner to arrange collection.');
            
            -- Notify the item owner
            INSERT INTO Notifications (UserID, ItemID, Message)
            VALUES (@ItemOwnerID, @ItemID, 'A claim for your item has been approved. The claimant will contact you soon.');
            
            -- Reject all other pending claims for this item
            UPDATE Claims
            SET ClaimsStatus = 'Rejected',
                AdminReviewedBy = @AdminID
            WHERE ItemID = @ItemID 
              AND ClaimID != @ClaimID
              AND ClaimsStatus = 'Pending';
              
            -- Notify other claimants
            INSERT INTO Notifications (UserID, ItemID, Message)
            SELECT UserID, ItemID, 'Your claim has been rejected as another claim was approved.'
            FROM Claims
            WHERE ItemID = @ItemID 
              AND ClaimID != @ClaimID
              AND ClaimsStatus = 'Rejected'
              AND AdminReviewedBy = @AdminID;
        END
        ELSE IF @Decision = 'Reject'
        BEGIN
            -- Update claim status
            UPDATE Claims 
            SET ClaimsStatus = 'Rejected', 
                AdminReviewedBy = @AdminID
            WHERE ClaimID = @ClaimID;
            
            -- Notify the claimant
            INSERT INTO Notifications (UserID, ItemID, Message)
            VALUES (@ClaimantID, @ItemID, 'Your claim has been rejected. Please contact support for more information.');
        END
        ELSE
        BEGIN
            RAISERROR('Invalid decision. Use "Approve" or "Reject".', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

-- =========================
-- 👁️ VIEWS
-- =========================

GO
-- View: Other Users Profile
CREATE VIEW otherUsersProfile AS
SELECT UserID, FullName, Gender, Email, PhoneNumber, CreatedAt
FROM Users;

GO
-- View: All Posts
CREATE VIEW AllPosts AS
SELECT i.ItemID, i.Title, i.ItemDescription, c.CategoryName, i.ItemStatus, 
       i.ItemLocation, i.DateReported, i.ImageURL, u.FullName AS PostedBy
FROM Items i
JOIN Users u ON i.UserID = u.UserID
LEFT JOIN Categories c ON i.CategoryID = c.CategoryID;




GO
-- View: Recent Posts (1 day old)
CREATE VIEW RecentPosts AS
SELECT * FROM AllPosts WHERE DateReported >= DATEADD(DAY, -1, GETDATE());

GO
-- View: Claims on Posts
CREATE VIEW ClaimsOnPosts AS
SELECT c.ClaimID, c.ItemID, u.FullName AS ClaimedBy, c.ClaimDetails, 
       c.ClaimsStatus, c.CreatedAt, a.FullName AS ReviewedBy
FROM Claims c
JOIN Users u ON c.UserID = u.UserID
LEFT JOIN Users a ON c.AdminReviewedBy = a.UserID;

-- =========================
-- ⚙️ STORED PROCEDURES
-- =========================


GO 
CREATE OR ALTER PROCEDURE GetQR
    @ItemID INT
	AS
BEGIN
SELECT    QRCode FROM Items
WHERE @ItemID = ItemID;
END;


-- 🔹 User Management
GO
CREATE OR ALTER PROCEDURE GetUserProfileDetails
    @UserID INT
AS
BEGIN
    SELECT UserID, FullName, Gender, Email, PhoneNumber, ProfilePic, CreatedAt
    FROM Users
    WHERE UserID = @UserID;
END;

GO
CREATE OR ALTER PROCEDURE GetUserItemDetails
    @UserID INT
AS
BEGIN
    -- User's Items (Posts)
    SELECT i.ItemID, i.Title, i.ItemDescription, c.CategoryName, i.ItemStatus, 
           i.ItemLocation, i.DateReported, i.ImageURL
    FROM Items i
    LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
    WHERE i.UserID = @UserID;
END;

GO
CREATE OR ALTER PROCEDURE GetUserClaimDetails
    @UserID INT
AS
BEGIN
    -- User's Claims
    SELECT c.ClaimID, c.ItemID, i.Title AS ClaimedItem, c.ClaimDetails, 
           c.ClaimsStatus, c.CreatedAt
    FROM Claims c
    JOIN Items i ON c.ItemID = i.ItemID
    WHERE c.UserID = @UserID;
END;

GO
CREATE OR ALTER PROCEDURE InsertUser
    @FullName NVARCHAR(255),
    @Gender CHAR(1),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @PhoneNumber NVARCHAR(11),
    @OAuthProvider NVARCHAR(50) = NULL,
    @OAuthID NVARCHAR(255) = NULL
AS
BEGIN
    INSERT INTO Users (FullName, Gender, Email, PasswordHash, PhoneNumber, UserRole)
    VALUES (@FullName, @Gender, @Email, @PasswordHash, @PhoneNumber,   'User');
END;

GO
CREATE OR ALTER PROCEDURE UpdateUserProfile
    @UserID INT,
    @FullName NVARCHAR(255) = NULL,
    @PasswordHash NVARCHAR(255) = NULL,
    @PhoneNumber NVARCHAR(11) = NULL,
    @Email NVARCHAR(255) = NULL,
    @ProfilePic VARCHAR(255) = NULL
AS
BEGIN
    UPDATE Users
    SET 
        FullName = ISNULL(@FullName, FullName),
        PasswordHash = ISNULL(@PasswordHash, PasswordHash),
        PhoneNumber = ISNULL(@PhoneNumber, PhoneNumber),
        Email = ISNULL(@Email, Email),
        ProfilePic = ISNULL(@ProfilePic, ProfilePic)
    WHERE UserID = @UserID;
END;

GO
CREATE OR ALTER PROCEDURE DeleteUserProfile
    @UserID INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
    BEGIN
        DELETE FROM Users WHERE UserID = @UserID;
    END
    ELSE
    BEGIN
        THROW 50002, 'User not found.', 1;
    END
END;

GO
-- 🔹 Authentication
CREATE OR ALTER PROCEDURE GetUserCredentials
    @Email NVARCHAR(255)
AS
BEGIN
    SELECT UserID, FullName, Email, PasswordHash, UserRole
    FROM Users
    WHERE Email = @Email;
END;

-- 🔹 Items & Posts
GO
CREATE OR ALTER PROCEDURE CreatePost
    @UserID INT,
    @Title NVARCHAR(255),
    @ItemDescription NVARCHAR(MAX),
    @CategoryID INT,
    @ItemStatus NVARCHAR(50),
    @ItemLocation NVARCHAR(255),
    @ImageURL NVARCHAR(255),
    @PrivateDetails NVARCHAR(255)
AS
BEGIN
    DECLARE @NewItemID INT;
    
    -- Insert new item
    INSERT INTO Items (UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL, PrivateDetails)
    VALUES (@UserID, @Title, @ItemDescription, @CategoryID, @ItemStatus, @ItemLocation, @ImageURL, @PrivateDetails);

    -- Get the newly inserted ItemID
    SET @NewItemID = SCOPE_IDENTITY();

    -- Call notification procedure
    EXEC AddPostNotification @NewItemID, @UserID;
END;

GO
CREATE OR ALTER PROCEDURE DeletePost
    @ItemID INT
AS
BEGIN
    DELETE FROM Items WHERE ItemID = @ItemID;
END;

GO
CREATE OR ALTER PROCEDURE GetCategorizedPosts
    @CategoryName NVARCHAR(100)
AS
BEGIN
    SELECT * FROM AllPosts WHERE CategoryName = @CategoryName ORDER BY DateReported DESC;
END;

GO
CREATE OR ALTER PROCEDURE GetPostComments
    @PostID INT
AS
BEGIN
    SELECT c.CommentID, u.FullName AS CommentedBy, c.CommentText, c.CreatedAt
    FROM Comments c
    JOIN Users u ON c.UserID = u.UserID
    WHERE c.PostID = @PostID
    ORDER BY c.CreatedAt DESC;
END;

GO
GO
CREATE OR ALTER PROCEDURE SP_GetItemsByFilters
    @Type NVARCHAR(10) = NULL,          -- 'lost' or 'found'
    @Status NVARCHAR(20) = NULL,        -- e.g. 'available', 'claimed'
    @RadiusKm FLOAT = NULL,             -- optional radius in km
    @Latitude FLOAT = NULL,             -- required if RadiusKm is provided
    @Longitude FLOAT = NULL             -- required if RadiusKm is provided
AS
BEGIN
    SELECT 
        i.ItemID,
        i.Title,
        i.ItemDescription AS description,
        i.ItemStatus AS type,
        l.Latitude,
        l.Longitude,
        u.FullName AS owner_name,
        u.Email,
        -- Only calculate distance if radius filter is used
        CASE 
            WHEN @RadiusKm IS NOT NULL THEN
                (6371 * ACOS(
                    COS(RADIANS(@Latitude)) 
                    * COS(RADIANS(l.Latitude)) 
                    * COS(RADIANS(l.Longitude) - RADIANS(@Longitude)) 
                    + SIN(RADIANS(@Latitude)) 
                    * SIN(RADIANS(l.Latitude))
                ))
            ELSE NULL
        END AS distance_km
    FROM Items i
    JOIN Users u ON i.UserID = u.UserID
    LEFT JOIN Locations l ON i.ItemID = l.ItemID
    WHERE
        (@Type IS NULL OR i.ItemStatus = @Type)             -- Filter by item type (lost/found)
        AND (@Status IS NULL OR i.ItemStatus = @Status)   -- Filter by item status
        AND (
            @RadiusKm IS NULL 
            OR (6371 * ACOS(
                COS(RADIANS(@Latitude)) 
                * COS(RADIANS(l.Latitude)) 
                * COS(RADIANS(l.Longitude) - RADIANS(@Longitude)) 
                + SIN(RADIANS(@Latitude)) 
                * SIN(RADIANS(l.Latitude))
              )) <= @RadiusKm
        );
END;

GO
-- 🔹 Claims & Verification
CREATE OR ALTER PROCEDURE ClaimItem
    @ItemID INT,
    @UserID INT,
    @ClaimDetails NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if item exists
        IF NOT EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID)
        BEGIN
            RAISERROR('Item does not exist.', 16, 1);
            RETURN;
        END
        
        -- Check if user has already claimed this item
        IF EXISTS (SELECT 1 FROM Claims WHERE ItemID = @ItemID AND UserID = @UserID)
        BEGIN
            RAISERROR('You have already claimed this item.', 16, 1);
            RETURN;
        END
        
        -- Check if item is already claimed by this user and approved
        IF EXISTS (
            SELECT 1 
            FROM Items 
            WHERE ItemID = @ItemID 
              AND ItemStatus = 'Claimed' 
              AND ClaimedBy = @UserID
        )
        BEGIN
            RAISERROR('You have already successfully claimed this item.', 16, 1);
            RETURN;
        END
        
        -- Insert the claim
        INSERT INTO Claims (ItemID, UserID, ClaimDetails)
        VALUES (@ItemID, @UserID, @ClaimDetails);
        
        -- Notify the item owner about the new claim
        DECLARE @ItemOwnerID INT;
        DECLARE @ItemTitle NVARCHAR(255);
        
        SELECT @ItemOwnerID = UserID, @ItemTitle = Title
        FROM Items
        WHERE ItemID = @ItemID;
        
        INSERT INTO Notifications (UserID, ItemID, Message)
        VALUES (@ItemOwnerID, @ItemID, 'Someone has claimed your item "' + @ItemTitle + '". An admin will review the claim.');
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

GO
CREATE OR ALTER PROCEDURE GetClaimsOnItem
    @ItemID INT
AS
BEGIN
    SELECT * FROM ClaimsOnPosts WHERE ItemID = @ItemID;
END;

GO
CREATE OR ALTER PROCEDURE VoteClaim
    @ClaimID INT,
    @UserID INT,
    @VoteType NVARCHAR(10)
AS
BEGIN
    MERGE INTO CommunityVerification AS target
    USING (SELECT @ClaimID AS ClaimID, @UserID AS UserID) AS source
    ON target.ClaimID = source.ClaimID AND target.UserID = source.UserID
    WHEN MATCHED THEN 
        UPDATE SET VoteType = @VoteType
    WHEN NOT MATCHED THEN
        INSERT (ClaimID, UserID, VoteType) VALUES (@ClaimID, @UserID, @VoteType);
END;

GO
CREATE OR ALTER PROCEDURE GetClaimVotes
    @ClaimID INT
AS
BEGIN
    SELECT COUNT(CASE WHEN VoteType = 'Upvote' THEN 1 END) AS Upvotes,
           COUNT(CASE WHEN VoteType = 'Downvote' THEN 1 END) AS Downvotes
    FROM CommunityVerification
    WHERE ClaimID = @ClaimID;
END;

GO
CREATE OR ALTER PROCEDURE DeleteClaim
    @ClaimID INT,
    @UserID INT
AS
BEGIN
    -- Check if the user is the claimant or an admin
    IF EXISTS (
        SELECT 1 FROM Claims c
        JOIN Users u ON c.UserID = u.UserID
        WHERE c.ClaimID = @ClaimID AND (c.UserID = @UserID OR u.UserRole = 'Admin')
    )
    BEGIN
        DELETE FROM Claims WHERE ClaimID = @ClaimID;
    END
    ELSE
    BEGIN
        THROW 50001, 'You are not authorized to delete this claim.', 1;
    END
END;

GO
CREATE OR ALTER PROCEDURE SP_GetClaimsByItemId
    @ItemID INT,
    @Type NVARCHAR(10) = NULL,         -- 'lost' or 'found'
    @Status NVARCHAR(20) = NULL,       -- 'claimed', 'unclaimed', etc.
    @RadiusKm FLOAT = NULL,            -- optional radius in km
    @Latitude FLOAT = NULL,            -- required if RadiusKm is provided
    @Longitude FLOAT = NULL            -- required if RadiusKm is provided
AS
BEGIN
    SELECT 
        c.ClaimID,
        c.ItemID,
        c.UserID,
        c.ClaimsStatus AS status,
        c.CreatedAt AS claimed_at,
        i.ItemStatus AS type,
        l.Latitude,
        l.Longitude,
        u.FullName AS claimer_name,
        u.Email,
        -- Only calculated if radius filter used
        CASE 
            WHEN @RadiusKm IS NOT NULL THEN
                (6371 * ACOS(
                    COS(RADIANS(@Latitude)) 
                    * COS(RADIANS(l.Latitude)) 
                    * COS(RADIANS(l.Longitude) - RADIANS(@Longitude)) 
                    + SIN(RADIANS(@Latitude)) 
                    * SIN(RADIANS(l.Latitude))
                ))
            ELSE NULL
        END AS distance_km
    FROM Claims c
    JOIN Items i ON c.ItemID = i.ItemID
    JOIN Users u ON c.UserID = u.UserID
    LEFT JOIN Locations l ON i.ItemID = l.ItemID
    WHERE c.ItemID = @ItemID
      AND (@Type IS NULL OR i.ItemStatus = @Type)
      AND (@Status IS NULL OR c.ClaimsStatus = @Status)
      AND (
          @RadiusKm IS NULL 
          OR (6371 * ACOS(
                COS(RADIANS(@Latitude)) 
                * COS(RADIANS(l.Latitude)) 
                * COS(RADIANS(l.Longitude) - RADIANS(@Longitude)) 
                + SIN(RADIANS(@Latitude)) 
                * SIN(RADIANS(l.Latitude))
              )) <= @RadiusKm
      );
END;

-- 🔹 Messaging & Notifications
GO
CREATE OR ALTER PROCEDURE SendMessage
    @SenderID INT,
    @ReceiverID INT,
    @PostID INT,
    @MessageText NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Messages (SenderID, ReceiverID, PostID, MessageText)
    VALUES (@SenderID, @ReceiverID, @PostID, @MessageText);
END;

GO
CREATE OR ALTER PROCEDURE GetMessagesBetweenUsers
    @UserID1 INT,
    @UserID2 INT
AS
BEGIN
    SELECT m.MessageID, u1.FullName AS Sender, u2.FullName AS Receiver,
           m.MessageText, m.CreatedAt, m.IsRead
    FROM Messages m
    JOIN Users u1 ON m.SenderID = u1.UserID
    JOIN Users u2 ON m.ReceiverID = u2.UserID
    WHERE (m.SenderID = @UserID1 AND m.ReceiverID = @UserID2)
       OR (m.SenderID = @UserID2 AND m.ReceiverID = @UserID1)
    ORDER BY m.CreatedAt;
END;

GO
CREATE OR ALTER PROCEDURE GetUserNotifications
    @UserID INT
AS
BEGIN
    SELECT NotificationID, Message, IsRead, CreatedAt
    FROM Notifications
    WHERE UserID = @UserID
    ORDER BY CreatedAt DESC;
END;

GO
CREATE OR ALTER PROCEDURE AddPostNotification
    @ItemID INT,
    @UserID INT
AS
BEGIN
    -- Insert notification for all users except the one who posted
    INSERT INTO Notifications (UserID, ItemID, Message)
    SELECT U.UserID, @ItemID, CONCAT('A new item "', I.Title, '" has been posted.')
    FROM Users U
    CROSS JOIN Items I
    WHERE U.UserID <> @UserID AND I.ItemID = @ItemID;
END;



GO 
CREATE OR ALTER PROCEDURE UpdateItem
    @ItemID INT,
    @UserID INT,  -- For authorization
    @Title NVARCHAR(255) = NULL,
    @ItemDescription NVARCHAR(MAX) = NULL,
    @CategoryID INT = NULL,
    @ItemLocation NVARCHAR(255) = NULL,
    @ImageURL NVARCHAR(255) = NULL,
    @PrivateDetails NVARCHAR(255) = NULL
AS
BEGIN
    -- Check if user owns the item or is admin
    IF NOT EXISTS (
        SELECT 1 FROM Items i
        JOIN Users u ON i.UserID = u.UserID
        WHERE i.ItemID = @ItemID AND (i.UserID = @UserID OR u.UserRole = 'Admin')
    )
    BEGIN
        RAISERROR('You are not authorized to update this item.', 16, 1);
        RETURN;
    END
    
    -- Check if item is already claimed
    IF EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID AND ItemStatus = 'Claimed')
    BEGIN
        RAISERROR('Cannot update a claimed item.', 16, 1);
        RETURN;
    END
    
    -- Update the item
    UPDATE Items
    SET 
        Title = ISNULL(@Title, Title),
        ItemDescription = ISNULL(@ItemDescription, ItemDescription),
        CategoryID = ISNULL(@CategoryID, CategoryID),
        ItemLocation = ISNULL(@ItemLocation, ItemLocation),
        ImageURL = ISNULL(@ImageURL, ImageURL),
        PrivateDetails = ISNULL(@PrivateDetails, PrivateDetails)
    WHERE ItemID = @ItemID;
END;

-- =========================
-- 🔄 TRIGGERS
-- =========================

GO
CREATE TRIGGER trg_Users_Delete_All
ON Users
INSTEAD OF DELETE
AS
BEGIN
    -- Clean Messages
    UPDATE Messages SET SenderID = NULL WHERE SenderID IN (SELECT UserID FROM DELETED);
    UPDATE Messages SET ReceiverID = NULL WHERE ReceiverID IN (SELECT UserID FROM DELETED);

    -- Delete Notifications
    DELETE FROM Notifications WHERE UserID IN (SELECT UserID FROM DELETED);

    -- Delete Comments
    DELETE FROM Comments WHERE UserID IN (SELECT UserID FROM DELETED);

    -- Delete Claims
    DELETE FROM Claims WHERE UserID IN (SELECT UserID FROM DELETED);

    -- Delete CommunityVerification
    DELETE FROM CommunityVerification WHERE UserID IN (SELECT UserID FROM DELETED);

    -- Delete Flags
    DELETE FROM Flags WHERE ReportedBy IN (SELECT UserID FROM DELETED);

	--
	    DELETE FROM Item WHERE UserID IN (SELECT UserID FROM DELETED);

    -- Finally delete user
    DELETE FROM Users WHERE UserID IN (SELECT UserID FROM DELETED);
END;

GO
CREATE TRIGGER trg_Items_Delete_All
ON Items
INSTEAD OF DELETE
AS
BEGIN
    -- Delete Messages
    DELETE FROM Messages WHERE PostID IN (SELECT ItemID FROM DELETED);

    -- Delete Comments
    DELETE FROM Comments WHERE PostID IN (SELECT ItemID FROM DELETED);

    -- Delete Claims
    DELETE FROM Claims WHERE ItemID IN (SELECT ItemID FROM DELETED);

    -- Finally delete item
    DELETE FROM Item WHERE ItemID IN (SELECT ItemID FROM DELETED);
END;

GO
CREATE TRIGGER trg_Claims_Insert_ValidationAndCleanup
ON Claims
AFTER INSERT
AS
BEGIN
    -- 1. Prevent self-claim
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Items it ON i.ItemID = it.ItemID
        WHERE i.UserID = it.UserID
    )
    BEGIN
        RAISERROR ('Users cannot claim their own items.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- 2. Delete community verifications for claiming user
    DELETE cv
    FROM CommunityVerification cv
    JOIN inserted i ON cv.UserID = i.UserID;
END;

GO
-- Validate that ReportedBy user exists
CREATE TRIGGER trg_ValidateReportedByUser
ON Flags
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        LEFT JOIN Users u ON i.ReportedBy = u.UserID
        WHERE u.UserID IS NULL
    )
    BEGIN
        RAISERROR('ReportedBy user does not exist in Users table.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;