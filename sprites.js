(function () {
  function drawBackground(ctx, width, height, time) {
    ctx.save();

    const glow = 0.5 + 0.5 * Math.sin(time * 2);
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#09070b');
    sky.addColorStop(0.58, '#260b17');
    sky.addColorStop(1, '#58131a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Uneven cave ceiling and walls.
    ctx.fillStyle = '#11090f';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, 74);
    ctx.lineTo(width - 24, 62);
    ctx.lineTo(width - 48, 92);
    ctx.lineTo(width - 70, 54);
    ctx.lineTo(width - 98, 112);
    ctx.lineTo(width - 125, 66);
    ctx.lineTo(width - 154, 96);
    ctx.lineTo(width - 190, 45);
    ctx.lineTo(width - 226, 84);
    ctx.lineTo(width - 260, 52);
    ctx.lineTo(width - 296, 102);
    ctx.lineTo(0, 72);
    ctx.closePath();
    ctx.fill();

    // Deep rock silhouettes on the sides.
    ctx.fillStyle = '#170a12';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(52, 0);
    ctx.lineTo(37, 108);
    ctx.lineTo(58, 178);
    ctx.lineTo(35, 246);
    ctx.lineTo(52, 330);
    ctx.lineTo(26, 410);
    ctx.lineTo(0, 438);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width - 44, 0);
    ctx.lineTo(width - 30, 130);
    ctx.lineTo(width - 56, 210);
    ctx.lineTo(width - 32, 300);
    ctx.lineTo(width - 50, 405);
    ctx.lineTo(width, 440);
    ctx.closePath();
    ctx.fill();

    // Lava glow pools add warmth without obscuring the dark cave.
    const lavaGlow = ctx.createRadialGradient(width * 0.5, height * 0.95, 4, width * 0.5, height * 0.95, width * 0.7);
    lavaGlow.addColorStop(0, 'rgba(255, 79, 24, ' + (0.28 + glow * 0.08) + ')');
    lavaGlow.addColorStop(0.35, 'rgba(177, 24, 20, 0.12)');
    lavaGlow.addColorStop(1, 'rgba(60, 5, 12, 0)');
    ctx.fillStyle = lavaGlow;
    ctx.fillRect(0, height * 0.45, width, height * 0.55);

    // Small angular rock shelves.
    ctx.fillStyle = '#3a111b';
    for (let i = 0; i < 6; i += 1) {
      const x = i * (width / 5) - 28;
      const y = height * 0.25 + (i % 2) * 48;
      ctx.beginPath();
      ctx.moveTo(x, y + 18);
      ctx.lineTo(x + 24, y - 4);
      ctx.lineTo(x + 65, y + 12);
      ctx.lineTo(x + 92, y + 32);
      ctx.lineTo(x + 30, y + 28);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function drawGround(ctx, width, height, groundHeight, offset) {
    ctx.save();
    const top = height - groundHeight;
    ctx.fillStyle = '#13080d';
    ctx.fillRect(0, top, width, groundHeight);

    ctx.fillStyle = '#63151a';
    ctx.fillRect(0, top, width, 8);
    ctx.fillStyle = '#ff4a1f';
    ctx.fillRect(0, top, width, 3);

    // Scrolling black rocks with bright lava cracks.
    const step = 58;
    const shift = -((offset % step) + step) % step;
    for (let x = shift - step; x < width + step; x += step) {
      ctx.fillStyle = '#2a0e16';
      ctx.beginPath();
      ctx.moveTo(x, top + 14);
      ctx.lineTo(x + 16, top + 4);
      ctx.lineTo(x + 40, top + 13);
      ctx.lineTo(x + 54, top + groundHeight);
      ctx.lineTo(x - 8, top + groundHeight);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#09060a';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.strokeStyle = '#e8341d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 18, top + 17);
      ctx.lineTo(x + 27, top + 30);
      ctx.lineTo(x + 20, top + 48);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBird(ctx, x, y, size, velocity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.max(-0.35, Math.min(0.45, velocity / 1100)));
    const r = size * 0.46;

    // A bright ember bat, deliberately original and readable against the cave.
    ctx.fillStyle = '#ff6a24';
    ctx.strokeStyle = '#12070b';
    ctx.lineWidth = Math.max(2, size * 0.08);
    ctx.beginPath();
    ctx.moveTo(-r * 0.95, -r * 0.06);
    ctx.lineTo(-r * 1.02, -r * 0.7);
    ctx.lineTo(-r * 0.28, -r * 0.42);
    ctx.lineTo(0, -r * 0.72);
    ctx.lineTo(r * 0.78, -r * 0.48);
    ctx.lineTo(r * 0.98, 0);
    ctx.lineTo(r * 0.64, r * 0.6);
    ctx.lineTo(0, r * 0.82);
    ctx.lineTo(-r * 0.7, r * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd447';
    ctx.beginPath();
    ctx.arc(r * 0.34, -r * 0.12, Math.max(2.5, size * 0.08), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a0b10';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawPipe(ctx, x, gapTop, gapBottom, pipeWidth, height) {
    ctx.save();
    const edge = Math.max(3, pipeWidth * 0.07);
    const cap = Math.min(12, pipeWidth * 0.18);
    function stalactite(top, bottom) {
      const bodyTop = top === 0 ? 0 : top;
      const bodyBottom = bottom;
      const gradient = ctx.createLinearGradient(x, bodyTop, x + pipeWidth, bodyTop);
      gradient.addColorStop(0, '#4b101a');
      gradient.addColorStop(0.45, '#b72b1c');
      gradient.addColorStop(1, '#4a0e16');
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#10070c';
      ctx.lineWidth = edge;
      ctx.fillRect(x, bodyTop, pipeWidth, bodyBottom - bodyTop);
      ctx.strokeRect(x + edge / 2, bodyTop + edge / 2, pipeWidth - edge, bodyBottom - bodyTop - edge);
      ctx.fillStyle = '#ff5b1e';
      ctx.fillRect(x + pipeWidth * 0.14, bodyTop, pipeWidth * 0.11, bodyBottom - bodyTop);
    }
    stalactite(0, gapTop);
    stalactite(gapBottom, height);

    // Chunky caps suggest rock shelves while staying inside each crash rectangle.
    ctx.fillStyle = '#7c1c1b';
    ctx.strokeStyle = '#10070c';
    ctx.lineWidth = edge;
    ctx.beginPath();
    ctx.rect(x - cap, Math.max(0, gapTop - cap), pipeWidth + cap * 2, cap);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(x - cap, gapBottom, pipeWidth + cap * 2, cap);
    ctx.fill();
    ctx.stroke();

    // Lava seams reinforce the cave theme.
    ctx.strokeStyle = '#ff471d';
    ctx.lineWidth = Math.max(1.5, pipeWidth * 0.035);
    ctx.beginPath();
    ctx.moveTo(x + pipeWidth * 0.28, 0);
    ctx.lineTo(x + pipeWidth * 0.42, Math.max(0, gapTop - cap));
    ctx.moveTo(x + pipeWidth * 0.72, gapBottom + cap);
    ctx.lineTo(x + pipeWidth * 0.58, height);
    ctx.stroke();
    ctx.restore();
  }

  window.SPRITES = { drawBackground, drawGround, drawBird, drawPipe };
})();
