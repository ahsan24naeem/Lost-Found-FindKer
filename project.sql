-- =========================
-- 📦 DATABASE CREATION
-- =========================
--drop login lostfound
--CREATE LOGIN lostfound WITH PASSWORD = 'lostfound12345';
--CREATE USER lostfound FOR LOGIN lostfound;
--ALTER ROLE db_owner ADD MEMBER lostfound;

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
    UserRole NVARCHAR(50) CHECK (UserRole IN ('User', 'Admin')) DEFAULT 'User', -- PROPHILE PIC FINISH 
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
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ,
    Title NVARCHAR(255) NOT NULL,
    ItemDescription NVARCHAR(MAX),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    ItemStatus NVARCHAR(50) CHECK (ItemStatus IN ('Lost', 'Found', 'Retrieved', 'Pending')) NOT NULL,
    ItemLocation NVARCHAR(255) NOT NULL,
    DateReported DATETIME DEFAULT GETDATE(),
    ImageURL NVARCHAR(255),
	IsFlagged INT,
	ClaimedBY INT NULL 

	CONSTRAINT FK_Items_ClaimedBy FOREIGN KEY (ClaimedBy) REFERENCES Users(UserID)
);

-- CLAIMS
CREATE TABLE Claims (
    ClaimID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT NOT NULL FOREIGN KEY REFERENCES Items(ItemID) ,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID), 
    ClaimDetails NVARCHAR(255) NOT NULL,
	CreatedAt DATETIME DEFAULT GETDATE(),
	[Status] NVARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Approved', 'Rejected'))
);

-- NOTIFICATIONS
CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ItemID INT NULL FOREIGN KEY REFERENCES Items(ItemID) ON DELETE SET NULL,
    Message NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
	IsRead BIT DEFAULT 0
);

