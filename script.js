const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyMessage = document.getElementById("empty-message");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const query = input.value.trim();

    console.log("Searching for:", query);

    if (query === "") {
        return;
    }

    results.innerHTML = "";
    resultCount.textContent = "Searching...";
    emptyMessage.style.display = "none";

    try {

        const url =
            "https://commons.wikimedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            "&gsrsearch=" + encodeURIComponent(query) +
            "&gsrnamespace=6" +
            "&gsrlimit=12" +
            "&prop=imageinfo" +
            "&iiprop=url" +
            "&iiurlwidth=300" +
            "&format=json" +
            "&origin=*";

        console.log("API URL:", url);

        const response = await fetch(url);

        console.log("Response:", response);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        console.log("API data:", data);

        if (!data.query || !data.query.pages) {
            resultCount.textContent = "Showing 0 results";
            emptyMessage.textContent = "No images found.";
            emptyMessage.style.display = "block";
            return;
        }

        const items = Object.values(data.query.pages);

        resultCount.textContent =
            "Showing " + items.length + " results for \"" + query + "\"";

        items.forEach(function (item) {

            const card = document.createElement("article");
            card.className = "card";

            const img = document.createElement("img");

            img.src = item.imageinfo[0].thumburl;
            img.alt = item.title;

            const caption = document.createElement("p");

            caption.textContent = item.title;

            card.appendChild(img);
            card.appendChild(caption);

            results.appendChild(card);
        });

    } catch (error) {

        console.error("Error:", error);

        resultCount.textContent = "Something went wrong";

        emptyMessage.textContent =
            "Could not load images. Please try again.";

        emptyMessage.style.display = "block";
    }
});