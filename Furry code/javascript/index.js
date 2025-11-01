function changeBackground()
{
    document.body.style.background = 'green';
};
function goToGoogle(){
    location.href = "";
};
function changeHello(){
    document.getElementById("aiden").innerText = "hello, ooguiy";
}
function allmystuff() {
  let i = 3;
  while (i < 3) { 
      alert(i);
      i++;
  }
  while (i) alert(i--);
  
  for (let i = 0; i < 3; i++) {
      alert(i);
  }
  for (let i = 0; i < 3; i++) {
      alert(i);
  }
  alert(i);

  let sum = 0;
  while (true) {
      let value = +prompt("Enter a number", '');
      if (!value) break; // (*)
      sum += value;
  }
  alert('Sum: ' + sum);


  alert('Go!');

  function calculateArea(radius) {
      return Math.PI * Math.pow(radius, 2);
  }
  let radius = prompt('what is the radius?' );
  let area = calculateArea(radius);
  alert(`The area of a circle with radius ${radius} is ${area}`);  
}

// Call the function to execute the code
