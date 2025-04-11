const entryText = document.getElementById("entryText");
const moodButtons = document.querySelectorAll(".mood-btn");
const saveBtn = document.getElementById("saveBtn");
const entriesContainer = document.getElementById("entriesContainer");
const filterMood = document.getElementById("filterMood");

let selectedMood = "";
const entriesRef = db.collection("journalEntries");

moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMood = btn.dataset.mood;
    moodButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

saveBtn.addEventListener("click", async () => {
  const text = entryText.value.trim();
  if (!text || !selectedMood) {
    alert("Please enter text and select a mood.");
    return;
  }

  const entry = {
    text,
    mood: selectedMood,
    date: new Date().toLocaleString()
  };

  try {
    await entriesRef.add(entry);
    entryText.value = "";
    selectedMood = "";
    moodButtons.forEach(b => b.classList.remove("selected"));
    showEntries();
  } catch (error) {
    console.error("Error saving entry:", error);
  }
});

async function deleteEntry(id) {
  try {
    await entriesRef.doc(id).delete();
    showEntries();
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
}

async function showEntries() {
  const filter = filterMood.value;
  entriesContainer.innerHTML = "";

  try {
    const snapshot = await entriesRef.orderBy("date", "desc").get();

    snapshot.forEach(doc => {
      const entry = doc.data();
      const entryId = doc.id;

      if (filter && entry.mood !== filter) return;

      const div = document.createElement("div");
      div.classList.add("entry");
      div.innerHTML = `
        <strong>${entry.mood} ${entry.date}</strong>
        <p>${entry.text}</p>
        <button onclick="deleteEntry('${entryId}')">Delete</button>
      `;
      entriesContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading entries:", error);
  }
}

// Filter and dark mode logic
filterMood.addEventListener("change", showEntries);

showEntries();