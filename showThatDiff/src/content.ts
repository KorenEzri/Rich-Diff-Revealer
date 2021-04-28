// This file is injected as a content script
export const enableAutomaticRichDiffs = () => {
    console.log("IN AUTO RICHDIFS")
    const allRelevantButtons = document.getElementsByClassName("btn btn-sm BtnGroup-item tooltipped tooltipped-w rendered js-rendered")
    Array.from(allRelevantButtons).forEach(button => {
    if (button instanceof HTMLElement) {
        button.click()
    }
    })
}
