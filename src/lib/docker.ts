import {execaCommand} from '@esm2cjs/execa';

export async function buildDockerImage(input: {
    name: string
    tag: string
    url: string
    npmToken: string
    nodeEnv: string
    platform: string
    customDockerfilePath?: string
}): Promise<void> {

    const {tag, url, npmToken, nodeEnv, customDockerfilePath} = input;

    console.log('building Docker image...', input);

    await execaCommand(`docker build \
        --platform ${input.platform} \
        --build-arg NPM_TOKEN=${npmToken} \
        --build-arg NODE_ENV=${nodeEnv} \
        -t ${url}:${tag} \
        -f ${customDockerfilePath ?? './Dockerfile'} .`);

}
