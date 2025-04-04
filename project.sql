create database project;
use project;

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

-- View: User Profile
CREATE view otherUsersProfile AS
SELECT UserID, FullName, Gender, Email, PhoneNumber, CreatedAt
FROM Users U;

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

-- User's Items (Posts)
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

 -- User's Claims
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


--user login
CREATE PROCEDURE GetUserCredentials
    @Email NVARCHAR(255)
AS
BEGIN
   
    SELECT UserID, FullName, Email, PasswordHash, UserRole
    FROM Users
    WHERE Email = @Email;
END;

--insert user
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

    -- Insert new user
    INSERT INTO Users (FullName, Gender, Email, PasswordHash, PhoneNumber, OAuthProvider, OAuthID)
    VALUES (@FullName, @Gender, @Email, @PasswordHash, @PhoneNumber, @OAuthProvider, @OAuthID);

    -- Return the newly created user ID
    SELECT SCOPE_IDENTITY() AS UserID;
END;

select * from Users;

-- Stored Procedure: Update User Information
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

-- Stored Procedure: Delete a User
CREATE PROCEDURE DeleteUser
    @UserID INT
AS
BEGIN
    DELETE FROM Users WHERE UserID = @UserID;
END;
