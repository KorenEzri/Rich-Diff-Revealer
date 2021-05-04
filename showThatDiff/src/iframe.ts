// import { getAndClickRichDiffBtns } from "./content-utils";

// const observerCallback = (mutationList: any[], observer: any) => {
//   mutationList.forEach((mutation) => {
//     switch (mutation.type) {
//       case "childList":
//         break;
//       case "attributes":
//         const allControlButtons = document.getElementsByClassName(
//           "js-view-mode-item"
//         )[0];
//         console.log(mutation.target);
//         if (
//           mutation.target.classList.contains("js-dragger") &&
//           !allControlButtons
//         ) {
//           setTimeout(() => {
//             getAndClickRichDiffBtns();
//           }, 400);
//         }
//         break;
//     }
//   });
// };

// const observerOptions = {
//   childList: true,
//   attributes: true,
//   subtree: true,
// };
// const observer = new MutationObserver(observerCallback);
// try {
//   observer.observe(document, observerOptions);
// } catch ({ message }) {
//   console.log(message);
// }
