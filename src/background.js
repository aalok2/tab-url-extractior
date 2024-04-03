import io from "socket.io-client";

const socket = io("http://localhost:3001", {
  debug: true,
  transports: ["websocket"],
});

// socket.on("connect", () => {
//   console.log("Connected to server");
// });
socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});
chrome.tabs.onCreated.addListener((tab) => {
  // Send opened tab URL to the server
  console.log("This is invoked");
  console.log("Tab", tab);
  console.log(tab.url);
  console.log("Socket", socket);
  console.log("Connected Socket", socket);
  socket.emit("tabOpened", tab.url);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    // Check if the tab has finished loading and is currently active
    console.log("This is invoked");
    console.log("Tab Updated", tab);
    console.log("Tab URL:", tab.url);
    socket.emit("tabUpdated", tab.url);
    // Send the URL to the server
  }
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Send closed tab ID to the server
  socket.emit("tabClosed", tabId);
});
// const socket = io("http://localhost:3001");

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "sendURL") {
//     socket.emit("tabOpened", message.url);
//   }
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.active) {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const activeTab = tabs[0];
//       if (activeTab) {
//         chrome.tabs.sendMessage(activeTab.id, {
//           action: "getURL",
//           url: activeTab.url,
//         });
//       }
//     });
//   }
// });

// // Background script
// chrome.runtime.onConnect.addListener((port) => {
//   port.onMessage.addListener((msg) => {
//     if (msg.action === "sendURL") {
//       socket.emit("tabUpdated", msg.url);
//     }
//   });
// });
