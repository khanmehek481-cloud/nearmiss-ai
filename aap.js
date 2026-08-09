const initial = [
  {
    location: "Block B Staircase",
    type: "Collision",
    severity: 3,
    description: "Two students nearly collided during class change."
  },
  {
    location: "Lab Entrance",
    type: "Slip / Fall",
    severity: 2,
    description: "A student almost slipped because of a wet floor."
  },
  {
    location: "Block B Staircase",
    type: "Overcrowding",
    severity: 2,
    description: "A large crowd formed at the staircase."
  },
  {
    location: "Canteen",
    type: "Collision",
    severity: 1,
    description: "Two people almost collided near the counter."
  }
];

let reports =
  JSON.parse(localStorage.getItem("nearmiss") || "null") || initial;

function save() {
  localStorage.setItem("nearmiss", JSON.stringify(reports));
}

function score(location) {
  return Math.min(
    100,
    reports
      .filter(r => r.location === location)
      .reduce((sum, r) => sum + r.severity * 15, 0)
  );
}

function render() {
  document.getElementById("total").textContent = reports.length;

  document.getElementById("high").textContent =
    reports.filter(r => r.severity === 3).length;

  const locations = [...new Set(reports.map(r => r.location))];

  document.getElementById("zones").textContent =
    locations.filter(x => score(x) >= 30).length;

  const max = Math.max(...locations.map(score), 0);

  const status = document.getElementById("status");

  status.textContent =
    max >= 70 ? "CRITICAL" :
    max >= 45 ? "HIGH" :
    max >= 25 ? "MODERATE" : "LOW";

  status.style.color =
    max >= 45 ? "#ff8b78" :
    max >= 25 ? "#ffd166" : "#62e6a8";

  document.getElementById("trend").textContent =
    Math.min(99, reports.length * 4) + "%";

  document.getElementById("riskList").innerHTML =
    locations
      .sort((a, b) => score(b) - score(a))
      .map(location => `
        <div class="risk">
          <b>${location}</b>
          <small> Risk score: ${score(location)}/100</small>
          <div class="riskbar">
            <div class="riskfill" style="width:${score(location)}%"></div>
          </div>
        </div>
      `)
      .join("");

  document.getElementById("reports").innerHTML =
    reports
      .slice()
      .reverse()
      .slice(0, 10)
      .map(r => `
        <div class="report">
          <b>${r.location}</b>
          <span class="tag">${r.type}</span>
          <p>${r.description}</p>
        </div>
      `)
      .join("");
}

function showReport() {
  document.getElementById("reportBox").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const location = document.getElementById("location").value;
  const type = document.getElementById("type").value;
  const severity = Number(
    document.getElementById("severity").value
  );
  const description =
    document.getElementById("description").value;

  reports.push({
    location,
    type,
    severity,
    description
  });

  save();
  render();
  this.reset();

  document.getElementById("message").textContent =
    "✓ Report recorded and risk analysis updated.";

  setTimeout(() => {
    document.getElementById("message").textContent = "";
  }, 3000);
});

render();
