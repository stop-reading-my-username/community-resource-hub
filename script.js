// Base (official) resources
const baseResources = [
  {
    id: 1,
    name: "Katy Christian Ministries (KCM) Food Pantry",
    category: "Food & Basic Needs",
    audience: "Families",
    description: "Food pantry providing supplemental food and personal care items for eligible Katy-area residents.",
    website: "https://ktcm.org/foodpantry/",
    contact: "281-391-3730 • 3506 Porter Rd, Katy, TX 77493",
    tags: ["food", "pantry", "groceries", "KCM"],
    featured: true
  },
  {
    id: 2,
    name: "2-1-1 Texas (United Way Helpline)",
    category: "Housing & Financial",
    audience: "Everyone",
    description: "Connects residents to local help for food, housing, utilities, health services, and more.",
    website: "https://www.211texas.org/",
    contact: "Dial 2-1-1 or 877-541-7905",
    tags: ["211", "utilities", "housing", "referrals"],
    featured: true
  },
  {
    id: 3,
    name: "988 Suicide & Crisis Lifeline",
    category: "Health & Wellness",
    audience: "Everyone",
    description: "Free, confidential 24/7 support for mental health crisis and suicide prevention.",
    website: "https://988lifeline.org/",
    contact: "Call or Text: 988",
    tags: ["mental health", "crisis", "988"]
  },
  {
    id: 4,
    name: "Fort Bend Women’s Center",
    category: "Health & Wellness",
    audience: "Families",
    description: "Support for survivors of domestic violence and sexual assault, including a 24-hour hotline.",
    website: "https://www.fbwc.org/en/",
    contact: "24-Hour Hotline: 281-342-HELP (4357)",
    tags: ["safety", "hotline", "support"],
    featured: true
  },
  {
    id: 5,
    name: "Katy ISD Community Resource Guide",
    category: "Education & Tutoring",
    audience: "Families",
    description: "Directory compiled for Katy ISD students and families to locate local community resources and support services.",
    website: "https://www.katyisd.org/social-work-services-support/katy-isd-community-resource-guide",
    contact: "See website for contacts",
    tags: ["katy isd", "students", "families"]
  },
  {
    id: 6,
    name: "Katy Branch Library (Harris County Public Library)",
    category: "Education & Tutoring",
    audience: "Everyone",
    description: "Library services including programs, study spaces, and free learning resources.",
    website: "https://hcpl.net/locations/kt/",
    contact: "281-391-3509 • 5414 Franz Rd, Katy, TX 77493",
    tags: ["library", "study", "programs"]
  },
  {
    id: 7,
    name: "Memorial Hermann Katy Hospital",
    category: "Health & Wellness",
    audience: "Everyone",
    description: "Hospital providing emergency and medical services for the Katy area (ER available 24/7).",
    website: "https://memorialhermann.org/locations/katy",
    contact: "281-644-7000 • 23900 Katy Fwy, Katy, TX 77494",
    tags: ["hospital", "ER", "medical"]
  },
  {
    id: 8,
    name: "City of Katy Police (Non-Emergency)",
    category: "Health & Wellness",
    audience: "Everyone",
    description: "For non-emergency police assistance within the City of Katy.",
    website: "https://www.cityofkaty.com/i-want-to/view/helpful-phone-numbers",
    contact: "Non-Emergency: 281-391-4848",
    tags: ["police", "safety", "non-emergency"]
  }
];

