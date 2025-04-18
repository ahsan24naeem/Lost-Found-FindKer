create database projectDB;
use projectDB;


CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(255) NOT NULL,
	Gender char(1), 
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255), --NOT NULL
    PhoneNumber NVARCHAR(11),
    OAuthProvider NVARCHAR(50),  -- Google, Facebook, etc.
    OAuthID NVARCHAR(255),       -- Unique ID from OAuth provider
    UserRole NVARCHAR(50) CHECK (UserRole IN ('User', 'Admin')) DEFAULT 'User',
    CreatedAt DATETIME DEFAULT GETDATE(),
	CONSTRAINT chk_Phone_Length CHECK (LEN(PhoneNumber) = 11),
	CONSTRAINT chk_EmailDomain CHECK (Email LIKE '%@lhr.nu.edu.pk'),
	CONSTRAINT chk_Gender CHECK (Gender IN ('M', 'F', 'O'))
);

CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Items(
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    Title NVARCHAR(255) NOT NULL,
    ItemDescription NVARCHAR(MAX),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    ItemStatus NVARCHAR(50) CHECK (ItemStatus IN ('Lost', 'Found', 'Claimed', 'Banned')) NOT NULL,
    ItemLocation NVARCHAR(255) NOT NULL,
    DateReported DATETIME DEFAULT GETDATE(),
    ImageURL NVARCHAR(255),
    QRCode NVARCHAR(255),
    PrivateDetails NVARCHAR(255),  -- For verification purposes
    IsFlagged INT DEFAULT 0,
    ClaimedBy INT NULL FOREIGN KEY REFERENCES Users(UserID)
);

