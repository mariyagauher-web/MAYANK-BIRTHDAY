/* =========================================================
   MAKE A WISH — PRO MAX
   Three.js + GSAP Cinematic Experience
========================================================= */

const $ = (selector) => document.querySelector(selector);

const world = $("#world");
const intro = $("#intro");
const flame = $("#flame");
const smoke = $("#smoke");
const cake = $("#cake");
const knife = $("#knife");
const cakeSlice = $("#cakeSlice");

const wishBtn = $("#wishBtn");
const blowBtn = $("#blowBtn");
const cutBtn = $("#cutBtn");

const wishText = $("#wishText");
const statusMessage = $("#statusMessage");
const flash = $("#flash");
const ending = $("#ending");
const againBtn = $("#againBtn");
const soundBtn = $("#soundBtn");
const cakeScene = $("#cakeScene");

/* =========================================================
   STATE
========================================================= */

let wished = false;
let blown = false;
let cut = false;
let soundOn = false;

let mouseX = 0;
let mouseY = 0;
let smoothX = 0;
let smoothY = 0;

let audioContext = null;
let masterGain = null;

/* =========================================================
   UI SOUND — SAFE WEB AUDIO
========================================================= */
function ensureAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.045;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTone(frequency = 440, duration = 0.12, type = "sine") {
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain || !soundOn) return;

  try {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.65, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  } catch (error) {
    /* Sound is decorative; never let it break the experience. */
  }
}

/* =========================================================
   THREE.JS WORLD
========================================================= */

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x17000e, 0.035);

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputEncoding = THREE.sRGBEncoding;

world.appendChild(renderer.domElement);

/* =========================================================
   LIGHTING
========================================================= */

const ambient = new THREE.AmbientLight(
  0x9e456f,
  1.1
);

scene.add(ambient);

const pinkLight = new THREE.PointLight(
  0xff3c9c,
  5,
  16
);

pinkLight.position.set(
  0,
  0.3,
  2
);

scene.add(pinkLight);

const warmLight = new THREE.PointLight(
  0xff9a42,
  3,
  9
);

warmLight.position.set(
  0,
  -1,
  3
);

scene.add(warmLight);

const leftLight = new THREE.PointLight(
  0x9e164f,
  3,
  12
);

leftLight.position.set(
  -5,
  2,
  -1
);

scene.add(leftLight);

const rightLight = new THREE.PointLight(
  0xff4f9c,
  2,
  12
);

rightLight.position.set(
  5,
  1,
  -1
);

scene.add(rightLight);

/* =========================================================
   BACKGROUND PARTICLES
========================================================= */

const particleCount = 1800;

const particlePositions = new Float32Array(
  particleCount * 3
);

const particleSizes = new Float32Array(
  particleCount
);

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3;

  particlePositions[i3] =
    (Math.random() - 0.5) * 28;

  particlePositions[i3 + 1] =
    (Math.random() - 0.5) * 18;

  particlePositions[i3 + 2] =
    (Math.random() - 0.5) * 18;

  particleSizes[i] =
    Math.random() * 0.035 + 0.01;
}

const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    particlePositions,
    3
  )
);

const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xff86bd,
    size: 0.035,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);

/* =========================================================
   LARGE GLOW ORBS
========================================================= */

function createGlow(color, scale, position) {

  const geometry =
    new THREE.SphereGeometry(1, 32, 32);

  const material =
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.scale.setScalar(scale);

  mesh.position.set(
    position[0],
    position[1],
    position[2]
  );

  scene.add(mesh);

  return mesh;
}

const glow1 =
  createGlow(
    0xff007c,
    4.5,
    [-5, 1, -4]
  );

const glow2 =
  createGlow(
    0xb000ff,
    3.5,
    [5, 2, -5]
  );

const glow3 =
  createGlow(
    0xff327e,
    3,
    [0, -3, -3]
  );

/* =========================================================
   FLOATING HEARTS
========================================================= */

const hearts = [];

function createHeart() {

  const shape =
    new THREE.Shape();

  shape.moveTo(0, 0.25);

  shape.bezierCurveTo(
    -0.45, 0.65,
    -0.85, 0.1,
    0, -0.55
  );

  shape.bezierCurveTo(
    0.85, 0.1,
    0.45, 0.65,
    0, 0.25
  );

  const geometry =
    new THREE.ShapeGeometry(shape);

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xff5ca8,
      transparent: true,
      opacity: .65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  const scale =
    Math.random() * .08 + .035;

  mesh.scale.setScalar(scale);

  mesh.position.set(
    (Math.random() - .5) * 12,
    Math.random() * 6 - 3,
    Math.random() * 3 - 2
  );

  mesh.rotation.z =
    Math.random() * Math.PI;

  scene.add(mesh);

  hearts.push({
    mesh,
    speed: Math.random() * .002 + .001,
    drift: Math.random() * .002
  });
}

