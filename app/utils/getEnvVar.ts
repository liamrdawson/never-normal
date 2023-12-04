// If an environment variable is not available, we will get `undefined` instead.
// This means that we'll get misleaing errors when we try to use the variable.
// E.g. we get Error: Unauthorized when we try to use an API key.
export function getEnvVar(environmentVariable: string) {
	const unvalidatedEnvironmentVariable = process.env[environmentVariable]

	if (!unvalidatedEnvironmentVariable) {
		throw new Error(
			`Couldn't find environment variable: ${environmentVariable}`
		)
	}

	return unvalidatedEnvironmentVariable
}
