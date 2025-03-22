import { supabase } from "../lib/supabase";

const seedDummyUsers = async () => {
  console.log("Starting to seed dummy users...");

  // Helper function to create a profile
  const createProfile = async (userData: any) => {
    try {
      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: "password123", // Simple password for test accounts
        email_confirm: true, // Automatically confirm their email
      });

      if (authError) {
        console.error(`Error creating auth user ${userData.email}:`, authError);
        return null;
      }

      const userId = authData?.user?.id;
      
      if (!userId) {
        console.error("Failed to get user ID after creation");
        return null;
      }

      // Then, create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: userData.name,
          bio: userData.bio,
          avatar_url: userData.avatar_url,
          skills: userData.skills,
          experience_level: userData.experience_level,
          looking_for: userData.looking_for,
          project_interests: userData.project_interests,
          contact_email: userData.email,
          github_url: userData.github_url,
          linkedin_url: userData.linkedin_url
        })
        .select()
        .single();

      if (profileError) {
        console.error(`Error creating profile for ${userData.email}:`, profileError);
        return null;
      }

      console.log(`Created user: ${userData.name} (${userData.email})`);
      return { auth: authData, profile: profileData };
    } catch (error) {
      console.error("Unexpected error during user creation:", error);
      return null;
    }
  };

  // Dummy user data
  const dummyUsers = [
    {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      bio: "Frontend developer with a passion for creating beautiful and user-friendly interfaces. Looking to collaborate on creative projects.",
      avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
      skills: ["JavaScript", "React", "CSS", "HTML", "UI/UX"],
      experience_level: "Intermediate",
      looking_for: ["Backend Developer", "Designer", "Data Scientist"],
      project_interests: ["E-commerce", "Social Impact", "Education"],
      github_url: "https://github.com/alexjohnson",
      linkedin_url: "https://linkedin.com/in/alexjohnson"
    },
    {
      name: "Sarah Lee",
      email: "sarah.lee@example.com",
      bio: "Backend developer with 3 years experience in Python and Django. Interested in AI and machine learning applications.",
      avatar_url: "https://randomuser.me/api/portraits/women/2.jpg",
      skills: ["Python", "Django", "Docker", "PostgreSQL", "API Development"],
      experience_level: "Advanced",
      looking_for: ["Frontend Developer", "AI/ML Engineer", "DevOps"],
      project_interests: ["AI Assistants", "Data Analysis", "Automation"],
      github_url: "https://github.com/sarahlee",
      linkedin_url: "https://linkedin.com/in/sarahlee"
    },
    {
      name: "Miguel Rodriguez",
      email: "miguel.rodriguez@example.com",
      bio: "Full-stack developer and UI/UX enthusiast. Love building from concept to deployment.",
      avatar_url: "https://randomuser.me/api/portraits/men/3.jpg",
      skills: ["JavaScript", "TypeScript", "Node.js", "MongoDB", "Express", "React"],
      experience_level: "Intermediate",
      looking_for: ["UI/UX Designer", "Product Manager", "Mobile Developer"],
      project_interests: ["FinTech", "Health Tech", "Mobile Apps"],
      github_url: "https://github.com/miguelr",
      linkedin_url: "https://linkedin.com/in/miguelr"
    },
    {
      name: "Aisha Patel",
      email: "aisha.patel@example.com",
      bio: "Data scientist with strong background in statistics and machine learning. Enthusiastic about solving complex problems with data.",
      avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
      skills: ["Python", "R", "TensorFlow", "Data Visualization", "Statistics"],
      experience_level: "Advanced",
      looking_for: ["Frontend Developer", "Backend Developer", "Domain Expert"],
      project_interests: ["Predictive Analytics", "NLP", "Computer Vision"],
      github_url: "https://github.com/aishap",
      linkedin_url: "https://linkedin.com/in/aishap"
    },
    {
      name: "Jordan Kim",
      email: "jordan.kim@example.com",
      bio: "DevOps engineer with a focus on cloud infrastructure and CI/CD. Beginner in coding but strong in infrastructure management.",
      avatar_url: "https://randomuser.me/api/portraits/men/5.jpg",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
      experience_level: "Beginner",
      looking_for: ["Full-stack Developer", "Backend Developer", "Security Engineer"],
      project_interests: ["Cloud Services", "Microservices", "Infrastructure as Code"],
      github_url: "https://github.com/jordank",
      linkedin_url: "https://linkedin.com/in/jordank"
    }
  ];

  // Create all dummy users
  for (const userData of dummyUsers) {
    await createProfile(userData);
  }

  console.log("Finished seeding dummy users!");
};

// Execute the seeding function
seedDummyUsers().catch(console.error);

// Export for potential use in other parts of the app
export default seedDummyUsers; 