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
    
    // --- Likert Scale Questions (21-60) ---
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

// === 新增：用於動態報告的文字片段 ===
const dynamicTexts = {
    strengths: {
        E: {
            high: "您是一位天生的社交家，能從與人互動中獲得源源不絕的能量，這讓您在開發客戶和建立人脈方面擁有巨大優勢。",
            mid: "您享受與人互動，能輕鬆地與客戶建立良好關係，這有助於您拓展業務網絡。"
        },
        I: {
            high: "您擁有強大的專注力和深度思考能力，善於一對一的深度溝通，這讓您能真正理解客戶內心深處的需求。",
            mid: "您傾向於先觀察再行動，透過深思熟慮建立的客戶關係，通常更加穩固和持久。"
        },
        S: {
            high: "您對事實和細節有著超乎常人的敏銳度，從屋況細節到合約條文，任何事都逃不過您的法眼，是客戶最安心的靠山。",
            mid: "您腳踏實地，注重實際，能為客戶提供具體、可靠的資訊，幫助他們做出務實的決定。"
        },
        N: {
            high: "您擁有卓越的遠見和洞察力，總能看到別人看不到的潛在價值與趨勢，特別適合為客戶規劃長遠的資產佈局。",
            mid: "您善於從大局思考，能幫助客戶跳脫框架，想像未來生活的美好藍圖。"
        },
        T: {
            high: "您是一位極度客觀的分析師，決策完全基於數據與邏輯，這讓您在談判和估價時非常專業，能為客戶爭取最大利益。",
            mid: "您處事公正、理性，能清晰地分析問題，即使在壓力下也能做出符合邏輯的判斷。"
        },
        F: {
            high: "您擁有極強的同理心，總能敏銳地捕捉到客戶的情緒與感受，並提供溫暖的支持，客戶不僅視您為仲介，更是值得信賴的朋友。",
            mid: "您重視和諧的人際關係，善於傾聽，能與客戶建立真誠的連結，讓交易過程充滿溫度。"
        },
        J: {
            high: "您是天生的管理者，任何複雜的流程在您手中都能變得井井有條。您的嚴謹規劃與超高執行力，是交易順利完成的最佳保證。",
            mid: "您喜歡有計畫地工作，做事有條理，能給客戶帶來很高的確定性和安全感。"
        },
        P: {
            high: "您是靈活應變的大師，市場或客戶的任何突發狀況都難不倒您。您總能跳出框架，找到創新的解決方案。",
            mid: "您對新事物抱持開放態度，能靈活調整策略，適應房仲工作中的各種變化與挑戰。"
        }
    }
};


