import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // Import bcrypt
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

dotenv.config();

const seedUsers = [
  {
    email: "elijah.mikaelson@example.com",
    fullName: "Elijah",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    email: "bruce.wayne@example.com",
    fullName: "Bruce Wayne",
    password: "iamthebatman",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    email: "patrick.bateman@example.com",
    fullName: "Patrick Bateman",
    password: "americanpsycho",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "steve.rogers@example.com",
    fullName: "Steve Rogers",
    password: "captainamerica",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    email: "loki.odinson@example.com",
    fullName: "Loki Odinson",
    password: "godofmischief",
    profilePic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    email: "tony.stark@example.com",
    fullName: "Tony Stark",
    password: "iamironman",
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    email: "thor.ragnar@example.com",
    fullName: "Thor Ragnar",
    password: "thunderlord",
    profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    email: "ragnar.lothbrok@example.com",
    fullName: "Ragnar Lothbrok",
    password: "vikinglegend",
    profilePic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    email: "doraemon@example.com",
    fullName: "Doraemon",
    password: "gadgetcat",
    profilePic: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    email: "shinchan@example.com",
    fullName: "Shinchan Nohara",
    password: "mischiefmaster",
    profilePic: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    email: "tom.cat@example.com",
    fullName: "Tom Cat",
    password: "chasingjerry",
    profilePic: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    email: "jerry.mouse@example.com",
    fullName: "Jerry Mouse",
    password: "cheeselover",
    profilePic: "https://randomuser.me/api/portraits/men/20.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users before seeding
    await User.deleteMany({});

    // Hash passwords
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10), // Hash password before saving
      }))
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log("Database seeded successfully with hashed passwords");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
