import incheonPass from "@assets/incheonpass_1767295222748.png";
import bkkPass from "@assets/bkkpass_1767295222749.png";
import hanoiPass from "@assets/hanoipass_1767295222749.png";
import gvlPass from "@assets/GVL_1767396834515.png";
import napaPass from "@assets/NAP_1767396834515.png";
import tahoePass from "@assets/TAHsummer_1767396834515.png";
import tahoeWinterPass from "@assets/TAHwinter_1767396834515.png";
import yosemitePass from "@assets/yose_1767396834515.png";

import koreaPolaroid1 from "@assets/Polaroid_1_1767077652294.png";
import koreaPhoto2 from "@assets/IMG_6050_1767077880636.jpg";
import koreaPhoto4 from "@assets/IMG_6032_1767174873950.jpg";
import koreaPhoto5 from "@assets/IMG_1691_1767174873950.jpg";
import koreaPhoto6 from "@assets/IMG_0365_1767174966835.jpg";
import koreaPhoto7 from "@assets/IMG_9674_1767175090625.jpg";

import tahoePhoto1 from "@assets/AfterlightImage_1767078244507.JPG";
import tahoePhoto2 from "@assets/IMG_2727_1767078244507.jpg";
import tahoePhoto3 from "@assets/IMG_1700_1767078244507.JPG";
import tahoePhoto4 from "@assets/IMG_2510_1767078339735.jpg";
import tahoePhoto5 from "@assets/IMG_1975_1767078436242.jpg";
import tahoePhoto8 from "@assets/IMG_1902_1767078857306.jpg";
import tahoePhoto9 from "@assets/IMG_6020_1767078857306.jpg";
import tahoePhoto10 from "@assets/IMG_2847_1767078953328.jpg";

import vietnamPhoto1 from "@assets/IMG_5373_1767080078687.jpg";
import vietnamPhoto2 from "@assets/IMG_5234_1767080078688.jpg";
import vietnamPhoto3 from "@assets/IMG_5526_1767080078688.jpg";
import vietnamPhoto4 from "@assets/IMG_5561_1767080078688.jpg";
import vietnamPhoto5 from "@assets/IMG_4538_1767080078688.jpg";
import vietnamPhoto6 from "@assets/IMG_5300_1767080078688.jpg";
import vietnamPhoto7 from "@assets/IMG_4695_1767080078688.jpg";
import vietnamPhoto8 from "@assets/IMG_1716_1767172863442.jpg";
import vietnamPhoto9 from "@assets/IMG_5974_1767174541458.jpg";

import koreaPhoto3 from "@assets/IMG_1707_1767138198025.jpg";
import bangkokPhoto1 from "@assets/IMG_5974_1767138198025.jpg";
import bangkokPhoto2 from "@assets/IMG_1712_1767171628119.jpg";
import bangkokPhoto3 from "@assets/IMG_8007_1767171628119.jpg";
import bangkokPhoto4 from "@assets/IMG_5716_1767171628119.jpg";
import bangkokPhoto5 from "@assets/IMG_1715_1767171628119.jpg";
import bangkokPhoto6 from "@assets/IMG_1711_1767171628119.jpg";
import bangkokPhoto7 from "@assets/IMG_1714_1767171628119.PNG";
import bangkokPhoto8 from "@assets/IMG_3518_1767172205779.JPG";

import napaPhoto1 from "@assets/IMG_3084_1767206089530.jpg";
import napaPhoto2 from "@assets/IMG_5066_1767206201520.jpg";
import napaPhoto3 from "@assets/IMG_5038_1767206274327.jpg";
import napaPhoto4 from "@assets/IMG_5026_1767206366278.jpg";
import napaPhoto5 from "@assets/IMG_5034_1767206589813.jpg";
import napaPhoto6 from "@assets/IMG_1830_1767206677070.jpg";

import gvlPhoto1 from "@assets/IMG_0439_1767313211694.jpeg";
import gvlPhoto2 from "@assets/IMG_1728_1767313211694.jpg";
import gvlPhoto3 from "@assets/IMG_7287_1767313211694.jpg";
import gvlPhoto4 from "@assets/IMG_0412_1767313211694.jpeg";
import gvlPhoto5 from "@assets/IMG_0421_1767313211694.jpeg";
import gvlPhoto6 from "@assets/IMG_7211_1767313211694.jpeg";

