import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signInWithEmail } from '../actions'
import { SignInWithEmailButton } from './sign-in-with-email-button'

export function SignInForm() {
  return (
    <form action={signInWithEmail} method="POST" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          id="email"
          type="email"
          defaultValue="admin@rocketseat.team"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          id="password"
          type="password"
          defaultValue="123456"
        />
      </div>

      <SignInWithEmailButton />
    </form>
  )
}
