// Cookie creating
function createCookie() {
  const name = document.getElementById("cookieName").value;
  const value = document.getElementById("cookieValue").value;
  document.cookie = `${name}=${value}; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/;`;
  document.getElementById("output").innerText = `Cookie "${name}" set!`;
}

// Cookie finding
function findCookie() {
  const name = document.getElementById("cookieName").value + "=";
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith(name)) {
      const value = cookie.split("=")[1];
      document.getElementById("output").innerText = `Cookie Value: ${value}`;
      return;
    }
  }
  document.getElementById("output").innerText = "Cookie not found.";
}

// Cookie destroy
function obliterateCookie() {
  const name = document.getElementById("cookieName").value;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  document.getElementById("output").innerText = `Cookie "${name}" deleted!`;
}

function displayCookies() {
  const cookies = document.cookie.split("; ");
  const output = cookies.length 
    ? cookies.map(cookie => `${cookie}<br>`).join("")
    : "No cookies found.";
  document.getElementById("output").innerHTML = output;
}

window.onload = displayCookies;
  