const mbtiData = {
    ESTJ: { type_name: '鐵血店長型 - 總經理 (ESTJ)', catch_phrase: '效率至上，使命必達！', weaknesses: '決策時可能過度依賴邏輯和數據，較難彈性應對市場變化，或忽略客戶的情感需求。在人際溝通上可能顯得過於直接和強勢。', client_strategy: '建立系統化的客戶管理與追蹤系統，將每一次的接觸都記錄下來。以數據和事實為基礎，向客戶展示房產的投資價值和交易流程的嚴謹性。', negotiation_strategy: '專注於價格和合約條款的談判，利用市場數據證明你的出價是合理的。保持理性，不讓情緒影響決策。', teamwork_suggestion: '主動承擔領導角色，組織團隊會議，分享你的流程管理經驗。但同時，也要學習傾聽不同意見，特別是來自情感型同事的建議。', career_suggestion: '適合擔任團隊組長或店長，專注於業務流程優化和團隊管理。', suggested_skills: '學習同理心溝通、情緒管理技巧，並提升對非結構化問題的應變能力。', immediate_action: '今天就為你的團隊建立一個共享的SOP文件，將一個關鍵流程標準化。', management_suggestion: '這類新人重視結構與規則，給予他們清晰的SOP和明確的績效目標。他們是可靠的執行者，適合負責流程管理與細節確認的任務。', team_role: '你是團隊的「指揮官」和「流程建立者」。你擅長制定計畫、分配任務，並確保團隊朝著共同目標前進。與充滿創意但較隨性的 P 型人格（如 ENFP、INFP）合作時，你需要給予更多彈性；而與 F 型人格（如 ISFJ、ENFJ）合作時，則要多加留意他們的感受，而不僅僅是任務本身。', client_perspective_text: '我的房仲是【鐵血店長型】，做事有條理、效率極高，所有交易細節都幫我規劃得清清楚楚，讓我非常安心！適合追求高效、專業服務的您。' },
    ESTP: { type_name: '超級戰將 - 企業家 (ESTP)', catch_phrase: '機會來了，就要抓住！', weaknesses: '可能因追求刺激而缺乏長遠規劃，容易忽略細節和跟進工作，需要紀律來維持業務穩定。', client_strategy: '將你的活力與熱情帶入每一次客戶接觸。透過有趣、有創意的帶看體驗來吸引客戶，並善用你的應變能力處理突發狀況。', negotiation_strategy: '在談判中展現你的靈活與果斷，快速分析對方意圖並提出對策，享受斡旋過程中的博弈。', teamwork_suggestion: '你能在團隊中帶來能量與活力。多分享你的實戰經驗與成功案例，激勵同事。', career_suggestion: '適合擔任外勤業務員，或專注於市場拓展和快速成交。', suggested_skills: '學習制定並遵守跟進計畫，提升文書處理與合約細節的嚴謹度。', immediate_action: '今天多打 3 通陌生電話，試著練習用幽默化解尷尬。', management_suggestion: '這類新人是天生的行動派，喜歡挑戰。給他們高彈性的開發空間和即時的業績獎勵。他們可能忽略文書細節，需要有內勤或系統輔助他們處理合約流程。', team_role: '你是團隊的「先鋒部隊」和「危機處理專家」。你總能第一個衝鋒陷陣，打開新的市場或解決突發狀況。與注重計畫的 J 型人格（如 ISTJ、ENTJ）合作時，記得要多溝通你的行動方案，讓他們安心。你的臨場反應能幫助思考型的 I 型人格（如 INTP、INTJ）將理論付諸實踐。', client_perspective_text: '我的房仲是【超級戰將】，反應快、懂的抓機會，總能幫我找到市場上最新的好案子，並在談判中快狠準！適合喜歡果斷、行動派顧問的您。' },
    ESFP: { type_name: '魅力四射公關家 - 表演者 (ESFP)', catch_phrase: '交朋友，順便成交！', weaknesses: '可能缺乏長遠規劃，容易被新奇事物吸引而分心，需要有紀律地管理時間和跟進。', client_strategy: '將你的社交魅力轉化為優勢，積極參與社區活動，拓展人脈。透過舉辦小型帶看會或開放日活動吸引客戶。', negotiation_strategy: '在談判中善用你的親和力，讓氣氛保持輕鬆愉快，以此軟化對方的態度。', teamwork_suggestion: '你是團隊的開心果，能有效活躍氣氛。主動發起團隊活動，增強凝聚力。', career_suggestion: '適合擔任外勤業務員，或專注於客戶體驗服務。', suggested_skills: '學習制定清晰的每日、每週工作清單，並嚴格執行。提升對細節的關注度。', immediate_action: '今天帶看時，嘗試用一個生動的故事來介紹房子，而不只是介紹規格。', management_suggestion: '這類新人需要舞台發揮，多安排他們負責第一線的客戶接觸或活動主持。他們需要被肯定，及時的口頭表揚會非常有效。提醒他們做好客戶記錄，避免遺忘重要細節。', team_role: '你是團隊的「公關大使」和「氣氛製造者」。你擅長建立人際網絡，為團隊帶來歡樂與活力。與內向的 I 型人格合作時，你可以幫助他們打破僵局，建立客戶關係。與注重數據的 T 型人格（如 ISTJ、ENTJ）合作，你能為冰冷的數據增添人性的溫度。', client_perspective_text: '我的房仲是【魅力公關家】，熱情又開朗，看房過程就像跟朋友聊天一樣輕鬆愉快，總能設身處地為我著想。適合喜歡融洽、無壓力服務的您。' },
    ESFJ: { type_name: '社區里長伯 - 供給者 (ESFJ)', catch_phrase: '您的事，就是我的事！', weaknesses: '較不喜歡高風險或衝突性挑戰，可能在面對客戶強硬議價或負面情緒時感到壓力。', client_strategy: '你的服務品質是最好的行銷。專注於維護老客戶與開發轉介紹。用心傾聽客戶需求，並給予情感支持。', negotiation_strategy: '在談判中，利用你的親和力來創造和諧的氣氛。你擅長以情動人，讓客戶和屋主都能感受到你的真誠。', teamwork_suggestion: '你將會是團隊中最受歡迎的成員。多關心同事，在團隊中發揮黏著劑的作用。', career_suggestion: '適合擔任客戶關係管理或團隊內勤支援等職位。', suggested_skills: '練習在必要時堅持立場，並學習如何處理與客戶的衝突。', immediate_action: '今天打電話給一位已成交的老客戶，單純問候近況，完全不提業務。', management_suggestion: '這類新人是團隊的穩定力量。他們適合負責客戶關懷與售後服務。在面對議價壓力時，主管需要提供明確的數據和底線支持，幫助他們建立信心。', team_role: '你是團隊的「黏著劑」和「客戶守護者」。你非常關心團隊的和諧與客戶的滿意度。與結果導向的 T 型人格合作時，你能提醒他們關注服務過程中的人情味。與充滿創意的 N 型人格合作時，你能幫助他們將天馬行空的想法，落實到具體的客戶服務流程中。', client_perspective_text: '我的房仲是【社區里長伯】，服務貼心又周到，從看房到交屋都把我的事當成自己的事在辦，讓人超感動！適合需要無微不至關懷的您。' },
    ENTJ: { type_name: '天生領導者 - 指揮官 (ENTJ)', catch_phrase: '目標只有一個：贏！', weaknesses: '可能過度理性，容易忽略客戶或同事的情感需求。在追求效率的同時，可能顯得缺乏耐心。', client_strategy: '以專業的市場分析和數據報告，向客戶展示你的獨到見解。專注於高端客戶或商業房產等需要策略規劃的領域。', negotiation_strategy: '你擅長複雜的談判。利用你強大的邏輯思維，將所有變數納入考量，並引導談判朝著你的目標前進。', teamwork_suggestion: '主動發起並領導新專案。將你的戰略思維分享給團隊，並鼓勵大家一起成長。', career_suggestion: '適合擔任團隊領導者或區域經理，專注於市場戰略與團隊擴張。', suggested_skills: '學習如何在溝通中融入情感元素，提升人際敏感度。', immediate_action: '今天花15分鐘，為你最重要的案子規劃出A、B、C三種不同的銷售策略。', management_suggestion: '這類新人有強烈的企圖心，要給他們足夠大的舞台和挑戰性目標。可以讓他們參與店務的策略規劃，但要提醒他們注意溝通方式，避免過於強勢。', team_role: '你是團隊的「總司令」和「策略家」。你天生就具備宏觀視野和領導力，能帶領團隊攻克難關。與細心的 S 型人格（如 ISFJ、ISTJ）合作，他們能為你的宏大計畫補足執行細節。與理想主義的 F 型人格（如 INFP、ENFP）合作時，你需要學習用願景而非命令來激勵他們。', client_perspective_text: '我的房仲是【天生領導者】，有策略、有遠見，總能提供精準的市場分析，幫我做出最有利的決策，霸氣又專業！適合尋求頂尖策略顧問的您。' },
    ENTP: { type_name: '鬼才行銷軍師 - 辯論家 (ENTP)', catch_phrase: '沒有不可能，只有想不到！', weaknesses: '可能因追求新鮮感而缺乏執行力，容易在多個專案之間跳躍，執行力可能不足。', client_strategy: '將你的創意行銷能力發揮到極致。透過非傳統的方式來吸引客戶，例如有趣的影片、線上講座等。', negotiation_strategy: '享受談判過程中的思維碰撞。你擅長利用邏輯和幽默來化解僵局，並從多個角度尋找解決方案。', teamwork_suggestion: '你是團隊中的「點子王」。多分享你的創新想法，並幫助團隊打破思維定勢。', career_suggestion: '適合擔任創意行銷、策略規劃或複雜案件處理等職位。', suggested_skills: '學習將想法轉化為可執行的計畫，並提升對細節的耐心。', immediate_action: '今天針對一個銷售中的案子，想出一個全新的廣告文案標題。', management_suggestion: '這類新人是創意的來源，不要用過多的規則限制他們。可以讓他們負責 brainstorm 或新媒體行銷。他們需要一位能幫助他們聚焦、將點子落地的夥伴或主管。', team_role: '你是團隊的「創意引擎」和「問題解決者」。你總能提出顛覆性的想法，找到別人看不到的出路。與務實的 J 型人格（如 ESTJ、ISTJ）合作，他們能幫助你將創意轉化為可行的方案。你的靈活性能夠幫助團隊在面對僵局時，找到突破口。', client_perspective_text: '我的房仲是【鬼才行銷軍師】，總有各種新奇的點子，能從我想不到的角度分析房子，跟他聊一聊總能茅塞頓開！適合思路開闊、喜歡創意的您。' },
    ENFP: { type_name: '火箭手開發王 - 競選者 (ENFP)', catch_phrase: '每個房子都有它的故事！', weaknesses: '容易因追求新鮮感而分心，缺乏長期規劃，可能在客戶跟進上顯得不夠系統。', client_strategy: '用你的熱情和個人魅力來感染客戶。專注於與客戶建立情感連結，讓他們感受到你真心想幫助他們。', negotiation_strategy: '在談判中，利用你對人性的洞察力來找到對方的痛點與需求，並以此為基礎來推動談判。', teamwork_suggestion: '你為團隊帶來積極的能量。多與同事分享你的創意與靈感。', career_suggestion: '適合擔任開發業務員，或專注於客戶關係維護與社群經營。', suggested_skills: '學習制定並遵守客戶跟進計畫，提升組織能力。', immediate_action: '今天開發時，嘗試用一個你從沒用過的開場白，給自己帶來新鮮感。', management_suggestion: '這類新人充滿熱情與創意，但可能缺乏跟進的紀律。給他們足夠的開發自由度，但要搭配明確的客戶關係管理（CRM）系統要求，並定期檢查進度。', team_role: '你是團隊的「啦啦隊長」和「點子發電機」。你充滿熱情和感染力，能激勵整個團隊的士氣。你的創意源源不絕，特別適合在行銷和開發上發揮。與注重細節的 S 型人格（如 ISTJ）合作，他們能幫你處理繁瑣的行政工作，讓你專心發揮長處。', client_perspective_text: '我的房仲是【火箭手開發王】，充滿熱情和感染力，總能發掘出每個房子的獨特故事，讓我對未來的家充滿想像！適合重視感覺與溫度的您。' },
    ENFJ: { type_name: '團隊激勵大使 - 提倡者 (ENFJ)', catch_phrase: '我相信，我們能一起成功！', weaknesses: '容易忽略個人界限，過度投入客戶情緒中，有時會因他人的問題而感到疲憊。', client_strategy: '將你的熱情和同理心用於建立深層的客戶關係。你的客戶會因為你的真誠和信任而選擇你。', negotiation_strategy: '在談判中，你擅長理解各方的情感需求，並尋找一個讓所有人都滿意的解決方案。', teamwork_suggestion: '你是團隊的靈魂人物。主動幫助同事解決困難，並營造積極向上的團隊氛圍。', career_suggestion: '適合擔任客戶服務經理或團隊教練，專注於人際關係與團隊發展。', suggested_skills: '學習如何在幫助他人的同時，保護自己的心理健康。', immediate_action: '今天找一位看起來需要打氣的同事，真誠地讚美他的一項優點。', management_suggestion: '這類新人是天生的教練和激勵者。他們適合帶領新人或負責團隊文化建設。他們非常在意他人的看法，需要主管給予大量的正面回饋與肯定。', team_role: '你是團隊的「教練」和「心靈導師」。你天生就懂得如何激勵他人、凝聚團隊。你擅長協調衝突，並幫助每個人發揮潛力。與注重邏輯的 T 型人格（如 INTP、ENTJ）合作時，你能幫助他們更好地理解團隊成員的情感需求，讓決策更周全。', client_perspective_text: '我的房仲是【團隊激勵大使】，非常有說服力和同理心，總能真誠地理解我的需求，並朝著雙贏的目標努力。適合尋求互信、合作關係的您。' },
    ISTJ: { type_name: '房產定海神針 - 檢查者 (ISTJ)', catch_phrase: '魔鬼，藏在細節裡。', weaknesses: '傾向於遵循傳統與舊有模式，較難適應快速變化的市場，或在與不同類型的人溝通時感到不適。', client_strategy: '你的專業性是客戶信任你的關鍵。專注於房產知識的深度學習，並可嘗試利用數據分析來輔助決策。', negotiation_strategy: '在談判中保持冷靜和客觀，用事實和數據支持你的觀點。確保合約和流程的每一步都萬無一失。', teamwork_suggestion: '在團隊中，你是最可靠的後盾。可以協助同事處理複雜的文書工作或流程問題。', career_suggestion: '適合擔任風險控管、合約管理或房產估價等專業內勤職位。', suggested_skills: '練習如何更有效地與人建立連結，並嘗試學習新的行銷工具或技術。', immediate_action: '今天將一份常用的合約或文件，重新檢查一遍，看看是否有可以優化的細節。', management_suggestion: '這類新人是流程的守護者。他們在處理文書、法規和數字方面非常可靠。給他們明確的指令和充足的時間，他們會完成得很好。鼓勵他們多分享專業知識，成為團隊的顧問。', team_role: '你是團隊的「基石」和「品質管理者」。你確保了團隊工作的每一個環節都準確無誤。與充滿活力的 P 型人格（如 ESTP、ENFP）合作時，你是他們最可靠的後盾，能幫助他們處理善後與細節。你的穩定性能夠平衡團隊中的冒險精神，確保團隊穩健前行。', client_perspective_text: '我的房仲是【房產定海神針】，嚴謹又可靠，對合約和屋況細節的掌握度無人能及，把事情交給他只有一百個放心！適合注重細節與安全的您。' },
    ISTP: { type_name: '問題解決專家 - 鑑賞家 (ISTP)', catch_phrase: '先別慌，總有辦法的。', weaknesses: '不喜歡頻繁的社交和開發客戶，較為被動。可能在人際溝通上顯得不夠熱情。', client_strategy: '以你的專業知識和解決問題的能力吸引客戶。你的客戶會因為你的可靠和專業而選擇你。', negotiation_strategy: '在談判中，你擅長用邏輯來分析問題，並提出實際可行的解決方案。', teamwork_suggestion: '你可能不喜歡團隊合作，但你能在關鍵時刻為團隊提供寶貴的技術支援。', career_suggestion: '適合擔任專案經理、房產鑑價師或專注於高難度案件處理。', suggested_skills: '學習如何主動開發新客戶，並提升溝通的親和力。', immediate_action: '今天找一個困擾你很久的作業流程問題，動手尋找一個工具或方法來解決它。', management_suggestion: '這類新人是天生的「救火隊」。當團隊遇到棘手問題時，他們能保持冷静並找到解法。不要強迫他們參加太多社交活動，而是給他們具體的、有挑戰性的任務去解決。', team_role: '你是團隊的「拆彈專家」和「技術顧問」。當團隊遇到棘手的技術問題或複雜的案件時，你總能保持冷靜，找到最有效的解決方案。與善於社交的 E 型人格合作，他們可以幫你對外溝通，而你則專注於解決核心問題，形成完美互補。', client_perspective_text: '我的房仲是【問題解決專家】，冷靜又理性，不管遇到什麼疑難雜症，他總能邏輯清晰地分析並找到解決辦法，超靠譜！適合需要專業解決方案的您。' },
    ISFP: { type_name: '空間美學顧問 - 探險家 (ISFP)', catch_phrase: '感受這個家的溫度。', weaknesses: '不擅長談價格和效率，可能在面對高壓的成交壓力時感到不適。', client_strategy: '以你的真誠和細膩來打動客戶。你擅長從客戶的角度出發，為他們找到最適合的家。可以多著墨在房屋的美感與生活氛圍營造。', negotiation_strategy: '在談判中，你擅長用情感來軟化氣氛。你的真誠會讓客戶和屋主都願意做出讓步。', teamwork_suggestion: '你能在團隊中提供情感支持。你的細膩觀察力能幫助團隊更好地理解客戶。', career_suggestion: '適合擔任客戶關係維護或房產美學顧問。', suggested_skills: '學習一些基本的談判技巧，並提升對數字和合約的敏感度。', immediate_action: '今天為一個正在銷售的物件，拍幾張充滿生活感的美照，並分享到社群。', management_suggestion: '這類新人對美感和氛圍很敏感。可以讓他們負責房屋的佈置、攝影或文案撰寫。他們需要一個和諧、少衝突的工作環境，主管應給予情感上的支持與鼓勵。', team_role: '你是團隊的「美學總監」和「溫情大使」。你對空間和氛圍有獨特的敏感度，能為物件加分。在團隊中，你總能關心到他人的情緒，提供溫暖的支持。與講求效率的 T 型人格（如 ESTJ）合作時，你能提醒他們關注客戶の居住體驗，而不僅僅是交易本身。', client_perspective_text: '我的房仲是【空間美學顧問】，對美感和氛圍特別敏銳，總能幫我發現房子的獨特之美，讓我對未來的家充滿期待。適合重視生活品味的您。' },
    ISFJ: { type_name: '暖心顧客守護者 - 守衛者 (ISFJ)', catch_phrase: '交給我就對了，一定辦妥。', weaknesses: '適應快速變化較慢，可能在面對市場波動或新技術時感到不適。', client_strategy: '以你的可靠和細膩來贏得客戶信任。你的客戶會因為你的踏實和責任感而選擇你。', negotiation_strategy: '在談判中，你擅長利用你對細節的掌握，確保合約和流程的每一步都萬無一失。', teamwork_suggestion: '你是團隊中最可靠的成員之一。你會默默地為團隊做出貢獻，並確保每一個細節都處理妥當。', career_suggestion: '適合擔任合約管理、文書處理或客戶服務等內勤職位。', suggested_skills: '學習適應變化，並嘗試學習一些新的行銷工具。', immediate_action: '今天挑選三位近期服務過的客戶，發送一則個人化的關心訊息，不提業務。', management_suggestion: '這類新人非常細心且有責任感，是客戶服務的絕佳人選。鼓勵他們將服務流程文件化，分享給團隊。他們可能不擅長拒絕，主管需適時介入協助處理高難度議價。', team_role: '你是團隊的「守護者」和「定心丸」。你細心、有責任感，是團隊中最值得信賴的後盾。與喜歡冒險的 P 型人格（如 ESTP）合作時，你能幫助他們處理好所有後續細節，讓他們無後顧之憂。你的存在讓整個團隊的運作更加穩定、可靠。', client_perspective_text: '我的房仲是【暖心顧客守護者】，細心又有責任感，服務過程中的每個小細節都幫我考慮到了，讓人感覺特別踏實和溫暖。適合需要貼心服務的您。' },
    INTJ: { type_name: '高瞻遠矚投資家 - 建築師 (INTJ)', catch_phrase: '看的不是現在，是未來。', weaknesses: '情緒管理欠佳，可能在人際互動上顯得冷漠或直接。不擅長社交和開發新客戶。', client_strategy: '以你的專業知識和獨到見解來吸引客戶。你的客戶會因為你的深度分析而選擇你。', negotiation_strategy: '你擅長複雜的談判。你會利用你的邏輯思維來分析所有變數，並提出最優的解決方案。', teamwork_suggestion: '你是團隊中的智囊。多分享你的策略性思考，並幫助團隊解決複雜問題。', career_suggestion: '適合擔任房產投資顧問、市場分析師或專案經理。', suggested_skills: '學習如何在溝通中融入情感元素，提升人際敏感度。', immediate_action: '今天花20分鐘，研究一個你感興趣的區域的都市計畫，思考未來3年的發展潛力。', management_suggestion: '這類新人是天生的策略家。給他們獨立思考的空間，讓他們負責市場分析或投資型產品的研究。他們的溝通直接，主管需要幫助他們和其他同事建立橋樑。', team_role: '你是團隊的「首席策略官」和「未來預測者」。你擅長從複雜的資訊中洞察未來趨勢，為團隊指明方向。與擅長執行的 S 型人格（如 ESTJ、ISFJ）合作，能將你的宏觀策略完美落地。與善於社交的 E 型人格合作，他們能將你的深刻見解，用更有魅力的方式傳達給客戶。', client_perspective_text: '我的房仲是【高瞻遠矚投資家】，總能提供別人看不到的市場洞見和未來趨勢分析，幫我規劃的不只是買房，更是資產的未來。適合尋求專業投資建議的您。' },
    INTP: { type_name: '房市策略家 - 邏輯學家 (INTP)', catch_phrase: '讓數據說話。', weaknesses: '與客戶互動少，不擅長社交和開發新客戶。可能在人際溝通上顯得不夠熱情。', client_strategy: '以你的專業知識和獨特見解來吸引客戶。你的客戶會因為你的深度分析而選擇你。', negotiation_strategy: '在談判中，你擅長用邏輯來分析問題，並提出實際可行的解決方案。', teamwork_suggestion: '你是團隊中的智囊。多分享你的創新想法，並幫助團隊解決複雜問題。', career_suggestion: '適合擔任市場分析師、數據分析師或專注於高難度案件處理。', suggested_skills: '學習如何主動開發新客戶，並提升溝通的親和力。', immediate_action: '今天挑選一個你最不熟悉的社區，花30分鐘分析它的行情數據，並找出一個獨特的賣點。', management_suggestion: '這類新人容易想太多、行動慢，建議多給明確步驟和時間限制。他們擅長分析，可以請他們研究市場數據或競爭對手策略，為團隊提供洞見。', team_role: '你是團隊的「數據科學家」和「系統架構師」。你擅長分析複雜的市場數據，並建立高效的工作系統。與行動派的 E 型人格（如 ESTP）合作，他們能將你的數據分析轉化為實際的市場行動。你的客觀分析能幫助感性的 F 型人格在做決策時，有更堅實的依據。', client_perspective_text: '我的房仲是【房市策略家】，他會用最客觀的數據幫我分析市場，沒有任何話術，只有滿滿的專業和邏輯，讓我買得明明白白。適合相信數據、理性決策的您。' },
    INFP: { type_name: '夢想家園建築師 - 調解者 (INFP)', catch_phrase: '幫你找到心之所向的家。', weaknesses: '遇挫折容易退縮，不喜歡高壓環境。在面對強硬議價或負面情緒時感到壓力。', client_strategy: '發揮你擅長傾聽的特質，成為客戶的「房產諮詢師」。專注於服務少數但忠誠度高的客戶。', negotiation_strategy: '在談判中，利用你對客戶需求的深刻理解，將對方的利益與房產優勢結合，達成雙贏局面。', teamwork_suggestion: '在團隊中，你可以扮演「心靈導師」的角色，幫助同事解決客戶關係上的困惑。', career_suggestion: '適合擔任客戶關係管理、專案策劃或品牌行銷等內勤職位。', suggested_skills: '學習如何在保護自己心理健康的同時，設定明確的業務界線。並提升主動開發新客戶的勇氣。', immediate_action: '今天寫下一段關於「家」的溫馨短文，分享到你的社群媒體上。', management_suggestion: '這類新人非常需要工作的意義感。要讓他們了解自己的工作如何幫助客戶實現夢想。他們不適合高壓的業績競賽，更適合在一個支持性的環境中成長。', team_role: '你是團隊的「靈魂捕手」和「品牌故事家」。你非常擅長理解客戶內心深處的需求，並能將物件の價值用感性的故事包裝。與務實的 T 型人格（如 ESTJ）合作，你能為他們的理性分析注入溫暖與人性。你的存在，能提升整個團隊的服務深度與品牌形象。', client_perspective_text: '我的房仲是【夢想家園建築師】，他不僅是在幫我找房子，更是在幫我實現對家的夢想，非常有耐心傾聽我的想法。適合想找到心靈歸屬的您。' },
    INFJ: { type_name: '房產知心人 - 提倡者 (INFJ)', catch_phrase: '不只找房子，更是找歸屬感。', weaknesses: '容易內心掙扎，有時會因過度考量他人感受而難以做出果斷的決策。不喜歡頻繁的外出拜訪和社交，容易感到能量耗盡。', client_strategy: '發揮你擅長傾聽的特質，成為客戶的「房產諮詢師」。專注於服務少數但忠誠度高的客戶。透過內容行銷（如部落格、社群媒體）來吸引潛在客戶。', negotiation_strategy: '在談判中，利用你對客戶需求的深刻理解，將對方的利益與房產優勢結合，達成雙贏局面。', teamwork_suggestion: '在團隊中，你可以扮演「心靈導師」的角色，幫助同事解決客戶關係上的困惑。', career_suggestion: '適合擔任客戶關係管理、專案策劃或品牌行銷等內勤職位。', suggested_skills: '學習如何在保護自己心理健康的同時，設定明確的業務界線。並提升主動開發新客戶的勇氣。', immediate_action: '今天花 10 分鐘，替每個重點客戶寫下一句能真正觸動他們內心的問候訊息。', management_suggestion: '這類新人能深度理解客戶需求，但可能不擅長陌生開發。鼓勵他們經營內容或社群，吸引理念相同的客戶。他們需要安靜的空間思考，避免過多的行政會議。', team_role: '你是團隊的「諮商師」和「價值引領者」。你擁有深刻的洞察力，能理解客戶和同事的潛在動機。你擅長建立長期信任，並為團隊的工作賦予更高的意義。與行動派的 P 型人格（如 ESTP）合作時，你能為他們的行動提供深度的策略思考，確保方向正確。', client_perspective_text: '我的房仲是【房產知心人】，他能洞察我沒說出口的需求，耐心陪伴我找到真正有歸屬感的家，而不只是推銷一間房子。適合想深度探索需求的您。' },
};

