document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsDiv = document.getElementById("results");
    const toggleSearchBtn = document.getElementById("toggle-search");
    const searchTypeHeader = document.getElementById("search-type");

    let searchMode = "user"; // Can be "user" or "repo"

    // Toggle between User Search and Repo Search
    toggleSearchBtn.addEventListener("click", () => {
        searchMode = searchMode === "user" ? "repo" : "user";
        searchTypeHeader.textContent = searchMode === "user" ? "🔍 Searching for Users" : "🔍 Searching for Repositories";
        searchInput.placeholder = searchMode === "user" ? "Search GitHub Users..." : "Search GitHub Repositories...";
    });

    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();

        if (searchMode === "user") {
            searchGitHubUsers(query);
        } else {
            searchGitHubRepos(query);
        }
    });

    // Search for GitHub users
    function searchGitHubUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => console.error("Error fetching users:", error));
    }

    // Display users in the results div
    function displayUsers(users) {
        resultsDiv.innerHTML = ""; // Clear previous results
        users.forEach(user => {
            const userCard = document.createElement("div");
            userCard.className = "card";
            userCard.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}">
                <div>
                    <h3>${user.login}</h3>
                    <a href="${user.html_url}" target="_blank">View Profile</a>
                </div>
            `;

            // Click event to fetch and display repositories
            userCard.addEventListener("click", () => fetchUserRepos(user.login));

            resultsDiv.appendChild(userCard);
        });
    }

    // Fetch repositories for a selected user
    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(repos => {
            displayRepos(repos);
        })
        .catch(error => console.error("Error fetching repos:", error));
    }

    // Display repositories in the results div
    function displayRepos(repos) {
        const repoList = document.createElement("ul");
        repoList.className = "repo-list";
        
        repos.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(repoItem);
        });

        resultsDiv.appendChild(repoList);
    }

    // Search for repositories by keyword
    function searchGitHubRepos(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => {
            displayRepos(data.items);
        })
        .catch(error => console.error("Error fetching repositories:", error));
    }
});
