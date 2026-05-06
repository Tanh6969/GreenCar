import vwId4      from "../assets/images/VW ID.4.png";
import fordMache   from "../assets/images/Ford Mach-E.png";
import ioniq5      from "../assets/images/Hyundai Ioniq 5.png";
import teslaM3     from "../assets/images/Tesla Model 3.png";
import polestar2   from "../assets/images/Polestar 2.png";
import lucidPure   from "../assets/images/Lucid Air Pure.png";
import rivianR1S   from "../assets/images/Rivian R1S.png";
import audiEtron   from "../assets/images/Audi e-tron GT.png";
import luxurySed   from "../assets/images/Luxury electric sedan.png";
import electricSuv from "../assets/images/Electric SUV.png";
import modernEv    from "../assets/images/Modern electric vehicle.png";
import lucidDream  from "../assets/images/Lucid Air Dream.png";
import lucidAir    from "../assets/images/Lucid Air.png";

export const MODEL_LOCAL_IMAGES: Record<number, string> = {
  1:  electricSuv, // VinFast VF e34    (compact SUV)
  2:  luxurySed,   // Hyundai Accent EV (sedan)
  3:  vwId4,       // VW ID.4
  4:  fordMache,   // Ford Mach-E
  5:  ioniq5,      // Hyundai IONIQ 5
  6:  polestar2,   // Hyundai IONIQ 6   (aerodynamic fastback – similar silhouette)
  7:  modernEv,    // VinFast VF 8
  8:  teslaM3,     // Tesla Model 3
  9:  luxurySed,   // Tesla Model S
  10: electricSuv, // Tesla Model X
  11: polestar2,   // Polestar 2
  12: audiEtron,   // Audi e-tron GT
  13: lucidPure,   // Lucid Air Pure
  14: rivianR1S,   // Rivian R1S
  15: modernEv,    // VinFast VF 9
};

export const PREMIUM_IMAGES = { lucidDream, rivianR1S, lucidAir };
