import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Info } from "lucide-react"

export const ChatContainer = ({ children }: {
    children: React.ReactNode
}) => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }}>
        <div style={{
            margin: "0 auto",
            padding: 32,
            maxWidth: 600,
            width: "100%"
        }}>
            {children}
        </div>
    </div>
}

export const Chat = ({ response, onSend }: {
    response: string,
    onSend: (text: string) => void
}) => {
    const [input, setInput] = useState("")
    return <>
        <Textarea readOnly value={response} style={{
            resize: "none",
            height: 300
        }}></Textarea>
        <div className="flex mt-2 gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)}></Input>
            <Button onClick={async () => {
                onSend(input)
                setInput("")
            }}>Submit</Button>
        </div>
    </>
}

export const ChatVision = ({ response, onSend }: {
    response: string,
    onSend: (text: string, url: string) => void
}) => {
    const [inputText, setInputText] = useState("")
    const [inputUrl, setInputUrl] = useState("")
    return <>
        <Textarea readOnly value={response} style={{
            resize: "none",
            height: 300
        }}></Textarea>
        <div className="flex mt-2 gap-2">
            <Input placeholder="https://" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)}></Input>
            <Input type="file" onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const  reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        setInputUrl(reader.result as string)
                    };
                }
            }}></Input>
        </div>
        <div className="flex mt-2 gap-2">
            <Input placeholder="..." value={inputText} onChange={(e) => setInputText(e.target.value)}></Input>
            <Button onClick={async () => {
                onSend(inputText, inputUrl)
                setInputText("")
                setInputUrl("")
            }}>Submit</Button>
        </div>
    </>
}