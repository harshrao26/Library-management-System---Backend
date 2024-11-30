import bcrypt from "bcrypt";

const hashedPassword =
  "$2b$10$JTZ2KtSCvb7iB96YG2Zeou.UqCScOAkGNcvi6VlPFbLp6IK6AfoFK"; // This is the hashed password from the database
const enteredPassword = "member"; // The password entered in Postman or the one you're testing

// Compare entered password with hashed password
bcrypt
  .compare(enteredPassword, hashedPassword)
  .then((isMatch) => {
    console.log("Password Match:", isMatch); // Should return true if the password matches
  })
  .catch((err) => console.error("Error comparing passwords:", err));
