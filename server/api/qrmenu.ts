import type { QrmenuData } from "~/types/qrmenu";
import QrmenuRawData from "public/qrmenus.json";

export default defineEventHandler((event) => {
  const data = getQuery(event);

  if (data["id"]) {
    const qrData = (QrmenuRawData as QrmenuData[]).find(
      (qr) => qr.id == data["id"]
    );

    const device = getMobileOperatingSystem(
      event.headers.get("user-agent") ?? ""
    );
    console.log(device);

    if (qrData === undefined) {
      return "404";
    }

    const link = qrData.url;

    if (device == devices.Apple) {
      sendRedirect(
        event,
        `googledrive://${link}/view?usp=drive_link&usp=drive_link`,
        302
      );
    } else if (device == devices.Android) {
      sendRedirect(
        event,
        `intent://${link}/view?usp=drive_link#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;end`,
        302
      );
    } else {
      fallbackRedirect(event, link);
    }
  } else {
    return `404`;
  }
});

function fallbackRedirect(event: any, link: String) {
  sendRedirect(event, `https://${link}/view?usp=drive_link`, 302);
}

enum devices {
  Android,
  Apple,
  Unknown,
}

function getMobileOperatingSystem(userAgent: string) {
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return devices.Unknown;
  }
  if (/android/i.test(userAgent)) {
    return devices.Android;
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return devices.Apple;
  }
  return devices.Unknown;
}
