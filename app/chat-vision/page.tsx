"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";

import { getGroqChatCompletion, getGroqChatCompletionTextWrapper } from "@/lib/groq/groq"
import { getGroqChatCompletionStreamWrapper } from "@/lib/groq/stream"
import { getGroqChatCompletionWithTools } from "@/lib/groq/tool"
import { useChatMessages } from "@/hook/useChatHistory";
import { Chat, ChatContainer, ChatVision } from "@/components/chat";


export default function () {

    const [response, setResponse] = useState("")
    const { push } = useChatMessages([
        { role: "system", content: "画像を渡すので、その画像を見て答えてください" }
    ])

    const send = (input: string, fileUrl: string) => {


        const history = push([
            /**
             * 前回の回答を送信する。初回は事前に用意した回答
             */
            { role: "assistant", content: response },
            { role: "user", content: input }
        ])

        if(fileUrl) {
            history[0] = {
                role: "user",
                content: [
                    { type: "text", text: history[0].content as string },
                    { type: "image_url", image_url: { url: fileUrl } }
                ]
            }
        }

        setResponse("")

        getGroqChatCompletionStreamWrapper(
            getGroqChatCompletion({
                stream: true,
                messages: history,
                model: "llama-3.2-90b-vision-preview"
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
        <ChatVision response={response} onSend={send} />
    </ChatContainer>
}