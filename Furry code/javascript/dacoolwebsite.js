function changeBackground() {
    const color = document.getElementById('colorSelect').value;
    document.body.style.backgroundColor = color || 'white'; 
}
function goToWebsite() {
    const url = document.getElementById('googleInput').value;
    if (url) {
        if (!/^https?:\/\//i.test(url)) {
            window.location.href = 'http://' + url;
        } else {
            window.location.href = url;
        }
    }
}
function changeHello() {
    const newText = document.getElementById('helloInput').value;
    document.getElementById('aiden').textContent = newText;
}

function modifyDom(){
    let middleDiv = document.createElement('div');
    middleDiv.innerHTML = "<p>middle</p>";
    let ele = document.getElementById('middle');
    ele.appendChild(middleDiv);
}
