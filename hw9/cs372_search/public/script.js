// --- CS372 Search Frontend ---

// Add a new string (“I'm Feeling Lucky”)
async function addString() {
  const box = document.getElementById("searchBox");
  const text = box.value.trim();
  const resultsList = document.getElementById("results");

  if (!text) return;

  try {
    await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    box.value = "";
    doSearch(); // refresh results
  } catch (err) {
    console.error("Add error:", err);
  }
}

// Search for strings (“CS372 Search”)
async function doSearch() {
  const q = document.getElementById("searchBox").value.trim();
  const ul = document.getElementById("results");

  ul.innerHTML = ""; // clear results

  try {
    const res = await fetch(`/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    // Display each stored string
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.text;  // <-- EXACTLY LIKE THE EXAMPLE
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Search error:", err);
  }
}