// Load/save pending (user-submitted) resources
function loadUserResources() {
  try {
    const raw = localStorage.getItem("userResources");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveUserResources(list) {
  localStorage.setItem("userResources", JSON.stringify(list));
}

function norm(s) { return (s || "").toLowerCase().trim(); }

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("filter-category");
  const audienceSelect = document.getElementById("filter-audience");
  const resourceList = document.getElementById("resource-list");
  const highlightGrid = document.getElementById("highlight-grid");
  const resultsCount = document.getElementById("results-count");

  let userResources = loadUserResources();
  let resources = [...baseResources, ...userResources];

  function badge(text, extraClass = "") {
    const s = document.createElement("span");
    s.className = `badge ${extraClass}`.trim();
    s.textContent = text;
    return s;
  }

  function createCard(res) {
    const card = document.createElement("article");
    card.className = "card";

    const h = document.createElement("h3");
    h.textContent = res.name;

    const badges = document.createElement("div");
    badges.className = "badges";
    badges.appendChild(badge(res.category));
    badges.appendChild(badge(res.audience));
    if (res.pending) badges.appendChild(badge("Pending review", "pending"));

    const p = document.createElement("p");
    p.textContent = res.description;

    const c = document.createElement("p");
    c.className = "resource-contact";
    const link = res.website
      ? `<a class="text-link" href="${res.website}" target="_blank" rel="noopener noreferrer">Visit website</a>`
      : "";
    const contactText = res.contact ? ` · <span>${res.contact}</span>` : "";
    c.innerHTML = `${link}${contactText}`;

    card.appendChild(h);
    card.appendChild(badges);
    card.appendChild(p);
    card.appendChild(c);
      // Allow removing ONLY user-submitted pending items (local to this browser)
  if (res.pending) {
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn-small danger";
    del.textContent = "Remove";

    del.addEventListener("click", () => {
      const ok = confirm(`Remove "${res.name}"?`);
      if (!ok) return;

      userResources = userResources.filter(r => r.id !== res.id);
      saveUserResources(userResources);
      resources = [...baseResources, ...userResources];

      renderHighlights();
      applyFilters();
    });

    actions.appendChild(del);
    card.appendChild(actions);
  }


    return card;
  }

  function render(list) {
    resourceList.innerHTML = "";

    if (resultsCount) {
      resultsCount.textContent = `Showing ${list.length} of ${resources.length} resources`;
    }

    if (!list.length) {
      resourceList.innerHTML = `<p class="muted">No resources match your search. Try different filters.</p>`;
      return;
    }

    list.forEach(r => resourceList.appendChild(createCard(r)));
  }

  function renderHighlights() {
    highlightGrid.innerHTML = "";
    const featured = resources.filter(r => r.featured).slice(0, 3);
    const picks = featured.length ? featured : resources.slice(0, 3);

    picks.forEach(r => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3>${r.name}</h3>
        <div class="badges">
          <span class="badge">${r.category}</span>
          <span class="badge">${r.audience}</span>
        </div>
        <p>${r.description}</p>
        ${r.website ? `<p class="resource-contact"><a class="text-link" href="${r.website}" target="_blank" rel="noopener noreferrer">Learn more</a></p>` : ""}
      `;
      highlightGrid.appendChild(card);
    });
  }

  function applyFilters() {
    const term = norm(searchInput.value);
    const category = categorySelect.value;
    const audience = audienceSelect.value;

    const filtered = resources.filter(res => {
      const okCat = category ? res.category === category : true;
      const okAud = audience ? res.audience === audience : true;

      const hay = norm(`${res.name} ${res.description} ${(res.tags || []).join(" ")} ${res.contact || ""}`);
      const okSearch = term ? hay.includes(term) : true;

      return okCat && okAud && okSearch;
    });

    render(filtered);
  }

  // Inputs
  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  audienceSelect.addEventListener("change", applyFilters);

  // Initial
  renderHighlights();
  render(resources);

  // Form submission adds "pending review" on this device/browser
  const form = document.getElementById("resource-form");
  const msg = document.getElementById("form-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("res-name").value.trim();
    const category = document.getElementById("res-category").value;
    const website = document.getElementById("res-website").value.trim();
    const contact = document.getElementById("res-contact").value.trim();
    const description = document.getElementById("res-description").value.trim();

    if (!name || !category || !description) {
      msg.textContent = "Please fill out all required fields (*)";
      msg.className = "form-message error";
      return;
    }

    const newRes = {
      id: Date.now(),
      name,
      category,
      audience: "Everyone",
      description,
      website: website || "",
      contact: contact || "",
      tags: ["submitted"],
      pending: true
    };

    userResources.push(newRes);
    saveUserResources(userResources);

    resources = [...baseResources, ...userResources];

    form.reset();
    msg.textContent = "Thanks! Your suggestion was added as “Pending review.”";
    msg.className = "form-message success";

    renderHighlights();
    applyFilters();
  });
});
