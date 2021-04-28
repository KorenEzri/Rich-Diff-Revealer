// This file is injected as a content script
 const enableAutomaticRichDiffs = () => {
    const allRelevantButtons = document.getElementsByClassName("btn btn-sm BtnGroup-item tooltipped tooltipped-w rendered js-rendered")
    Array.from(allRelevantButtons).forEach(button => {
    if (button instanceof HTMLElement) {
        button.click()
    }
    })
}
window.addEventListener("blur", enableAutomaticRichDiffs)

enableAutomaticRichDiffs()