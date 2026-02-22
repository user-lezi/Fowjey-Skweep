import { ArgType, ForgeFunction } from "@tryforge/forgescript";

export default new ForgeFunction({
  name: "ditherImage",
  brackets: true,
  params: [
    { name: "imageurl", type: ArgType.URL, required: true },
    { name: "path", type: ArgType.String, required: true },
    { name: "mode", type: ArgType.String }, // "floyd" | "ordered"
    { name: "palette", type: ArgType.String }, // "bw" | "gameboy" | "neon"
    { name: "size", type: ArgType.Number },
  ],
  code: `
  $let[mode;$default[$env[mode];floyd]]
  $let[threshold;128]
  $let[strength;1]
  $let[palette;$env[palette]]
  $let[size;$default[$env[size];512]]

  $createCanvas[d;$get[size];$get[size];
    $drawImage[;$env[imageurl];0;0;$get[size];$get[size]]
  ]

  $!js[
    const canvas = ctx.canvasManager.get("d").ctx;
    ctx.imageData = canvas.getImageData(0,0,$get[size],$get[size]);
    ctx.data = ctx.imageData.data;
  ]

  $c[ RGB PALETTES ]
  $!js[
    let threshold = +ctx.getKeyword("threshold");

    let palettes = {
      bw: [[0,0,0\\],[255,255,255\\]\\],

      gameboy: [
        [15,56,15\\],
        [48,98,48\\],
        [139,172,15\\],
        [155,188,15\\]
      \\],

      neon: [
        [0,255,255\\],      // cyan
        [255,0,255\\],      // magenta
        [0,0,0\\],          // black
        [255,20,147\\],     // hot pink
        [138,43,226\\],     // neon purple
        [57,255,20\\]       // neon green
      \\]
    };

    ctx.quantizeRGB = (r,g,b) => {
      let paletteName = ctx.getKeyword("palette");
      let palette = paletteName ? palettes[paletteName\\] : undefined;

      if (!palette) {
        return [
          r < threshold ? 0 : 255,
          g < threshold ? 0 : 255,
          b < threshold ? 0 : 255
        \\];
      }

      return palette.reduce((prev, curr) => {
        let prevDist =
          (prev[0\\]-r)**2 +
          (prev[1\\]-g)**2 +
          (prev[2\\]-b)**2;

        let currDist =
          (curr[0\\]-r)**2 +
          (curr[1\\]-g)**2 +
          (curr[2\\]-b)**2;

        return currDist < prevDist ? curr : prev;
      });
    };
  ]

  $jsonLoad[bayer;[[0,8,2,10\\],[12,4,14,6\\],[3,11,1,9\\],[15,7,13,5\\]\\]]

  $c[ ORDERED RGB ]
  $!js[
    let size = +ctx.getKeyword("size");
    let strength = +ctx.getKeyword("strength");
    let mode = ctx.getKeyword("mode");

    if (mode == "ordered") {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {

          let i = 4 * (y * size + x);

          let r = ctx.data[i\\];
          let g = ctx.data[i+1\\];
          let b = ctx.data[i+2\\];

          let map = (ctx.getEnvironmentKey("bayer")[y % 4\\][x % 4\\] / 16) * 255 - 128;

          let nr = Math.max(0, Math.min(255, r + map));
          let ng = Math.max(0, Math.min(255, g + map));
          let nb = Math.max(0, Math.min(255, b + map));

          let q = ctx.quantizeRGB(nr,ng,nb);

          ctx.data[i\\]   = q[0\\];
          ctx.data[i+1\\] = q[1\\];
          ctx.data[i+2\\] = q[2\\];
        }
      }
    }
    $c[ FLOYD RGB ]
    else if (mode == "floyd") {

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {

          let i = 4 * (y * size + x);

          let r = ctx.data[i\\];
          let g = ctx.data[i+1\\];
          let b = ctx.data[i+2\\];

          let q = ctx.quantizeRGB(r,g,b);

          let er = (r - q[0\\]) * strength;
          let eg = (g - q[1\\]) * strength;
          let eb = (b - q[2\\]) * strength;

          ctx.data[i\\]   = q[0\\];
          ctx.data[i+1\\] = q[1\\];
          ctx.data[i+2\\] = q[2\\];

          distribute(x + 1, y, er, eg, eb, 7/16);
          distribute(x - 1, y + 1, er, eg, eb, 3/16);
          distribute(x, y + 1, er, eg, eb, 5/16);
          distribute(x + 1, y + 1, er, eg, eb, 1/16);
        }
      }

      function distribute(x, y, er, eg, eb, factor) {
        if (x < 0 || x >= size || y < 0 || y >= size) return;

        let i = 4 * (y * size + x);

        ctx.data[i\\]   = Math.max(0, Math.min(255, ctx.data[i\\]   + er * factor));
        ctx.data[i+1\\] = Math.max(0, Math.min(255, ctx.data[i+1\\] + eg * factor));
        ctx.data[i+2\\] = Math.max(0, Math.min(255, ctx.data[i+2\\] + eb * factor));
      }
    }
  ]

  $createCanvas[D;$get[size];$get[size]]
  $!js[
    ctx.canvasManager.get("D").ctx.putImageData(ctx.imageData,0,0)
  ]

  $return[$canvasDownload[D;$env[path];png]]
  `,
});