-- FLAGS (REPORTS)
CREATE TABLE Flags (
    FlagID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT FOREIGN KEY REFERENCES Items(ItemID),
    ReportedBy INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Reason NVARCHAR(255) NOT NULL,
    Status NVARCHAR(50) CHECK (Status IN ('Pending', 'Reviewed', 'Dismissed')) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE CommunityVerification (
    ClaimID INT FOREIGN KEY REFERENCES Claims(ClaimID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    VoteType NVARCHAR(10) CHECK (VoteType IN ('Upvote', 'Downvote')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (ClaimID, UserID)
);
select * from CommunityVerification

-- MESSAGES
CREATE TABLE Messages (
    MessageID INT IDENTITY(1,1) PRIMARY KEY,
    SenderID INT FOREIGN KEY REFERENCES Users(UserID),
    ReceiverID INT FOREIGN KEY REFERENCES Users(UserID),
    PostID INT FOREIGN KEY REFERENCES Items(ItemID),
    MessageText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    PostID INT FOREIGN KEY REFERENCES Items(ItemID),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    CommentText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
);
-- =========================
-- 🗂️ CATEGORIES
-- =========================
INSERT INTO Categories (CategoryName)
VALUES
('Electronics'),
('Stationery'),
('Accessories'),
('Valueables'),
('Personal Items'),
('Sports Equipment'),
('Others');

-- =========================
-- 👁️ VIEWS
-- =========================


-- =========================
-- ⚙️ STORED PROCEDURES
-- =========================

-- 🔹 User Management
select * from CommunityVerification

GO

CREATE OR ALTER PROCEDURE GetUserProfileDetails
    @UserID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        SELECT UserID, FullName, Gender, Email, PhoneNumber, CreatedAt
        FROM Users
        WHERE UserID = @UserID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END;
GO  

CREATE OR ALTER PROCEDURE GetUserItemDetails
    @UserID INT
AS
BEGIN
    BEGIN TRY
        SELECT i.ItemID, i.Title, i.ItemDescription, c.CategoryName, i.ItemStatus, 
               i.ItemLocation, i.DateReported, i.ImageURL
        FROM Items i
        LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
        WHERE i.UserID = @UserID;
    END TRY
    BEGIN CATCH
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;

GO
--CREATE OR ALTER PROCEDURE GetUserClaimDetails
--    @UserID INT
--AS
--BEGIN
--    BEGIN TRY
--        BEGIN TRANSACTION;
        
--        SELECT c.ClaimID, c.ItemID, i.Title AS ClaimedItem, c.ClaimDetails, 
--               c.Status, c.CreatedAt
--        FROM Claims c
--        JOIN Items i ON c.ItemID = i.ItemID
--        WHERE c.UserID = @UserID;
        
--        COMMIT TRANSACTION;
--    END TRY
--    BEGIN CATCH
--        IF @@TRANCOUNT > 0
--            ROLLBACK TRANSACTION;
        
--        THROW;
--    END CATCH
--END;

GO

GO
CREATE OR ALTER PROCEDURE UpdateUserProfile
    @UserID INT,
    @FullName NVARCHAR(255) = NULL,
    @PasswordHash NVARCHAR(255) = NULL,
    @PhoneNumber NVARCHAR(11) = NULL,
    @Email NVARCHAR(255) = NULL
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE Users
        SET 
            FullName = ISNULL(@FullName, FullName),
            PasswordHash = ISNULL(@PasswordHash, PasswordHash),
            PhoneNumber = ISNULL(@PhoneNumber, PhoneNumber),
            Email = ISNULL(@Email, Email)
        WHERE UserID = @UserID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO


CREATE OR ALTER PROCEDURE DeleteUserProfile
    @UserID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        BEGIN
            PRINT 'Error: User not found.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        DELETE FROM Users WHERE UserID = @UserID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

GO
-- 🔹 Authentication
CREATE OR ALTER PROCEDURE GetUserCredentials
    @Email NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SELECT u.UserID, u.FullName, u.Email, u.PasswordHash, u.UserRole
        FROM Users u
        WHERE u.Email = @Email;
    END TRY
    BEGIN CATCH
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;


-- 🔹 Items & Posts

select * from 
-- View: All Posts
--exec allposts
CREATE OR ALTER PROCEDURE AllPosts
AS
BEGIN
    SET NOCOUNT ON; -- how many rows effected message
    
    BEGIN TRY
        SELECT 
            i.ItemID, 
            i.Title, 
            i.ItemDescription, 
            c.CategoryName, 
            i.ItemStatus, 
            i.ItemLocation, 
            i.DateReported, 
            i.ImageURL, 
            u.FullName AS PostedBy, 
            u.UserID
        FROM Items i
        JOIN Users u ON i.UserID = u.UserID
        LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
        ORDER BY i.DateReported DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

CREATE view AllPosts
AS
begin
            SELECT 
            i.ItemID, 
            i.Title, 
            i.ItemDescription, 
            c.CategoryName, 
            i.ItemStatus, 
            i.ItemLocation, 
            i.DateReported, 
            i.ImageURL, 
            u.FullName AS PostedBy, 
            u.UserID
        FROM Items i
        JOIN Users u ON i.UserID = u.UserID
        LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
		where 
end

update Items
set ItemStatus = 'Found'
where ItemID = 1

select * from items

GO
CREATE OR ALTER PROCEDURE CreatePost
    @UserID INT,
    @Title NVARCHAR(255),
    @ItemDescription NVARCHAR(MAX),
    @CategoryID INT,
    @Status NVARCHAR(50),
    @ItemLocation NVARCHAR(255),
    @ImageURL NVARCHAR(255),
    @NewItemID INT OUTPUT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate Status
        IF @Status NOT IN ('Lost', 'Found', 'Retrieved')
        BEGIN
            RAISERROR('Invalid item status. Must be Lost, Found, or Retrieved', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insert new item
        INSERT INTO Items (UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL, IsFlagged, ClaimedBy)
        VALUES (@UserID, @Title, @ItemDescription, @CategoryID, @Status, @ItemLocation, @ImageURL, NULL, NULL);

        -- Get the newly inserted ItemID
        SET @NewItemID = SCOPE_IDENTITY();
        
        -- Call notification procedure
        EXEC AddPostNotification @NewItemID, @UserID;
               
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        -- Re-throw the error to be caught by the application
        THROW;
    END CATCH
END;
select * from Items



-- PARAMETER @UserID ADDED 
CREATE OR ALTER PROCEDURE DeletePost
    @ItemID INT,
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if user owns the item or is admin
        IF NOT EXISTS (
            SELECT 1 FROM Items i
            WHERE i.ItemID = @ItemID
        )
        BEGIN
            PRINT 'Error: You are not authorized to delete this item.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        DELETE FROM Items WHERE ItemID = @ItemID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

GO
select * from claims
-- 🔹 Claims & Verification  
CREATE OR ALTER PROCEDURE ClaimItem
    @ItemID INT,
    @UserID INT,
    @ClaimDetails NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validation checks
        IF NOT EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID)
        BEGIN 
            PRINT 'Error: Item does not exist.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check item status is 'Found'
        IF NOT EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID AND ItemStatus = 'Found')
        BEGIN
            PRINT 'Error: Only "Found" items can be claimed.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM Claims WHERE ItemID = @ItemID AND UserID = @UserID)
        BEGIN
            PRINT 'Error: You have already claimed this item.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check if user is trying to claim their own item
        IF EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID AND UserID = @UserID)
        BEGIN
            PRINT 'Error: You cannot claim your own item.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check if item is already claimed
        IF EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID AND ClaimedBy IS NOT NULL)
        BEGIN
            PRINT 'Error: This item has already been claimed.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Insert with Status 'Pending'
        INSERT INTO Claims (ItemID, UserID, ClaimDetails, Status)
        VALUES (@ItemID, @UserID, @ClaimDetails, 'Pending');
        
        -- Get the newly inserted ClaimID
        DECLARE @NewClaimID INT = SCOPE_IDENTITY();
        
        -- Notification for item owner only
        DECLARE @ItemOwnerID INT, @ItemTitle NVARCHAR(255);
        SELECT @ItemOwnerID = UserID, @ItemTitle = Title FROM Items WHERE ItemID = @ItemID;
        
        -- Notify the item owner
        INSERT INTO Notifications (UserID, ItemID, Message)
        VALUES (@ItemOwnerID, @ItemID, 'Someone has claimed your item "' + @ItemTitle + '". Review the claim in your dashboard.');
        
        -- Return the new claim ID
        SELECT @NewClaimID AS NewClaimID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;

