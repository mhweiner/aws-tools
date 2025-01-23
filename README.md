# aws-tools

A collection of tools for managing AWS infrastructure.

## CLI commands

You must first authenticate via aws cli or export keys into shell.

### create-stack 

```bash
./bin/create-stack {STACK_NAME} {TEMPLATE_FILE} {PARAMS_FILE}
```

Stack name is the name of the stack in CloudFormation. Template file is the path to the CloudFormation template. Params file is the path to the parameters file.

### update-stack

```bash
./bin/update-stack {STACK_NAME} {TEMPLATE_FILE} {PARAMS_FILE}
```

Stack name is the name of the stack in CloudFormation. Template file is the path to the CloudFormation template. Params file is the path to the parameters file. There must be changes to the template in order for the stack to update.

### redeploy-stack

```bash
./bin/redeploy-stack {STACK_NAME} {TEMPLATE_FILE} {PARAMS_FILE}
```

Redeploys a CloudFormation stack with the given name and template file, using the existing stack's parameters. Useful for updating a stack with a new template without having to specify all the parameters again, or for re-deploying a stack that failed to create for some reason.

## Commit Messages

Commit messages are parsed via [autorel](https://github.com/mhweiner/autorel) to determine the version bump, channel/tag, and trigger a release. Commit messages must follow the following rules:

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard specification (ie, `fix: fix a bug`, `feat: add new feature`, `feat!: add breaking change`)
- Use one of the following types: `build`, `ci`, `chore`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Here are some examples of commit messages and the resulting [SemVer](https://semver.org) version bump:

- `fix: fix a bug` -> `0.0.1`
- `feat: add new feature` -> `0.1.0`
- `feat!: add breaking change` -> `1.0.0`

By default, the following types do not trigger a version bump or release:

- `build`, `ci`, `chore`, `docs`, `refactor`, `style`, `test`

You can find more examples in the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) documentation.

## Deploying

Every commit made to `main` that triggers a release per above and passes CI is deployed to production via Github Actions. See the following:

- [Autorel Documentation](https://github.com/mhweiner/autorel)
- [Autorel Configuration](.autorel.yaml)
- [Github Actions Documentation](https://docs.github.com/en/actions)
- [Github Actions Configuration](.github/workflows/release.yml)