CREATE TABLE Claims (
    ClaimID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT not NULL,
    UserID INT not NULL,  
    ClaimDetails NVARCHAR(255) NOT NULL, 
    ClaimsStatus NVARCHAR(50) CHECK (ClaimsStatus IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    AdminReviewedBy INT NULL,
	--CONSTRAINT FK_ADMINREVIEWBY FOREIGN KEY (AdminReviewedBy) REFERENCES Users(UserID) on delete set null,  
    CONSTRAINT FK_Claims_Items FOREIGN KEY (ItemID) REFERENCES Items(ItemID) on delete cascade,
);

CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
	ItemID INT, --???
    Message NVARCHAR(255) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Flags ( --REPORT A POST
    FlagID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    ReportedBy INT FOREIGN KEY REFERENCES Users(UserID),
    Reason NVARCHAR(255) NOT NULL,
    Status NVARCHAR(50) CHECK (Status IN ('Pending', 'Reviewed', 'Dismissed')) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE CommunityVerification (
    VerificationID INT IDENTITY(1,1) PRIMARY KEY,
    ClaimID INT FOREIGN KEY REFERENCES Claims(ClaimID) ON DELETE CASCADE,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    VoteType NVARCHAR(10) CHECK (VoteType IN ('Upvote', 'Downvote')),
    CreatedAt DATETIME DEFAULT GETDATE(),
	CONSTRAINT claim_user_unique UNIQUE(ClaimID,UserID)
);

CREATE TABLE Locations (
    LocationID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    Latitude DECIMAL(9,6),
    Longitude DECIMAL(9,6)
);

CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    PostID INT FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    CommentText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsFlagged BIT DEFAULT 0  -- If inappropriate
);

CREATE TABLE Messages (
    MessageID INT IDENTITY(1,1) PRIMARY KEY,
    SenderID INT FOREIGN KEY REFERENCES Users(UserID),
    ReceiverID INT FOREIGN KEY REFERENCES Users(UserID),
    PostID INT FOREIGN KEY REFERENCES Items(ItemID) ON DELETE CASCADE,
    MessageText NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);


-- Insert into Users
INSERT INTO Users (FullName, Gender, Email, PasswordHash, PhoneNumber, OAuthProvider, OAuthID, UserRole) VALUES
('Ahsan Naeem', 'F', 'l230517@lhr.nu.edu.pk', 'Ahsan', '03248403266', NULL, NULL, 'Admin'),
('Ali Khan', 'M', 'ali.khan@lhr.nu.edu.pk', 'hashed_password1', '03123456789', NULL, NULL, 'User'),
('Sara Ahmed', 'F', 'sara.ahmed@lhr.nu.edu.pk', 'hashed_password2', '03211234567', NULL, NULL, 'Admin'),
('Omar Farooq', 'M', 'omar.farooq@lhr.nu.edu.pk', 'hashed_password3', '03001112233', 'Google', 'google123', 'User'),
('Ayesha Malik', 'F', 'ayesha.malik@lhr.nu.edu.pk', 'hashed_password4', '03119887766', NULL, NULL, 'User'),
('Hassan Raza', 'M', 'hassan.raza@lhr.nu.edu.pk', 'hashed_password5', '03005556677', 'Facebook', 'fb_456', 'User');

-- Insert into Categories
INSERT INTO Categories (CategoryName) VALUES
('Electronics'),
('Bags'),
('Clothing'),
('Books'),
('Accessories');

select * from users

-- Insert into Items
INSERT INTO Items (UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL, QRCode, PrivateDetails) VALUES
(1, 'Lost iPhone', 'Black iPhone 12 lost near cafeteria', 1, 'Lost', 'University Cafeteria', NULL, NULL, 'Serial No: 12345'),
(2, 'Found Wallet', 'Brown leather wallet with ID card inside', 2, 'Found', 'Library', NULL, NULL, 'Contains Student ID'),
(3, 'Lost Jacket', 'Blue denim jacket with brand label', 3, 'Lost', 'Parking Lot', NULL, NULL, 'Brand: Levi�s'),
(4, 'Found Notebook', 'Green spiral notebook with handwritten notes', 4, 'Found', 'Lecture Hall B', NULL, NULL, 'Name on first page'),
(5, 'Lost Watch', 'Silver analog watch with black strap', 5, 'Lost', 'Sports Complex', NULL, NULL, 'Engraved initials: HR');

-- Insert into Claims
INSERT INTO Claims (ItemID, UserID, ClaimDetails) VALUES
(1, 3, 'It belongs to me, I can unlock it'),
(2, 1, 'My wallet, it has my ID'),
(3, 4, 'I lost this jacket yesterday'),
(4, 2, 'That�s my notebook, it has my notes'),
(5, 5, 'My watch, has initials HR engraved');

-- Insert into Notifications
INSERT INTO Notifications (UserID, ItemID, Message) VALUES
(1, 1, 'Your item report has been received'),
(2, 2, 'A new found item matches your description'),
(3, 3, 'Your claim is under review'),
(4, 4, 'Your found item post has received a claim'),
(5, 5, 'Your reported lost item has a match');

-- Insert into Flags
INSERT INTO Flags (ItemID, ReportedBy, Reason) VALUES
(1, 2, 'Suspicious listing'),
(2, 3, 'Incorrect information'),
(3, 4, 'Duplicate post'),
(4, 5, 'Inappropriate content'),
(5, 1, 'Misleading details');

-- Insert into CommunityVerification
INSERT INTO CommunityVerification (ClaimID, UserID, VoteType) VALUES
(1, 2, 'Upvote'),
(2, 3, 'Upvote'),
(3, 4, 'Downvote'),
(4, 5, 'Upvote'),
(5, 1, 'Downvote');

-- Insert into Locations
INSERT INTO Locations (ItemID, Latitude, Longitude) VALUES
(1, 31.5204, 74.3587),
(2, 31.5220, 74.3615),
(3, 31.5150, 74.3555),
(4, 31.5178, 74.3592),
(5, 31.5199, 74.3570);

-- Insert into Comments
INSERT INTO Comments (PostID, UserID, CommentText) VALUES
(1, 2, 'Hope you find it soon!'),
(2, 3, 'Thanks for posting!'),
(3, 4, 'Can you describe it more?'),
(4, 5, 'I lost a similar one!'),
(5, 1, 'Any updates?');

-- Insert into Messages
INSERT INTO Messages (SenderID, ReceiverID, PostID, MessageText) VALUES
(1, 3, 1, 'Hey, I think this is my phone!'),
(2, 1, 2, 'I found a wallet, is this yours?'),
(3, 4, 3, 'Can you tell me more about the jacket?'),
(4, 5, 4, 'I found a notebook, what�s written inside?'),
(5, 1, 5, 'I lost a watch, does it have my initials?');

-- View: User Profile
CREATE view otherUsersProfile AS
SELECT UserID, FullName, Gender, Email, PhoneNumber, CreatedAt
FROM Users U;

SELECT * FROM otherUsersProfile;

--procedure: profile details
CREATE PROCEDURE GetUserProfileDetails
@UserID INT
AS
BEGIN
    With profiledetails as (SELECT UserID, FullName, Gender, Email, PhoneNumber, CreatedAt
    FROM Users
    WHERE UserID = @UserID)
Select * from profiledetails;
END;

--Procedure: User's Items (Posts)
CREATE PROCEDURE GetUserItemDetails
    @UserID INT
AS
BEGIN
    SELECT i.ItemID, i.Title, i.ItemDescription, c.CategoryName, i.ItemStatus, 
           i.ItemLocation, i.DateReported, i.ImageURL
    FROM Items i
    LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
    WHERE i.UserID = @UserID;

END;

 --Procedure: User's Claims
CREATE PROCEDURE GetUserClaimDetails
    @UserID INT
AS
BEGIN
    SELECT c.ClaimID, c.ItemID, i.Title AS ClaimedItem, c.ClaimDetails, 
           c.ClaimsStatus, c.CreatedAt
    FROM Claims c
    JOIN Items i ON c.ItemID = i.ItemID
    WHERE c.UserID = @UserID;
END;


--Procedure: user login
CREATE PROCEDURE GetUserCredentials
    @Email NVARCHAR(255)
AS
BEGIN
   
    SELECT UserID, FullName, Email, PasswordHash, UserRole
    FROM Users
    WHERE Email = @Email;
END;

--Procedure: insert user
CREATE PROCEDURE InsertUser
    @FullName NVARCHAR(255),
    @Gender CHAR(1),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @PhoneNumber NVARCHAR(11),
    @OAuthProvider NVARCHAR(50) = NULL,
    @OAuthID NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

INSERT INTO Users (FullName, Gender, Email, PasswordHash, PhoneNumber, OAuthProvider, OAuthID)
VALUES (@FullName, @Gender, @Email, @PasswordHash, @PhoneNumber, @OAuthProvider, @OAuthID);

SELECT SCOPE_IDENTITY() AS UserID; --Return the newly created user ID
END;

select * from Users;

-- Procedure: Update User Information
CREATE PROCEDURE UpdateUser
    @UserID INT,
    @FullName NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @PhoneNumber NVARCHAR(11)
AS
BEGIN
    UPDATE Users 
    SET FullName = @FullName, PasswordHash = @PasswordHash, PhoneNumber = @PhoneNumber 
    WHERE UserID = @UserID;
END;

-- Procedure: Delete a User
CREATE PROCEDURE DeleteUser
    @UserID INT
AS
BEGIN
    DELETE FROM Users WHERE UserID = @UserID;
END;


-- View: Display All Posts
CREATE VIEW AllPosts 
AS
SELECT i.ItemID, i.Title, i.ItemDescription, c.CategoryName, i.ItemStatus, 
       i.ItemLocation, i.DateReported, i.ImageURL, u.FullName AS PostedBy
FROM Items i
JOIN Users u ON i.UserID = u.UserID
LEFT JOIN Categories c ON i.CategoryID = c.CategoryID;

-- View: Display Recent Posts (Max 1 Day Old)
CREATE VIEW RecentPosts AS
SELECT * FROM AllPosts WHERE DateReported >= DATEADD(DAY, -1, GETDATE());

-- Stored Procedure: Display Categorized Posts
CREATE PROCEDURE GetCategorizedPosts
    @CategoryName NVARCHAR(100)
AS
BEGIN
    SELECT * FROM AllPosts WHERE CategoryName = @CategoryName ORDER BY DateReported DESC;
END;

-- Stored Procedure: Retrieve Comments for a Post
CREATE PROCEDURE GetPostComments
    @PostID INT
AS
BEGIN
    SELECT c.CommentID, u.FullName AS CommentedBy, c.CommentText, c.CreatedAt
    FROM Comments c
    JOIN Users u ON c.UserID = u.UserID
    WHERE c.PostID = @PostID
    ORDER BY c.CreatedAt DESC;
END;

go;
-- Stored Procedure: Create a New Post

select * from Items;

CREATE PROCEDURE CreatePost
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
    INSERT INTO Items (UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL, PrivateDetails)
    VALUES (@UserID, @Title, @ItemDescription, @CategoryID, @ItemStatus, @ItemLocation, @ImageURL, @PrivateDetails);
END;

-- Stored Procedure: Delete a Post
CREATE PROCEDURE DeletePost
    @ItemID INT
AS
BEGIN
    DELETE FROM Items WHERE ItemID = @ItemID;
END;

--search a post
CREATE PROCEDURE SearchPosts
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT i.ItemID, i.Title, i.ItemDescription, c.CategoryName, i.ItemStatus, 
           i.ItemLocation, i.DateReported, i.ImageURL, u.FullName AS PostedBy
    FROM Items i
    JOIN Users u ON i.UserID = u.UserID
    LEFT JOIN Categories c ON i.CategoryID = c.CategoryID
    WHERE i.Title LIKE '%' + @SearchTerm + '%'
       OR i.ItemDescription LIKE '%' + @SearchTerm + '%'
       OR i.ItemLocation LIKE '%' + @SearchTerm + '%'
       OR c.CategoryName LIKE '%' + @SearchTerm + '%'
    ORDER BY i.DateReported DESC;
END;

--Procedure: Claims 
CREATE PROCEDURE ClaimItem
    @ItemID INT,
    @UserID INT,
    @ClaimDetails NVARCHAR(255)
AS
BEGIN
    INSERT INTO Claims (ItemID, UserID, ClaimDetails)
    VALUES (@ItemID, @UserID, @ClaimDetails);
END;


-- View: Claims on Posts
CREATE VIEW ClaimsOnPosts AS
SELECT c.ClaimID, c.ItemID, u.FullName AS ClaimedBy, c.ClaimDetails, 
       c.ClaimsStatus, c.CreatedAt, a.FullName AS ReviewedBy
FROM Claims c
JOIN Users u ON c.UserID = u.UserID
LEFT JOIN Users a ON c.AdminReviewedBy = a.UserID;

-- Stored Procedure: Retrieve Claims on an Item
CREATE PROCEDURE GetClaimsOnItem
    @ItemID INT
AS
BEGIN
    SELECT * FROM ClaimsOnPosts WHERE ItemID = @ItemID;
END;

-- Stored Procedure: Upvote or Downvote a Claim
CREATE PROCEDURE VoteClaim
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

go
-- Stored Procedure: View Claim Verification Status
CREATE PROCEDURE GetClaimVotes
    @ClaimID INT
AS
BEGIN
    SELECT COUNT(CASE WHEN VoteType = 'Upvote' THEN 1 END) AS Upvotes,
           COUNT(CASE WHEN VoteType = 'Downvote' THEN 1 END) AS Downvotes
    FROM CommunityVerification
    WHERE ClaimID = @ClaimID;
END;

go
--Procedure: delete claim 
CREATE PROCEDURE DeleteClaim
    @ClaimID INT,
    @UserID INT
AS
BEGIN
--Check if the user is the claimant or an admin
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

go
-- Stored Procedure: Send a Message
CREATE PROCEDURE SendMessage
    @SenderID INT,
    @ReceiverID INT,
    @PostID INT,
    @MessageText NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Messages (SenderID, ReceiverID, PostID, MessageText)
    VALUES (@SenderID, @ReceiverID, @PostID, @MessageText);
END;


go
-- Stored Procedure: Retrieve Messages Between Two Users
CREATE PROCEDURE GetMessagesBetweenUsers
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

go
-- Stored Procedure: Retrieve Notifications for a User
CREATE PROCEDURE GetUserNotifications
    @UserID INT
AS
BEGIN
    SELECT NotificationID, Message, IsRead, CreatedAt
    FROM Notifications
    WHERE UserID = @UserID
    ORDER BY CreatedAt DESC;
END;

go
-- Procedure: Add Notification When a New Post is Create
CREATE PROCEDURE AddPostNotification
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

go 
-- Trigger: Automatically Add Notification After New Item Inserted
CREATE TRIGGER trg_AddPostNotification
ON Items
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ItemID INT, @UserID INT;

    -- Assuming only one row is inserted at a time
    SELECT TOP 1 @ItemID = ItemID, @UserID = UserID FROM INSERTED;

    -- Call the procedure to add notifications for other users
    EXEC AddPostNotification @ItemID, @UserID;
END;