for (let i = 0; i < 55; i++) {
  createHeart();
}

/* =========================================================
   THREE ANIMATION
========================================================= */

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const elapsed =
    clock.getElapsedTime();

  /* Smooth mouse */
  smoothX +=
    (mouseX - smoothX) * .035;

  smoothY +=
    (mouseY - smoothY) * .035;

  camera.position.x =
    smoothX * .45;

  camera.position.y =
    -smoothY * .25;

  camera.lookAt(
    smoothX * .08,
    smoothY * .05,
    0
  );

  /* Particles */
  particles.rotation.y =
    elapsed * .012;

  particles.rotation.x =
    Math.sin(elapsed * .12) * .025;

  /* Glows */
  glow1.position.y =
    1 + Math.sin(elapsed * .3) * .5;

  glow2.position.y =
    2 + Math.cos(elapsed * .25) * .5;

  glow3.scale.setScalar(
    3 + Math.sin(elapsed * .8) * .25
  );

  /* Hearts */
  hearts.forEach((item, index) => {

    const m = item.mesh;

    m.position.y += item.speed;

    m.position.x +=
      Math.sin(elapsed * .4 + index) *
      item.drift;

    m.rotation.z += .002;

    if (m.position.y > 4) {
      m.position.y = -4;
    }
  });

  /* Candle ambience */
  if (!blown) {

    warmLight.intensity =
      2.5 +
      Math.sin(elapsed * 16) * .45;

    pinkLight.intensity =
      4.7 +
      Math.sin(elapsed * 3) * .35;
  }

  renderer.render(
    scene,
    camera
  );
}

animate();

/* =========================================================
   DOM PARTICLES
========================================================= */

function createDOMParticle(
  x = 50,
  y = 50,
  type = "dot"
) {

  const p =
    document.createElement("span");

  p.className = "particle";

  if (type === "heart") {
    p.innerHTML = "♥";
    p.style.width = "auto";
    p.style.height = "auto";
    p.style.background = "none";
    p.style.boxShadow = "none";
    p.style.color = "#ff79ba";
    p.style.fontSize =
      `${Math.random() * 12 + 8}px`;
  }

  p.style.left = `${x}%`;
  p.style.top = `${y}%`;

  $("#sceneParticles").appendChild(p);

  return p;
}

/* =========================================================
   SPARKLE BURST
========================================================= */

function sparkleBurst(count = 55) {

  const rect =
    cakeScene.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  const centerY =
    rect.top + rect.height * .48;

  for (let i = 0; i < count; i++) {

    const p =
      document.createElement("div");

    p.style.position = "fixed";
    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;
    p.style.width =
      `${Math.random() * 5 + 2}px`;
    p.style.height =
      `${Math.random() * 5 + 2}px`;
    p.style.borderRadius = "50%";
    p.style.background =
      i % 3 === 0
        ? "#fff"
        : "#ff80bd";
    p.style.boxShadow =
      "0 0 12px #ff3b9e";
    p.style.zIndex = "800";
    p.style.pointerEvents = "none";

    document.body.appendChild(p);

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      Math.random() * 240 + 70;

    const tx =
      Math.cos(angle) * distance;

    const ty =
      Math.sin(angle) * distance;

    gsap.fromTo(
      p,
      {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 1
      },
      {
        x: tx,
        y: ty,
        scale: Math.random() * 1.4 + .5,
        opacity: 0,
        duration: Math.random() * .9 + .7,
        ease: "power3.out",
        onComplete: () => p.remove()
      }
    );
  }
}

/* =========================================================
   INTRO
========================================================= */

function playIntro() {

  const tl =
    gsap.timeline();

  tl.to(
    ".intro-heart",
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(2)"
    }
  )

  .to(
    ".intro-line",
    {
      width: 150,
      duration: .8,
      ease: "power2.out"
    },
    "-=.5"
  )

  .to(
    ".intro-content p",
    {
      opacity: 1,
      duration: .7
    },
    "-=.3"
  )

  .to(
    ".intro-content h1",
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out"
    },
    "-=.3"
  )

  .to(
    ".intro-content span",
    {
      opacity: 1,
      duration: .8
    },
    "-=.5"
  )

  .to(
    ".intro",
    {
      opacity: 0,
      duration: 1.3,
      delay: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        intro.style.visibility = "hidden";
      }
    }
  );

}

