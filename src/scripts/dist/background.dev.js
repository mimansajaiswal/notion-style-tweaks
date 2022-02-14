"use strict";

var _webextensionPolyfill = _interopRequireDefault(require("webextension-polyfill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    global: {}
  });
  chrome.storage.local.set({
    local: {}
  });
  chrome.storage.local.set({
    settings: {
      darkMode: true
    }
  });
  chrome.storage.local.set({
    meta: {
      activePage: "",
      scopeMode: "global"
    }
  });
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(tab);
  var uuid;

  if (tab.url.lastIndexOf("-") != -1) {
    uuid = tab.url.substring(tab.url.lastIndexOf("-") + 1);
  } else {
    uuid = tab.url.substring(tab.url.lastIndexOf("/") + 1).substring(0, 32);
  }

  var activePage = {
    title: tab.title,
    uuid: uuid,
    icon: tab.favIconUrl,
    tabid: tab.id
  };
  var meta = {};
  chrome.storage.local.get("meta", function (data) {
    Object.assign(meta, data.meta);
    meta.activePage = activePage;
    chrome.storage.local.set({
      meta: meta
    });
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["build/update.js"]
    });
    chrome.scripting.insertCSS({
      target: {
        tabId: tab.id
      },
      files: ["stylesheets/themes/CSS/theme.css"]
    });
  });
  var local = {};
  chrome.storage.local.get("local", function (data) {
    Object.assign(local, data.local);

    if (local[uuid] == undefined) {
      local[uuid] = {};
    }

    chrome.storage.local.set({
      local: local
    });
  });
  console.log("tab updated");
});