import ChatWindow from '../components/ChatWindow'

export default function AiChatPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Product Assistant</h1>
        <p className="text-sm text-gray-500 mt-1">
          Powered by Spring AI · GPT-4o-mini with function calling — queries live product database
        </p>
      </div>
      <ChatWindow />
    </div>
  )
}