GO
select * from Claims
CREATE OR ALTER PROCEDURE GetClaimsOnItem
    @ItemID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        SELECT 
            c.ClaimID,
            c.ItemID,
            c.UserID,
            u.FullName AS ClaimerName,
            u.Email AS ClaimerEmail,
            c.ClaimDetails,
            c.Status,
            c.CreatedAt,
            (SELECT COUNT(*) FROM CommunityVerification cv 
             WHERE cv.ClaimID = c.ClaimID AND cv.VoteType = 'Upvote') AS Upvotes,
            (SELECT COUNT(*) FROM CommunityVerification cv 
             WHERE cv.ClaimID = c.ClaimID AND cv.VoteType = 'Downvote') AS Downvotes
        FROM Claims c
        JOIN Users u ON c.UserID = u.UserID
        WHERE c.ItemID = @ItemID
        ORDER BY c.CreatedAt DESC;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END;

select * from Claims

GO
CREATE OR ALTER PROCEDURE VoteClaim
    @ClaimID INT,
    @UserID INT,
    @VoteType NVARCHAR(10)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate VoteType
        IF @VoteType NOT IN ('Upvote', 'Downvote')
        BEGIN
            PRINT 'Error: Invalid vote type.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check if user is the claimant (can't vote on own claim)
        IF EXISTS (SELECT 1 FROM Claims WHERE ClaimID = @ClaimID AND UserID = @UserID)
        BEGIN
            PRINT 'Error: You cannot vote on your own claim.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        MERGE INTO CommunityVerification AS target
        USING (SELECT @ClaimID AS ClaimID, @UserID AS UserID) AS source
        ON target.ClaimID = source.ClaimID AND target.UserID = source.UserID
        WHEN MATCHED THEN 
            UPDATE SET VoteType = @VoteType
        WHEN NOT MATCHED THEN
            INSERT (ClaimID, UserID, VoteType) VALUES (@ClaimID, @UserID, @VoteType);
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;

GO

select * from Claims
CREATE OR ALTER PROCEDURE DeleteClaim
    @ClaimID INT,
    @UserID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
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
            PRINT 'Error: You are not authorized to delete this claim.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

