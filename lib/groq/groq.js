const API_KEY = "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"

/**
 * @param {string} content
 * @returns string
 */
const getGroqChatCompletion = async (body) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            /**
             * API_TOKENに発行したapi keyを入れる
             * ```
             * const API_KEY = "gsk_XXXXXXXXXXXXXXXXXXXXXXXXX"
             * ```
             */
            Authorization: `Bearer ${API_KEY}`,
        },
        ContentType: "application/json",
        body: JSON.stringify({
            /**
             * モデル一覧
             * @see https://console.groq.com/docs/models
             */
            model: "llama-3.1-70b-versatile",
            max_tokens: 4096,

            ...body,
        })
    })
    return res
}

/**
 * @param {Response | Promise<Response>} res
 * @returns string
 */
const getGroqChatCompletionTextWrapper = async (res) => {
    const json = await res.json()
    /**
     * 一番最初の回答を取り出して返す
     */
    return json.choices[0].message.content
}

export {
    getGroqChatCompletion,
    getGroqChatCompletionTextWrapper
}