import Hero from './components/Hero'
import Uploader from './components/Uploader'
function App() {
  return (
    <div className="min-h-[100vh] bg-gray-950 text-white flex flex-col items-center p-6">
      <Hero />

      {/* Uploader */}
      <Uploader />
    </div>
  )
}

export default App
