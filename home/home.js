const object = document.getElementById("object");
const ground = document.getElementById("ground");
const videothumbnail = Array.from(document.querySelectorAll(".video-thumbnail"));

let gravity = 0.3;
let velocity = 0;
let objectY = parseFloat(localStorage.getItem("objectY")) || 25; // Retrieve last position or default to 0
let objectX = parseFloat(localStorage.getItem("objectX")) || 50; // Retrieve last position or default to 50%
let horizontalSpeed = 0.3;
let verticalSpeed = 5;
let maxBoost = 8;
let CanJump = false;
const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
};

function IsInRange(num, min, max) {
  return num >= Math.min(min, max) && num <= Math.max(min, max);
}

function update() {
  const objectRect = object.getBoundingClientRect();
  CanJump = false;
  // Apply gravity and update vertical position
  velocity += gravity;

  // Check ground collision
  const groundLevel = window.innerHeight - object.offsetHeight;
  if (objectY >= groundLevel) {
    objectY = groundLevel;
    velocity = 0;
  }
  
  // Check video collision  


  // Horizontal movement
  if (keys.left && objectX > 0) objectX -= horizontalSpeed;
  if (keys.right && objectX < 100) objectX += horizontalSpeed;
  
  
  
  //Where it will go to next if its going to hit somewhere
  for (const video of videothumbnail) {
    const videoRect = video.getBoundingClientRect();
    //if top video than it can go there
    if(IsInRange(objectRect.bottom, videoRect.top,videoRect.top + velocity) && objectRect.left < videoRect.right &&
    objectRect.right > videoRect.left )
    {

      objectY = videoRect.top - object.offsetHeight;
      velocity = 0; 
      console.log("On top of it");
    }
    //if bottom video than it can go there
    if(IsInRange(objectRect.bottom, videoRect.bottom,videoRect.bottom + velocity) && objectRect.left < videoRect.right &&
    objectRect.right > videoRect.left )
    {
      objectY = videoRect.bottom - object.offsetHeight ;
      velocity = 0; 
      console.log("On bottom of it");
    }
  }
  //Is it hitting ground or videos if yes they CAN JUMP
  for (const video of videothumbnail) {
    const videoRect = video.getBoundingClientRect();
    if ((objectRect.bottom == videoRect.top || IsInRange(objectRect.bottom,videoRect.bottom , videoRect.bottom + 1)) && 
      objectRect.left < videoRect.right &&
      objectRect.right > videoRect.left
    ) {
      CanJump = true;
      console.log('CanJump for')
      break;
    }
  }
  if(!CanJump){  CanJump = (objectY == groundLevel);  }

  if (keys.up && CanJump) {
    velocity = -maxBoost;
    CanJump = false;
   
  }

  //Velocity most be calculated at last beacuse it might become 0 at the bottom
  objectY += velocity;

  //console.log(velocity);

  localStorage.setItem("objectY", objectY);
  localStorage.setItem("objectX", objectX);

  // Update object position
  object.style.top = `${objectY}px`;
  object.style.left = `${objectX}%`;

  requestAnimationFrame(update);
}

// Handle key events
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
