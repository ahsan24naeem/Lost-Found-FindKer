-- Insert into Users
INSERT INTO Users (FullName, Gender, Email, PasswordHash, PhoneNumber, OAuthProvider, OAuthID, UserRole) VALUES
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

-- Insert into Items
INSERT INTO Items (UserID, Title, ItemDescription, CategoryID, ItemStatus, ItemLocation, ImageURL, QRCode, PrivateDetails) VALUES
(1, 'Lost iPhone', 'Black iPhone 12 lost near cafeteria', 1, 'Lost', 'University Cafeteria', NULL, NULL, 'Serial No: 12345'),
(2, 'Found Wallet', 'Brown leather wallet with ID card inside', 2, 'Found', 'Library', NULL, NULL, 'Contains Student ID'),
(3, 'Lost Jacket', 'Blue denim jacket with brand label', 3, 'Lost', 'Parking Lot', NULL, NULL, 'Brand: Levi’s'),
(4, 'Found Notebook', 'Green spiral notebook with handwritten notes', 4, 'Found', 'Lecture Hall B', NULL, NULL, 'Name on first page'),
(5, 'Lost Watch', 'Silver analog watch with black strap', 5, 'Lost', 'Sports Complex', NULL, NULL, 'Engraved initials: HR');

-- Insert into Claims
INSERT INTO Claims (ItemID, UserID, ClaimDetails) VALUES
(1, 3, 'It belongs to me, I can unlock it'),
(2, 1, 'My wallet, it has my ID'),
(3, 4, 'I lost this jacket yesterday'),
(4, 2, 'That’s my notebook, it has my notes'),
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
(4, 5, 4, 'I found a notebook, what’s written inside?'),
(5, 1, 5, 'I lost a watch, does it have my initials?');


SELECT * FROM Items ORDER BY DateReported DESC;

