"use strict";

const PacketDeviceArt = (() => {
  const edge = "#78a2fd";
  const detail = "#5482d4";
  const light = "#8ce7e6";
  const top = "#192f59";
  const front = "#101f3c";
  const side = "#15294b";
  const deep = "#0a1731";
  const point = ([x, y, z]) => [66 + (x - y) * .9, 72 + (x + y) * .43 - z];
  const at = (x, y, z) => [x, y, z];

  function polygon(ctx, points, fill, stroke = edge, width = 1.13) {
    ctx.beginPath();
    points.forEach((xyz, index) => {
      const [x, y] = point(xyz);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    if (fill) {
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }

  function surface(ctx, x, y, width, depth, z, fill, stroke, lineWidth) {
    polygon(ctx, [at(x, y, z), at(x + width, y, z), at(x + width, y + depth, z), at(x, y + depth, z), at(x, y, z)],
      fill, stroke, lineWidth);
  }

  function panel(ctx, x, y, width, bottom, height, fill, stroke, lineWidth) {
    polygon(ctx, [at(x, y, bottom), at(x + width, y, bottom), at(x + width, y, bottom + height), at(x, y, bottom + height)],
      fill, stroke, lineWidth);
  }

  function box(ctx, x, y, width, depth, base, height, colors = [top, front, side]) {
    const right = x + width, near = y + depth, cap = base + height;
    if (height > 0) {
      polygon(ctx, [at(right, y, cap), at(right, near, cap), at(right, near, base), at(right, y, base)], colors[2]);
      panel(ctx, x, near, width, base, height, colors[1]);
    }
    surface(ctx, x, y, width, depth, cap, colors[0]);
  }

  function lattice(ctx, x, y, width, depth) {
    surface(ctx, x, y, width, depth, -5, "#0d1c36", "#395a91", .85);
    surface(ctx, x + 3, y + 3, width - 6, depth - 6, -5, null, "#304a7d", .65);
    polygon(ctx, [at(x + 2, y + depth - 7, -5), at(x + 2, y + depth - 2, -5), at(x + 7, y + depth - 2, -5)], null, detail, 1);
  }

  function laptop(ctx) {
    lattice(ctx, -29, -21, 58, 48);
    box(ctx, -25, -17, 50, 39, 0, 3);
    polygon(ctx, [at(-25, -17, 3), at(-25, -25, 45), at(25, -25, 45), at(25, -17, 3)], front);
    polygon(ctx, [at(-25, -17, 3), at(-25, -25, 45), at(-27, -26, 46), at(-27, -18, 4), at(-25, -17, 3)],
      side, edge, .92);
    polygon(ctx, [at(-26, -25, 45), at(-27, -26, 46), at(23, -26, 46), at(25, -25, 45), at(-26, -25, 45)],
      top, edge, .9);
    polygon(ctx, [at(-21, -18, 8), at(-21, -24, 40), at(21, -24, 40), at(21, -18, 8)], deep, detail, .75);
    polygon(ctx, [at(-18, -23, 35), at(18, -23, 35)], null, detail, .9);
    panel(ctx, -17, -20, 15, 12, 17, "#214783", null);
    for (const [y, z, length] of [[-22, 29, 17], [-21, 24, 17], [-20, 19, 13], [-19, 14, 16]]) {
      polygon(ctx, [at(1, y, z), at(1 + length, y, z)], null, detail, .9);
    }
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 11; col++) {
        surface(ctx, -21.5 + col * 3.95, -12 + row * 4.25, 2.95, 2.75, 3.2, "#102246", detail, .56);
      }
    }
    surface(ctx, -8.8, 6.9, 17.6, 10.1, 3.2, deep, detail, .72);
    panel(ctx, 15, 22.1, 5, 1, .7, light, null);
  }

  function rack(ctx) {
    lattice(ctx, -23, -19, 46, 39);
    box(ctx, -17, -14, 34, 28, 0, 47);
    for (let level = 0; level < 3; level++) {
      const z = 5 + level * 13;
      panel(ctx, -13.7, 14.2, 27.4, z, 10, deep, detail, .77);
      panel(ctx, -10.5, 14.4, 3, z + 5.8, 1.75, level === 2 ? light : "#608ecb", null);
      panel(ctx, -10.5, 14.4, 1.25, z + 2.8, 1.25, detail, null);
      for (let slot = 0; slot < 3; slot++) panel(ctx, 1.2 + slot * 3.45, 14.4, 2.35, z + 3.2, 3.55, side, detail, .48);
    }
    surface(ctx, -12, -10, 22, 17, 47.2, null, detail, .72);
    for (let vent = 0; vent < 4; vent++) {
      polygon(ctx, [at(17.4, -8 + vent * 3.1, 32), at(17.4, -8 + vent * 3.1, 40)], null, detail, .67);
    }
  }

  function appliance(ctx, router) {
    lattice(ctx, -33, -22, 66, 45);
    const depth = router ? 30 : 35;
    const height = router ? 13 : 10;
    box(ctx, -28, -17, 56, depth, 2, height);
    const z = height + 2, near = depth - 17;
    surface(ctx, -25, -14, 50, depth - 7, z + .12, null, detail, .7);
    const count = router ? 4 : 8;
    const gap = router ? 9 : 5.2;
    for (let i = 0; i < count; i++) {
      const x = -22 + gap * i;
      panel(ctx, x, near + .2, router ? 7 : 4.1, 4.2, router ? 6 : 4.2, deep, detail, .55);
      panel(ctx, x + .8, near + .3, 1.2, z - 1.9, .85, i === 0 || i === 2 ? light : "#5379aa", null);
    }
    if (router) {
      const arrow = (from, to, y, z) => {
        const dir = Math.sign(to - from);
        polygon(ctx, [at(from, y, z), at(to, y, z), at(to - 4 * dir, y - 4, z)], null, edge, 1.05);
        polygon(ctx, [at(to, y, z), at(to - 4 * dir, y + 4, z)], null, edge, 1.05);
      };
      arrow(-12, 12, -7, z + .2);
      arrow(12, -12, 4, z + .2);
    } else {
      for (let vent = 0; vent < 7; vent++) {
        polygon(ctx, [at(-21 + vent * 5.1, -10, z + .1), at(-21 + vent * 5.1, -2, z + .1)], null, detail, .68);
      }
      surface(ctx, 17, -11, 4, 4, z + .1, light, null);
    }
  }

  function desktop(ctx) {
    lattice(ctx, -30, -22, 60, 43);
    box(ctx, 10, -13, 13, 17, 1, 38);
    panel(ctx, 13, 4.2, 7, 9, 16, deep, detail, .75);
    panel(ctx, 14, 4.4, 2, 29, 2, light, null);
    box(ctx, -24, -4, 30, 17, 0, 3);
    box(ctx, -12, -3, 6, 6, 3, 12);
    box(ctx, -28, -7, 34, 4, 13, 25);
    panel(ctx, -25, -2.7, 28, 16, 19, deep, detail, .74);
    panel(ctx, -22, -2.5, 7, 19, 12, "#254b86", null);
    for (const z of [21, 25, 29]) panel(ctx, -12, -2.5, 11, z, .65, detail, null);
  }

  function segment(ctx) {
    lattice(ctx, -32, -25, 64, 52);
    surface(ctx, -25, -15, 50, 30, -1, deep, detail, .74);
    polygon(ctx, [at(-18, 8, 1), at(-13, -7, 1), at(20, -7, 1)], null, light, 1.14);
    polygon(ctx, [at(16, 13, 1), at(3, 13, 1), at(-2, -7, 1)], null, detail, 1);
    for (const [x, y] of [[-24, 6], [-17, -13], [16, -13], [12, 8]]) {
      box(ctx, x, y, 11, 10, 0, 5);
      surface(ctx, x + 3, y + 2.5, 5, 5, 5.2, "#77c9ef", null);
    }
  }

  const drawings = {
    client: laptop, peer: desktop, gateway: ctx => appliance(ctx, true),
    switch: ctx => appliance(ctx, false), segment
  };

  function draw(canvas, id) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    (drawings[id] ?? rack)(ctx);
  }

  return { draw };
})();
