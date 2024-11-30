import { useState } from "react"

type MessageContent = {
    type: "text",
    text: string
} | {
    type: "image_url",
    image_url: {
        url: string
    }
}
type Message = {
    role: string,
    content: string | MessageContent[]
}
export const useChatMessages = (messages: Array<Message>) => {
    const [history, setHistory] = useState(messages)
    const push = (message: Message | Array<Message>) => {
        let his = [...history, message] as Array<Message>;
        if(Array.isArray(message)) {
            his = [...history, ...message]
        }
        setHistory(his)
        return his
    }
    return {
        history,
        push
    }
}