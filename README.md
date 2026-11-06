# Solar System Observatory

Responsive static astronomy application modeled on Sun & Moon Observatory, featuring the Sun, Moon, and Mercury through Neptune. No antipodal section.

## Features
- Interactive 24-hour altitude curves and selectable celestial bodies
- Rise, highest-altitude time, set, and daily above-horizon duration
- Sun/Moon shared-sky time
- Planetary horizon and daylight/twilight/night status
- 5-, 10-, 30-day outlook
- Lunar phase, illuminated fraction, approximate moon age
- GPS, manual coordinates, collapsible panels, mobile-friendly dark interface

## Deploy
In GitHub, choose Settings → Pages → Deploy from a branch → main → /(root). The app is served from `index.html` and requires an internet connection to load Astronomy Engine from jsDelivr.

## Accuracy
Astronomy Engine provides analytical planetary ephemerides. Horizon crossings are calculated locally using 5-minute sampling and bisection. Solar rise/set uses a −0.833° threshold; other bodies use geometric altitude 0°. The displayed transit is the daily maximum altitude, which may differ from a true meridian transit. Rise/set and outlook dates use the device timezone, even for remote manual coordinates. The app does not account for local terrain or all atmospheric effects. Above-horizon does not guarantee visible to the eye. Not for navigation.

The original Sun & Moon repository is unchanged.
