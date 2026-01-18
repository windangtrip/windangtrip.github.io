const field = document.getElementById("raymond-field");
const countInput = document.getElementById("raymond-count");
const speedInput = document.getElementById("raymond-speed");
const overlay = document.getElementById("raymond-overlay");
const resetButton = document.getElementById("raymond-reset");

if (field) {
  let sprites = [];
  let speedFactor = Number(speedInput?.value || 1.4);

  const fieldRect = () => field.getBoundingClientRect();

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const createSprite = () => {
    const img = document.createElement("img");
    img.src = "raymond.png";
    img.alt = "";
    img.className = "raymond-sprite";
    field.appendChild(img);

    const rect = fieldRect();
    const size = img.offsetWidth || 72;

    const sprite = {
      el: img,
      x: randomBetween(0, rect.width - size),
      y: randomBetween(0, rect.height - size),
      vx: randomBetween(-1.2, 1.2),
      vy: randomBetween(-1.2, 1.2),
      hue: randomBetween(0, 360),
      hueSpeed: randomBetween(0.4, 1.4),
    };

    img.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      popSprite(sprite);
    });

    return sprite;
  };

  const addSprites = (count) => {
    for (let i = 0; i < count; i += 1) {
      sprites.push(createSprite());
    }
  };

  const removeSprites = (count) => {
    for (let i = 0; i < count; i += 1) {
      const sprite = sprites.pop();
      if (sprite) {
        sprite.el.remove();
      }
    }
  };

  const showOverlay = () => {
    if (overlay) {
      overlay.hidden = false;
    }
  };

  const hideOverlay = () => {
    if (overlay) {
      overlay.hidden = true;
    }
  };

  const updateOverlay = () => {
    if (sprites.length === 0) {
      showOverlay();
    } else {
      hideOverlay();
    }
  };

  const createSplash = (x, y) => {
    const splash = document.createElement("div");
    splash.className = "raymond-splash";
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    field.appendChild(splash);
    window.setTimeout(() => splash.remove(), 700);
  };

  const popSprite = (sprite) => {
    const index = sprites.indexOf(sprite);
    if (index === -1) {
      return;
    }
    const size = sprite.el.offsetWidth || 72;
    createSplash(sprite.x + size / 2, sprite.y + size / 2);
    sprite.el.remove();
    sprites.splice(index, 1);
    updateOverlay();
  };

  const tick = () => {
    const rect = fieldRect();

    sprites.forEach((sprite) => {
      const size = sprite.el.offsetWidth || 72;
      sprite.x += sprite.vx * speedFactor;
      sprite.y += sprite.vy * speedFactor;
      sprite.hue = (sprite.hue + sprite.hueSpeed) % 360;

      if (sprite.x <= 0 || sprite.x >= rect.width - size) {
        sprite.vx *= -1;
        sprite.x = Math.max(0, Math.min(sprite.x, rect.width - size));
      }

      if (sprite.y <= 0 || sprite.y >= rect.height - size) {
        sprite.vy *= -1;
        sprite.y = Math.max(0, Math.min(sprite.y, rect.height - size));
      }

      sprite.el.style.transform = `translate(${sprite.x}px, ${sprite.y}px)`;
      sprite.el.style.filter = `hue-rotate(${sprite.hue}deg) saturate(1.4)`;
    });

    requestAnimationFrame(tick);
  };

  if (countInput) {
    countInput.addEventListener("input", (event) => {
      const nextCount = Number(event.target.value);
      const diff = nextCount - sprites.length;
      if (diff > 0) {
        addSprites(diff);
      } else if (diff < 0) {
        removeSprites(Math.abs(diff));
      }
      updateOverlay();
    });
  }

  if (speedInput) {
    speedInput.addEventListener("input", (event) => {
      speedFactor = Number(event.target.value);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      removeSprites(sprites.length);
      addSprites(Number(countInput?.value || 18));
      updateOverlay();
    });
  }

  addSprites(Number(countInput?.value || 18));
  updateOverlay();
  requestAnimationFrame(tick);
}