import yosePhoto1 from "@assets/IMG_9697_1767314383298.jpeg";
import yosePhoto2 from "@assets/IMG_9628_1767314383297.jpeg";
import yosePhoto3 from "@assets/IMG_9716_1767314383298.jpeg";
import yosePhoto4 from "@assets/IMG_9707_1767314383298.jpeg";
import yosePhoto5 from "@assets/IMG_9769_1767314383298.jpeg";
import yosePhoto6 from "@assets/IMG_9737_1767314383298.jpeg";
import yosePhoto7 from "@assets/IMG_9777_1767314383298.jpeg";
import yosePhoto8 from "@assets/IMG_9807_1767314383298.jpeg";
import yosePhoto9 from "@assets/IMG_9629_1767314383298.jpeg";
import yosePhoto10 from "@assets/IMG_9635_1767314383298.jpeg";
import yosePhoto11 from "@assets/IMG_9806_1767314383298.jpeg";
import yosePhoto12 from "@assets/IMG_9811_1767314383298.jpeg";

import tahSumPhoto1 from "@assets/IMG_1438_1767315778372.jpg";
import tahSumPhoto2 from "@assets/IMG_1730_1767315778373.jpg";
import tahSumPhoto3 from "@assets/IMG_1430_1767315778373.jpg";
import tahSumPhoto4 from "@assets/IMG_2100_1767315778373.jpg";
import tahSumPhoto5 from "@assets/AfterlightImage_1767315778373.JPG";
import tahSumPhoto6 from "@assets/IMG_1720_1767315778373.jpg";
import tahSumPhoto7 from "@assets/IMG_3026_1767344953230.jpg";
import tahSumPhoto8 from "@assets/IMG_1461_1767344953230.jpg";

import laxPass from "@assets/lax_1767396834515.png";
import laxPhoto1 from "@assets/IMG_3962_1767346493361.jpg";
import laxPhoto2 from "@assets/IMG_1731_1767346493361.jpg";
import laxPhoto3 from "@assets/IMG_7762_1767346493361.jpeg";
import laxPhoto4 from "@assets/5C5DB67B-1785-4684-B2A4-1A30E0B08A58_1767346493361.JPG";
import laxPhoto5 from "@assets/IMG_3019_1767346493361.jpg";

export interface PhotoMetadata {
  src: string;
  title: string;
  caption: string;
  note?: string;
}

export interface Memory {
  id: string;
  month: string;
  monthShort: string;
  year: string;
  from: string;
  to: string;
  flight: string;
  gate: string;
  seat: string;
  caption: string;
  highlights: string[];
  photos: PhotoMetadata[];
  boardingPassImage: string;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
}