const superpowerScores = {
    ESTJ: { '開發力': 9, '談判力': 10, '服務力': 7, '分析力': 9, '抗壓力': 10 }, ESTP: { '開發力': 10, '談判力': 10, '服務力': 7, '分析力': 6, '抗壓力': 9 }, ESFP: { '開發力': 10, '談判力': 7, '服務力': 10, '分析力': 6, '抗壓力': 7 }, ESFJ: { '開發力': 9, '談判力': 7, '服務力': 10, '分析力': 7, '抗壓力': 7 }, ENTJ: { '開發力': 9, '談判力': 10, '服務力': 6, '分析力': 10, '抗壓力': 10 }, ENTP: { '開發力': 10, '談判力': 9, '服務力': 6, '分析力': 9, '抗壓力': 7 }, ENFP: { '開發力': 10, '談判力': 7, '服務力': 9, '分析力': 7, '抗壓力': 6 }, ENFJ: { '開發力': 9, '談判力': 9, '服務力': 10, '分析力': 7, '抗壓力': 6 }, ISTJ: { '開發力': 6, '談判力': 9, '服務力': 9, '分析力': 10, '抗壓力': 10 }, ISTP: { '開發力': 7, '談判力': 9, '服務力': 6, '分析力': 10, '抗壓力': 9 }, ISFP: { '開發力': 7, '談判力': 6, '服務力': 10, '分析力': 7, '抗壓力': 7 }, ISFJ: { '開發力': 6, '談判力': 7, '服務力': 10, '分析力': 9, '抗壓力': 9 }, INTJ: { '開發力': 6, '談判力': 10, '服務力': 6, '分析力': 10, '抗壓力': 9 }, INTP: { '開發力': 4, '談判力': 9, '服務力': 6, '分析力': 10, '抗壓力': 7 }, INFP: { '開發力': 6, '談判力': 6, '服務力': 10, '分析力': 7, '抗壓力': 6 }, INFJ: { '開發力': 6, '談判力': 9, '服務力': 10, '分析力': 9, '抗壓力': 6 }
};

