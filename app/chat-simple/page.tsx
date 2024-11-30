"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";

import { getGroqChatCompletion, getGroqChatCompletionTextWrapper } from "@/lib/groq/groq"
import { getGroqChatCompletionStreamWrapper } from "@/lib/groq/stream"
import { getGroqChatCompletionWithTools } from "@/lib/groq/tool"
import { useChatMessages } from "@/hook/useChatHistory";
import { Chat, ChatContainer } from "@/components/chat";

export default function() {
    
    const [response, setResponse] = useState("どうしたの?")
    const { push } = useChatMessages([
        { role: "system", content: "あなたは哲学的な問が好きなアシスタントです。ユーザーの問に対して、哲学的な問を返しはぐらかします。" }
    ])

    const send = (input: string)=> {

        const history = push([
            /**
             * 前回の回答を送信する。初回は事前に用意した回答
             */
            { role: "assistant", content: response },
            { role: "user", content: input }
        ])

        setResponse("")

        getGroqChatCompletionStreamWrapper(
            getGroqChatCompletion({
                stream: true,
                messages: history,
            }),
            (value) => setResponse((r) => r.concat(value))
        )

    }
    return <ChatContainer>
        <Alert className="mb-2">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-lg">せつめい</AlertTitle>
            <AlertDescription>
                これ以上ないほどシンプルなLLMを使ったアプリ
            </AlertDescription>
        </Alert>
        <Chat response={response} onSend={send} />
    </ChatContainer>
}