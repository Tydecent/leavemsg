// 页面加载时获取留言
document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
    
    // 表单提交事件
    document.getElementById('messageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitMessage();
    });
    
    // 匿名复选框逻辑
    document.getElementById('anonymous').addEventListener('change', function() {
        const nameInput = document.getElementById('name');
        if (this.checked) {
            nameInput.disabled = true;
            nameInput.value = "";
            nameInput.placeholder = "匿名用户";
        } else {
            nameInput.disabled = false;
            nameInput.placeholder = "输入您的名字";
        }
    });
});

// 获取留言
async function fetchMessages() {
    try {
        const response = await fetch('/messages');
        if (!response.ok) {
            throw new Error('获取留言失败');
        }
        let messages = await response.json();
        // 反转数组使最新留言显示在最前面
        messages.reverse();
        renderMessages(messages);
    } catch (error) {
        console.error('获取留言失败:', error);
        document.getElementById('messageList').innerHTML = `
            <div class="empty-message">
                无法加载留言，请稍后再试
            </div>
        `;
    }
}

// 提交留言
async function submitMessage() {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const isAnonymous = document.getElementById('anonymous').checked;
    
    // 处理匿名选项
    const name = isAnonymous ? "" : nameInput.value.trim();
    const content = messageInput.value.trim();
    
    if (!content) {
        alert('请输入留言内容');
        return;
    }

    if (name == "网站开发者") {
        /*那些打败不了你的，终会使你更加强大*/
        alert('???竟然想谋权篡位?');
        return;
    }

    if (name == "蝗虫") {
        return;
    }

    if (name == "屁水" || name == "豪猪" || name == "痞帅" || name == "豪猪男") {
        alert('善语结善缘，恶语伤人心，拒绝网络暴力')
        return;
    }
    
    try {
        // 使用URLSearchParams创建表单数据
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('content', content);
        
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('留言提交失败');
        }
        
        // 清空表单
        // nameInput.value = '';
        messageInput.value = '';
        document.getElementById('anonymous').checked = false;
        nameInput.disabled = false;
        nameInput.placeholder = "输入您的名字";
        
        // 重新获取留言
        fetchMessages();
        
        // 显示成功消息
        const btn = document.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-parachute-box"></i> 留言已发布';
        btn.style.backgroundColor = '#4ade80';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
        }, 3000);

        location.reload(true);   
        
    } catch (error) {
        console.error('提交留言失败:', error);
        alert('提交留言时出错');
    }
}

// 渲染留言
function renderMessages(messages) {
    const messageList = document.getElementById('messageList');
    
    if (messages.length === 0) {
        messageList.innerHTML = '<div class="empty-message">暂无留言，成为第一个留言者吧！</div>';
        return;
    }
    
    messageList.innerHTML = messages.map(message => {
        // 处理匿名用户显示
        const isAnonymous = !message.name || message.name === '匿名用户';
        const displayName = isAnonymous ? '匿名用户' : message.name;
        
        // 格式化时间戳
        const timestamp = message.timestamp ? 
            new Date(message.timestamp).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : '未知时间';
        
        return `
            <div class="message">
                <div class="message-header">
                    <div class="author ${isAnonymous ? 'anonymous' : ''}"><i class="fa-solid fa-user"></i> ${displayName}</div>
                    <div class="timestamp"><i class="fa-solid fa-calendar-days"></i>${timestamp}</div>
                </div>
                <div class="message-content">
                    <html>
                        ${message.content}
                    </html>
                </div>
            </div>
        `;
    }).join('');
}
// <div class="message-content">${escapeHtml(message.content)}</div>

// 防止XSS攻击的HTML转义函数
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}