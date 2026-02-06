"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.BaseCommand({
    type: "messageCreate",
    name: "morph",
    code: `
  $let[srcUser;$authorID]
  $let[trgUser;$findUser[$message]]
  $if[$get[trgUser]==$get[srcUser];$let[trgUser;]]

  $let[progressContent;> *$randomtext[🧬 Reconstructing reality...;🎨 Rearranging pixels like a perfectionist...]*]
  $fn[progress;
    $let[content;$get[progressContent]\n> $bar[$env[current];100;12;⬜;⬛] **$round[$env[current];2]%**]
    $if[$env[id]==;
      $let[id;$sendMessage[$channelID;$reply $get[content];true]];
      $editMessage[$channelID;$get[id];$get[content]]
    ]
    $return[$wait[1000]$get[id]]
  ;current;id]
  $let[progressMessageID;$callFn[progress;$randomNumber[1;10;true];]]

  $c[ Constants ]
  $let[size;512]
  $let[frames;30]
  $let[srcImg;$userAvatar[$get[srcUser];1024;png]]
  $let[trgImg;$if[$get[trgUser]==;https://images2.imgbox.com/9d/32/fyedGEQR_o.jpg;$userAvatar[$get[trgUser];1024;png]]]

  $c[ Extract Source Image Pixels & Target Positions ]
  $arrayCreate[srcPixels]
  $createCanvas[srcCanvas;$get[size];$get[size];
    $drawImage[;$get[srcImg];0;0;$get[size];$get[size]]
  ]
  $arrayCreate[trgPositions]
  $createCanvas[trgCanvas;$get[size];$get[size];
    $drawImage[;$get[trgImg];0;0;$get[size];$get[size]]
  ]
  $!djsEval[
    const size = +ctx.getKeyword("size");
    const key = (r,g,b,a) =>0.2126*r + 0.7152*g + 0.0722*b;
    const srcCanvas = ctx.canvasManager.get("srcCanvas");
    const trgCanvas = ctx.canvasManager.get("trgCanvas");
    for(let y = 0; y < size; y++) {
      for(let x = 0; x < size; x++) {
        let srcRGBA =  srcCanvas.getPixels(x,y,1,1,0);
        ctx.getEnvironmentKey("srcPixels").push({
          x, y, rgba: srcRGBA, key: key(...srcRGBA)
        })
        let trgRGBA = trgCanvas.getPixels(x,y,1,1,0);
        ctx.getEnvironmentKey("trgPositions").push({
          x, y, key: key(...trgRGBA)
        })
      }
    }
  ]
  $!callFn[progress;$randomNumber[30;45;true];$get[progressMessageID]]

  $c[ Sort both by color similarity ]
  $!djsEval[ctx.setEnvironmentKey("srcPixels", ctx.getEnvironmentKey("srcPixels").sort((a, b) => a.key - b.key));ctx.setEnvironmentKey("trgPositions", ctx.getEnvironmentKey("trgPositions").sort((a, b) => a.key - b.key))]
  $!callFn[progress;$randomNumber[50;60;true];$get[progressMessageID]]


  $c[ Moing pixels ]
  $let[i;0]
  $!djsEval[
    const trg = ctx.getEnvironmentKey("trgPositions");
    const color = (r,g,b,a) => "rgba(" + r + ", " + g + ", " + b + ", " + (a/255) + ")";
    ctx.setEnvironmentKey("moving", ctx.getEnvironmentKey("srcPixels").slice()
      .map((p,i) => ({
        startX: p.x,
        startY: p.y,
        endX: trg.at(i).x,
        endY: trg.at(i).y,
        color: color(...p.rgba)
      }))
    );
  ]
  $!callFn[progress;$randomNumber[65;80;true];$get[progressMessageID]]

  $c[ GIF ]
  $newGIFEncoder[gif;$get[size];$get[size];;
    $setGIFEncoderLoops[;0]
  ]
  $createCanvas[frame;$get[size];$get[size];
    $drawImage[;canvas://srcCanvas;0;0;$get[size];$get[size]]
  ]
  $loop[$get[frames];
    $let[frame;$sub[$env[frame];1]]
    $let[t;$divide[$get[frame];$get[frames]]]
    $!djsEval[
      const canvas = ctx.canvasManager.get("frame");
      const lerp = (a,b,t) => a+ (b-a)*t;
      let t = +ctx.getKeyword("t");
      t = t*t*(3-2*t);
      ctx.getEnvironmentKey("moving").forEach(p => {
        let x = Math.round(lerp(p.startX, p.endX, t))
        let y = Math.round(lerp(p.startY, p.endY, t))
        canvas.ctx.fillStyle = p.color;
        canvas.ctx.fillRect(x-0.5,y-0.5,2,2)
      });
    ]
    $addFrame[gif;canvas://frame]
  ;frame;true]
  $!callFn[progress;100;$get[progressMessageID]]

  $sendMessage[$channelID;
    $reply[$channelID;$get[progressMessageID]]
    ## Morphing <@$get[srcUser]> to $if[$get[trgUser]==;**SUIIIIY MAN**;<@$get[trgUser]>]
    $attachGIF[gif;morph.gif]
    $attachCanvas[frame;morph.png]
  ]
  `,
});