--NEW
CREATE OR ALTER PROCEDURE AcknowledgeClaim
    @ItemID INT,
    @PosterID INT,  -- The original poster of the item
    @ClaimID INT    -- The claim being acknowledged
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verify the user is the original poster of the item
        IF NOT EXISTS (
            SELECT 1 
            FROM Items 
            WHERE ItemID = @ItemID AND UserID = @PosterID
        )
        BEGIN
            PRINT 'Error: You must be the original poster of this item to acknowledge claims.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verify the claim exists and is for this item
        DECLARE @ClaimantID INT;
        SELECT @ClaimantID = UserID
        FROM Claims
        WHERE ClaimID = @ClaimID AND ItemID = @ItemID;
        
        IF @ClaimantID IS NULL
        BEGIN
            PRINT 'Error: The specified claim does not exist or is not for this item.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check if the claim is still pending
        IF NOT EXISTS (
            SELECT 1 
            FROM Claims 
            WHERE ClaimID = @ClaimID AND Status = 'Pending'
        )
        BEGIN
            PRINT 'Error: Only pending claims can be acknowledged.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Update the item status to Pending and set ClaimedBy
        UPDATE Items
        SET ItemStatus = 'Pending',
            ClaimedBy = @ClaimantID
        WHERE ItemID = @ItemID;
        
        -- Notify the claimant
        DECLARE @ItemTitle NVARCHAR(255), @PosterName NVARCHAR(255);
        SELECT @ItemTitle = Title FROM Items WHERE ItemID = @ItemID;
        SELECT @PosterName = FullName FROM Users WHERE UserID = @PosterID;
        
        INSERT INTO Notifications (UserID, ItemID, Message)
        VALUES (
            @ClaimantID, 
            @ItemID,
            'Your claim for "' + @ItemTitle + '" has been acknowledged by ' + @PosterName + '. Waiting for admin approval.'
        );
        
        -- Notify admins that a claim has been acknowledged and needs final approval
        -- This is now the only place where admins are notified about claims
        INSERT INTO Notifications (UserID, ItemID, Message)
        SELECT 
            u.UserID, 
            @ItemID,
            'A claim for item "' + @ItemTitle + '" has been acknowledged by the poster and needs final approval.'
        FROM Users u
        WHERE u.UserRole = 'Admin';
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

select * from Items
select * from Claims

-- PARA @Status CHANGED 
CREATE OR ALTER PROCEDURE AdminProcessClaim
    @ClaimID INT,
    @Status NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        -- Verify the user is an admin
        -- Get the claim and item information
        DECLARE @ItemID INT;
        DECLARE @ClaimantID INT;
        DECLARE @CurrentClaimStatus NVARCHAR(50);
        DECLARE @ItemOwnerID INT;
        DECLARE @ItemStatus NVARCHAR(50);
        DECLARE @CurrentClaimedBy INT;
        
        SELECT 
            @ItemID = c.ItemID,
            @ClaimantID = c.UserID,
            @CurrentClaimStatus = c.Status,
            @ItemOwnerID = i.UserID,
            @ItemStatus = i.ItemStatus,
            @CurrentClaimedBy = i.ClaimedBy
        FROM Claims c
        JOIN Items i ON c.ItemID = i.ItemID
        WHERE c.ClaimID = @ClaimID;
        
        -- Check if claim exists
        IF @ItemID IS NULL
        BEGIN
            PRINT 'Error: Claim not found.';
            RETURN;
        END
        
        -- Check if claim is already processed (not pending)
        IF @CurrentClaimStatus != 'Pending'
        BEGIN
            PRINT 'Error: This claim has already been processed.';
            RETURN;
        END
        
        -- Validate Status
        IF @Status NOT IN ('Approved', 'Rejected')
        BEGIN
            PRINT 'Error: Invalid claim status. Use "Approved" or "Rejected".';
            RETURN;
        END
        
        -- For approval, check if the item status is 'Pending' and the claimant matches
        IF @Status = 'Approved' AND (@ItemStatus != 'Pending' OR @CurrentClaimedBy != @ClaimantID)
        BEGIN
            PRINT 'Error: This claim cannot be approved. The item must be in Pending status and the claimant must match the acknowledged claim.';
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        IF @Status = 'Approved'
        BEGIN
            -- Update claim status
            UPDATE Claims 
            SET Status = @Status
            WHERE ClaimID = @ClaimID;
            
            -- Update item status to Retrieved (ClaimedBy is already set)
            UPDATE Items
            SET ItemStatus = 'Retrieved'
            WHERE ItemID = @ItemID;
            
            -- Notify the claimant
            INSERT INTO Notifications (UserID, ItemID, Message)
            VALUES (
                @ClaimantID, 
                @ItemID, 
                'Your claim has been approved! Please contact the item owner to arrange collection.'
            );
            
            -- Notify the item owner
            INSERT INTO Notifications (UserID, ItemID, Message)
            VALUES (
                @ItemOwnerID, 
                @ItemID,
                'A claim for your item has been approved. The claimant will contact you soon.'
            );
            
            -- Reject all other pending claims for this item
            UPDATE Claims
            SET Status = 'Rejected'
            WHERE ItemID = @ItemID 
              AND ClaimID != @ClaimID
              AND Status = 'Pending';
              
            -- Notify other claimants
            INSERT INTO Notifications (UserID, ItemID, Message)
            SELECT 
                c.UserID, 
                c.ItemID,
                'Your claim has been rejected as another claim was approved.'
            FROM Claims c
            WHERE c.ItemID = @ItemID 
              AND c.ClaimID != @ClaimID
              AND c.Status = 'Rejected';
        END
        ELSE IF @Status = 'Rejected'
        BEGIN
            -- If rejecting a claim that was previously acknowledged (item in Pending status)
            IF @ItemStatus = 'Pending' AND @CurrentClaimedBy = @ClaimantID
            BEGIN
                -- Reset the item status and clear ClaimedBy
                UPDATE Items
                SET ItemStatus = 'Found',
                    ClaimedBy = NULL
                WHERE ItemID = @ItemID;
            END
            
            -- Update claim status
            --UPDATE Claims 
            --SET Status = @Status
            --WHERE ClaimID = @ClaimID;
			delete from Claims WHERE ClaimID = @ClaimID;
            
            -- Notify the claimant
            INSERT INTO Notifications (UserID, ItemID, Message)
            VALUES (
                @ClaimantID, 
                @ItemID,
                'Your claim has been rejected. Please contact support for more information.'
            );
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

