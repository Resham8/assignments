let num = 1;
function counter() {
   console.clear();
   console.log(num);
   num = num + 1;

   setTimeout(counter, 1000);
}

setTimeout(counter, 1000);