window.addEventListener(
  "load",
  playIntro
);

/* =========================================================
   WISH
========================================================= */

wishBtn.addEventListener(
  "click",
  () => {

    if (wished) return;

    wished = true;

    sparkleBurst(85);

    gsap.to(
      ".camera-glow",
      {
        opacity: 1.7,
        scale: 1.35,
        duration: .8,
        yoyo: true,
        repeat: 1
      }
    );

    gsap.to(
      cake,
      {
        y: -12,
        rotationY: 3,
        duration: .8,
        ease: "power3.out",
        yoyo: true,
        repeat: 1
      }
    );

    gsap.to(
      ".hero h1",
      {
        textShadow:
          "0 0 20px rgba(255,120,190,.5), 0 0 70px rgba(255,30,150,.45)",
        duration: .5,
        yoyo: true,
        repeat: 1
      }
    );

    wishText.textContent =
      "Your wish is on its way...";

    statusMessage.textContent =
      "The universe heard you ♥";

    statusMessage.classList.add("show");

    playTone(
      523.25,
      .12,
      "sine"
    );

    setTimeout(() => {

      statusMessage.classList.remove(
        "show"
      );

      wishText.textContent =
        "Now... blow the candle and let your wish fly.";

    }, 2300);

  }
);

/* =========================================================
   BLOW CANDLE
========================================================= */

blowBtn.addEventListener(
  "click",
  () => {

    if (blown) return;

    if (!wished) {

      sparkleBurst(20);

      statusMessage.textContent =
        "Make your wish first...";

      statusMessage.classList.add(
        "show"
      );

      gsap.to(
        statusMessage,
        {
          opacity: 1,
          duration: .3
        }
      );

      setTimeout(() => {
        statusMessage.classList.remove(
          "show"
        );
      }, 1500);

      return;
    }

    blown = true;

    /* Flame bend */
    gsap.to(
      flame,
      {
        rotation: 55,
        x: 12,
        scaleX: 1.8,
        duration: .35,
        ease: "power2.out"
      }
    );

    gsap.to(
      flame,
      {
        opacity: 0,
        scale: .15,
        duration: .35,
        delay: .25,
        ease: "power2.in"
      }
    );

    gsap.to(
      ".candle-light",
      {
        opacity: 0,
        scale: .3,
        duration: .7
      }
    );

    /* Smoke */
    gsap.to(
      smoke,
      {
        opacity: 1,
        duration: .3
      }
    );

    smoke.querySelectorAll("i")
      .forEach((smokePiece, index) => {

        gsap.to(
          smokePiece,
          {
            y: -50 - index * 15,
            x: index % 2
              ? 25
              : -20,
            scale:
              1.3 + index * .4,
            opacity: 0,
            duration: 2.2,
            delay: index * .15,
            ease: "power1.out"
          }
        );

      });

    /* Small camera shake */
    gsap.timeline()
      .to(
        cake,
        {
          x: -5,
          duration: .05
        }
      )
      .to(
        cake,
        {
          x: 5,
          duration: .05
        }
      )
      .to(
        cake,
        {
          x: -3,
          duration: .05
        }
      )
      .to(
        cake,
        {
          x: 0,
          duration: .1
        }
      );

    sparkleBurst(65);

    warmLight.intensity = .4;

    playTone(
      392,
      .18,
      "triangle"
    );

    wishText.textContent =
      "Your wish has been released into the night.";

    statusMessage.textContent =
      "The candle is blown...";

    statusMessage.classList.add(
      "show"
    );

    /* Unlock cut */
    setTimeout(() => {

      cutBtn.classList.remove(
        "locked"
      );

      cutBtn.classList.add(
        "unlocked"
      );

      cutBtn.style.pointerEvents =
        "auto";

      wishText.textContent =
        "One last thing... let's celebrate.";

    }, 1200);

  }
);

/* =========================================================
   CUT CAKE
========================================================= */

