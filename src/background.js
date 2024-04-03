const socket = require("socket.io-client");
const socketConnection = socket.io("http://localhost:3001");

chrome.tabs.onCreated.addListener((tab) => {
  // Send opened tab URL to the server
  console.log("This is invoked");
  console.log("Tab", tab);
  console.log(tab.url);
  socketConnection.emit("tabOpened", tab.url);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    // Check if the tab has finished loading and is currently active
    console.log("This is invoked");
    console.log("Tab Updated", tab);
    console.log("Tab URL:", tab.url);
    // Send the URL to the server
  }
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Send closed tab ID to the server
  socketConnection.emit("tabClosed", tabId);
});
