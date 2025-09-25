const form = document.getElementById('searchForm');
const input = document.getElementById('searchBar');
const lucky = document.getElementById('luckyBtn');
const msg = document.getElementById('message');

function showError(text) {
  msg.textContent = text;
  msg.style.color = 'red';
}

function showInfo(text) {
  msg.textContent = text;
  msg.style.color = 'blue';
}

// Handle the normal Google search submit
form.addEventListener('submit', function (e) {
  const q = input.value.trim();
  if (!q) {
    e.preventDefault();
    showError('Search string cannot be empty');
  } else {
    msg.textContent = '';
  }
});

// Handle the Lucky button
lucky.addEventListener('click', function () {
  const q = input.value.trim();
  if (!q) {
    showError('Search string cannot be empty');
    return;
  }
  showInfo(q.toUpperCase());
});