export const memories: Memory[] = [
  {
    id: "sfo-icn",
    month: "January",
    monthShort: "JAN",
    year: "2025",
    from: "SFO",
    to: "ICN",
    flight: "KR625",
    gate: "G09",
    seat: "10A",
    caption: "A spontaneous 20-hour layover in Korea before heading back to the U.S. Just enough time for food, skincare, and exploring a city I always love returning to.",
    highlights: ["Layover escape", "Self care", "City energy"],
    photos: [
      { src: koreaPhoto2, title: "Street Food Night", caption: "Tteokbokki and fishcakes on a cold evening.", note: "Found this spot down a random alley. Best decision of the trip." },
      { src: koreaPhoto7, title: "Ready for Adventure", caption: "Feeling excited before exploring the city.", note: "That pre-adventure energy is the best." },
      { src: bangkokPhoto7, title: "Night Market", caption: "Exploring the vibrant Seoul night markets.", note: "The energy and colors were absolutely electric." },
      { src: koreaPhoto5, title: "Korean BBQ", caption: "Sizzling beef on the grill with all the sides.", note: "Nothing beats Korean BBQ with good company." },
      { src: koreaPhoto4, title: "Subway Reflection", caption: "Late night on the Seoul metro.", note: "The green glow of the subway at night was so atmospheric." },
      { src: koreaPhoto6, title: "Cafe Hopping", caption: "Matcha latte and burnt cheesecake at a Seoul cafe.", note: "Korea's cafe culture is unmatched." }
    ],
    boardingPassImage: incheonPass,
    rotation: -2,
    offsetX: 5,
    offsetY: 0
  },
  {
    id: "icn-bkk",
    month: "January",
    monthShort: "JAN",
    year: "2025",
    from: "ICN",
    to: "BKK",
    flight: "KR25",
    gate: "A2",
    seat: "19B",
    caption: "My yearly return to Bangkok to see family and friends. This trip was extra special with our first-ever family photoshoot.",
    highlights: ["Home", "Togetherness", "Celebration"],
    photos: [
      { src: bangkokPhoto6, title: "Cafe Moment", caption: "Peaceful afternoon at a Bangkok cafe.", note: "Found this hidden gem with the most beautiful garden view." },
      { src: bangkokPhoto4, title: "Temple Visit", caption: "Golden guardian at the temple entrance.", note: "The architecture and symbolism everywhere was mesmerizing." },
      { src: koreaPhoto3, title: "Photo Studio", caption: "Behind the scenes at a Bangkok photo shoot.", note: "Such a fun day with the crew." },
      { src: bangkokPhoto2, title: "Cloud Painting", caption: "Stunning sky artwork at the gallery.", note: "The colors reminded me of Bangkok sunsets." },
      { src: bangkokPhoto8, title: "Family Portrait", caption: "A beautiful family moment in the studio.", note: "Creating memories that last forever." },
      { src: bangkokPhoto5, title: "Thai Feast", caption: "Grilled pork and fresh spring rolls.", note: "Every meal was an adventure in flavors." },
      { src: bangkokPhoto3, title: "Traditional Dress", caption: "Beautiful Thai silk and craftsmanship.", note: "The detail in traditional Thai fashion is incredible." },
      { src: vietnamPhoto9, title: "Fresh Seafood", caption: "Delicious fresh prawns at a local restaurant.", note: "The freshest seafood I've ever had." }
    ],
    boardingPassImage: bkkPass,
    rotation: 1,
    offsetX: -3,
    offsetY: 2
  },
  {
    id: "bkk-han",
    month: "January",
    monthShort: "JAN",
    year: "2025",
    from: "BKK",
    to: "HAN",
    flight: "VT06",
    gate: "D04",
    seat: "22D",
    caption: "A weekend in Hanoi spent exploring the city with my family. We took a short trip to Sapa and found ourselves 5,200 feet up in the mountains.",
    highlights: ["Family time", "City streets", "Mountain air"],
    photos: [
      { src: vietnamPhoto8, title: "Me and my parents", caption: "My mom had been talking about coming to this place for so long and we finally got the chance to come here together!", note: "She was so happy." },
      { src: vietnamPhoto1, title: "Vietnamese Traditional Dress", caption: "Spending a quiet day by the lake in traditional Vietnamese dress.", note: "Everything felt calm, slow, and really grounding." },
      { src: vietnamPhoto5, title: "Above the Clouds", caption: "5,200 feet up in Sapa, everything felt quiet and unreal.", note: "It was like stepping into a different world for a moment." },
      { src: vietnamPhoto3, title: "Lantern Night", caption: "Hoi An's magical lantern-lit streets.", note: "The lanterns felt like floating dreams." },
      { src: vietnamPhoto6, title: "Food Tour with my Sister", caption: "Us eating Banh Mi in Viet dress is such a vibe.", note: "" },
      { src: vietnamPhoto4, title: "Morning Vibe in a Cafe", caption: "I love how Vietnam has so many cute cafes like this.", note: "I love going to cafes and just chill." },
      { src: vietnamPhoto7, title: "Night Market", caption: "The energy of a Vietnamese night market.", note: "So many smells and sounds. Sensory overload in the best way." },
      { src: vietnamPhoto2, title: "Egg Coffee", caption: "Trying egg coffee for the first time.", note: "Not sure if I like them or not but I love trying something new." }
    ],
    boardingPassImage: hanoiPass,
    rotation: -1,
    offsetX: 2,
    offsetY: -1
  },
  {
    id: "sf-gvl",
    month: "September",
    monthShort: "SEP",
    year: "2025",
    from: "SF",
    to: "GVL",
    flight: "Local",
    gate: "Walk",
    seat: "Calm",
    caption: "A short getaway to explore a calm lakeside town in Northern California. Slow walks, lunch by the lake, and small-town charm made it feel like a reset.",
    highlights: ["Slow pace", "Lake walks", "Small town"],
    photos: [
      { src: gvlPhoto1, title: "River Day", caption: "Perfect afternoon by the Russian River.", note: "The water was so calm and peaceful." },
      { src: gvlPhoto2, title: "Cabin Views", caption: "Nestled among the redwoods.", note: "Waking up to these views every morning." },
      { src: gvlPhoto3, title: "Patio Lunch", caption: "Relaxing after a morning hike.", note: "The perfect spot for people watching." },
      { src: gvlPhoto4, title: "Wine Country", caption: "Rolling hills on the drive up.", note: "Windows down, music up." },
      { src: gvlPhoto6, title: "Tree Huggers", caption: "Connecting with nature.", note: "These trees have seen so much." },
      { src: gvlPhoto5, title: "Brunch Spread", caption: "Farm fresh breakfast.", note: "Every bite was incredible." }
    ],
    boardingPassImage: gvlPass,
    rotation: -1.5,
    offsetX: 4,
    offsetY: -2
  },
  {
    id: "sf-nap",
    month: "April",
    monthShort: "APR",
    year: "2025",
    from: "SF",
    to: "NAP",
    flight: "Local",
    gate: "Drive",
    seat: "Reset",
    caption: "A relaxed trip to Napa focused on wine tasting and vineyard hopping. Slow sips and beautiful scenery made for a perfect day away.",
    highlights: ["Wine tasting", "Vineyard views", "Slow day"],
    photos: [
      { src: napaPhoto2, title: "Wine Tasting", caption: "Enjoying a glass with a view.", note: "Perfect afternoon at the chateau." },
      { src: napaPhoto1, title: "Sunset Drive", caption: "Cotton candy skies on the way to wine country.", note: "The colors were absolutely unreal." },
      { src: napaPhoto4, title: "Road Trip", caption: "Golden hour on the drive up.", note: "Windows down, music up." },
      { src: napaPhoto3, title: "Red Wine Flight", caption: "Tasting through the Pinot Noir collection.", note: "Domaine Carneros knows how to do it right." },
      { src: napaPhoto5, title: "Chateau Views", caption: "The stunning winery estate.", note: "Felt like we were in France." },
      { src: napaPhoto6, title: "Fine Dining", caption: "Beautifully plated foie gras.", note: "Every bite was a work of art." }
    ],
    boardingPassImage: napaPass,
    rotation: 0.5,
    offsetX: -2,
    offsetY: 1
  },
  {
    id: "sf-tah",
    month: "July",
    monthShort: "JUL",
    year: "2025",
    from: "SF",
    to: "TAH",
    flight: "Local",
    gate: "Stay",
    seat: "Relax",
    caption: "Tahoe in the summer is warm, bright, and effortless. Lake days, sunshine, and good company made this trip especially memorable.",
    highlights: ["Lake days", "Sunshine", "Good vibes"],
    photos: [
      { src: tahSumPhoto1, title: "Lakeside View", caption: "Soaking in the views from the rocks.", note: "Perfect spot to watch the boats go by." },
      { src: tahSumPhoto3, title: "First Glimpse", caption: "That first look at the lake from the road.", note: "The anticipation was real." },
      { src: tahSumPhoto2, title: "Rocky Profile", caption: "Enjoying the peaceful moments by the boulders.", note: "The water was so clear you could see the bottom." },
      { src: tahSumPhoto4, title: "Road Trip Vibes", caption: "Windmills on the drive up.", note: "Windows down, playlist on." },
      { src: tahSumPhoto5, title: "Crystal Waters", caption: "Relaxing on the granite boulders.", note: "The water sparkled like diamonds." },
      { src: tahSumPhoto6, title: "Ouch! That hurt a little.", caption: "Got some scratches from the rocks because I jumped too early.", note: "It was painful a little haha." },
      { src: tahSumPhoto7, title: "Boulder Hangs", caption: "Living our best lake life.", note: "Found the perfect photo spot." },
      { src: tahSumPhoto8, title: "Summer Selfie", caption: "Sun-kissed and happy.", note: "Best day at the lake." }
    ],
    boardingPassImage: tahoePass,
    rotation: -0.5,
    offsetX: 1,
    offsetY: 0
  },
  {
    id: "sf-yose",
    month: "July",
    monthShort: "JUL",
    year: "2025",
    from: "SF",
    to: "YOSE",
    flight: "Local",
    gate: "Stay",
    seat: "Relax",
    caption: "A quiet 28th birthday escape into Yosemite, away from the noise. Being surrounded by nature made the trip feel grounding and deeply refreshing.",
    highlights: ["Stillness", "Nature", "Reset"],
    photos: [
      { src: yosePhoto1, title: "Bike Adventure", caption: "Cruising through the valley on two wheels.", note: "Best way to explore Yosemite." },
      { src: yosePhoto4, title: "Waterfall Vista", caption: "Nevada Fall cascading down the cliffs.", note: "The mist was so refreshing." },
      { src: yosePhoto7, title: "Dining Room Views", caption: "Lunch with a view at the Ahwahnee.", note: "The mountains through those windows." },
      { src: yosePhoto6, title: "Merced River", caption: "Crystal clear waters with Half Dome peeking through.", note: "Stopped here for a picnic." },
      { src: yosePhoto5, title: "Valley Ride", caption: "Sunny day biking through the trees.", note: "Perfect weather for exploring." },
      { src: yosePhoto9, title: "Yurt Stay", caption: "Cozy glamping near the park.", note: "Fell asleep watching the stars through the skylight." },
      { src: yosePhoto10, title: "Valley Sunset", caption: "Sun breaking through the clouds over Half Dome.", note: "Mother nature putting on a show." },
      { src: yosePhoto11, title: "Lodge Interior", caption: "Rustic elegance inside the Ahwahnee.", note: "The details and craftsmanship were incredible." },
      { src: yosePhoto12, title: "Rock Painting", caption: "Getting creative with painted rocks.", note: "A little art project souvenir." }
    ],
    boardingPassImage: yosemitePass,
    rotation: 1.5,
    offsetX: -1,
    offsetY: 2
  },
  {
    id: "sf-tah-winter",
    month: "December",
    monthShort: "DEC",
    year: "2025",
    from: "SF",
    to: "TAH",
    flight: "Local",
    gate: "Stay",
    seat: "Relax",
    caption: "Winter in Tahoe feels magical every time. Snowboarding with friends and crisp mountain air always help me feel restored.",
    highlights: ["Snow days", "Mountain air", "Healing"],
    photos: [
      { src: tahoePhoto5, title: "Snowboarding Heals my Heart", caption: "Snowboarding is a challenge I love.", note: "It is all about mindset, whether you think you can do it or not." },
      { src: tahoePhoto1, title: "Winter Wonderland", caption: "Seeing the view from the slopes makes me so happy.", note: "Always love to go back to Northstar." },
      { src: tahoePhoto3, title: "My Little Guy", caption: "My masterpiece so far in making this little snowman." },
      { src: tahoePhoto4, title: "After Snowstorm", caption: "This is what happened after the snowstorm.", note: "We were stuck at the cvs cus snowstorm was crazy." },
      { src: tahoePhoto8, title: "Day 1 of the season!", caption: "I was so excited to snowboard again!!" },
      { src: tahoePhoto2, title: "White dog & white beach", caption: "This is our friend's dog, Loki. We took him for a snowy walk in the morning and he loved it!" },
      { src: tahoePhoto9, title: "The View at Northstar", caption: "Seeing this such beautiful view after snowboarding felt so satisfying." },
      { src: tahoePhoto10, title: "Sunset on our way back", caption: "The sunset on our drive back home was UNREAL!", note: "Probably the best sunset I've ever seen" }
    ],
    boardingPassImage: tahoeWinterPass,
    rotation: -1,
    offsetX: 3,
    offsetY: -1
  },
  {
    id: "sfo-lax",
    month: "January",
    monthShort: "JAN",
    year: "2025",
    from: "SFO",
    to: "LAX",
    flight: "AL24",
    gate: "E08",
    seat: "11D",
    caption: "A quick trip to LA to spend time with a close friend. Beach walks, city views, and great food made it feel full despite the short stay.",
    highlights: ["Friendship", "Beach days", "City views"],
    photos: [
      { src: laxPhoto1, title: "Downtown Night", caption: "City lights and good company.", note: "The energy of LA at night is something else." },
      { src: laxPhoto2, title: "Observatory Pendulum", caption: "Mesmerized by the Foucault pendulum.", note: "Science meets art at Griffith." },
      { src: laxPhoto3, title: "City Views", caption: "LA sprawling beneath the observatory.", note: "Could see all the way to the ocean." },
      { src: laxPhoto4, title: "Beach Day", caption: "Classic California coastline.", note: "Palm trees and perfect waves." },
      { src: laxPhoto5, title: "Street Style", caption: "Exploring the neighborhoods.", note: "Found so many cool spots." }
    ],
    boardingPassImage: laxPass,
    rotation: 0.5,
    offsetX: -1,
    offsetY: 1
  },
];
