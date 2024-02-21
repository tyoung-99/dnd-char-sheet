import fs from "fs";
import { readFile } from "fs/promises";

export const getImg = async (id) => {
  let imgList = fs.readdirSync("./img/");
  imgList = imgList.map((fileName) => {
    const split = fileName.lastIndexOf(".");
    return [fileName.slice(0, split), fileName.slice(split)];
  });
  for (const file of imgList) {
    if (file[0] === id) {
      return await readFile(`img/${file[0]}${file[1]}`);
    }
  }
};

export const removeImg = async (id) => {
  let imgList = fs.readdirSync("./img/");
  imgList = imgList.map((fileName) => {
    const split = fileName.lastIndexOf(".");
    return [fileName.slice(0, split), fileName.slice(split)];
  });
  for (const file of imgList) {
    if (file[0] === id) {
      await unlink(`img/${file[0]}${file[1]}`);
    }
  }
};
