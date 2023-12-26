import { BoxType } from "../constants/box-types";
import { GameConstants } from "../constants/game-constants";

function calculateScore(diceValues, boxType) {
    switch (boxType) {
        case BoxType.ONES:
        case BoxType.TWOS:
        case BoxType.THREES:
        case BoxType.FOURS:
        case BoxType.FIVES:
        case BoxType.SIXES:
            return calculateSum(diceValues, boxType);
        case BoxType.MAX:
        case BoxType.MIN:
            return calculateSum(diceValues);
        case BoxType.TRIPS:
            return calculateTrips(diceValues);
        case BoxType.STRAIGHT:
            return calculateStraight(diceValues);
        case BoxType.BOAT:
            return calculateBoat(diceValues);
        case BoxType.CARRIAGE:
            return calculateCarriage(diceValues);
        case BoxType.YAMB:
            return calculateYamb(diceValues);
        default:
            throw new Error("Invalid BoxType: " + boxType);
    }
}

export default calculateScore;

function calculateSum(diceValues, boxType) {
    if (boxType !== undefined) {
        return diceValues.reduce((sum, value) => sum + (value === boxType + 1 ? value : 0), 0);
    } else {
        return diceValues.reduce((sum, value) => sum + value, 0);
    }
}

function calculateTrips(diceValues) {
    let sum = calculateRecurringValueSum(diceValues, 3);
    if (sum > 0) {
        sum += GameConstants.BONUS_TRIPS;
    }
    return sum;
}

function calculateStraight(diceValues) {
    let foundValues = [false, false, false, false, false, false];
    diceValues.forEach(value => foundValues[value - 1] = true);
    if (foundValues.slice(0, 5).every(v => v)) {
        return GameConstants.BONUS_STRAIGHT_SMALL;
    } else if (foundValues.slice(1, 6).every(v => v)) {
        return GameConstants.BONUS_STRAIGHT_LARGE;
    }
    return 0;
}

function calculateBoat(diceValues) {
    let tripsSum = calculateRecurringValueSum(diceValues, 3);
    if (tripsSum > 0) {
        let remainingDiceValues = diceValues.filter(value => value !== tripsSum / 3);
        let pairSum = calculateRecurringValueSum(remainingDiceValues, 2);
        if (pairSum > 0) {
            return pairSum + tripsSum + GameConstants.BONUS_BOAT;
        }
    }
    return 0;
}

function calculateCarriage(diceValues) {
    let sum = calculateRecurringValueSum(diceValues, 4);
    if (sum > 0) {
        sum += GameConstants.BONUS_CARRIAGE;
    }
    return sum;
}

function calculateYamb(diceValues) {
    let sum = calculateRecurringValueSum(diceValues, 5);
    if (sum > 0) {
        sum += GameConstants.BONUS_YAMB;
    }
    return sum;
}

function calculateRecurringValueSum(diceValues, threshold) {
    let sum = 0;
    for (let i = 1; i <= 6; i++) {
        let count = diceValues.filter(value => value === i).length;
        if (count >= threshold) {
            sum = i * threshold;
            break;
        }
    }
    return sum;
}