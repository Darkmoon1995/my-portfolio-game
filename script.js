const object = document.getElementById("object");
const ground = document.getElementById("ground");
const jumpPads = Array.from(document.querySelectorAll(".jumpPad"));

let gravity = 0.3;
let velocity = 0;
let objectY = parseFloat(localStorage.getItem("objectY")) || 0; // Retrieve last position or default to 0
let objectX = parseFloat(localStorage.getItem("objectX")) || 50; // Retrieve last position or default to 50%
let horizontalSpeed = 0.5;
let verticalSpeed = 5;
let maxBoost = 8;

const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
};

function update() {
  // Apply gravity
  velocity += gravity;
  objectY += velocity;

  // Ground collision
  const groundLevel = ground.offsetTop - object.offsetHeight;
  if (objectY >= groundLevel) {
    objectY = groundLevel;
    velocity = 0;
  }

  // Jump and movement logic
  if (keys.up && objectY >= groundLevel) {
    velocity = -maxBoost;
  }

  if (keys.down && objectY + object.offsetHeight < groundLevel) {
    objectY += verticalSpeed;
  }

  if (keys.left && objectX > 0) {
    objectX -= horizontalSpeed;
  }

  if (keys.right && objectX < 100) {
    objectX += horizontalSpeed;
  }

  // Check jump pads
  jumpPads.forEach((jumpPad) => {
    const padRect = jumpPad.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();
    if (
      objectRect.right > padRect.left &&
      objectRect.left < padRect.right &&
      objectRect.bottom > padRect.top &&
      objectRect.top < padRect.bottom &&
      velocity >= 0 // Ensure the object is falling onto the pad
    ) {
      velocity = -12; // Boost upwards when hitting a jump pad
    }
  });

  // Update object position
  object.style.top = `${objectY}px`;
  object.style.left = `${objectX}%`;

  // Save position to localStorage
  localStorage.setItem("objectY", objectY);
  localStorage.setItem("objectX", objectX);

  requestAnimationFrame(update);
}

// Key press events
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") keys.up = true;
  if (e.key === "ArrowDown" || e.key === "s") keys.down = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") keys.up = false;
  if (e.key === "ArrowDown" || e.key === "s") keys.down = false;
});

// Start the update loop
update();
