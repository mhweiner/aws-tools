import {AssumeRoleCommand, STSClient} from '@aws-sdk/client-sts';

export async function assumeRole(roleArn: string): Promise<void> {

    console.log(`assuming role ${roleArn}...`);

    const sts = new STSClient();
    const result = await sts.send(new AssumeRoleCommand({
        RoleArn: roleArn,
        RoleSessionName: 'deploy',
    }));

    if (!result.Credentials) throw new Error('failed to assume role');

    const creds = {
        accessKeyId: result.Credentials?.AccessKeyId,
        secretAccessKey: result.Credentials?.SecretAccessKey,
        sessionToken: result.Credentials?.SessionToken,
    };

    if (!creds.accessKeyId || !creds.secretAccessKey || !creds.sessionToken) {

        throw new Error('failed to assume role');

    }

    process.env.AWS_ACCESS_KEY_ID = creds.accessKeyId || '';
    process.env.AWS_SECRET_ACCESS_KEY = creds.secretAccessKey || '';
    process.env.AWS_SESSION_TOKEN = creds.sessionToken || '';

}
