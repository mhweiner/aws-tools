import {test} from 'hoare';
import {getHighestPriority, getNextPriority} from './elb';
import {toResult} from './toResult';

test('getHighestPriority should return 0 if no rules', (assert) => {

    assert.equal(getHighestPriority([]), 0);

});

test('getHighestPriority should return 0 if no valid priorities', (assert) => {

    assert.equal(getHighestPriority([{Priority: ''}]), 0);
    assert.equal(getHighestPriority([{Priority: ''}, {Priority: ''}]), 0);
    assert.equal(getHighestPriority([{Priority: 'default'}]), 0);
    assert.equal(getHighestPriority([{Priority: undefined}, {Priority: 'blah'}]), 0);

});

test('getHighestPriority should return highest priority', (assert) => {

    assert.equal(getHighestPriority([{Priority: '1'}]), 1);
    assert.equal(getHighestPriority([{Priority: '1'}, {Priority: '2'}]), 2);
    assert.equal(getHighestPriority([{Priority: '1'}, {Priority: '2'}, {Priority: '3'}]), 3);
    assert.equal(getHighestPriority([{Priority: '3000'}, {Priority: '2'}, {Priority: '1'}]), 3000);
    assert.equal(getHighestPriority([{Priority: '5'}, {Priority: '1000'}, {Priority: 'default'}]), 1000);

});

test('getNextPriority should throw if => range', (assert) => {

    const [err] = toResult(() => getNextPriority(1399));

    assert.errorsEquivalent(err, new Error('out of available priorities! (1000, 1399)'));

});

test('getNextPriority should return lowest reserved range if highest priority is lower or equal', (assert) => {

    assert.equal(getNextPriority(0), 1000);
    assert.equal(getNextPriority(1), 1000);
    assert.equal(getNextPriority(2), 1000);
    assert.equal(getNextPriority(3), 1000);
    assert.equal(getNextPriority(999), 1000);

});

test('getNextPriority should return highest + 1 if highest priority is higher', (assert) => {

    assert.equal(getNextPriority(1000), 1001);
    assert.equal(getNextPriority(1001), 1002);
    assert.equal(getNextPriority(1002), 1003);
    assert.equal(getNextPriority(1003), 1004);
    assert.equal(getNextPriority(1398), 1399);

});

test('getHighestPriority should correctly handle mixed valid and invalid priorities', (assert) => {

    assert.equal(getHighestPriority([{Priority: '2'}, {Priority: 'nan'}, {Priority: '3'}]), 3);
    assert.equal(getHighestPriority([{Priority: '200'}, {Priority: undefined}, {Priority: '100'}, {Priority: 'NaN'}]), 200);
    assert.equal(getHighestPriority([{Priority: '50'}, {Priority: 'not a number'}, {Priority: '60'}, {Priority: '0'}]), 60);

});

test('getHighestPriority should handle negative priorities, treating them as valid', (assert) => {

    assert.equal(getHighestPriority([{Priority: '-1'}, {Priority: '-2'}, {Priority: '0'}]), 0);
    assert.equal(getHighestPriority([{Priority: '-300'}, {Priority: '-200'}, {Priority: '-100'}]), -100);

});

test('getHighestPriority should handle large numbers correctly', (assert) => {

    assert.equal(getHighestPriority([{Priority: '999999999'}, {Priority: '888888888'}]), 999999999);

});

test('getHighestPriority should correctly handle priorities with leading zeros', (assert) => {

    assert.equal(getHighestPriority([{Priority: '007'}, {Priority: '08'}, {Priority: '009'}]), 9);

});

test('getHighestPriority should return 0 if priorities are all zeros', (assert) => {

    assert.equal(getHighestPriority([{Priority: '0'}, {Priority: '0'}, {Priority: '0'}]), 0);

});

test('getHighestPriority should return the highest priority even if it is a negative number', (assert) => {

    assert.equal(getHighestPriority([{Priority: '-50'}, {Priority: '-20'}, {Priority: '-10'}]), -10);

});


