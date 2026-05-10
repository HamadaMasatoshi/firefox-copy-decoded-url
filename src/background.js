const MENU_ID = "copy-decoded-link";

// 初始化右键菜单
async function setupContextMenu() {
  const result = await browser.storage.local.get({ showContextMenu: true });
  
  // 先尝试移除，防止重复创建报错
  await browser.contextMenus.removeAll();

  if (result.showContextMenu) {
    browser.contextMenus.create({
      id: MENU_ID,
      title: "Copy Decoded URL",
      contexts: ["link"]
    });
  }
}

// 监听安装或启动
browser.runtime.onInstalled.addListener(setupContextMenu);
browser.runtime.onStartup.addListener(setupContextMenu);

// 监听配置变化
browser.storage.onChanged.addListener((changes) => {
  if (changes.showContextMenu) {
    setupContextMenu();
  }
});

// 工具栏按钮功能保持不变
browser.action.onClicked.addListener(async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const url = tabs[0].url;
  const decodedUrl = decodeURIComponent(url);
  await navigator.clipboard.writeText(decodedUrl);
});

// 监听右键点击
browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === MENU_ID) {
    try {
      const decodedUrl = decodeURIComponent(info.linkUrl);
      navigator.clipboard.writeText(decodedUrl);
    } catch (e) {
      console.error("Failed to decode URL:", e);
    }
  }
});
