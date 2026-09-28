/** Tutorial list shown on /tutorial. Covers are preloaded at app start. */
import { REMOTE_IMAGES } from "@/lib/remoteImages";
export type Tutorial = {
  title: string;
  date: string;
  url: string;
  cover: string;
};

export const TUTORIALS: Tutorial[] = [
  {
    title: '【Hindi Version】 USDT Earning Tricks step by step guide',
    date: '2026-09-10 16:12:12',
    url: 'https://youtu.be/9lL8ojTGXWg?si=kSipZohmmfEtixLx',
    cover: REMOTE_IMAGES["https://i.ibb.co/8DX0kBGF/file-00000000a1f48208bba6dbd73d1f24fc.png"],
  },
  {
    title: '【Hindi Version】 How to buy USDT inside Binance',
    date: '2026-09-10 13:45:54',
    url: 'https://youtu.be/smG4a4iI4Sc?si=n4wjqENa3M6GFehI',
    cover: REMOTE_IMAGES["https://i.ibb.co/ksnDtftF/file-0000000042908211887a79a020852c5b.png"],
  },
  {
    title: '【Hindi Version】 HK Deposit USDT Tutorial',
    date: '2026-09-10 13:01:16',
    url: 'https://youtu.be/CMdPx_uUgXo?si=pSYhghJlKhcplUdR',
    cover: REMOTE_IMAGES["https://i.ibb.co/mFch9Mgc/file-00000000c7008211b2f45601a80e1865.png"],
  },
  {
    title: '【English Version】 HK Deposit USDT Tutorial',
    date: '2026-09-09 13:31:52',
    url: 'https://youtube.com/shorts/ff4fXwbQ1xw?si=upRgkoMZS8UL6Tc4',
    cover: REMOTE_IMAGES["https://i.ibb.co/mFch9Mgc/file-00000000c7008211b2f45601a80e1865.png"],
  },
];

export const TUTORIAL_COVERS = TUTORIALS.map((item) => item.cover);
