/* static/js/copy-tex.js */

window.addEventListener('load', function() {
  // 1. 检查 MathJax 是否存在 (基于 MathJax 2.x，Even 主题默认版本)
  if (typeof MathJax === 'undefined') return;

  // 2. 等待 MathJax 渲染队列完成
  MathJax.Hub.Queue(function () {
    
    // 获取所有 MathJax 的脚本标签 (它们存储了公式数据)
    var jaxScripts = MathJax.Hub.getAllJax();
    
    jaxScripts.forEach(function(jax) {
      // 获取对应的 DOM 元素 (即页面上显示的公式)
      var element = document.getElementById(jax.inputID + "-Frame");
      
      if (!element) return;

      // 3. 设置鼠标样式为“手指”，提示可点击
      element.style.cursor = "pointer";
      element.title = "点击复制 LaTeX 代码";
      
      // 4. 绑定点击事件
      element.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止默认行为（防止触发 MathJax 放大等）
        
        // 核心：获取原始 LaTeX 源码
        var sourceText = jax.originalText;
        
        // 判断是行内公式($)还是块级公式($$)，自动补全美元符号
        if (jax.root.Get("display")) {
           // 如果是块级公式 (Display Mode)
           sourceText = "$$\n" + sourceText + "\n$$";
        } else {
           // 如果是行内公式 (Inline Mode)
           sourceText = "$" + sourceText + "$";
        }

        // 5. 写入剪贴板
        navigator.clipboard.writeText(sourceText).then(function() {
          showToast("LaTeX 已复制!", e.pageX, e.pageY);
        }).catch(function(err) {
          console.error('无法复制: ', err);
          showToast("复制失败，请手动复制", e.pageX, e.pageY);
        });
      });
    });
  });
});

// --- 辅助函数：创建一个简单的提示气泡 (Toast) ---
function showToast(message, x, y) {
  var toast = document.createElement("div");
  toast.innerText = message;
  toast.className = "latex-copy-toast";
  
  // 设置位置 (跟随鼠标点击位置)
  toast.style.left = x + "px";
  toast.style.top = (y - 30) + "px"; // 显示在鼠标上方一点
  
  document.body.appendChild(toast);

  // 动画：淡入 -> 停留 -> 淡出
  setTimeout(function() {
    toast.style.opacity = "0";
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 500);
  }, 1000);
}