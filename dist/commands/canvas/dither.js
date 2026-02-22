"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.BaseCommand({
    type: "messageCreate",
    name: "dither",
    aliases: ["d"],
    code: `
  $let[targetUser;$findUser[$message[0];false]]
  $if[$get[targetUser]==;
    $if[$isValidLink[$message[0]]==true;
      $let[src;$message[0]];
      $let[src;$userAvatar[$authorID;1024;png]]
    ];
    $let[src;$userAvatar[$get[targetUser];1024;png]]
  ]
  $ifx[
    $if[$includes[$toLowerCase[$message];-floyd];
      $let[mode;floyd]
    ]
    $elseIf[$includes[$toLowerCase[$message];-ordered];
      $let[mode;ordered]
    ]
    $else[
      $let[mode;ordered]
    ]
  ]
  $ifx[
    $if[$includes[$toLowerCase[$message];-gameboy];
      $let[palette;gameboy]
    ]
    $elseIf[$includes[$toLowerCase[$message];-bw];
      $let[palette;bw]
    ]
    $elseIf[$includes[$toLowerCase[$message];-neon];
      $let[palette;neon]
    ]
  ]
  $let[file;temp_dither-$randomUUID.png]
  $ditherImage[$get[src];$get[file];$get[mode];$get[palette];512]
  $attachment[$get[file];dither.png]
  $setTimeout[$deleteFile[$get[file]];10s]
  `,
});
