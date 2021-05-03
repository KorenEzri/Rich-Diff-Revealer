import { compareImages } from "./content-utils";

let addedImage: HTMLImageElement | Element | null;
let deletedImage: HTMLImageElement | Element | null;

const showDiffImage = () => {
  addedImage = document.getElementsByClassName("added asset")[0];
  deletedImage = document.getElementsByClassName("deleted asset")[0];
  try {
    console.log(addedImage, deletedImage);
    if (
      addedImage instanceof HTMLImageElement &&
      deletedImage instanceof HTMLImageElement
    ) {
      compareImages(addedImage, deletedImage);
    }
  } catch ({ meesage }) {
    console.log(meesage);
  }
};
window.addEventListener("DOMContentLoaded", showDiffImage);
