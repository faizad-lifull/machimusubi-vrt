export const pagePatterns: {
  path: string;
  maskingSelectors?: string[];
  selectors?: string[];
  deviceType: ("sp" | "pc")[];
  describe?: string;
}[] = [
  // {
  //   path: "/machimusubi/",
  //   deviceType: ["sp", "pc"],
  //   describe: "Top Page Test",
  // },
  // {
  //   path: "/machimusubi/tokyo/lifestyle/",
  //   deviceType: ["sp", "pc"],
  //   describe: "Lifestyle Page Test",
  // },
  // {
  //   path: "/machimusubi/tokyo/lifestyle/st-list/?tag_id=1,3",
  //   deviceType: ["sp", "pc"],
  //   describe: "Lifestyle Station Page Test",
  // },
  // {
  //   path: "/machimusubi/tokyo/lifestyle/64/",
  //   deviceType: ["sp", "pc"],
  //   describe: "Lifestyle Id Page Test",
  // },
  // {
  //   path: "/machimusubi/tokyo/shinagawa_00224-st/",
  //   deviceType: ["sp"],
  //   maskingSelectors: [
  //     // Mask user review bubbles
  //     "#prg-areaReviews > div.reviewContent > div.reviewList > dl > dd",
  //     // Mask user icons and demographic information
  //     "#prg-areaReviews > div.reviewContent > div.reviewList > dl > dt",
  //   ],
  //   describe: "Station Detail Page Test",
  // },
  // {
  //   path: "/machimusubi/gifu/line/",
  //   deviceType: ["sp", "pc"],
  //   describe: "Line List Page Test",
  // },
  // {
  //   path: "/machimusubi/gifu/chuohonsen-line/",
  //   deviceType: ["sp", "pc"],
  //   describe: "Line Page Test",
  // },
  // {
  //   path: "/machimusubi/not/found/",
  //   deviceType: ["sp", "pc"],
  //   describe: "Error Page Test",
  // },
  // {
  //   path: "/machimusubi/tokyo/heiwadai_06376-st/",
  //   deviceType: ["pc"],
  //   selectors: [".statsContent"],
  //   describe: "Station Detail Rating Star differences",
  // },
  // {
  //   path: "/machimusubi/tokyo/heiwadai_06376-st/",
  //   deviceType: ["pc"],
  //   selectors: ["#line"],
  //   describe: "Station Detail Route information differences",
  // },
  {
    path: "/machimusubi/tokyo/heiwadai_06376-st/",
    deviceType: ["pc", "sp"],
    selectors: ["#data"],
    describe: "Station Detail Basic information differences",
  },
];