-- 🔹 Messaging & Notifications
GO
CREATE OR ALTER PROCEDURE SendMessage
    @SenderID INT,
    @ReceiverID INT,
    @ItemID INT,
    @MessageText NVARCHAR(MAX)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate sender and receiver exist
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @SenderID)
        BEGIN
            PRINT 'Error: Sender does not exist.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @ReceiverID)
        BEGIN
            PRINT 'Error: Receiver does not exist.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Validate item exists
        IF NOT EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID)
        BEGIN
            PRINT 'Error: Item does not exist.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Insert message
        INSERT INTO Messages (SenderID, ReceiverID, PostID, MessageText)
        VALUES (@SenderID, @ReceiverID, @ItemID, @MessageText);
        
        -- Notify receiver about new message
        DECLARE @SenderName NVARCHAR(255), @ItemTitle NVARCHAR(255);
        SELECT @SenderName = FullName FROM Users WHERE UserID = @SenderID;
        SELECT @ItemTitle = Title FROM Items WHERE ItemID = @ItemID;
        
        INSERT INTO Notifications (UserID, ItemID, Message)
        VALUES (
            @ReceiverID,
            @ItemID,
            'New message from ' + @SenderName + ' regarding item "' + @ItemTitle + '"'
        );
        
        -- Return the new message ID
        SELECT SCOPE_IDENTITY() AS NewMessageID;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;

CREATE OR ALTER PROCEDURE PendingItemsView AS
BEGIN
SELECT 
    i.ItemID, 
    i.Title, 
    i.ItemDescription, 
    c.CategoryName, 
    i.ItemStatus, 
    i.ItemLocation, 
    i.DateReported, 
    i.ImageURL, 
    u.FullName AS PostedBy,
    u.UserID AS PosterID,
    claimer.FullName AS ClaimedBy,
    i.ClaimedBY AS ClaimantID,
	cl.ClaimID
FROM Items i
JOIN Users u ON i.UserID = u.UserID
LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
LEFT JOIN Users claimer ON i.ClaimedBY = claimer.UserID
LEFT JOIN Claims cl ON i.ItemID = cl.ItemID AND cl.UserID = i.ClaimedBy
WHERE i.ItemStatus = 'Pending'
ORDER BY i.DateReported DESC;
END

select * from Claims
select * from Items

CREATE OR ALTER PROCEDURE GetMessagesBetweenUsers
    @UserID1 INT,
    @UserID2 INT
