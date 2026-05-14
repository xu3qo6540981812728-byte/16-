exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Get the Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: { message: 'API key is not configured on the server.' } }) };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: { message: 'Prompt is missing from the request body.' } }) };
        }

        // --- FINAL MODEL NAME UPDATE ---
        // Changed to the latest recommended model 'gemini-1.5-flash-latest' for better compatibility.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        // Construct the payload for the Gemini API
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };
        
        // Use node-fetch to make the API call
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Google API Error:', errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: { message: errorBody.error.message || 'An error occurred with the Gemini API.' } })
            };
        }

        const result = await response.json();
        
        // Extract the text from the response
        let text = "抱歉，AI分析時發生錯誤，未收到有效內容。";
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            text = result.candidates[0].content.parts[0].text;
        } else if (result.promptFeedback && result.promptFeedback.blockReason) {
            text = `AI分析請求被阻擋，原因：${result.promptFeedback.blockReason}。請檢查 prompt 內容是否合規。`;
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error('Server-side error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
};
