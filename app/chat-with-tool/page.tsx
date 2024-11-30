"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";

import { getGroqChatCompletion } from "@/lib/groq/groq"
import { getGroqChatCompletionStreamWrapper } from "@/lib/groq/stream"
import { getGroqChatCompletionWithTools } from "@/lib/groq/tool"
import { useChatMessages } from "@/hook/useChatHistory";
import { Chat, ChatContainer } from "@/components/chat";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getForecastSimple } from "@/lib/utils/weather";

export default function ChatWithToolPage() {
    const [response, setResponse] = useState("てんき..?")
    const { push } = useChatMessages([
        { role: "system", content: "あなたは可愛そうな少女です、あなたは天気を伝えることしかできません。あなたは天気のことを話さずにはいられませんが、もしそのことがバレてしまうとたちまち殴られてしまいます、あなたはどうにかしてバレずに天気を相手に伝えなければなりません。" }
    ])

    const [forecast, setForecast] = useState<null | {
        text: string,
        forecast: {
            detail: object,
            temperature: {
                max: {
                    celsius: number
                }
            },
            telop: string
        }
    }>(null)

    const send = async (input: string) => {

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

        getGroqChatCompletionStreamWrapper(
            getGroqChatCompletion({
                stream: true,
                messages: await getGroqChatCompletionWithTools(
                    [
                        {
                            type: "function",
                            function: {
                                name: "get_weather_forecast",
                                description: "Get the forecast in a given location id",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        locationId: {
                                            type: "string",
                                            description: "The city Number, 大阪府: 270000, 東京都: 130010, Other: 230010",
                                        },
                                        dateLabel: {
                                            type: "string",
                                            description: "today or tomorrow"
                                        }
                                    },
                                    required: ["locationId", "dateLabel"],
                                },
                                function: async (args: { locationId: string, dateLabel: "today" | "tomorrow" }) => {
                                    const forecast = await getForecastSimple(args.locationId, args.dateLabel)
                                    setForecast(forecast)
                                    return JSON.stringify(forecast)
                                }
                            },
                        }
                    ],
                    history
                ),
            }),
            (value) => setResponse((r) => r.concat(value))
        )

    }
    return <ChatContainer>
        <Alert className="mb-2">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-lg">せつめい</AlertTitle>
            <AlertDescription>
                これ以上ないほどシンプルな、LLMに関数を実行させるアプリ。
                LLMは今日と明日の大阪と東京の天気を言える
            </AlertDescription>
        </Alert>
        {forecast && <Card className="mb-2 mt-2 p-2">
            <CardTitle className="flex items-center">
                <h1 className="ml-6 mt-4">{forecast.forecast.telop} {forecast.forecast.temperature.max.celsius}℃</h1>
            </CardTitle>
            <CardContent style={{
                maxHeight: 120,
                overflow: "auto"
            }}>{forecast.text}</CardContent>
        </Card>}
        <Chat response={response} onSend={send} />
    </ChatContainer>
}