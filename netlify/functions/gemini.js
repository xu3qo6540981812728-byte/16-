exports.handler = async (event, context) => {
    // 只允許 POST 請求
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // 1. 取得 API Key (從 Netlify 環境變數)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('錯誤：未設定 GEMINI_API_KEY');
            return { 
                statusCode: 500, 
                body: JSON.stringify({ error: { message: '伺服器未設定 API Key' } }) 
            };
        }

        // 2. 解析前端傳來的 Prompt
        const body = JSON.parse(event.body);
        const userPrompt = body.prompt;

        if (!userPrompt) {
            return { statusCode: 400, body: JSON.stringify({ error: { message: '缺少 Prompt 內容' } }) };
        }

        // 3. 呼叫 Google Gemini API
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                parts: [{ text: userPrompt }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: { message: errorData.error?.message || 'Gemini API 呼叫失敗' } })
            };
        }

        const result = await response.json();
        
        // 4. 提取回應文字
        let text = "抱歉，AI 分析時發生未知的錯誤。";
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            text = result.candidates[0].content.parts[0].text;
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error('Server Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
};
