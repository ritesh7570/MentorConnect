const mongoose = require("mongoose");
const Job = require("../models/job");
const User = require("../models/user");
const { validateJob } = require("../schemas/jobSchema");
const { log } = require("winston");
const logger = require("../utils/logger")("jobSeeder"); // Import logger

const jobData = [
  // Healthcare
  {
    title: "Doctor",
    salary: 150000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "HealthCare India",
    applyLink: "https://healthcareindia.in/careers",
  },
  {
    title: "Nurse",
    salary: 70000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "NurseCare",
    applyLink: "https://nursecare.in/jobs",
  },
  {
    title: "Pharmacist",
    salary: 80000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "PharmaPlus",
    applyLink: "https://pharmaplus.in/careers",
  },
  {
    title: "Surgeon",
    salary: 200000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "SurgeryIndia",
    applyLink: "https://surgeryindia.in/jobs",
  },
  {
    title: "Dentist",
    salary: 100000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "DentalCare",
    applyLink: "https://dentalcare.in/careers",
  },
  {
    title: "Physiotherapist",
    salary: 80000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "PhysioCare",
    applyLink: "https://physiocare.in/jobs",
  },
  {
    title: "Optometrist",
    salary: 70000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "OpticsPlus",
    applyLink: "https://opticsplus.in/careers",
  },
  {
    title: "Veterinarian",
    salary: 90000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "VetCare",
    applyLink: "https://vetcare.in/jobs",
  },

  // Entertainment
  {
    title: "Actor",
    salary: 150000,
    location: "Mumbai, India",
    jobType: "Contract",
    companyName: "Bollywood Productions",
    applyLink: "https://bollywoodproductions.in/jobs",
  },
  {
    title: "Director",
    salary: 200000,
    location: "Delhi, India",
    jobType: "Contract",
    companyName: "FilmMakers Ltd.",
    applyLink: "https://filmmakers.in/careers",
  },
  {
    title: "Screenwriter",
    salary: 100000,
    location: "Bangalore, India",
    jobType: "Contract",
    companyName: "ScriptWriters",
    applyLink: "https://scriptwriters.in/jobs",
  },
  {
    title: "Producer",
    salary: 250000,
    location: "Chennai, India",
    jobType: "Contract",
    companyName: "CinemaWorks",
    applyLink: "https://cinemaworks.in/careers",
  },
  {
    title: "Cinematographer",
    salary: 120000,
    location: "Hyderabad, India",
    jobType: "Contract",
    companyName: "FilmVision",
    applyLink: "https://filmvision.in/jobs",
  },
  {
    title: "Film Editor",
    salary: 95000,
    location: "Kolkata, India",
    jobType: "Contract",
    companyName: "EditMasters",
    applyLink: "https://editmasters.in/careers",
  },
  {
    title: "Casting Director",
    salary: 100000,
    location: "Pune, India",
    jobType: "Contract",
    companyName: "Casting Co.",
    applyLink: "https://castingco.in/jobs",
  },
  {
    title: "Art Director",
    salary: 110000,
    location: "Ahmedabad, India",
    jobType: "Contract",
    companyName: "ArtWorks",
    applyLink: "https://artworks.in/careers",
  },
  {
    title: "Sound Engineer",
    salary: 90000,
    location: "Jaipur, India",
    jobType: "Contract",
    companyName: "SoundSolutions",
    applyLink: "https://soundsolutions.in/jobs",
  },
  {
    title: "Production Assistant",
    salary: 50000,
    location: "Mumbai, India",
    jobType: "Contract",
    companyName: "FilmAssist",
    applyLink: "https://filmassist.in/careers",
  },
  {
    title: "Software Engineer",
    salary: 120000,
    location: "San Francisco, CA",
    jobType: "Full-time",
    companyName: "Tech Corp",
    applyLink: "https://techcorp.com/apply",
  },
  {
    title: "Frontend Developer",
    salary: 95000,
    location: "New York, NY",
    jobType: "Full-time",
    companyName: "Web Innovations",
    applyLink: "https://webinnovations.com/careers",
  },
  {
    title: "Data Analyst Intern",
    salary: 20000,
    location: "Remote",
    jobType: "Internship",
    companyName: "Data Insights",
    applyLink: "https://datainsights.com/apply",
  },
  {
    title: "Architect",
    salary: 130000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "ArchDesign",
    applyLink: "https://archdesign.in/jobs",
  },
  {
    title: "Civil Engineer",
    salary: 110000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "BuildMasters",
    applyLink: "https://buildmasters.in/careers",
  },
  {
    title: "Mechanical Engineer",
    salary: 100000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "MechExperts",
    applyLink: "https://mechexperts.in/jobs",
  },
  {
    title: "Electrical Engineer",
    salary: 105000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "ElectroTech",
    applyLink: "https://electrotech.in/careers",
  },
  {
    title: "Teacher",
    salary: 70000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "EduCare",
    applyLink: "https://educare.in/jobs",
  },
  {
    title: "Professor",
    salary: 120000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "UniTeach",
    applyLink: "https://uniteach.in/careers",
  },
  {
    title: "Financial Advisor",
    salary: 95000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "FinanceAdvisors",
    applyLink: "https://financeadvisors.in/jobs",
  },
  {
    title: "Marketing Manager",
    salary: 100000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "MarketExperts",
    applyLink: "https://marketexperts.in/careers",
  },
  {
    title: "Product Manager",
    salary: 120000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "ProductMasters",
    applyLink: "https://productmasters.in/jobs",
  },
  {
    title: "HR Manager",
    salary: 90000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "HRExperts",
    applyLink: "https://hrexperts.in/careers",
  },
  {
    title: "Administrative Assistant",
    salary: 65000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "AdminSolutions",
    applyLink: "https://adminsolutions.in/jobs",
  },
  {
    title: "Business Development Manager",
    salary: 110000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "BizDev Co.",
    applyLink: "https://bizdevco.in/careers",
  },
  {
    title: "Logistics Coordinator",
    salary: 80000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "LogisticsPlus",
    applyLink: "https://logisticsplus.in/jobs",
  },
  {
    title: "Event Planner",
    salary: 70000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "EventExperts",
    applyLink: "https://eventexperts.in/careers",
  },
  {
    title: "Travel Consultant",
    salary: 60000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "TravelCo",
    applyLink: "https://travelco.in/jobs",
  },
  {
    title: "Customer Service Representative",
    salary: 50000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "CustomerCare",
    applyLink: "https://customercare.in/careers",
  },
  {
    title: "Graphic Designer",
    salary: 75000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "DesignStudio",
    applyLink: "https://designstudio.in/jobs",
  },
  {
    title: "Content Writer",
    salary: 65000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "ContentCreators",
    applyLink: "https://contentcreators.in/careers",
  },
  {
    title: "Social Media Manager",
    salary: 80000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "SocialExperts",
    applyLink: "https://socialexperts.in/jobs",
  },
  {
    title: "Legal Advisor",
    salary: 120000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "LegalMasters",
    applyLink: "https://legalmasters.in/careers",
  },
  {
    title: "Real Estate Agent",
    salary: 90000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "RealEstatePro",
    applyLink: "https://realestatepro.in/jobs",
  },
  {
    title: "IT Support Specialist",
    salary: 70000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "ITCare",
    applyLink: "https://itcare.in/careers",
  },
  {
    title: "Database Administrator",
    salary: 100000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "DBMasters",
    applyLink: "https://dbmasters.in/jobs",
  },
  {
    title: "Network Engineer",
    salary: 95000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "NetworkSolutions",
    applyLink: "https://networksolutions.in/careers",
  },
  {
    title: "Web Developer",
    salary: 85000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "WebWorks",
    applyLink: "https://webworks.in/jobs",
  },
  {
    title: "Software Tester",
    salary: 70000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "TestMasters",
    applyLink: "https://testmasters.in/careers",
  },
  {
    title: "Quality Assurance Analyst",
    salary: 75000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "QualityCo",
    applyLink: "https://qualityco.in/jobs",
  },
  {
    title: "Systems Analyst",
    salary: 90000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "SystemsPlus",
    applyLink: "https://systemsplus.in/careers",
  },
  {
    title: "Technical Writer",
    salary: 65000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "TechWrite",
    applyLink: "https://techwrite.in/jobs",
  },
  {
    title: "Data Scientist",
    salary: 130000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "DataTech",
    applyLink: "https://datatech.in/careers",
  },
  {
    title: "Digital Marketing Specialist",
    salary: 80000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "DigitalPro",
    applyLink: "https://digitalpro.in/jobs",
  },
  {
    title: "SEO Specialist",
    salary: 75000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "SEOExperts",
    applyLink: "https://seoexperts.in/careers",
  },
  {
    title: "Product Designer",
    salary: 95000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "DesignWorks",
    applyLink: "https://designworks.in/jobs",
  },
  {
    title: "UX Researcher",
    salary: 85000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "UXResearch",
    applyLink: "https://uxresearch.in/careers",
  },
  {
    title: "Customer Success Manager",
    salary: 90000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "SuccessPlus",
    applyLink: "https://successplus.in/jobs",
  },
  {
    title: "Sales Executive",
    salary: 70000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "SalesPros",
    applyLink: "https://salespros.in/careers",
  },
  {
    title: "Business Analyst",
    salary: 95000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "BizAnalyze",
    applyLink: "https://bizanalyze.in/jobs",
  },
  {
    title: "Operations Manager",
    salary: 100000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "OperationsPlus",
    applyLink: "https://operationsplus.in/careers",
  },
  {
    title: "Supply Chain Manager",
    salary: 90000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "SupplyMasters",
    applyLink: "https://supplymasters.in/jobs",
  },
  {
    title: "HR Coordinator",
    salary: 65000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "HRCo",
    applyLink: "https://hrco.in/careers",
  },
  {
    title: "Training Specialist",
    salary: 70000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "TrainExperts",
    applyLink: "https://trainexperts.in/jobs",
  },
  {
    title: "Project Manager",
    salary: 110000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "ProjectMasters",
    applyLink: "https://projectmasters.in/careers",
  },
  {
    title: "Quality Control Inspector",
    salary: 80000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "QualityPlus",
    applyLink: "https://qualityplus.in/jobs",
  },
  {
    title: "Manufacturing Engineer",
    salary: 85000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "ManufactureCo",
    applyLink: "https://manufactureco.in/careers",
  },
  {
    title: "R&D Scientist",
    salary: 120000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "ResearchAndDev",
    applyLink: "https://researchanddev.in/jobs",
  },
  {
    title: "Graphic Designer",
    salary: 75000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "DesignStudio",
    applyLink: "https://designstudio.in/careers",
  },
  {
    title: "Content Creator",
    salary: 65000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "ContentCreators",
    applyLink: "https://contentcreators.in/jobs",
  },
  {
    title: "Digital Content Specialist",
    salary: 70000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "DigitalContent",
    applyLink: "https://digitalcontent.in/careers",
  },
  {
    title: "E-commerce Manager",
    salary: 90000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "EcomMasters",
    applyLink: "https://ecommasters.in/jobs",
  },
  {
    title: "Cloud Engineer",
    salary: 100000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "CloudWorks",
    applyLink: "https://cloudworks.in/careers",
  },
  {
    title: "DevOps Engineer",
    salary: 95000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "DevOpsPlus",
    applyLink: "https://devopsplus.in/jobs",
  },
  {
    title: "Game Developer",
    salary: 105000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "GameDevStudio",
    applyLink: "https://gamedevstudio.in/careers",
  },
  {
    title: "IT Consultant",
    salary: 90000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "ITConsultants",
    applyLink: "https://itconsultants.in/jobs",
  },
  {
    title: "System Administrator",
    salary: 75000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "SystemAdminCo",
    applyLink: "https://systemadminco.in/careers",
  },
  {
    title: "Technical Support Specialist",
    salary: 70000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "TechSupport",
    applyLink: "https://techsupport.in/jobs",
  },
  {
    title: "Research Analyst",
    salary: 85000,
    location: "Delhi, India",
    jobType: "Full-time",
    companyName: "ResearchCorp",
    applyLink: "https://researchcorp.in/careers",
  },
  {
    title: "Marketing Specialist",
    salary: 75000,
    location: "Bangalore, India",
    jobType: "Full-time",
    companyName: "MarketSolutions",
    applyLink: "https://marketsolutions.in/jobs",
  },
  {
    title: "Public Relations Manager",
    salary: 90000,
    location: "Chennai, India",
    jobType: "Full-time",
    companyName: "PRMasters",
    applyLink: "https://prmasters.in/careers",
  },
  {
    title: "Event Coordinator",
    salary: 70000,
    location: "Hyderabad, India",
    jobType: "Full-time",
    companyName: "EventCoord",
    applyLink: "https://eventcoord.in/jobs",
  },
  {
    title: "Recruitment Specialist",
    salary: 80000,
    location: "Kolkata, India",
    jobType: "Full-time",
    companyName: "RecruitmentPlus",
    applyLink: "https://recruitmentplus.in/careers",
  },
  {
    title: "Operations Analyst",
    salary: 85000,
    location: "Pune, India",
    jobType: "Full-time",
    companyName: "OpsAnalysis",
    applyLink: "https://opsanalysis.in/jobs",
  },
  {
    title: "IT Project Manager",
    salary: 110000,
    location: "Ahmedabad, India",
    jobType: "Full-time",
    companyName: "ITProjects",
    applyLink: "https://itprojects.in/careers",
  },
  {
    title: "Business Development Manager",
    salary: 95000,
    location: "Jaipur, India",
    jobType: "Full-time",
    companyName: "BizDevCo",
    applyLink: "https://bizdevco.in/jobs",
  },
  {
    title: "Strategic Planner",
    salary: 90000,
    location: "Mumbai, India",
    jobType: "Full-time",
    companyName: "StrategyWorks",
    applyLink: "https://strategyworks.in/careers",
  },
];
async function jobSeeder() {
  try {
    // Clear existing jobs
    await Job.deleteMany({});
    logger.info("Existing jobs cleared.");

    // Fetch all mentors
    const mentors = await User.find({ role: "mentor" });
    const mentorIds = mentors.map((mentor) => mentor._id);

    // Fetch all mentees
    const mentees = await User.find({ role: "mentee" });
    const menteeIds = mentees.map((mentee) => mentee._id);

    if (mentorIds.length === 0) {
      logger.warn("No mentors found. Cannot seed jobs without mentors.");
      return;
    }

    if (menteeIds.length === 0) {
      logger.warn("No mentees found. Jobs will have no likes.");
    }

    for (const job of jobData) {
      // Validate the job data
      try {
        await validateJob(job);
      } catch (validationError) {
        logger.error(`Failed to validate job: ${validationError.message}`);
        continue; // Skip this job and move to the next one
      }

      // Assign a random mentor as the job owner
      const ownerId = mentorIds[Math.floor(Math.random() * mentorIds.length)];
      job.owner = ownerId;

      // Randomly generate likes from mentees
      const numLikes = Math.floor(Math.random() * menteeIds.length);
      job.likes = [];
      for (let i = 0; i < numLikes; i++) {
        const menteeId = menteeIds[Math.floor(Math.random() * menteeIds.length)];
        if (!job.likes.includes(menteeId)) {
          job.likes.push(menteeId);
        }
      }

      // Create the job
      const newJob = await Job.create(job);


      console.info(`Job "${newJob.title}" created successfully`);
    }

    logger.info("Job data seeded successfully!");
  } catch (error) {
    logger.error("Error seeding job data:", error);
  }
}


module.exports = jobSeeder;
