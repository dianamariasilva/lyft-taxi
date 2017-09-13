"use strict";

function rand() {
  var num = document.getElementById("user-key")
  num.innerHTML = Math.floor((Math.random() * 1000) + 100);
}

rand();