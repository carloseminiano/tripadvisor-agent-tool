// 🌳 Initialize global tree with only dropdown structure (without resolution)
const tree = {
  owner: {
    listing: {
      verification: {
        "how to verify": {
          "owner registered not verified": {
            "not verified": {} // Will fetch file from GitHub
          }
        }
      },
      "ownership change": {},
      photos: {},
      awards: {},
      duplicate: {},
      "update business information": {}
    },
    awards: {},
    reviews: {},
    "management center": {},
    booking: {},
    "vacation rental": {}
  },
  member: {
    reviews: {
      report: {}
    },
    "member account": {},
    listing: {},
    community: {}
  },
  unregistered: {}
};

// 🌐 DOM Elements
const requestorSelect = document.getElementById("requestor");
const dynamicFields = document.getElementById("dynamicFields");
const resolutionBox = document.getElementById("resolutionContainer");
const instructionOutput = document.getElementById("instructionText");
const emailOutput = document.getElementById("emailTemplate");
const kbOutput = document.getElementById("kbLink");
const relatedCasesList = document.getElementById("relatedCasesList");

// 🧠 Capitalize each word in a string
function capitalize(text) {
  return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// 🧹 Clear all dynamic fields and hide resolution box
function clearDynamicFields() {
  dynamicFields.innerHTML = "";
  resolutionBox.classList.add("hidden");
}

// 📦 Show resolution details in the UI
function showResolution(resolution) {
  resolutionBox.classList.remove("hidden");

  instructionOutput.textContent = resolution.instruction || "—";
  emailOutput.textContent = resolution.emailTemplate || "—";
  kbOutput.textContent = resolution.kb || "—";

  relatedCasesList.innerHTML = "";
  (resolution.relatedCases || []).forEach(caseId => {
    const li = document.createElement("li");
    li.textContent = caseId;
    relatedCasesList.appendChild(li);
  });
}

// 🌍 Fetch resolution JSON file from GitHub
async function showResolutionFromFile(pathArray) {
  const filename = pathArray.join("_").replace(/\s+/g, "_") + ".json";
  const url = `https://raw.githubusercontent.com/your-username/your-repo/main/resolutions/${filename}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("File not found");

    const resolution = await response.json();
    showResolution(resolution);
  } catch (err) {
    console.error("Error loading resolution:", err);
    alert("Resolution not available for this path.");
  }
}

// 🎯 Create a dropdown and handle its change
function createDropdown(labelText, options, levelPath) {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = labelText;
  wrapper.appendChild(label);

  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = `Select ${labelText}`;
  select.appendChild(defaultOption);

  for (const key of Object.keys(options)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = capitalize(key);
    select.appendChild(option);
  }

  select.addEventListener("change", () => {
    // Clear dropdowns below current
    while (wrapper.nextSibling) {
      dynamicFields.removeChild(wrapper.nextSibling);
    }

    const selectedValue = select.value;
    if (!selectedValue) return;

    const newPath = [...levelPath, selectedValue];

    let pointer = tree;
    for (const key of newPath) {
      pointer = pointer?.[key];
    }

    if (!pointer || Object.keys(pointer).length === 0) {
      showResolutionFromFile(newPath);
    } else if (typeof pointer === "object") {
      let label = levelPath.length === 0 ? "Category" : `Reason ${levelPath.length}`;
      const dropdown = createDropdown(label, pointer, newPath);
      dynamicFields.appendChild(dropdown);
    }
  });

  wrapper.appendChild(select);
  return wrapper;
}

// 🚦 Handle initial dropdown (Requestor)
requestorSelect.addEventListener("change", () => {
  clearDynamicFields();
  const selected = requestorSelect.value;
  if (!selected || !tree[selected]) return;

  const next = tree[selected];
  const dropdown = createDropdown("Category", next, [selected]);
  dynamicFields.appendChild(dropdown);
});

// 📋 Copy to clipboard function
function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}