AS
BEGIN
    BEGIN TRY
        SELECT m.MessageID, 
               m.SenderID,
               u1.FullName AS SenderName,
               m.ReceiverID,
               u2.FullName AS ReceiverName,
               m.PostID,
               i.Title AS ItemTitle,
               m.MessageText, 
               m.CreatedAt
        FROM Messages m
        JOIN Users u1 ON m.SenderID = u1.UserID
        JOIN Users u2 ON m.ReceiverID = u2.UserID
        LEFT JOIN Items i ON m.PostID = i.ItemID
        WHERE (m.SenderID = @UserID1 AND m.ReceiverID = @UserID2)
           OR (m.SenderID = @UserID2 AND m.ReceiverID = @UserID1)
        ORDER BY m.CreatedAt;
    END TRY
    BEGIN CATCH
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

select * from notifications
CREATE OR ALTER PROCEDURE GetUserNotifications
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate user exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        BEGIN
            THROW 50001, 'User not found.', 1;
        END
        
        -- Get notifications
        SELECT 
            n.NotificationID, 
            n.ItemID,
            i.Title AS ItemTitle,
            n.Message, 
            n.CreatedAt,
			n.IsRead
        FROM Notifications n
        LEFT JOIN Items i ON n.ItemID = i.ItemID
        WHERE n.UserID = @UserID
        ORDER BY n.CreatedAt DESC;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        -- Re-throw the error with additional context
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO


-- NEW 
CREATE OR ALTER PROCEDURE AddPostNotification
    @ItemID INT,
    @UserID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @ItemTitle NVARCHAR(255);
        SELECT @ItemTitle = Title FROM Items WHERE ItemID = @ItemID;
        
        -- Use a temporary table to avoid duplicate notifications
        CREATE TABLE #UsersToNotify (UserID INT);
        
        -- Get all users except the poster
        INSERT INTO #UsersToNotify (UserID)
        SELECT DISTINCT U.UserID
        FROM Users U
        WHERE U.UserID <> @UserID;
        
        -- Insert notifications for these users
        INSERT INTO Notifications (UserID, ItemID, Message)
        SELECT UserID, @ItemID, 'A new item "' + @ItemTitle + '" has been posted.'
        FROM #UsersToNotify;
        
        -- Clean up
        DROP TABLE #UsersToNotify;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

-- ALL NEW 
select * from Flags
-- 🔹 Flags & Reports
CREATE OR ALTER PROCEDURE ReportItem
    @ItemID INT,
    @UserID INT,
    @Reason NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if item exists
        IF NOT EXISTS (SELECT 1 FROM Items WHERE ItemID = @ItemID)
        BEGIN
            PRINT 'Error: Item does not exist.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Check if user has already reported this item
        IF EXISTS (SELECT 1 FROM Flags WHERE ItemID = @ItemID AND ReportedBy = @UserID)
        BEGIN
            PRINT 'Error: You have already reported this item.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Insert flag with Status 'Pending'
        INSERT INTO Flags (ItemID, ReportedBy, Reason, Status)
        VALUES (@ItemID, @UserID, @Reason, 'Pending');
        
        -- Notify admins about the new flag
        DECLARE @ItemTitle NVARCHAR(255);
        SELECT @ItemTitle = Title FROM Items WHERE ItemID = @ItemID;
        
        INSERT INTO Notifications (UserID, ItemID, Message)
        SELECT u.UserID, @ItemID, 'Item "' + @ItemTitle + '" has been flagged: ' + @Reason
        FROM Users u
        WHERE u.UserRole = 'Admin';
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

select * from Flags

