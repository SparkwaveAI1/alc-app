import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎓 ALC</h1>
          <p className="text-muted-foreground">AI Learning Companion</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