const partnerPairing = {
    ESTJ: { partner: 'ISFP', text: '據說和「空間美學顧問」ISFP 是最佳拍檔' }, ESTP: { partner: 'ISFJ', text: '據說和「暖心顧客守護者」ISFJ 是最佳拍檔' }, ESFP: { partner: 'ISTJ', text: '據說和「房產定海神針」ISTJ 是最佳拍檔' }, ESFJ: { partner: 'ISTP', text: '據說和「問題解決專家」ISTP 是最佳拍檔' }, ENTJ: { partner: 'INFP', text: '據說和「夢想家園建築師」INFP 是最佳拍檔' }, ENTP: { partner: 'INFJ', text: '據說和「房產知心人」INFJ 是最佳拍檔' }, ENFP: { partner: 'INTJ', text: '據說和「高瞻遠矚投資家」INTJ 是最佳拍檔' }, ENFJ: { partner: 'INTP', text: '據說和「房市策略家」INTP 是最佳拍檔' }, ISTJ: { partner: 'ESFP', text: '據說和「魅力四射公關家」ESFP 是最佳拍檔' }, ISTP: { partner: 'ESFJ', text: '據說和「社區里長伯」ESFJ 是最佳拍檔' }, ISFP: { partner: 'ESTJ', text: '據說和「鐵血店長型」ESTJ 是最佳拍檔' }, ISFJ: { partner: 'ESTP', text: '據說和「超級戰將」ESTP 是最佳拍檔' }, INTJ: { partner: 'ENFP', text: '據說和「火箭手開發王」ENFP 是最佳拍檔' }, INTP: { partner: 'ENFJ', text: '據說和「團隊激勵大使」ENFJ 是最佳拍檔' }, INFP: { partner: 'ENTJ', text: '據說和「天生領導者」ENTJ 是最佳拍檔' }, INFJ: { partner: 'ENTP', text: '據說和「鬼才行銷軍師」ENTP 是最佳拍檔' }
};

