import type { Config } from 'jest'

const config: Config = {
  passWithNoTests: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
}

export default config