cutBtn.addEventListener(
  "click",
  () => {

    if (cut || !blown) return;

    cut = true;

    /* Knife enters */
    gsap.to(
      knife,
      {
        opacity: 1,
        right: -15,
        duration: .9,
        ease: "power3.out"
      }
    );

    setTimeout(() => {

      /* Knife cutting movement */
      gsap.to(
        knife,
        {
          x: -80,
          rotation: -5,
          duration: .65,
          ease: "power2.inOut"
        }
      );

      /* Cake reacts */
      gsap.to(
        cake,
        {
          x: 3,
          duration: .12,
          yoyo: true,
          repeat: 3
        }
      );

      /* Cut flash */
      gsap.to(
        flash,
        {
          opacity: .16,
          duration: .08,
          yoyo: true,
          repeat: 1
        }
      );

      sparkleBurst(70);

      playTone(
        261.63,
        .15,
        "sine"
      );

    }, 800);

    /* Slice appears */
    setTimeout(() => {

      gsap.set(
        cakeSlice,
        {
          opacity: 1
        }
      );

      gsap.to(
        cakeSlice,
        {
          x: 85,
          y: -35,
          z: 120,
          rotationY: -16,
          rotationZ: -5,
          duration: 1.2,
          ease: "power3.out"
        }
      );

      /* Slight cake separation */
      gsap.to(
        ".tier-bottom",
        {
          x: -4,
          duration: .7
        }
      );

      gsap.to(
        ".tier-top",
        {
          x: 4,
          duration: .7
        }
      );

      statusMessage.textContent =
        "A little piece of happiness ♥";

      statusMessage.classList.add(
        "show"
      );

    }, 1450);

    /* Ending */
    setTimeout(() => {

      finishExperience();

    }, 4300);

  }
);

/* =========================================================
   ENDING SEQUENCE
========================================================= */

function finishExperience() {

  gsap.to(
    ".experience",
    {
      opacity: 0,
      scale: .94,
      duration: 1.2,
      ease: "power3.inOut"
    }
  );

  gsap.to(
    ".decor",
    {
      opacity: 0,
      duration: 1
    }
  );

  gsap.to(
    ending,
    {
      autoAlpha: 1,
      scale: 1,
      duration: 1.6,
      delay: .45,
      ease: "power3.out"
    }
  );

  gsap.fromTo(
    ".ending-content",
    {
      y: 35,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      delay: 1,
      ease: "power3.out"
    }
  );

  createEndingParticles();

}

/* =========================================================
   ENDING PARTICLES
========================================================= */

function createEndingParticles() {

  const container =
    document.querySelector(
      ".ending-particles"
    );

  for (let i = 0; i < 80; i++) {

    const p =
      document.createElement("span");

    p.innerHTML =
      Math.random() > .7
        ? "♥"
        : "✦";

    p.style.position = "absolute";
    p.style.left =
      `${Math.random() * 100}%`;
    p.style.top =
      `${Math.random() * 100}%`;

    p.style.color =
      Math.random() > .5
        ? "#ff8ec5"
        : "#ffd8ea";

    p.style.opacity =
      Math.random() * .6 + .15;

    p.style.fontSize =
      `${Math.random() * 12 + 5}px`;

    container.appendChild(p);

    gsap.to(
      p,
      {
        y:
          Math.random() * -150 - 50,
        x:
          (Math.random() - .5) * 100,
        rotation:
          Math.random() * 180,
        opacity: 0,
        duration:
          Math.random() * 5 + 4,
        repeat: -1,
        ease: "none",
        delay:
          Math.random() * 3
      }
    );
  }
}

/* =========================================================
   AGAIN
========================================================= */

againBtn.addEventListener(
  "click",
  (event) => {

    /* The supplied HTML contains a placeholder URL, so do not
       navigate to a fake domain. Restart the experience instead. */
    event.preventDefault();
    location.reload();

  }
);

/* =========================================================
   BACKGROUND MUSIC
========================================================= */

const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 0.38;

let musicStarted = false;

/* Try to start music immediately */
function startBackgroundMusic() {

  if (musicStarted) return;

  bgMusic.play()
    .then(() => {

      musicStarted = true;

      soundOn = true;

      soundBtn.classList.add("playing");

    })
    .catch(() => {

      /*
        Browser blocked autoplay.
        It will start automatically on
        the first user interaction.
      */

    });
}


/* Start as soon as possible */
window.addEventListener("load", () => {

  setTimeout(() => {
    startBackgroundMusic();
  }, 300);

});


/* Fallback for browser autoplay blocking */
function firstInteractionMusic() {

  if (!musicStarted) {
    startBackgroundMusic();
  }

  document.removeEventListener(
    "click",
    firstInteractionMusic
  );

  document.removeEventListener(
    "touchstart",
    firstInteractionMusic
  );

  document.removeEventListener(
    "keydown",
    firstInteractionMusic
  );
}

document.addEventListener(
  "click",
  firstInteractionMusic,
  { once: true }
);

document.addEventListener(
  "touchstart",
  firstInteractionMusic,
  { once: true }
);

