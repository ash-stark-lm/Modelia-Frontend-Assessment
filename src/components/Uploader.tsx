import React, { useState, useRef, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LiveSummary from './LiveSummary'

import History from './History'
import ImageUploader from './ImageUpload'
import PromptStyleForm from './PromptStyle'
import GeneratedResult from './GeneratedResult'
import StyleActions from './StyleActions'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type StyleType = 'Editorial' | 'Streetwear' | 'Vintage'

interface GenerateResponse {
  id: string
  imageUrl: string
  prompt: string
  style: string
  createdAt: string
}

interface GenerateRequest {
  imageDataUrl: string | null
  prompt: string
  style: string
}

const mockGenerateApi = async (
  body: GenerateRequest,
  abortController: AbortController,
  attempt = 1
): Promise<GenerateResponse> => {
  return new Promise<GenerateResponse>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (Math.random() < 0.2) {
        reject({ message: 'Model overloaded' })
      } else {
        resolve({
          id: crypto.randomUUID(),
          imageUrl: body.imageDataUrl || '',
          prompt: body.prompt,
          style: body.style,
          createdAt: new Date().toISOString(),
        })
      }
    }, 1000 + Math.random() * 1000)

    abortController.signal.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject({ message: 'Request aborted' })
    })
  }).catch(async (err: any) => {
    if (err.message === 'Model overloaded' && attempt < 3) {
      toast.error(`⚠️ Model overloaded (attempt ${attempt}). Retrying...`, {
        position: 'top-right',
        autoClose: 2500,
      })
      await new Promise((r) => setTimeout(r, 2 ** attempt * 500))
      return mockGenerateApi(body, abortController, attempt + 1)
    }
    throw err
  })
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })

export default function Uploader() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<StyleType>('Editorial')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<GenerateResponse | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [history, setHistory] = useState<GenerateResponse[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use a single timeline for the animation with stagger
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.8 },
        scrollTrigger: {
          trigger: '#uploader', // The parent container is the single trigger
          start: 'top 30%',
          end: 'bottom 20%',

          scrub: 2,
        },
      })

      // Animate the main sections with stagger
      tl.from(['.upload-section', '.preview-section', '.history-section'], {
        y: 90,
        opacity: 0,
        stagger: 0.2,
      })
    },
    { scope: containerRef }
  )

  useEffect(() => {
    const stored = localStorage.getItem('generationHistory')
    if (stored) setHistory(JSON.parse(stored))
  }, [])

  const handleImageUpload = async (url: string | null, file: File | null) => {
    if (file) {
      const base64 = await toBase64(file)
      setUploadedImageUrl(base64)
      setUploadedFile(file)
      toast.success(
        `Image "${file.name}" uploaded successfully! (${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB)`,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )
    } else {
      setUploadedImageUrl(null)
      setUploadedFile(null)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt before generating!', {
        position: 'top-right',
        autoClose: 4000,
      })
      return
    }

    setLoading(true)
    setGenerated(null)
    abortControllerRef.current = new AbortController()

    const loadingToastId = toast.loading('Generating your AI art...', {
      position: 'top-right',
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    })

    try {
      const res = await mockGenerateApi(
        {
          imageDataUrl: uploadedImageUrl,
          prompt,
          style,
        },
        abortControllerRef.current
      )

      setGenerated(res)
      const newHistory = [res, ...history].slice(0, 5)
      setHistory(newHistory)
      localStorage.setItem('generationHistory', JSON.stringify(newHistory))

      toast.update(loadingToastId, {
        render: '🎨 AI art generated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      toast.info(
        <div className="space-y-1 text-sm">
          <div>
            <strong>ID:</strong> {res.id.slice(0, 8)}...
          </div>
          <div>
            <strong>Prompt:</strong> {res.prompt}
          </div>
          <div>
            <strong>Style:</strong> {res.style}
          </div>
          <div>
            <strong>Created:</strong> {new Date(res.createdAt).toLocaleString()}
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )
    } catch (err: any) {
      if (err.message === 'Request aborted') {
        toast.dismiss(loadingToastId)
        toast.info('Generation cancelled', {
          position: 'top-right',
          autoClose: 3000,
        })
      } else {
        toast.update(loadingToastId, {
          render: `❌ Generation failed: ${err.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
      console.error('Generation error:', err)
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleAbort = () => {
    abortControllerRef.current?.abort()
    toast.info('Cancelling generation...', {
      position: 'top-right',
      autoClose: 2000,
    })
  }

  return (
    <>
      <div
        id="uploader"
        ref={containerRef}
        className="w-full max-w-[100vw] mx-auto min-h-screen space-y-10 rounded-xl border border-gray-900 bg-black p-8 shadow-md"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image + Actions */}
          <div className="flex flex-col space-y-6 upload-section">
            <h2 className="text-lg font-semibold text-gray-200">
              Upload & Style
            </h2>
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-6 shadow">
              <ImageUploader
                onImageUpload={handleImageUpload}
                uploadedImageUrl={uploadedImageUrl}
              />
              <StyleActions
                style={style}
                setStyle={setStyle}
                onGenerate={handleGenerate}
                onAbort={handleAbort}
                loading={loading}
              />
            </div>
          </div>

          {/* Right: Prompt + Live Preview */}
          <div className="flex flex-col space-y-6 preview-section">
            <h2 className="text-lg font-semibold text-gray-200">
              Prompt & Preview
            </h2>
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-6 shadow">
              <PromptStyleForm prompt={prompt} setPrompt={setPrompt} />
              <LiveSummary
                prompt={prompt}
                style={style}
                imageUrl={uploadedImageUrl}
              />
              <GeneratedResult generated={generated} />
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="w-full history-section">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">
            Recent History
          </h2>
          <div className="rounded-xl border border-gray-700 bg-black p-5 shadow">
            <History
              items={history}
              onSelect={(item) => {
                setUploadedImageUrl(item.imageUrl)
                setPrompt(item.prompt)
                setStyle(item.style as StyleType)
              }}
            />
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ fontSize: '14px' }}
      />
    </>
  )
}
