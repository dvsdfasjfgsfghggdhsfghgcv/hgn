/**
 * SendCloud邮件服务
 * 处理邮箱验证、发送验证码等功能
 */

// SendCloud配置（实际使用时需替换为真实的API key和用户名）
const SENDCLOUD_CONFIG = {
    apiUser: 'vdsgfbdgfs',
    apiKey: '74e8e468e3001bc25a5b4cb4b717e6d4',
    from: 'youxi@dsccs.ip-ddns.com', // 修改为正确的邮箱格式
    fromName: '游戏平台'
};

/**
 * 发送验证码邮件
 * @param {string} to 收件人邮箱
 * @param {string} code 验证码
 * @returns {Promise<object>} 发送结果
 */
async function sendVerificationEmail(to, code) {
    // 邮件主题
    const subject = '游戏平台 - 邮箱验证码';

    // 邮件内容（HTML格式）
    const html = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background-color: #4CAF50; color: white; padding: 10px; text-align: center;">
                <h2>游戏平台 - 邮箱验证</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                <p>您好！</p>
                <p>感谢您注册我们的游戏平台。以下是您的验证码：</p>
                <div style="margin: 20px 0; padding: 10px; background-color: #f5f5f5; font-size: 24px; text-align: center; letter-spacing: 5px;">
                    ${code}
                </div>
                <p>验证码有效期为10分钟，请尽快完成验证。</p>
                <p>如果这不是您的操作，请忽略此邮件。</p>
                <p>祝您游戏愉快！</p>
            </div>
            <div style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
                <p>此邮件由系统自动发送，请勿回复。</p>
            </div>
        </div>
    `;

    // 输出日志，便于调试
    console.log(`准备发送邮件到: ${to}, 验证码: ${code}`);
    console.log(`使用API用户名: ${SENDCLOUD_CONFIG.apiUser}`);

    // 构建发送请求参数
    const data = new FormData();
    data.append('apiUser', SENDCLOUD_CONFIG.apiUser);
    data.append('apiKey', SENDCLOUD_CONFIG.apiKey);
    data.append('from', SENDCLOUD_CONFIG.from);
    data.append('fromName', SENDCLOUD_CONFIG.fromName);
    data.append('to', to);
    data.append('subject', subject);
    data.append('html', html);

    try {
        // 调用SendCloud API
        console.log('开始调用SendCloud API...');
        const response = await fetch('https://api.sendcloud.net/apiv2/mail/send', {
            method: 'POST',
            body: data
        });

        // 解析响应
        console.log('收到API响应...');
        const result = await response.json();
        console.log('API响应结果:', result);

        // 返回发送结果
        if (result.result === true || result.statusCode === 200) {
            return {
                success: true,
                message: '验证码发送成功',
                data: result
            };
        } else {
            return {
                success: false,
                message: result.message || '发送失败',
                data: result
            };
        }
    } catch (error) {
        console.error('发送邮件失败:', error);
        return {
            success: false,
            message: '发送失败: ' + error.message,
            error
        };
    }
}

/**
 * 在前端使用的模拟发送函数
 * 由于浏览器端可能没有直接访问SendCloud API的权限，
 * 实际项目中应将此逻辑放在服务器端处理
 * @param {string} email 收件人邮箱
 * @param {string} code 验证码
 * @returns {object} 发送结果
 */
function mockSendVerification(email, code) {
    // 在实际项目中，这里应该是一个向后端API发送请求的函数
    console.log(`[模拟] 向 ${email} 发送验证码: ${code}`);

    // 模拟API调用延迟
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                message: '验证码发送成功（模拟）'
            });
        }, 1000);
    });
}

/**
 * 通过PHP代理发送验证码
 * 使用服务器端代理解决跨域问题
 * @param {string} email 收件人邮箱
 * @param {string} code 验证码
 * @returns {Promise<object>} 发送结果
 */
async function sendVerificationViaProxy(email, code) {
    console.log(`通过代理向 ${email} 发送验证码: ${code}`);

    // 构建表单数据
    const formData = new FormData();
    formData.append('email', email);
    formData.append('code', code);

    try {
        // 调用代理脚本
        const response = await fetch('email_proxy.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const result = await response.json();
        console.log('代理响应结果:', result);

        return result;
    } catch (error) {
        console.error('代理发送失败:', error);
        return {
            success: false,
            message: '发送失败: ' + error.message
        };
    }
}

// 导出函数供其他脚本使用
window.SendCloudService = {
    sendVerificationEmail,
    mockSendVerification,
    sendVerificationViaProxy
};