import {CloudFormationClient} from '@aws-sdk/client-cloudformation';

export type TemplateParams = Record<string, any>;
export type Template<P extends TemplateParams> = {
    template: string
    params: P
} | string;

let cf: CloudFormationClient|undefined;

export function initCloudFormationClient(): void {

    cf = new CloudFormationClient();

}

export function getCfClient(): CloudFormationClient {

    if (!cf) throw new Error('CloudFormation client not initialized');

    return cf;

}

export * from './createStack';
export * from './getStack';
export * from './updateStack';
export * from './deleteStack';
export * from './validateTemplate';