document.addEventListener(
  "keydown",
  firstInteractionMusic,
  { once: true }
);


/* =========================================================
   SOUND BUTTON
========================================================= */

soundBtn.addEventListener(
  "click",
  (e) => {

    e.stopPropagation();

    if (!musicStarted) {

      startBackgroundMusic();

      return;
    }

    if (!bgMusic.paused) {

      bgMusic.pause();

      soundOn = false;

      soundBtn.classList.remove(
        "playing"
      );

    } else {

      bgMusic.play()
        .then(() => {
          soundOn = true;
          soundBtn.classList.add("playing");
        })
        .catch(() => {
          soundOn = false;
          soundBtn.classList.remove("playing");
        });

    }

  }
);
/* =========================================================
   MOUSE PARALLAX
========================================================= */

window.addEventListener(
  "mousemove",
  (e) => {

    mouseX =
      (e.clientX /
        window.innerWidth -
        .5) * 2;

    mouseY =
      (e.clientY /
        window.innerHeight -
        .5) * 2;

    /* DOM decoration depth */
    gsap.to(
      ".decor-left",
      {
        x: mouseX * -16,
        y: mouseY * -8,
        duration: 1.3,
        ease: "power3.out",
        overwrite: true
      }
    );

    gsap.to(
      ".decor-right",
      {
        x: mouseX * -20,
        y: mouseY * -10,
        duration: 1.3,
        ease: "power3.out",
        overwrite: true
      }
    );

    gsap.to(
      ".cake",
      {
        rotateY: mouseX * 3,
        rotateX: 5 - mouseY * 2,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true
      }
    );

  }
);

/* =========================================================
   TOUCH PARALLAX
========================================================= */

window.addEventListener(
  "deviceorientation",
  (event) => {

    if (
      event.gamma === null ||
      event.beta === null
    ) return;

    mouseX =
      Math.max(
        -1,
        Math.min(
          1,
          event.gamma / 25
        )
      );

    mouseY =
      Math.max(
        -1,
        Math.min(
          1,
          event.beta / 25
        )
      );

  }
);

/* =========================================================
   FLOATING DOM PARTICLES
========================================================= */

function createFloatingParticles() {

  const container =
    $("#sceneParticles");

  for (let i = 0; i < 35; i++) {

    const p =
      createDOMParticle(
        Math.random() * 100,
        Math.random() * 100,
        Math.random() > .8
          ? "heart"
          : "dot"
      );

    gsap.to(
      p,
      {
        y:
          -(Math.random() * 100 + 80),
        x:
          (Math.random() - .5) * 70,
        opacity: 0,
        duration:
          Math.random() * 5 + 4,
        repeat: -1,
        delay:
          Math.random() * 5,
        ease: "none",
        onRepeat: () => {

          p.style.left =
            `${Math.random() * 100}%`;

          p.style.top =
            `${100 + Math.random() * 20}%`;

          gsap.set(
            p,
            {
              opacity:
                Math.random() * .7 + .2
            }
          );

        }
      }
    );

  }

}

createFloatingParticles();

/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);

/* =========================================================
   INITIAL CAKE ENTRANCE
========================================================= */

gsap.set(
  cake,
  {
    opacity: 0,
    y: 80,
    scale: .82
  }
);

gsap.set(
  ".hero",
  {
    opacity: 0,
    y: -25
  }
);

gsap.set(
  ".wish-area",
  {
    opacity: 0,
    y: 25
  }
);

gsap.timeline({
  delay: 4.4
})

.to(
  ".hero",
  {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out"
  }
)

.to(
  cake,
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.5,
    ease: "back.out(1.25)"
  },
  "-=.55"
)

.to(
  ".wish-area",
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
  },
  "-=.6"
)

.from(
  ".balloon",
  {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: .08,
    ease: "back.out(1.4)"
  },
  "-=.8"
);

/* =========================================================
   EXTRA AMBIENT ANIMATION
========================================================= */

gsap.to(
  ".balloon-one",
  {
    y: -15,
    rotation: -5,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  }
);

gsap.to(
  ".balloon-two",
  {
    y: 18,
    rotation: 7,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  }
);

gsap.to(
  ".balloon-three",
  {
    y: -12,
    rotation: -4,
    duration: 3.7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  }
);

gsap.to(
  ".balloon-four",
  {
    y: -16,
    rotation: 7,
    duration: 3.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  }
);

gsap.to(
  ".balloon-five",
  {
    y: 16,
    rotation: -7,
    duration: 4.1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  }
);

gsap.to(
  ".balloon-six",
  {
    y: -13,
    rotation: 5,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  }
);