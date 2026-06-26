import { Suspense } from 'react'
import GoogleSetupInner from './GoogleSetupInner'

export default function GoogleSetupPage() {
  return (
    <Suspense>
      <GoogleSetupInner />
    </Suspense>
  )
}
