

import {
    DOMParser,
    Element,
  } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
  
  async function getList(curPage = 1) {
    let wallpaperItems= [];
    const res = await fetch(`${ORIGIN_URL}?p=${curPage}`);
    const { status, statusText } = res;
    if (status === STATUS_CODE.OK) {
      const rawData = await res.text();
      const doc = new DOMParser().parseFromString(rawData, "text/html");
  
      const body = doc?.querySelector("body");
      const items = body?.querySelectorAll(".item");
      if (items) {
        wallpaperItems = Array.from(items).map((item) => {
          // <Element> for bug: https://github.com/b-fuze/deno-dom/issues/4
          const descriptionEl = (<Element> item).querySelector(
            ".description h3",
          );
          const dateEl = (<Element> item).querySelector(
            ".description .calendar .t",
          );
          const mark = (<Element> item).querySelector(".mark");
          const path = mark?.attributes.href;
          const imgName = path?.substring(
            path.lastIndexOf("/") + 1,
            path.lastIndexOf("?"),
          );
  
          const wallpaperItem: WallpaperItem = {
            name: imgName,
            description: descriptionEl?.textContent,
            date: dateEl?.textContent,
            url: `https://cn.bing.com/th?id=OHR.${imgName}_UHD.jpg`,
          };
  
          return wallpaperItem;
        });
      }
    } else {
      console.log(`${status}: ${statusText}`);
    }
  
    return wallpaperItems;
  }
  


  export async function saveFile(
  node: WallpaperItem,
  saveDir = DEFAULT_FILE_SAVE_DIR,
) {
  const { name, date, url } = node;
  const res = await fetch(url);
  const { status, statusText } = res;
  if (status === STATUS_CODE.OK) {
    const img = await res.arrayBuffer();
    const ext = url.substring(url.lastIndexOf("."));

    Deno.mkdirSync(saveDir, { recursive: true });
    Deno.writeFileSync(
      `${saveDir}/[${date}]${name}${ext}`,
      new Uint8Array(img),
    );
  } else {
    console.log(`${status}: ${statusText}`);
  }
}



export async function getPageCount(): Promise<number> {
  const res = await fetch(`${ORIGIN_URL}`);
  const { status, statusText } = res;
  if (status === STATUS_CODE.OK) {
    const rawData = await res.text();
    const doc = new DOMParser().parseFromString(rawData, "text/html");

    const body = doc?.querySelector("body");
    const pager = body?.querySelector(".page span");
    const pagerTextContent = pager?.textContent || "";
    const [, pageCount = "0"] = pagerTextContent.split("/");

    return parseInt(pageCount);
  } else {
    console.log(`${status}: ${statusText}`);
    return 0;
  }
}




export async function getAll(): Promise<Array<WallpaperItem>> {
    let allWallpaperItems = [];
    const pageCount = await getPageCount();
    if (pageCount > 0) {
      const queue = new Array(pageCount).fill(undefined).map((val, index) =>
        index + 1
      ).map((curPage) => getList(curPage));
  
      let i = 0;
      const timeout = (item: Promise<unknown>, array: Array<unknown>) => {
        const time = Math.random() + 0.5;
        console.log(array.length, ++i);
        return new Promise((resolve) => setTimeout(() => resolve(item), time));
      };
      const group = await asyncPool(
        REQUEST_CONCURRENCY_LIMIT,
        queue,
        timeout,
      );
  
      allWallpaperItems = (<Array<WallpaperItem>> []).concat(
        ...(<Array<Array<WallpaperItem>>> group),
      );
  
      setCache(allWallpaperItems);
    } else {
      allWallpaperItems = getCache();
    }
  
    return allWallpaperItems;
  }
  


  function setCache(data: Array<WallpaperItem>) {
    Deno.writeTextFile("./cache.json", JSON.stringify(data, null, 2));
  }
 