const mongoose = require("mongoose");
const Group = require("../models/group");
const User = require("../models/user");
const logger = require("../utils/logger")("groupSeeder"); // Import logger
const { validateGroup } = require("../schemas/groupSchema");

const groupData = [
  {
    name: "Tech Innovators",
    description: "A group for technology enthusiasts and innovators.",
    motto: "Innovation through Collaboration",
    website: "https://techinnovators.example.com",
    contactEmail: "contact@techinnovators.example.com",
  },
  {
    name: "Environmental Advocates",
    description:
      "A group dedicated to environmental conservation and awareness.",
    motto: "Protecting Our Planet",
    website: "https://environmentaladvocates.example.com",
    contactEmail: "info@environmentaladvocates.example.com",
  },
  {
    name: "Local Artisans Network",
    description: "Supporting and promoting local artisans and craftsmen.",
    motto: "Craftsmanship at Its Best",
    website: "https://localartisans.example.com",
    contactEmail: "support@localartisans.example.com",
  },
  // {
  //   name: "Health and Wellness",
  //   description: "A group focused on health, wellness, and fitness.",
  //   motto: "Wellness is Wealth",
  //   website: "https://healthandwellness.example.com",
  //   contactEmail: "contact@healthandwellness.example.com",
  // },
  // {
  //   name: "Young Entrepreneurs Club",
  //   description:
  //     "A community for young entrepreneurs to share ideas and resources.",
  //   motto: "Building the Future",
  //   website: "https://youngentrepreneurs.example.com",
  //   contactEmail: "info@youngentrepreneurs.example.com",
  // },
  // {
  //   name: "Outdoor Adventure Club",
  //   description:
  //     "Promoting outdoor activities like hiking, camping, and rock climbing.",
  //   motto: "Explore the Wild",
  //   website: "https://outdooradventureclub.example.com",
  //   contactEmail: "contact@outdooradventureclub.example.com",
  // },
  // {
  //   name: "Sustainable Living",
  //   description:
  //     "A group advocating for sustainable and eco-friendly living practices.",
  //   motto: "Live Green, Live Clean",
  //   website: "https://sustainableliving.example.com",
  //   contactEmail: "support@sustainableliving.example.com",
  // },
  // {
  //   name: "Tech Women Network",
  //   description: "Empowering women in tech through networking and mentorship.",
  //   motto: "Inspiring Women in Tech",
  //   website: "https://techwomennetwork.example.com",
  //   contactEmail: "info@techwomennetwork.example.com",
  // },
  // {
  //   name: "Photography Enthusiasts",
  //   description:
  //     "A community for photography lovers to share tips and experiences.",
  //   motto: "Capture the Moment",
  //   website: "https://photographyenthusiasts.example.com",
  //   contactEmail: "support@photographyenthusiasts.example.com",
  // },
  // {
  //   name: "Book Lovers Circle",
  //   description:
  //     "A group for avid readers to discuss their favorite books and authors.",
  //   motto: "Read, Share, Grow",
  //   website: "https://bookloverscircle.example.com",
  //   contactEmail: "info@bookloverscircle.example.com",
  // },
  // {
  //   name: "Urban Gardeners Society",
  //   description: "A community for urban gardening enthusiasts.",
  //   motto: "Grow Your Own Green",
  //   website: "https://urbangardeners.example.com",
  //   contactEmail: "contact@urbangardeners.example.com",
  // },
  // {
  //   name: "Fitness Fanatics",
  //   description: "Dedicated to fitness enthusiasts and workout lovers.",
  //   motto: "Fitness for Life",
  //   website: "https://fitnessfanatics.example.com",
  //   contactEmail: "support@fitnessfanatics.example.com",
  // },
  // {
  //   name: "Music Makers",
  //   description:
  //     "A group for musicians and music lovers to collaborate and share.",
  //   motto: "Creating Harmony Together",
  //   website: "https://musicmakers.example.com",
  //   contactEmail: "info@musicmakers.example.com",
  // },
  // {
  //   name: "Tech Innovators Europe",
  //   description:
  //     "A European division of Tech Innovators, focusing on local technology trends.",
  //   motto: "Innovating Across Borders",
  //   website: "https://techinnovatorseurope.example.com",
  //   contactEmail: "contact@techinnovatorseurope.example.com",
  // },
  // {
  //   name: "Eco Warriors",
  //   description: "A group focused on environmental activism and awareness.",
  //   motto: "Fight for the Future",
  //   website: "https://ecowarriors.example.com",
  //   contactEmail: "info@ecowarriors.example.com",
  // },
  // {
  //   name: "Foodies United",
  //   description:
  //     "For food lovers and culinary enthusiasts to share recipes and experiences.",
  //   motto: "Savor Every Moment",
  //   website: "https://foodiesunited.example.com",
  //   contactEmail: "support@foodiesunited.example.com",
  // },
  // {
  //   name: "Mindfulness & Meditation",
  //   description: "A community promoting mindfulness and meditation practices.",
  //   motto: "Find Your Inner Peace",
  //   website: "https://mindfulnessmeditation.example.com",
  //   contactEmail: "contact@mindfulnessmeditation.example.com",
  // },
  // {
  //   name: "AI Enthusiasts",
  //   description:
  //     "A group for those interested in artificial intelligence and machine learning.",
  //   motto: "Shaping the Future with AI",
  //   website: "https://aienthusiasts.example.com",
  //   contactEmail: "info@aienthusiasts.example.com",
  // },
  // {
  //   name: "Blockchain Pioneers",
  //   description:
  //     "A community exploring blockchain technology and its applications.",
  //   motto: "Decentralizing the World",
  //   website: "https://blockchainpioneers.example.com",
  //   contactEmail: "support@blockchainpioneers.example.com",
  // },
  // {
  //   name: "Photography Lovers India",
  //   description: "An India-based group for photography enthusiasts.",
  //   motto: "Click, Share, Inspire",
  //   website: "https://photographyloversindia.example.com",
  //   contactEmail: "info@photographyloversindia.example.com",
  // },
  // {
  //   name: "Travel Addicts",
  //   description:
  //     "A group for people passionate about traveling and exploring new places.",
  //   motto: "Wander Often, Wonder Always",
  //   website: "https://traveladdicts.example.com",
  //   contactEmail: "contact@traveladdicts.example.com",
  // },
  // {
  //   name: "Vegan Lifestyle Advocates",
  //   description:
  //     "Promoting the benefits of a vegan lifestyle for health and the environment.",
  //   motto: "Healthy Living, Healthy Planet",
  //   website: "https://veganlifestyleadvocates.example.com",
  //   contactEmail: "support@veganlifestyleadvocates.example.com",
  // },
  // {
  //   name: "Wildlife Photographers",
  //   description:
  //     "A group for photographers who specialize in wildlife photography.",
  //   motto: "Capturing Nature's Beauty",
  //   website: "https://wildlifephotographers.example.com",
  //   contactEmail: "info@wildlifephotographers.example.com",
  // },
  // {
  //   name: "Space Exploration Enthusiasts",
  //   description:
  //     "A group for those interested in astronomy and space exploration.",
  //   motto: "To Infinity and Beyond",
  //   website: "https://spaceexplorationenthusiasts.example.com",
  //   contactEmail: "contact@spaceexplorationenthusiasts.example.com",
  // },
  // {
  //   name: "Coding for Kids",
  //   description: "A group that teaches coding and programming to kids.",
  //   motto: "Inspiring the Next Generation",
  //   website: "https://codingforkids.example.com",
  //   contactEmail: "support@codingforkids.example.com",
  // },
  // {
  //   name: "Sustainable Agriculture Group",
  //   description:
  //     "A community focused on sustainable farming and agriculture practices.",
  //   motto: "Farming for the Future",
  //   website: "https://sustainableagriculturegroup.example.com",
  //   contactEmail: "info@sustainableagriculturegroup.example.com",
  // },
  // {
  //   name: "Music Producers Hub",
  //   description:
  //     "A community for music producers to share tips, tricks, and collaborations.",
  //   motto: "Produce, Create, Inspire",
  //   website: "https://musicproducershub.example.com",
  //   contactEmail: "contact@musicproducershub.example.com",
  // },
  // {
  //   name: "Startup Founders",
  //   description:
  //     "A network of startup founders sharing experiences and advice.",
  //   motto: "Turning Ideas into Reality",
  //   website: "https://startupfounders.example.com",
  //   contactEmail: "info@startupfounders.example.com",
  // },
  // {
  //   name: "Fitness Bootcamp",
  //   description:
  //     "A group offering intense fitness training and bootcamp-style workouts.",
  //   motto: "Train Hard, Stay Strong",
  //   website: "https://fitnessbootcamp.example.com",
  //   contactEmail: "support@fitnessbootcamp.example.com",
  // },
  // {
  //   name: "Women in Business",
  //   description:
  //     "A network for women entrepreneurs and business professionals.",
  //   motto: "Empowering Women, Empowering Business",
  //   website: "https://womeninbusiness.example.com",
  //   contactEmail: "info@womeninbusiness.example.com",
  // },
  // {
  //   name: "Yoga for Beginners",
  //   description:
  //     "A community for people new to yoga, offering tips and beginner guides.",
  //   motto: "Find Your Balance",
  //   website: "https://yogaforbeginners.example.com",
  //   contactEmail: "contact@yogaforbeginners.example.com",
  // },
  // {
  //   name: "AI Developers Club",
  //   description:
  //     "A group for AI developers to share knowledge and collaborate.",
  //   motto: "Building the Future with AI",
  //   website: "https://aidevelopersclub.example.com",
  //   contactEmail: "support@aidevelopersclub.example.com",
  // },
  // {
  //   name: "Sustainable Fashion",
  //   description:
  //     "A community promoting eco-friendly and sustainable fashion choices.",
  //   motto: "Fashion for the Future",
  //   website: "https://sustainablefashion.example.com",
  //   contactEmail: "info@sustainablefashion.example.com",
  // },
  // {
  //   name: "Pet Lovers Club",
  //   description: "A group for pet owners and animal lovers.",
  //   motto: "For the Love of Pets",
  //   website: "https://petloversclub.example.com",
  //   contactEmail: "contact@petloversclub.example.com",
  // },
  // {
  //   name: "Language Learners Network",
  //   description:
  //     "A group for people learning new languages to share tips and resources.",
  //   motto: "Breaking Language Barriers",
  //   website: "https://languagelearnersnetwork.example.com",
  //   contactEmail: "info@languagelearnersnetwork.example.com",
  // },
  // {
  //   name: "Social Impact Innovators",
  //   description:
  //     "A community of people focused on creating social change through innovation.",
  //   motto: "Innovating for Good",
  //   website: "https://socialimpactinnovators.example.com",
  //   contactEmail: "contact@socialimpactinnovators.example.com",
  // },
  // Add more group entries as needed to reach 100
];
async function groupSeeder() {
  try {
    // Clear existing groups
    await Group.deleteMany({});
    logger.info("Existing groups cleared.");

    // Fetch all mentor IDs
    const mentors = await User.find({ role: "mentor" });
    const mentorIds = mentors.map((mentor) => mentor._id);

    if (mentorIds.length === 0) {
      logger.warn("No mentors found. Cannot seed groups without mentors.");
      return;
    }

    // Fetch all mentee IDs
    const mentees = await User.find({ role: "mentee" });
    const menteeIds = mentees.map((mentee) => mentee._id);

    if (menteeIds.length === 0) {
      logger.warn("No mentees found. Groups will have only mentors.");
    }

    for (const group of groupData) {
      // Validate the group data
      try {
        await validateGroup(group);
      } catch (validationError) {
        logger.error(`Failed to validate group: ${validationError.message}`);
        continue; // Skip this group and move to the next one
      }

      // Pick a random mentor ID for the group owner
      const ownerId = mentorIds[Math.floor(Math.random() * mentorIds.length)];

      // Pick random mentee members
      const randomMembers = menteeIds
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * menteeIds.length + 1)); // Random number of mentees

      // Create the group
      const newGroup = await Group.create({
        ...group,
        owner: ownerId,
        members: randomMembers,
        memberCount: randomMembers.length + 1, // Include the owner in the count
      });  
   }

    logger.info("Group data seeded successfully!");
  } catch (error) {
    logger.error("Error seeding group data:", error);
  }
}


module.exports = groupSeeder;