/* =========================================================
   MAYANK — CINEMATIC 19 WEBSITE EXPERIENCE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const curtainIntro =
    document.getElementById("curtainIntro");

  const curtainLeft =
    document.querySelector(".curtain-left");

  const curtainRight =
    document.querySelector(".curtain-right");

  const main =
    document.getElementById("main");

  const ageStage =
    document.getElementById("ageStage");

  const ageWrapper =
    document.getElementById("ageWrapper");

  const age18 =
    document.getElementById("age18");

  const age19 =
    document.getElementById("age19");

  const clickHint =
    document.getElementById("clickHint");

  const shardContainer =
    document.getElementById("shardContainer");

  const birthdaySection =
    document.getElementById("birthdaySection");

  const openCollection =
    document.getElementById("openCollection");

  const collectionSection =
    document.getElementById("collectionSection");

  const websiteGrid =
    document.getElementById("websiteGrid");

  const openCelebration =
    document.getElementById("openCelebration");

  const finalCelebration =
    document.getElementById("finalCelebration");

  const replayButton =
    document.getElementById("replayButton");

  const musicControl =
    document.getElementById("musicControl");

  const musicText =
    document.getElementById("musicText");

  const bgMusic =
    document.getElementById("bgMusic");


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  gsap.set(main, {
    opacity: 0
  });

  gsap.set(
    [
      birthdaySection,
      collectionSection,
      finalCelebration
    ],
    {
      display: "none"
    }
  );


  /* =======================================================
     CURTAIN CINEMATIC REVEAL
  ======================================================= */

  const curtainTimeline = gsap.timeline();

  curtainTimeline

    .to({}, {
      duration: .8
    })

    .to(curtainLeft, {
      xPercent: -105,
      duration: 1.8,
      ease: "power4.inOut"
    })

    .to(curtainRight, {
      xPercent: 105,
      duration: 1.8,
      ease: "power4.inOut"
    }, "<")

    .to(curtainIntro, {
      opacity: 0,
      duration: .7,
      pointerEvents: "none"
    }, "-=.4")

    .to(main, {
      opacity: 1,
      duration: .6
    }, "-=.5")

    .fromTo(
      age18,
      {
        opacity: 0,
        scale: .65,
        filter: "blur(15px)"
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out"
      }
    )

    .fromTo(
      clickHint,
      {
        opacity: 0,
        y: 15
      },
      {
        opacity: 1,
        y: 0,
        duration: .7
      },
      "-=.5"
    );


  /* =======================================================
     MUSIC
  ======================================================= */

  let musicStarted = false;

  musicControl.addEventListener("click", async () => {

    if (!musicStarted) {

      try {

        await bgMusic.play();

        musicStarted = true;

        musicText.textContent = "PLAYING";

      } catch (error) {

        musicText.textContent =
          "ADD MUSIC.MP3";

      }

    } else {

      bgMusic.pause();

      musicStarted = false;

      musicText.textContent = "MUSIC";

    }

  });


  /* =======================================================
     CREATE 18 SHARDS
  ======================================================= */

  function createShards() {

    shardContainer.innerHTML = "";

    const shardCount =
      window.innerWidth < 600 ? 55 : 90;

    const colors = [
      "#fff4ad",
      "#ffd85a",
      "#e8b931",
      "#c99424",
      "#ffffff"
    ];

    for (let i = 0; i < shardCount; i++) {

      const shard =
        document.createElement("div");

      shard.className = "shard";

      const size =
        Math.random() * 8 + 3;

      const angle =
        Math.random() * Math.PI * 2;

      const distance =
        Math.random() *
        (window.innerWidth < 600 ? 280 : 550) +
        100;

      const x =
        Math.cos(angle) * distance;

      const y =
        Math.sin(angle) * distance;

      const rotation =
        Math.random() * 360;

      const color =
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ];

      shard.style.setProperty(
        "--size",
        `${size}px`
      );

      shard.style.setProperty(
        "--gold",
        color
      );

      shard.dataset.x = x;
      shard.dataset.y = y;
      shard.dataset.rotation = rotation;

      shardContainer.appendChild(shard);
    }

  }


  /* =======================================================
     18 -> 19 CINEMATIC TRANSFORMATION
  ======================================================= */

  let alreadyClicked = false;

  ageWrapper.addEventListener("click", () => {

    if (alreadyClicked) return;

    alreadyClicked = true;

    clickHint.textContent = "";

    createShards();

    const shards =
      document.querySelectorAll(".shard");


    /* -----------------------------------------------
       INITIAL SHARD POSITIONS
    ------------------------------------------------ */

    gsap.set(shards, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: () => Math.random() * 360,
      scale: .3
    });


    /* -----------------------------------------------
       CINEMATIC TIMELINE
    ------------------------------------------------ */

    const tl = gsap.timeline();


    /* 18 tension */

    tl.to(age18, {
      scale: 1.06,
      duration: .18,
      ease: "power2.out"
    })

    .to(age18, {
      scale: .94,
      duration: .12
    })

    .to(age18, {
      scale: 1.12,
      duration: .18,
      ease: "power2.inOut"
    });


    /* -----------------------------------------------
       SHATTER
    ------------------------------------------------ */

    tl.to(age18, {
      opacity: 0,
      scale: .8,
      filter: "blur(8px)",
      duration: .16
    }, "+=.03");


    tl.to(shards, {

      x: i => shards[i].dataset.x,
      y: i => shards[i].dataset.y,

      rotation:
        i => Number(
          shards[i].dataset.rotation
        ) + 360,

      scale:
        () => Math.random() * 1.2 + .4,

      opacity: 0,

      duration:
        () => Math.random() * .8 + .7,

      ease: "power3.out",

      stagger: {
        each: .005,
        from: "center"
      }

    }, "-=.05");


    /* -----------------------------------------------
       19 CINEMATIC REVEAL
    ------------------------------------------------ */

    tl.to(age19, {

      opacity: 1,

      scale: 1,

      rotateX: 0,

      filter: "blur(0px)",

      duration: 1.5,

      ease: "power4.out"

    }, "-=.8");


    /* neon flash */

    tl.to(age19, {

      textShadow:
        "0 0 8px #fff, " +
        "0 0 25px #ffe36e, " +
        "0 0 70px #e0a719, " +
        "0 0 150px #d2910e",

      duration: .25

    });

    tl.to(age19, {

      textShadow:
        "0 0 5px #fff1a0, " +
        "0 0 15px #e6bd39, " +
        "0 0 35px #d99d13, " +
        "0 0 70px rgba(214,157,20,.8), " +
        "0 0 130px rgba(214,157,20,.35)",

      duration: .7

    });


    /* hold */

    tl.to({}, {
      duration: 1.3
    });


    /* -----------------------------------------------
       TRANSITION TO BIRTHDAY
    ------------------------------------------------ */

    tl.to(ageStage, {

      opacity: 0,

      scale: .96,

      filter: "blur(8px)",

      duration: .9,

      ease: "power3.inOut"

    });


    tl.set(ageStage, {
      display: "none"
    });


    tl.set(birthdaySection, {
      display: "flex"
    });


    tl.fromTo(
      birthdaySection,
      {
        opacity: 0,
        y: 70
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out"
      }
    );


    /* -----------------------------------------------
       BIRTHDAY CONTENT REVEAL
    ------------------------------------------------ */

    tl.fromTo(
      ".gold-kicker",
      {
        opacity: 0,
        y: 25
      },
      {
        opacity: 1,
        y: 0,
        duration: .5
      },
      "-=.6"
    );


    tl.fromTo(
      ".birthday-heading",
      {
        opacity: 0,
        y: 55,
        scale: .92
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: .9,
        ease: "power3.out"
      },
      "-=.3"
    );


    tl.fromTo(
      ".gold-divider",
      {
        scaleX: 0,
        opacity: 0
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: .6
      }
    );


    tl.fromTo(
      ".birthday-message p",
      {
        opacity: 0,
        y: 25
      },
      {
        opacity: 1,
        y: 0,
        duration: .45,
        stagger: .16
      },
      "-=.2"
    );


    tl.fromTo(
      "#openCollection",
      {
        opacity: 0,
        y: 25
      },
      {
        opacity: 1,
        y: 0,
        duration: .5
      }
    );

  });


  /* =======================================================
     19 WEBSITE DATA
  ======================================================= */

  const websites = [

    {
      title: "HAPPY BIRTHDAY MAYANK",
      desc: "A tiny website made with a lot of heart.",
      theme: "preview-birthday",
      link: "https://birthday-beta-ten-97.vercel.app",
      special: true
    },

    {
      title: "A Special Memory",
      desc: "Some moments deserve their own little corner on the internet.",
      theme: "preview-pink",
      link: "websites/02/index.html"
    },

    {
      title: "Made For You",
      desc: "A small creation, carrying a surprisingly big amount of love.",
      theme: "preview-purple",
      link: "websites/03/index.html"
    },

    {
      title: "The Memory Lane",
      desc: "A little digital walk through unforgettable moments.",
      theme: "preview-blue",
      link: "websites/04/index.html"
    },

    {
      title: "Birthday Chaos",
      desc: "Because normal birthday wishes were clearly not enough.",
      theme: "preview-orange",
      link: "websites/05/index.html"
    },

    {
      title: "For My Idiot",
      desc: "A website specially reserved for one certified idiot.",
      theme: "preview-green",
      link: "websites/06/index.html"
    },

    {
      title: "19 Reasons",
      desc: "Nineteen tiny reasons to celebrate today.",
      theme: "preview-red",
      link: "websites/07/index.html"
    },

    {
      title: "A Little Surprise",
      desc: "You thought this was the end? Absolutely not.",
      theme: "preview-gold",
      link: "websites/08/index.html"
    },

    {
      title: "The Birthday Letter",
      desc: "A digital letter written specially for your birthday.",
      theme: "preview-lavender",
      link: "websites/09/index.html"
    },

    {
      title: "Best Memories",
      desc: "A little collection of moments worth keeping.",
      theme: "preview-dark",
      link: "websites/10/index.html"
    },

    {
      title: "Aesthetic Birthday",
      desc: "A cinematic birthday experiment.",
      theme: "preview-pink",
      link: "websites/11/index.html"
    },

    {
      title: "The Crazy One",
      desc: "Because your birthday needed a little chaos.",
      theme: "preview-purple",
      link: "websites/12/index.html"
    },

    {
      title: "For The Memories",
      desc: "A digital scrapbook made from random thoughts.",
      theme: "preview-blue",
      link: "websites/13/index.html"
    },

    {
      title: "One More Year",
      desc: "Congratulations. You survived another year.",
      theme: "preview-orange",
      link: "websites/14/index.html"
    },

    {
      title: "Birthday Wishes",
      desc: "Some wishes are better when turned into a website.",
      theme: "preview-green",
      link: "websites/15/index.html"
    },

    {
      title: "19th Chapter",
      desc: "Chapter nineteen officially starts here.",
      theme: "preview-red",
      link: "websites/16/index.html"
    },

    {
      title: "A Digital Gift",
      desc: "Not wrapped in paper, but definitely made with effort.",
      theme: "preview-gold",
      link: "websites/17/index.html"
    },

    {
      title: "Last Little Surprise",
      desc: "Almost at the end. Just one more.",
      theme: "preview-lavender",
      link: "websites/18/index.html"
    },

    {
      title: "THE FINAL ONE",
      desc: "Nineteen websites. One birthday. Happy 19th, Monkey.",
      theme: "preview-birthday",
      link: "websites/19/index.html",
      special: true
    }

  ];


  /* =======================================================
     GENERATE CARDS
  ======================================================= */

  websites.forEach((site, index) => {

    const number =
      String(index + 1).padStart(2, "0");

    const card =
      document.createElement("article");

    card.className = "website-card";

    card.innerHTML = `

      <div class="card-preview ${site.theme}">

        <div class="card-number">
          ${number}
        </div>

        <div class="card-tag">
          WEBSITE
        </div>

        ${
          site.special

            ? `
              <div class="preview-big-text">
                Happy<br>
                Birthday
              </div>

              <div class="gold-line-preview"></div>
            `

            : `
              <div class="preview-text">
                PREVIEW UNAVAILABLE
              </div>
            `
        }

      </div>


      <div class="card-content">

        <h3>
          ${site.title}
        </h3>

        <p>
          ${site.desc}
        </p>

        <a
          class="view-btn"
          href="${site.link}"
        >
          View Website&nbsp; ↗
        </a>

      </div>
    `;

    websiteGrid.appendChild(card);

  });


  /* =======================================================
     OPEN COLLECTION
  ======================================================= */

  openCollection.addEventListener("click", () => {

    gsap.to(birthdaySection, {

      opacity: 0,

      y: -60,

      duration: .7,

      ease: "power2.in"

    });

    setTimeout(() => {

      birthdaySection.style.display = "none";

      collectionSection.style.display = "block";

      window.scrollTo(0, 0);

      gsap.fromTo(
        collectionSection,
        {
          opacity: 0,
          y: 70
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );

      animateCards();

    }, 650);

  });


  /* =======================================================
     CARD ANIMATION
  ======================================================= */

  function animateCards() {

    const cards =
      document.querySelectorAll(".website-card");

    gsap.fromTo(
      cards,

      {
        opacity: 0,
        y: 70,
        scale: .95
      },

      {
        opacity: 1,
        y: 0,
        scale: 1,

        duration: .65,

        stagger: {
          each: .07,
          from: "start"
        },

        ease: "power3.out"
      }
    );

  }


  /* =======================================================
     CARD TILT
  ======================================================= */

  document.addEventListener(
    "mousemove",
    (event) => {

      if (window.innerWidth < 800) return;

      const cards =
        document.querySelectorAll(".website-card");

      cards.forEach(card => {

        const rect =
          card.getBoundingClientRect();

        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          return;
        }

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        const rotateX =
          (0.5 - y) * 4;

        const rotateY =
          (x - 0.5) * 4;

        gsap.to(card, {
          rotateX,
          rotateY,

          duration: .3,

          overwrite: true
        });

      });

    }
  );


  /* =======================================================
     FINAL PAGE
     ONLY BUTTON CLICK
  ======================================================= */

  openCelebration.addEventListener(
    "click",
    () => {

      gsap.to(collectionSection, {

        opacity: 0,

        scale: .96,

        duration: .8,

        ease: "power2.in"

      });

      setTimeout(() => {

        collectionSection.style.display = "none";

        finalCelebration.style.display = "flex";

        window.scrollTo(0, 0);

        gsap.fromTo(
          finalCelebration,

          {
            opacity: 0,
            scale: 1.04
          },

          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
          }
        );


        /* -----------------------------------------------
           FINAL TEXT
        ------------------------------------------------ */

        gsap.fromTo(
          ".celebration-kicker",

          {
            opacity: 0,
            y: 25
          },

          {
            opacity: 1,
            y: 0,
            duration: .6
          }
        );


        gsap.fromTo(
          ".celebration-title",

          {
            opacity: 0,
            y: 80,
            scale: .8
          },

          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            delay: .25,
            ease: "power3.out"
          }
        );


        gsap.fromTo(
          ".celebration-name",

          {
            opacity: 0,
            y: 25
          },

          {
            opacity: 1,
            y: 0,
            duration: .6,
            delay: .7
          }
        );


        gsap.fromTo(
          ".celebration-copy, .celebration-small",

          {
            opacity: 0,
            y: 20
          },

          {
            opacity: 1,
            y: 0,
            duration: .6,
            delay: 1,
            stagger: .15
          }
        );


        /* -----------------------------------------------
           FIREWORKS
        ------------------------------------------------ */

        startFireworks();

      }, 750);

    }
  );


  /* =======================================================
     FIREWORK SYSTEM
  ======================================================= */

  const canvas =
    document.getElementById("fireworksCanvas");

  const ctx =
    canvas.getContext("2d");

  let fireworks = [];
  let particles = [];

  let fireworksRunning = false;


  function resizeCanvas() {

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width =
      window.innerWidth * ratio;

    canvas.height =
      window.innerHeight * ratio;

    canvas.style.width =
      window.innerWidth + "px";

    canvas.style.height =
      window.innerHeight + "px";

    ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );

  }


  window.addEventListener(
    "resize",
    resizeCanvas
  );

  resizeCanvas();


  function random(min, max) {
    return Math.random() *
      (max - min) + min;
  }


  class Firework {

    constructor() {

      this.x =
        random(
          window.innerWidth * .15,
          window.innerWidth * .85
        );

      this.y =
        window.innerHeight + 20;

      this.targetX =
        random(
          window.innerWidth * .15,
          window.innerWidth * .85
        );

      this.targetY =
        random(
          window.innerHeight * .15,
          window.innerHeight * .55
        );

      this.speed =
        random(8, 12);

      this.angle =
        Math.atan2(
          this.targetY - this.y,
          this.targetX - this.x
        );

      this.velocityX =
        Math.cos(this.angle) *
        this.speed;

      this.velocityY =
        Math.sin(this.angle) *
        this.speed;

      this.color =
        [
          "#ffd85a",
          "#fff0a1",
          "#e6b83e",
          "#ffffff"
        ][
          Math.floor(
            Math.random() * 4
          )
        ];

      this.dead = false;

    }


    update() {

      this.x += this.velocityX;

      this.y += this.velocityY;

      this.velocityY += .08;

      if (
        this.y <= this.targetY
      ) {

        this.explode();

        this.dead = true;

      }

    }


    draw() {

      ctx.beginPath();

      ctx.arc(
        this.x,
        this.y,
        2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        this.color;

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        this.color;

      ctx.fill();

      ctx.shadowBlur = 0;

    }


    explode() {

      const count =
        window.innerWidth < 600
          ? 65
          : 100;

      for (
        let i = 0;
        i < count;
        i++
      ) {

        const angle =
          Math.random() *
          Math.PI * 2;

        const speed =
          random(1.5, 7);

        particles.push(
          new FireParticle(
            this.x,
            this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            this.color
          )
        );

      }

    }

  }


  class FireParticle {

    constructor(
      x,
      y,
      vx,
      vy,
      color
    ) {

      this.x = x;
      this.y = y;

      this.vx = vx;
      this.vy = vy;

      this.color = color;

      this.life = 1;

      this.decay =
        random(.012, .025);

      this.size =
        random(1, 3);

    }


    update() {

      this.x += this.vx;

      this.y += this.vy;

      this.vx *= .985;

      this.vy *= .985;

      this.vy += .045;

      this.life -= this.decay;

    }


    draw() {

      ctx.save();

      ctx.globalAlpha =
        Math.max(this.life, 0);

      ctx.beginPath();

      ctx.arc(
        this.x,
        this.y,
        this.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        this.color;

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        this.color;

      ctx.fill();

      ctx.restore();

    }

  }


  function startFireworks() {

    if (fireworksRunning) return;

    fireworksRunning = true;

    fireworks = [];
    particles = [];

    fireworksLoop();

  }


  let lastFirework =
    0;


  function fireworksLoop(
    timestamp = 0
  ) {

    if (
      !fireworksRunning
    ) return;

    ctx.fillStyle =
      "rgba(0,0,0,.18)";

    ctx.fillRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );


    /* create rockets */

    if (
      timestamp -
      lastFirework >
      650
    ) {

      fireworks.push(
        new Firework()
      );

      lastFirework =
        timestamp;

    }


    /* fireworks */

    fireworks =
      fireworks.filter(
        firework => {

          firework.update();

          firework.draw();

          return !firework.dead;

        }
      );


    /* particles */

    particles =
      particles.filter(
        particle => {

          particle.update();

          particle.draw();

          return particle.life > 0;

        }
      );


    requestAnimationFrame(
      fireworksLoop
    );

  }


  /* =======================================================
     REPLAY
  ======================================================= */

  replayButton.addEventListener(
    "click",
    () => {

      window.location.reload();

    }
  );

});