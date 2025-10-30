import { axe, toHaveNoViolations } from 'jest-axe'
import { render } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import LoginPage from '../app/login/page'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  test('Login page should have no accessibility violations', async () => {
    const { container } = render(
      <SessionProvider session={null}>
        <LoginPage />
      </SessionProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})