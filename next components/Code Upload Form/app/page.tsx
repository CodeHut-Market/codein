import { CodeSnippetUploadForm } from "@/components/code-snippet-upload-form"

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 bg-[rgba(108,136,115,1)]">
      <div className="max-w-4xl mx-auto">
        <CodeSnippetUploadForm />
      </div>
    </main>
  )
}
