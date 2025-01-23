/* eslint-disable @typescript-eslint/no-unused-vars */
import {execaCommand} from '@esm2cjs/execa';
import {
    CreateRepositoryCommand,
    DescribeRepositoriesCommand,
    ECRClient,
} from '@aws-sdk/client-ecr';
import {toResultAsync} from './toResult';

let ecr: ECRClient|undefined;

/**
 * Initialize the ECR client.
 * We assume that region and credentials are set up either via IAM, environment variables,
 * or the AWS CLI.
 */
export function initEcrClient(): void {

    ecr = new ECRClient();

}

export async function ecrRepoExists(name: string): Promise<boolean> {

    if (!ecr) throw new Error('ECR client not initialized');

    console.log(`looking up ECR repository ${name}`);

    const [err, resp] = await toResultAsync(ecr.send(new DescribeRepositoriesCommand({
        repositoryNames: [name],
    })));

    if (!err) {

        return true;

    }

    if (err.name === 'RepositoryNotFoundException') {

        return false;

    } else {

        throw err;

    }

}

export async function createEcrRepo(name: string): Promise<void> {

    if (!ecr) throw new Error('ECR client not initialized');

    console.log(`creating ECR repository ${name}`);

    await ecr.send(new CreateRepositoryCommand({repositoryName: name}));

}

export async function authenticateDockerToEcrRepo(url: string): Promise<void> {

    if (!ecr) throw new Error('ECR client not initialized');

    console.log('authenticating Docker to ECR...');

    const {stdout: password} = await execaCommand('aws ecr get-login-password');

    await execaCommand(`docker login --username AWS --password-stdin ${url}`, {input: password});

}

export async function pushImageToEcr(name: string, tag: string, url: string): Promise<void> {

    if (!ecr) throw new Error('ECR client not initialized');

    console.log(`pushing Docker image ${name}:${tag} to ECR...`);
    await execaCommand(`docker push ${url}:${tag}`);

}
