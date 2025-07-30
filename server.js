const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const { text } = require('body-parser');

const PORT = 12001;
const MESSAGE_FILE = 'messages.json';

// 确保消息文件存在
if (!fs.existsSync(MESSAGE_FILE)) {
  fs.writeFileSync(MESSAGE_FILE, '[]', 'utf-8');
}

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);
  const pathname = reqUrl.pathname;

  // 处理静态文件请求
  if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile(res, '/index.html', 'text/html');
  } else if (pathname === '/style.css') {
    serveStaticFile(res, '/style.css', 'text/css');
  } else if (pathname === '/script.js') {
    serveStaticFile(res, '/script.js', 'text/js')
  }else if (pathname === '/robots.txt') {
    serveStaticFile(res, '/robots.txt', 'robots.txt');
  }
  
  // 获取留言
  else if (pathname === '/messages' && req.method === 'GET') {
    getMessages(res);
  }
  
  // 提交留言
  else if (pathname === '/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const postData = querystring.parse(body);
      addMessage(postData, res);
    });
  }
  
  // 404处理
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('No God Please No!');
  }
});

// 提供静态文件
function serveStaticFile(res, filePath, contentType) {
  const fullPath = path.join(__dirname, 'public', filePath);
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
      return;
    }
    
    res.writeHead(200, {'Content-Type': contentType});
    res.end(data);
  });
}

// 获取留言
function getMessages(res) {
  fs.readFile(MESSAGE_FILE, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: '无法读取留言数据'}));
      return;
    }
    
    try {
      const messages = JSON.parse(data);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(messages));
    } catch (e) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: '留言数据解析错误'}));
    }
  });
}

// 添加留言
function addMessage(postData, res) {
  const name = postData.name || '匿名用户';
  const content = postData.content;
  
  if (!content) {
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: '留言内容不能为空'}));
    return;
  }
  
  const newMessage = {
    id: Date.now(),
    name: name,
    content: content,
    timestamp: new Date().toISOString()
  };
  
  fs.readFile(MESSAGE_FILE, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: '无法读取留言数据'}));
      return;
    }
    
    try {
      const messages = JSON.parse(data);
      messages.push(newMessage);
      
      fs.writeFile(MESSAGE_FILE, JSON.stringify(messages, null, 2), (err) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({error: '无法保存留言'}));
          return;
        }
        
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: true, message: newMessage}));
      });
    } catch (e) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: '留言数据解析错误'}));
    }
  });
}

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});