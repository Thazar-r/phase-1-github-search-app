const baseURL = 'https://api.github.com';
const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        alert('Please enter a GitHub username');
        return;
    }
    try {
        const userData = await fetchUserData(searchTerm);
        displayUsers(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

async function fetchUserData(username) {
    const url = `${baseURL}/search/users?q=${username}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data.items; // Return array of user items
}

function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <div class="user">
                <img src="${user.avatar_url}" alt="User Avatar" class="avatar">
                <div class="username">${user.login}</div>
                <a href="${user.html_url}" target="_blank" class="profile-link">View Profile</a>
            </div>
        `;
        userItem.addEventListener('click', async () => {
            try {
                const reposData = await fetchUserRepos(user.login);
                displayUserRepos(reposData);
            } catch (error) {
                console.error('Error fetching user repositories:', error);
            }
        });
        userList.appendChild(userItem);
    });
}

async function fetchUserRepos(username) {
    const url = `${baseURL}/users/${username}/repos`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user repositories');
    }
    const data = await response.json();
    return data; // Return array of repositories
}

function displayUserRepos(repos) {
    reposList.innerHTML = '';
    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
            <div class="repo">
                <h3>${repo.name}</h3>
                <p>${repo.description || ''}</p>
                <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
            </div>
        `;
        reposList.appendChild(repoItem);
    });
}
