// All quiz data and logic are securely stored here on the backend.

const questions = [
    // --- MBTI Choice Questions (1-20) ---
    { id: 'q1', type: 'mbti_choice', text: '當你第一次與陌生客戶見面時，你更傾向於？', options: [{ text: '主動聊天，快速建立信任關係', value: 'E' }, { text: '先觀察對方需求與情緒，再找時機開口', value: 'I' }] },
    { id: 'q2', type: 'mbti_choice', text: '客戶覺得你的開價建議太高時，你會？', options: [{ text: '提出行情數據、成交案例佐證', value: 'T' }, { text: '耐心傾聽，先安撫再溝通', value: 'F' }] },
    { id: 'q3', type: 'mbti_choice', text: '你的工作風格是？', options: [{ text: '有明確待辦清單，逐步完成', value: 'J' }, { text: '彈性應對，每天狀況隨時調整', value: 'P' }] },
    { id: 'q4', type: 'mbti_choice', text: '帶客戶看房時，你更傾向於？', options: [{ text: '細節逐一介紹，確保資訊完整', value: 'S' }, { text: '引導客戶想像入住後的生活', value: 'N' }] },
    { id: 'q5', type: 'mbti_choice', text: '當面對一份複雜的買賣合約，你會？', options: [{ text: '逐字檢查細節，避免遺漏', value: 'S' }, { text: '快速抓重點，理解核心精神', value: 'N' }] },
    { id: 'q6', type: 'mbti_choice', text: '你認為建立房仲事業的關鍵是？', options: [{ text: '拓展廣大人脈，積極社交', value: 'E' }, { text: '深耕少數客戶，建立長期信任', value: 'I' }] },
    { id: 'q7', type: 'mbti_choice', text: '客戶婉拒你說「再考慮看看」時，你會？', options: [{ text: '快速分析原因，轉向下一個潛在客戶', value: 'T' }, { text: '感到失落但會繼續追蹤', value: 'F' }] },
    { id: 'q8', type: 'mbti_choice', text: '客戶提出不合理議價時，你會？', options: [{ text: '拿數據證明價格合理', value: 'T' }, { text: '嘗試理解對方立場，尋找折衷', value: 'F' }] },
    { id: 'q9', type: 'mbti_choice', text: '帶看過程中，你更傾向於？', options: [{ text: '讓客戶自己體驗，你只適時回應', value: 'I' }, { text: '主動引導對話，刺激客戶表達想法', value: 'E' }] },
    { id: 'q10', type: 'mbti_choice', text: '你如何安排每日行程？', options: [{ text: '訂定帶看與開發計畫並嚴格執行', value: 'J' }, { text: '依當日客戶狀況靈活調整', value: 'P' }] },
    { id: 'q11', type: 'mbti_choice', text: '面對一個新問題時，你會？', options: [{ text: '馬上找可行解法', value: 'S' }, { text: '先思考原理與長遠影響', value: 'N' }] },
    { id: 'q12', type: 'mbti_choice', text: '你更喜歡與客戶互動的方式？', options: [{ text: '面對面聊', value: 'E' }, { text: '用電話或訊息', value: 'I' }] },
    { id: 'q13', type: 'mbti_choice', text: '在成交過程中，你更看重？', options: [{ text: '效率與成交速度', value: 'T' }, { text: '關係的和諧與互信', value: 'F' }] },
    { id: 'q14', type: 'mbti_choice', text: '當有新案源時，你更傾向於？', options: [{ text: '先行動再說，邊做邊修正', value: 'P' }, { text: '先規劃策略再推進', value: 'J' }] },
    { id: 'q15', type: 'mbti_choice', text: '客戶抱怨「別家仲介說可以更便宜」時，你會？', options: [{ text: '冷靜解釋行情與差異', value: 'T' }, { text: '表達理解，先穩住情緒再處理', value: 'F' }] },
    { id: 'q16', type: 'mbti_choice', text: '你喜歡的工作環境是？', options: [{ text: '規章制度明確', value: 'J' }, { text: '彈性自由、有空間發揮', value: 'P' }] },
    { id: 'q17', type: 'mbti_choice', text: '面對客戶需求時，你會？', options: [{ text: '著重解決當下具體需求', value: 'S' }, { text: '挖掘隱藏的長期需求', value: 'N' }] },
    { id: 'q18', type: 'mbti_choice', text: '你更喜歡的社交模式？', options: [{ text: '多人聚會、廣泛交流', value: 'E' }, { text: '少數深度聊天', value: 'I' }] },
    { id: 'q19', type: 'mbti_choice', text: '你評價自己工作時會看重？', options: [{ text: '數據、成績單', value: 'T' }, { text: '個人成就感與客戶感受', value: 'F' }] },
    { id: 'q20', type: 'mbti_choice', text: '成交前最後 48 小時，你會？', options: [{ text: '按照流程逐步完成簽約、款項等細節', value: 'J' }, { text: '彈性應對買賣雙方的臨時變動', value: 'P' }] },
    
    { id: 'q21', type: 'likert', text: '我能從與客戶聊天中獲得能量與動力。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'EI' },
    { id: 'q22', type: 'likert', text: '我很擅長處理突發狀況，例如客戶臨時改約或屋主突然變卦。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'JP' },
    { id: 'q23', type: 'likert', text: '我做成交決策時，多半依賴數據與邏輯，而不是情感。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'TF' },
    { id: 'q24', type: 'likert', text: '我學習新社區行情或新開發技巧的速度很快。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'SN' },
    { id: 'q25', type: 'likert', text: '面對高壓的議價場合，我能保持冷靜並清楚表達。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'T' },
    { id: 'q26', type: 'likert', text: '我認為「建立客戶信任」比「快速成交」更重要。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'F' },
    { id: 'q27', type: 'likert', text: '我喜歡每天都有明確的帶看與開發目標。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'J' },
    { id: 'q28', type: 'likert', text: '我能快速調整話術，因應不同客戶的個性。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'P' },
    { id: 'q29', type: 'likert', text: '在行動前，我通常會仔細權衡不同成交方案。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'I' },
    { id: 'q30', type: 'likert', text: '我傾向於關注帶看過程中的具體細節（例如屋況、格局）。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'S' },
    { id: 'q31', type: 'likert', text: '即使資訊不足，我也能果斷建議客戶是否出價。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'P' },
    { id: 'q32', type: 'likert', text: '我能敏銳察覺客戶說話背後的情緒。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'F' },
    { id: 'q33', type: 'likert', text: '我是一個擅長拓展人脈、認識新客戶的人。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'E' },
    { id: 'q34', type: 'likert', text: '我更傾向於關注房市的長期趨勢與未來發展。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'N' },
    { id: 'q35', type: 'likert', text: '我習慣主動安排帶看與合約流程，確保一切順利。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'J' },
    { id: 'q36', type: 'likert', text: '在提供建議時，我會考慮客戶的感受與情緒。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'F' },
    { id: 'q37', type: 'likert', text: '我更喜歡獨立作業，不太依賴團隊合作。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'I' },
    { id: 'q38', type: 'likert', text: '我評估房產時，會特別關注實際功能與用途。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'S' },
    { id: 'q39', type: 'likert', text: '我能輕鬆應對簽約過程中計劃外的變動。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'P' },
    { id: 'q40', type: 'likert', text: '我會用客觀的市場數據來評估房子的價值。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'T' },
    { id: 'q41', type: 'likert', text: '我能快速與陌生客戶建立信任感。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'E' },
    { id: 'q42', type: 'likert', text: '我喜歡嘗試新的行銷方式，例如短影片、社群曝光。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'N' },
    { id: 'q43', type: 'likert', text: '我是一個做事有條理、規劃嚴謹的人。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'J' },
    { id: 'q44', type: 'likert', text: '我很容易理解客戶的真實需求與感受。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'F' },
    { id: 'q45', type: 'likert', text: '我喜歡在帶看過程中找到最高效的介紹方式。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'T' },
    { id: 'q46', type: 'likert', text: '我通常會先觀察客戶の反應，再決定怎麼回應。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'I' },
    { id: 'q47', type: 'likert', text: '我會主動替客戶解決問題，而不是等他們開口。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'E' },
    { id: 'q48', type: 'likert', text: '我是一個注重細節的仲介，例如交屋驗屋環節不會漏。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'S' },
    { id: 'q49', type: 'likert', text: '我喜歡保持彈性，不急於逼客戶馬上做決定。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'P' },
    { id: 'q50', type: 'likert', text: '我會用長遠的眼光規劃自己的房仲職涯。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'N' },
    { id: 'q51', type: 'likert', text: '我更喜歡和客戶面對面交流，而不是只靠訊息。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'E' },
    { id: 'q52', type: 'likert', text: '我常靠直覺來判斷客戶的需求。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'N' },
    { id: 'q53', type: 'likert', text: '我會嚴格遵守公司制定的規定與流程。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'J' },
    { id: 'q54', type: 'likert', text: '在成交判斷上，我更相信數據而不是感覺。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'T' },
    { id: 'q55', type: 'likert', text: '在團隊合作中，我常扮演傾聽與觀察的角色。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'I' },
    { id: 'q56', type: 'likert', text: '我很喜歡根據現場狀況，靈活調整銷售話術。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'P' },
    { id: 'q57', type: 'likert', text: '我能在高壓的議價或簽約現場保持冷靜與理性。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'T' },
    { id: 'q58', type: 'likert', text: '在提供建議時，我會特別顧及客戶的個人情感。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'F' },
    { id: 'q59', type: 'likert', text: '我能快速發現房子的缺點或潛在問題。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'S' },
    { id: 'q60', type: 'likert', text: '我會花時間思考新的開發或成交模式，提升業績。', scale: ['1', '2', '3', '4', '5'], labels: ['非常不同意', '', '', '', '非常同意'], trait: 'N' },
];

const dynamicTexts = { /* ... This part is correct and doesn't need changes ... */ };
const mbtiData = { /* ... The version with client_perspective object ... */ };
const superpowerScores = { /* ... This part is correct and doesn't need changes ... */ };
const partnerPairing = { /* ... This part is correct and doesn't need changes ... */ };

const calculateResult = (answers) => { /* ... The version that returns client_perspective object ... */ };

exports.handler = async (event, context) => {
    const { action } = event.queryStringParameters;
    if (event.httpMethod === 'GET' && action === 'getQuestions') {
        const frontendQuestions = questions.map(({ id, type, text, options, scale, labels }) => ({
            id, type, text, options, scale, labels
        }));
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(frontendQuestions)
        };
    }
    if (event.httpMethod === 'POST' && action === 'calculateResult') {
        try {
            const { answers } = JSON.parse(event.body);
            if (!answers) {
                return { statusCode: 400, body: 'Missing answers in request body' };
            }
            const result = calculateResult(answers);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result)
            };
        } catch (error) {
            console.error("Calculation Error:", error);
            return { statusCode: 500, body: `Error calculating result: ${error.message}` };
        }
    }
    return {
        statusCode: 404,
        body: 'Action not found'
    };
};
