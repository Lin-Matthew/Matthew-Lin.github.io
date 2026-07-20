document.addEventListener('DOMContentLoaded', () => {
    // ==== 1. 复制代码块功能 ====
    document.querySelectorAll('.highlight').forEach((codeBlock) => {
        if (codeBlock.querySelector('.copy-code-button')) return; // 避免重复添加
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.type = 'button';
        copyButton.innerText = '复制';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '5px';
        copyButton.style.right = '10px';
        copyButton.style.zIndex = '2';
        codeBlock.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const code = codeBlock.querySelector('pre code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerText = '已复制!';
                setTimeout(() => { copyButton.innerText = '复制'; }, 2000);
            });
        });
    });

    // ==== 2. 自动化图片放大外壳包裹功能 ====
    const images = document.querySelectorAll('.post-content img, article img, .article-style img');
    
    images.forEach((img, index) => {
        // 如果图片外面已经有 <a> 标签链接了，说明套过了，直接跳过
        if (img.parentElement.tagName === 'A') return;

        // 创建 Lightbox 所需的 a 标签外壳
        const wrapper = document.createElement('a');
        const imgSrc = img.getAttribute('src');
        
        wrapper.setAttribute('href', imgSrc);
        // 💡 关键修改：用不同的 index 让每张图独立成组，防止点击直接跳到下一张
        wrapper.setAttribute('data-lightbox', `image-group-${index}`); 
        wrapper.setAttribute('data-title', img.getAttribute('alt') || `图片 ${index + 1}`); 

        // 把 a 标签插入到图片前面，然后把图片塞进 a 标签内部
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });
});