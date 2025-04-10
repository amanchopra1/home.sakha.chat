const teamMembers = [
  {
    name: "Aman Chopra",
    position: "AI/ML Analyst at Brainwave Science",
    image: "./images/AmanPrabhuJi.jpg",
    linkedin: "https://www.linkedin.com/in/amanchopra9/",
    description:
      "Initiated and led the development of Project Sakha by bringing together a team of skilled volunteers. Directed the creation of a conversational chatbot trained on Srila Prabhupada's books, aligning AI with spiritual literature. Currently working as an EEG Consultant and AI/ML Analyst at Brainwave Science.",
  },
  {
    name: "Arpita Mittal",
    position: "SDE-1",
    image: "./images/ArpitaMataJi.jpg",
    linkedin: "https://www.linkedin.com",
    description: `Managed the complete backend development of Sakha with over a year of experience in software engineering.
`,
  },
  {
    name: "Aastha Tripathi",
    position: "Associate Buisness Analyst",
    image: "./images/AasthaMataJi.jpg",
    linkedin:
      "https://www.linkedin.com/in/tripathi-aastha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    description: `Led the volunteer coordination efforts and played a key role in chatbot and dataset development for Project Sakha. Contributed to manual labeling and preparation of training data, ensuring accuracy and alignment with Srila Prabhupada's teachings.
`,
  },
  {
    name: "Nidhi Vig",
    position: "SDE @Amazon",
    image: "./images/NidhiMataJi.jpg",
    linkedin: "https://www.linkedin.com/in/nidhi-vig-013965202/",
    description: `A tech-enthusiast who contributed to Sakha by assisting in application-level development and technology integration.
`,
  },
  {
    name: "Tuhin Bose",
    position: "Security Researcher @CloudSEK",
    image: "./images/TohinPrabhuJi.jpg",
    linkedin: "https://www.linkedin.com/in/tuhin1729/",
    description: `Helped manage cloud servers, integrating backend, frontend, and DevOps workflows to ensure seamless operation.
`,
  },
  {
    name: "Nilesh Patil",
    position: "College Student",
    image: "./images/NileshPrabhuJi.jpg",
    linkedin: "https://linkedIn.com/in/nileshpatil6",
    description: `Developed a robust frontend, particularly the chanting beads segment, and showed great enthusiasm for open-source and AI.
`,
  },
  {
    name: "Sahil Mehta",
    position: "SDE-1",
    image: "./images/SahiPrabhuJi.png",
    linkedin: "https://www.linkedin.com/in/sahil-mehta-1235b0158/",
    description: `Contributed significantly by designing the UI for over 900+ Vedic Granths, ensuring a user-friendly experience.
`,
  },
  {
    name: "Abhishek Rai",
    position: "Software Engineer",
    image: "./images/Abhishek.jpg",
    linkedin: "https://www.linkedin.com/in/abhishek-rai-692397227/",
    description: `Built and optimized the frontend for Sakha, translating team requirements into functional user interfaces.`,
  },
];

const container = document.querySelector(".team-card-wrapper");

teamMembers.forEach((member) => {
  const card = document.createElement("div");
  card.classList.add("card-container");

  // Check if description is long enough to need truncation (more than 100 characters)
  const needsTruncation = member.description.length > 100;

  card.innerHTML = `
    <div class="card">
      <div class="team-image-wrapper">
        <img class="team-member-image" src="${member.image}" alt="${
    member.name
  }">
      </div>
      <p class="text-blk name">${member.name}</p>
      <p class="text-blk position">${member.position}</p>

      <div class="feature-text-wrapper">
        <p class="text-blk feature-text ${needsTruncation ? "clamped" : ""}">
          ${member.description}
        </p>
        ${needsTruncation ? `<span class="read-more">Read more</span>` : ""}
      </div>

      <div class="social-icons">
        <a href="${member.linkedin}" target="_blank">
          <img class="linkedin-icon" src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn">
        </a>
      </div>
    </div>
  `;

  container.appendChild(card);
});

// Read more toggle
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("read-more")) {
    const card = e.target.closest(".card");
    const featureText = card.querySelector(".feature-text");
    const textWrapper = card.querySelector(".feature-text-wrapper");

    // Toggle classes
    card.classList.toggle("expanded");
    featureText.classList.toggle("clamped");

    // Toggle text and adjust card height
    if (card.classList.contains("expanded")) {
      e.target.textContent = "Show less";
      // Remove the fixed height constraint
      card.style.height = "auto";
    } else {
      e.target.textContent = "Read more";
      // Reset to the original fixed height
      card.style.height = "480px";
    }
  }
});
