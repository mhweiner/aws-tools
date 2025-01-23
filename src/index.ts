import * as dockerMod from './lib/docker';
import * as ecrMod from './lib/ecr';
import * as cfnMod from './lib/cfn';
import * as stsMod from './lib/sts';
import * as elbMod from './lib/elb';

export const cfn = cfnMod;
export const ecr = ecrMod;
export const docker = dockerMod;
export const sts = stsMod;
export const elb = elbMod;