exec ProcessFlag @FlagID = 2, @review = 'Reviewed'
select * from Flags
CREATE OR ALTER PROCEDURE ProcessFlag
    @FlagID INT,
    @Review NVARCHAR(20) -- 'Reviewed' or 'Dismissed'
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
               
        -- Validate @Review parameter
        IF @Review NOT IN ('Reviewed', 'Dismissed')
        BEGIN
            PRINT 'Error: Invalid review type. Must be "Reviewed" or "Dismissed".';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
             
        -- Get flag details
        DECLARE @ItemID INT, @ReporterID INT, @CurrentStatus NVARCHAR(50);
        SELECT 
            @ItemID = ItemID, 
            @ReporterID = ReportedBy,
            @CurrentStatus = Status
        FROM Flags 
        WHERE FlagID = @FlagID;
        
        -- Check if flag is already processed
        IF @CurrentStatus != 'Pending'
        BEGIN
            PRINT 'Error: Flag has already been processed.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Update flag status based on review type
        UPDATE Flags
        SET Status = @Review
        WHERE FlagID = @FlagID;
        
        -- Notify the reporter
        DECLARE @ItemTitle NVARCHAR(255), @NotificationMessage NVARCHAR(500);
        SELECT @ItemTitle = Title FROM Items WHERE ItemID = @ItemID;
        
        IF @Review = 'Reviewed'
        BEGIN
            SET @NotificationMessage = 'Your flag for item "' + @ItemTitle + '" has been reviewed and the post was removed';
            
            -- Delete the post if reviewed
            
                    END
        ELSE -- Dismissed
        BEGIN
            SET @NotificationMessage = 'Your flag for item "' + @ItemTitle + '" has been dismissed as invalid';
        END
        
        INSERT INTO Notifications (UserID, ItemID, Message)
        VALUES (
            @ReporterID, 
            @ItemID, 
            @NotificationMessage
        );

		DECLARE @PostOwnerID INT;
    SELECT @PostOwnerID = UserID FROM Items WHERE ItemID = @ItemID;
    
    IF @PostOwnerID IS NOT NULL
    BEGIN
        INSERT INTO Notifications (UserID, ItemID, Message)
        VALUES (
            @PostOwnerID,
            @ItemID,
            'Your post "' + @ItemTitle + '" was removed after admin review'
        );

            DELETE FROM Items WHERE ItemID = @ItemID;

	END
        
        -- Additional action if flag is dismissed
        IF @Review = 'Dismissed'
        BEGIN
            -- Notify the item owner that their post was flagged but deemed valid
            DECLARE @ItemOwnerID INT;
            SELECT @ItemOwnerID = UserID FROM Items WHERE ItemID = @ItemID;
            
            IF @ItemOwnerID IS NOT NULL AND @ItemOwnerID != @ReporterID
            BEGIN
                INSERT INTO Notifications (UserID, ItemID, Message)
                VALUES (
                    @ItemOwnerID,
                    @ItemID,
                    'A flag on your item "' + @ItemTitle + '" was dismissed by an admin'
                );
            END
        END
        
        COMMIT TRANSACTION;
        
        PRINT 'Flag processed successfully. Status set to: ' + @Review;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
        RETURN;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE GetItemFlags
    @ItemID INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        SELECT 
            f.FlagID,
            f.ItemID,
            i.Title AS ItemTitle,
            f.ReportedBy,
            u.FullName AS ReporterName,
            f.Reason,
            f.Status,
            f.CreatedAt
        FROM Flags f
        JOIN Items i ON f.ItemID = i.ItemID
        JOIN Users u ON f.ReportedBy = u.UserID
        WHERE f.ItemID = @ItemID
        ORDER BY f.CreatedAt DESC;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END;
GO

-- =========================
-- 🔄 TRIGGERS
-- =========================
GO
CREATE OR ALTER TRIGGER trg_Users_Delete_All
ON Users
INSTEAD OF DELETE
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Delete Messages where the deleted user is sender or receiver
        DELETE FROM Messages 
        WHERE SenderID IN (SELECT UserID FROM DELETED) 
           OR ReceiverID IN (SELECT UserID FROM DELETED);
        
        -- Delete all other user-related records
        DELETE FROM Notifications WHERE UserID IN (SELECT UserID FROM DELETED);
        DELETE FROM Claims WHERE UserID IN (SELECT UserID FROM DELETED);
        DELETE FROM CommunityVerification WHERE UserID IN (SELECT UserID FROM DELETED);
        DELETE FROM Flags WHERE ReportedBy IN (SELECT UserID FROM DELETED);
        DELETE FROM Comments WHERE UserID IN (SELECT UserID FROM DELETED);
        -- For items owned by user, clear ClaimedBy references first
        UPDATE Items SET ClaimedBy = NULL 
        WHERE ClaimedBy IN (SELECT UserID FROM DELETED);
        
        -- Delete items owned by user
        DELETE FROM Items WHERE UserID IN (SELECT UserID FROM DELETED);
        
        -- Finally delete the user
        DELETE FROM Users WHERE UserID IN (SELECT UserID FROM DELETED);
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH
END;


