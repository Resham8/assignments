let num = 1;
function counter() {
   console.clear();
   console.log(num);
   num = num + 1;
}

setInterval(counter, 1000);