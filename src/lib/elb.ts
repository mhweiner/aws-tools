import {DescribeRulesCommand, ElasticLoadBalancingV2Client, Rule} from '@aws-sdk/client-elastic-load-balancing-v2';

export const reservedRange = [1000, 1399];

const {
    AWS_REGION,
} = process.env;

export function getHighestPriority(rules: Rule[]): number {

    const num = rules.map((rule) => {

        if (!rule.Priority) return 0;

        const num = parseInt(rule.Priority as string);

        return Number.isNaN(num) ? 0 : num;

    }).sort((a, b) => a - b).pop();

    return num || 0;

}

export function getNextPriority(highest: number): number {

    if (highest >= reservedRange[1]) throw new Error(`out of available priorities! (${reservedRange.join(', ')})`);

    return Math.max(highest + 1, reservedRange[0]);

}

export async function getNextALBPriority(listenerArn: string): Promise<number> {

    console.log('getting next available ALB Listener priority');

    const elbv2Client = new ElasticLoadBalancingV2Client({region: AWS_REGION});
    const command = new DescribeRulesCommand({
        ListenerArn: listenerArn,
        PageSize: 400,
    });

    const {Rules} = await elbv2Client.send(command);

    if (Rules && Rules.length > 0) {

        console.log(`${Rules.length} rules found for listener ${listenerArn}`);

        const highest = getHighestPriority(Rules);
        const nextAvail = getNextPriority(highest);

        console.log(`next available priority is ${nextAvail}`);

        return nextAvail;

    } else {

        console.log(`no rules found for listener ${listenerArn}`);
        console.log(`next available priority is ${reservedRange[1]}`);

        return reservedRange[1];

    }

}
