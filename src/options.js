const checkbox = document.querySelector("#showContextMenu");

// 加载初始值
browser.storage.local.get({ showContextMenu: true }).then((result) => {
  checkbox.checked = result.showContextMenu;
});

// 保存改动
checkbox.addEventListener("change", (e) => {
  browser.storage.local.set({
    showContextMenu: e.target.checked
  });
});
