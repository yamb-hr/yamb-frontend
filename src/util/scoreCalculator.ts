import { BoxType } from '../enums/BoxType';

const gameConstants = {
    BONUS_TRIPS: 10,
    BONUS_STRAIGHT_SMALL: 35,
    BONUS_STRAIGHT_LARGE: 45,
    BONUS_BOAT: 30,
    BONUS_CARRIAGE: 40,
    BONUS_YAMB: 50
};

class ScoreCalculator {

    calculateScore(diceValues: number[], boxType: BoxType): number {
        switch (boxType) {
            case BoxType.Ones:
            case BoxType.Twos:
            case BoxType.Threes:
            case BoxType.Fours:
            case BoxType.Fives:
            case BoxType.Sixes:
                return this.calculateSum(diceValues, boxType);
            case BoxType.Max:
            case BoxType.Min:
                return this.calculateSum(diceValues);
            case BoxType.Trips:
                return this.calculateTrips(diceValues);
            case BoxType.Straight:
                return this.calculateStraight(diceValues);
            case BoxType.Boat:
                return this.calculateBoat(diceValues);
            case BoxType.Carriage:
                return this.calculateCarriage(diceValues);
            case BoxType.Yamb:
                return this.calculateYamb(diceValues);
            default:
                throw new Error("Invalid BoxType: " + boxType);
        }
    }
    
    calculateSum(diceValues: number[], boxType?: BoxType): number {
        if (boxType === undefined) {
            return diceValues.reduce((sum, value) => sum + value, 0);
        } else {
            let sum = 0;
            diceValues.forEach(value => {
                if (value === this.boxTypeToNumber(boxType)) {
                    sum += value;
                }
            });
            return sum;
        }
    }
    
    boxTypeToNumber(boxType: BoxType): number {
        return [
            BoxType.Ones,
            BoxType.Twos,
            BoxType.Threes,
            BoxType.Fours,
            BoxType.Fives,
            BoxType.Sixes
        ].indexOf(boxType) + 1;
    }
    
    calculateTrips(diceValues: number[]): number {
        const sum = this.calculateRecurringValueSum(diceValues, 3);
        return sum > 0 ? sum + gameConstants.BONUS_TRIPS : 0;
    }
    
    calculateStraight(diceValues: number[]): number {
        const foundValues = [false, false, false, false, false, false];
        diceValues.forEach(value => foundValues[value - 1] = true);
    
        if (foundValues.slice(0, 5).every(Boolean)) {
            return gameConstants.BONUS_STRAIGHT_SMALL;
        } else if (foundValues.slice(1, 6).every(Boolean)) {
            return gameConstants.BONUS_STRAIGHT_LARGE;
        }
        return 0;
    }
    
    calculateBoat(diceValues: number[]): number {
        const tripsSum = this.calculateRecurringValueSum(diceValues, 3);
        if (tripsSum > 0) {
            const remainingDiceValues = diceValues.filter(value => value !== tripsSum / 3);
            const pairSum = this.calculateRecurringValueSum(remainingDiceValues, 2);
            if (pairSum > 0) {
                return pairSum + tripsSum + gameConstants.BONUS_BOAT;
            }
        }
        return 0;
    }
    
    calculateCarriage(diceValues: number[]): number {
        const sum = this.calculateRecurringValueSum(diceValues, 4);
        return sum > 0 ? sum + gameConstants.BONUS_CARRIAGE : 0;
    }
    
    calculateYamb(diceValues: number[]): number {
        const sum = this.calculateRecurringValueSum(diceValues, 5);
        return sum > 0 ? sum + gameConstants.BONUS_YAMB : 0;
    }
    
    calculateRecurringValueSum(diceValues: number[], threshold: number): number {
        for (let i = 1; i <= 6; i++) {
            const count = diceValues.filter(value => value === i).length;
            if (count >= threshold) {
                return i * threshold;
            }
        }
        return 0;
    }
}

const scoreCalculator = new ScoreCalculator();
export default scoreCalculator;