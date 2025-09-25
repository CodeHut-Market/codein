import LoadingSpinner from '../components/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner 
        variant="code-matrix" 
        size="xl" 
        message="Loading CodeHut" 
        className="animate-fade-in"
      />
    </div>
  )
}