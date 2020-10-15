let socket = io();

let containerDiv = document.querySelector(".cursor-container");
let errorDiv = document.querySelector(".error");

navigator.permissions.query({ name: "accelerometer" }).then(function (result) {
  if (result.state === "granted") {
    //   showLocalNewsWithGeolocation();
    errorDiv.style.visibility = "visible";

    let acl = new AbsoluteOrientationSensor();
    acl.start();

    acl.addEventListener("reading", onAccelerometerReading);
  } else if (result.state === "prompt") {
    //   showButtonToEnableLocalNews();
  }
  // Don't do anything if the permission was denied.
});

function onAccelerometerReading(event) {
  errorDiv.style.visibility = "visible";
  let { quaternion } = event.target;
  console.log("event", event);

  containerDiv.innerHTML = JSON.stringify(quaternion);

  //   console.log("Acceleration along the X-axis " + acl.x);
  //   console.log("Acceleration along the Y-axis " + acl.y);
  //   console.log("Acceleration along the Z-axis " + acl.z);

  //   containerDiv.innerHTML = "X: " + x + ", Y: " + y + ", Z: " + z;

  socket.emit("accelerometer-reading", [...quaternion]);
}

// document.body.addEventListener("mousemove", mouseHasMoved);

function cursorsChanged(cursors) {
  let allCursorDivs = containerDiv.querySelectorAll(".cursor");

  for (let i = 0; i < allCursorDivs.length; i++) {
    allCursorDivs[i].dataset.updated = false;
  }

  let ids = Object.keys(cursors);

  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];

    let cursorDiv = containerDiv.querySelector('.cursor[data-id="' + id + '"]');

    if (cursorDiv == null) {
      // There's no div on the page with that ID yet.
      cursorDiv = document.createElement("div");
      cursorDiv.classList.add("cursor");
      cursorDiv.dataset.id = id;

      containerDiv.appendChild(cursorDiv);
    }

    // cursorDiv.style.left = cursors[id].x + "px";
    // cursorDiv.style.top = cursors[id].y + "px";

    cursorDiv.innerHTML = "X: " + cursors[id].x + ", Y: " + cursors[id].y;

    cursorDiv.dataset.updated = true;
  }

  for (let i = 0; i < allCursorDivs.length; i++) {
    if (allCursorDivs[i].dataset.updated == "false") {
      allCursorDivs[i].parentNode.removeChild(allCursorDivs[i]);
    }
  }
}

socket.on("cursor-object-changed", cursorsChanged);
