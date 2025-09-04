async function callAPI() {
  try {
    let res = await fetch("http://localhost:5000/api/hello");
    let data = await res.json();
    document.getElementById("response").innerText = data.message;
  } catch (err) {
    console.error(err);
  }
}
function getStarted() {
  window.location.href = "login.html";
}