GO
CREATE or alter TRIGGER trg_Items_Delete_All
ON Items
INSTEAD OF DELETE
AS
BEGIN
    -- Delete Messages
    DELETE FROM Messages WHERE PostID IN (SELECT ItemID FROM DELETED);
    -- Delete Claims

    DELETE FROM Claims WHERE ItemID IN (SELECT ItemID FROM DELETED);

	DELETE FROM Flags WHERE ItemID IN (SELECT ItemID FROM DELETED);

	DELETE FROM comments WHERE PostID IN (SELECT ItemID FROM DELETED);
    -- Finally delete item
    DELETE FROM Items WHERE ItemID IN (SELECT ItemID FROM DELETED);

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

END;

GO

CREATE TRIGGER trg_Notifications_CleanupOld
ON Notifications
AFTER INSERT
AS
BEGIN
    -- Delete notifications older than 3 days for users who just received a new notification
    DELETE FROM Notifications 
    WHERE UserID IN (SELECT UserID FROM inserted)
    AND DATEDIFF(DAY, CreatedAt, GETDATE()) >= 3;
END;

CREATE OR ALTER TRIGGER trg_Claims_Delete_CommunityVerification
ON Claims
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- First delete all community verification records for the claims being deleted
        DELETE FROM CommunityVerification
        WHERE ClaimID IN (SELECT ClaimID FROM deleted);
        
        -- Then delete the claims themselves
        DELETE FROM Claims
        WHERE ClaimID IN (SELECT ClaimID FROM deleted);
        
        COMMIT TRANSACTION;
        
        PRINT 'Successfully deleted claims and their associated community verifications.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        PRINT 'Error in trg_Claims_Delete_CommunityVerification: ' + ERROR_MESSAGE();
        THROW; -- Re-throw the error to the calling application
    END CATCH
END;
GO


CREATE VIEW View_FlagDetails AS
SELECT 
    f.FlagID,
    f.ItemID,
    i.Title AS ItemTitle,
    i.ItemDescription,
    i.ItemLocation,
    i.ItemStatus,
    i.DateReported,
    f.ReportedBy,
    reporter.FullName AS ReportedByName,
    reporter.Email AS ReportedByEmail,
    i.UserID AS ItemOwnerID,
    owner.FullName AS ItemOwnerName,
    owner.Email AS ItemOwnerEmail,
    f.Reason,
    f.Status AS FlagStatus,
    f.CreatedAt AS FlagCreatedAt
FROM Flags f
JOIN Items i ON f.ItemID = i.ItemID
JOIN Users reporter ON f.ReportedBy = reporter.UserID
JOIN Users owner ON i.UserID = owner.UserID;


CREATE OR ALTER PROCEDURE MarkItemAsClaimed
    @ItemID INT,
    @UserID INT,
    @ClaimedBy INT = NULL -- Optional: Set to the user who successfully claimed the item
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if item exists and was posted by the requesting user
    IF NOT EXISTS (
        SELECT 1 
        FROM Items 
        WHERE ItemID = @ItemID AND UserID = @UserID
    )
    BEGIN
        RAISERROR('You are not authorized to update this item or it does not exist.', 16, 1);
        RETURN;
    END

    -- Update item status and optionally set ClaimedBY
    UPDATE Items
    SET ItemStatus = 'Retrieved',
        ClaimedBY = @ClaimedBy
    WHERE ItemID = @ItemID;

    PRINT 'Item marked as Retrieved.';
END

CREATE OR ALTER PROCEDURE CreateComment
    @PostID INT,
    @UserID INT,
    @CommentText NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Comments (PostID, UserID, CommentText)
    VALUES (@PostID, @UserID, @CommentText);
END;


CREATE OR ALTER PROCEDURE GetCommentsByPost
    @PostID INT
AS
BEGIN
    SELECT 
        c.CommentID,
        c.PostID,
        c.UserID,
        u.FullName AS CommentedBy,
        u.ProfilePic,
        c.CommentText,
        c.CreatedAt
    FROM Comments c
    JOIN Users u ON c.UserID = u.UserID
    WHERE c.PostID = @PostID
    ORDER BY c.CreatedAt DESC;
END;