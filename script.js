alert("✅ JS file is working!");

// ✅ Maps categories to available concerns
const concernMap = {
  listing: ["Verification", "Update Business Information", "Report Ownership Change"],
  product: ["Interested in Purchasing", "Billing", "Cancel Subscription"],
  booking: ["Confirmation Email", "Cancel Booking", "Booking Status"],
  member_account: ["Forgot Password", "Update Info", "Merge Account"]
};

// ✅ Maps concerns to sub-concerns (Make sure concern names match concernMap exactly)
const subConcernMap = {
  "Verification": ["Owner Registered - Not Verified", "Identity Check", "Owner Disabled"],
  "Update Business Information": ["Name Update", "Contact Update", "Category Correction"],
  "Report Ownership Change": ["Business Sold", "Business Closed"],
  "Interested in Purchasing": ["Business Advantage", "Premium Plan"],
  "Billing": ["Refund", "Failed Transaction"],
  "Cancel Subscription": ["Auto Renewal", "Manual Cancellation"],
  "Confirmation Email": ["Not Received", "Wrong Email"],
  "Cancel Booking": ["Duplicate", "Customer Request"],
  "Booking Status": ["Pending", "Confirmed"],
  "Forgot Password": ["Reset Link", "Not Receiving Email"],
  "Update Info": ["Change Email", "Change Name"],
  "Merge Account": ["Same Email", "Different Email"]
};

// ✅ Reset child dropdowns when a parent changes
function resetBelow(level) {
  if (level === "requestor" || level === "category") {
    document.getElementById("concern").innerHTML = "<option value=''>-- Select --</option>";
    document.getElementById("subconcern").innerHTML = "<option value=''>-- Select --</option>";
    document.getElementById("resolutionContainer").innerHTML = "";
  }
  if (level === "concern") {
    document.getElementById("subconcern").innerHTML = "<option value=''>-- Select --</option>";
    document.getElementById("resolutionContainer").innerHTML = "";
  }
}

// ✅ Populate the concern dropdown based on category
function updateConcernOptions() {
  const category = document.getElementById("category").value;
  const concernSelect = document.getElementById("concern");

  concernSelect.innerHTML = "<option value=''>-- Select --</option>";

  if (concernMap[category]) {
    concernMap[category].forEach((concern) => {
      const option = document.createElement("option");
      option.value = concern;
      option.textContent = concern;
      concernSelect.appendChild(option);
    });
  }
}

// ✅ Populate sub-concern dropdown based on selected concern
function updateSubConcernOptions() {
  const concern = document.getElementById("concern").value.trim();
  const subSelect = document.getElementById("subconcern");

  subSelect.innerHTML = "<option value=''>-- Select --</option>";

  console.log("Fetching subconcerns for:", concern); // Debugging

  if (subConcernMap[concern]) {
    subConcernMap[concern].forEach((sub) => {
      const option = document.createElement("option");
      option.value = sub;
      option.textContent = sub;
      subSelect.appendChild(option);
    });
  }
}

// ✅ Load resolution HTML based on dropdown path
function loadResolution() {
  const category = document.getElementById("category").value.trim();
  const concern = document.getElementById("concern").value.trim();
  const sub = document.getElementById("subconcern").value.trim();

  if (!category || !concern || !sub) return;

  const filePath = `Resolution_DB/${category}/${concern}/${sub}.html`;

  console.log("Trying to fetch:", filePath); // Debug path

  fetch(filePath)
    .then((res) => {
      if (!res.ok) throw new Error("Resolution not found");
      return res.text();
    })
    .then((html) => {
      document.getElementById("resolutionContainer").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("resolutionContainer").innerHTML =
        "<p style='color:red;'>❌ No resolution found for this path.</p>";
    });
}