// === 修改： calculateResult 函式 ===
const calculateResult = (answers) => {
    const score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach(q => {
        if (!answers[q.id]) return;
        if (q.type === 'mbti_choice') {
            const value = answers[q.id];
            if (value) score[value] += 2; // 選項題分數權重設為2
        } else if (q.type === 'likert') {
            const value = parseInt(answers[q.id], 10);
            if (value) {
                const [trait1, trait2] = q.trait.split('');
                if (value >= 4) score[trait1] += (value - 3);
                else if (value <= 2) score[trait2] += (3 - value);
            }
        }
    });

    const mbti = (score.E >= score.I ? 'E' : 'I') +
                 (score.S >= score.N ? 'S' : 'N') +
                 (score.T >= score.F ? 'T' : 'F') +
                 (score.J >= score.P ? 'J' : 'P');
    
    // 計算百分比
    const calculatePercentages = (s1, s2) => {
        const total = s1 + s2;
        return total === 0 ? { p1: 50, p2: 50 } : { p1: (s1 / total) * 100, p2: (s2 / total) * 100 };
    };
    
    const percentages = {
        EI: { E: calculatePercentages(score.E, score.I).p1, I: calculatePercentages(score.E, score.I).p2 },
        SN: { S: calculatePercentages(score.S, score.N).p1, N: calculatePercentages(score.S, score.N).p2 },
        TF: { T: calculatePercentages(score.T, score.F).p1, F: calculatePercentages(score.T, score.F).p2 },
        JP: { J: calculatePercentages(score.J, score.P).p1, P: calculatePercentages(score.J, score.P).p2 }
    };

    const baseData = mbtiData[mbti];

    // --- 動態優勢文案生成 ---
    const [dim1, dim2, dim3, dim4] = mbti.split('');
    const strengthTexts = [];
    
    const getLevel = (percent) => percent >= 75 ? 'high' : 'mid';

    strengthTexts.push(dynamicTexts.strengths[dim1][getLevel(percentages.EI[dim1])]);
    strengthTexts.push(dynamicTexts.strengths[dim2][getLevel(percentages.SN[dim2])]);
    strengthTexts.push(dynamicTexts.strengths[dim3][getLevel(percentages.TF[dim3])]);
    strengthTexts.push(dynamicTexts.strengths[dim4][getLevel(percentages.JP[dim4])]);
    
    const dynamicStrengthsText = strengthTexts.join(' ');

    return { 
        mbtiType: mbti, 
        strengths: percentages, // Renamed from 'strengths' to 'percentages' to avoid confusion
        scoreDetails: score, // Return raw scores as well
        type_name: baseData.type_name,
        strengthsText: dynamicStrengthsText, // Use the dynamically generated text
        weaknesses: baseData.weaknesses,
        client_strategy: baseData.client_strategy,
        negotiation_strategy: baseData.negotiation_strategy,
        teamwork_suggestion: baseData.teamwork_suggestion,
        career_suggestion: baseData.career_suggestion,
        suggested_skills: baseData.suggested_skills,
        immediate_action: baseData.immediate_action,
        management_suggestion: baseData.management_suggestion,
        superpowerScores: superpowerScores[mbti],
        team_role: baseData.team_role,
        catch_phrase: baseData.catch_phrase,
        partner_info: partnerPairing[mbti],
        client_perspective_text: baseData.client_perspective_text // Newly added field
    };
};


exports.handler = async (event, context) => {
    const { action } = event.queryStringParameters;

    if (event.httpMethod === 'GET' && action === 'getQuestions') {
        // Only send the necessary fields to the frontend
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
            return { statusCode: 500, body: `Error calculating result: ${error.message}` };
        }
    }

    return {
        statusCode: 404,
        body: 'Action not found'
    };
};
