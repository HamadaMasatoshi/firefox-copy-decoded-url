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

// 工具栏按钮功能：直接利用传进来的 tab 对象
browser.action.onClicked.addListener(async (tab) => {
  // 调试信息：如果这里还打印 undefined，说明 manifest 权限没生效
  console.log("Current tab URL:", tab.url);

  if (tab.url) {
    try {
      const decodedUrl = decodeURIComponent(tab.url);
      await navigator.clipboard.writeText(decodedUrl);
      
      // 可选：添加一个简单的通知，确认复制成功
      console.log("URL copied!");
    } catch (e) {
      console.error("Failed to copy/decode URL:", e);
    }
  } else {
    console.error("No URL found. Check 'activeTab' permission.");
  }
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
