"use strict";
class Rabbit {
    constructor(state = "alive") {
        this.state = state;
    }
    die() {
        return new Rabbit("dead");
    }
    create(n) {
        if (typeof n !== "number")
            throw new Error("Rabbit.create(): n is not a number");
        return Array(n).fill(new Rabbit("alive"));
    }
}
class Fox {
    constructor(state = "alive") {
        this.state = state;
    }
    die() {
        return new Fox("dead");
    }
    create(n) {
        if (typeof n !== "number")
            throw new Error("Fox.create(): n is not a number");
        return Array(n).fill(new Fox("alive"));
    }
}
class Field {
    constructor(rabbits, foxes, rules) {
        this.rabbits = rabbits;
        this.foxes = foxes;
        this.rules = rules;
        this.creatures = [...rabbits, ...foxes];
    }
    getRabbits() {
        return this.countCreature(this.rabbits);
    }
    getFoxes() {
        return this.countCreature(this.foxes);
    }
    setRabbits(rabbits) {
        this.rabbits = rabbits;
        this.creatures = [...rabbits, ...this.foxes];
    }
    setFoxes(foxes) {
        this.foxes = foxes;
        this.creatures = [...this.rabbits, ...foxes];
    }
    addRabbits(rabbits) {
        this.rabbits.push(...rabbits);
        this.creatures = [...this.rabbits, ...this.foxes];
    }
    addFoxes(foxes) {
        this.foxes.push(...foxes);
        this.creatures = [...this.rabbits, ...this.foxes];
    }
    killRabbits(n) {
        let count = 0;
        this.rabbits = this.rabbits.map((rabbit, _) => {
            if (count < n && rabbit.state == "alive") {
                count += 1;
                return rabbit.die();
            }
            return rabbit;
        });
        this.creatures = [...this.rabbits, ...this.foxes];
    }
    killFoxes(n) {
        let count = 0;
        this.foxes = this.foxes.map((fox, _) => {
            if (count < n && fox.state == "alive") {
                count += 1;
                return fox.die();
            }
            return fox;
        });
        this.creatures = [...this.rabbits, ...this.foxes];
    }
    getExecutableRules() {
        return this.rules.filter((rule) => {
            return rule.isExecutable(this);
        });
    }
    // 生きているcreatureの数を数える
    countCreature(creatures) {
        let count = 0;
        for (const creature of creatures) {
            if (creature.state == "alive") {
                count += 1;
            }
        }
        return count;
    }
}
class RabbitIncreaseRule {
    apply(field) {
        // ウサギがいない場合は何もしない
        if (this.isExecutable(field))
            field.addRabbits(Array(1).fill(new Rabbit("alive")));
        return field;
    }
    isExecutable(field) {
        return field.getRabbits() > 0;
    }
}
class RabbitDoubleIncreaseRule {
    apply(field) {
        // ウサギがいない場合は何もしない
        if (this.isExecutable(field))
            field.addRabbits(Array(2).fill(new Rabbit("alive")));
        return field;
    }
    isExecutable(field) {
        return field.getRabbits() > 0;
    }
}
class RabbitReduceRule {
    apply(field) {
        if (this.isExecutable(field))
            field.killRabbits(1);
        return field;
    }
    isExecutable(field) {
        return field.getRabbits() > 0;
    }
}
class FoxReduceRule {
    apply(field) {
        field.killFoxes(1);
        return field;
    }
    isExecutable(field) {
        return field.getFoxes() > 0;
    }
}
class FoxIncreaseRule {
    apply(field) {
        // キツネがいない場合は何もしない
        if (this.isExecutable(field))
            field.addFoxes(Array(1).fill(new Fox("alive")));
        return field;
    }
    isExecutable(field) {
        return field.getFoxes() > 0 && field.getRabbits() > 0;
    }
}
class FoxEatsRabbitRule {
    apply(field) {
        // キツネがいない場合は何もしない
        if (this.isExecutable(field))
            field.killRabbits(1);
        field.addFoxes(Array(1).fill(new Fox("alive")));
        return field;
    }
    isExecutable(field) {
        return field.getFoxes() > 0 && field.getRabbits() > 0;
    }
}
const assert = (condition, message = "") => {
    if (!condition) {
        console.error("Assertion failed: ", message);
        throw new Error("Assertion failed");
    }
};
class Main {
    simulate(rabbitNum, foxNum, count) {
        // console.log("----Simulation start----")
        const initRules = [
            new RabbitIncreaseRule(),
            new FoxIncreaseRule(),
            new FoxEatsRabbitRule(),
            new RabbitReduceRule(),
            new FoxReduceRule(), // キツネ→
        ];
        const rabbitCountTransition = [rabbitNum];
        const foxCountTransition = [foxNum];
        let field = new Field(new Rabbit().create(rabbitNum), new Fox().create(foxNum), initRules);
        let extincted = false;
        // console.log(`Rabbit: ${field.getRabbits()}, Fox: ${(field.getFoxes())}`);
        for (let i = 0; i < count; i++) {
            // ランダムにルールを適用
            const rules = field.getExecutableRules();
            if (rules.length == 0) {
                console.log("No executable rules");
                extincted = true;
                break;
            }
            const rule = rules[Math.floor(Math.random() * rules.length)];
            // フィールドを更新
            field = rule.apply(field);
            // うさぎとキツネの数を記録
            rabbitCountTransition.push(field.getRabbits());
            foxCountTransition.push(field.getFoxes());
        }
        // console.log(`Rabbit: ${field.getRabbits()}, Fox: ${field.getFoxes()}`);
        return {
            rabbitCountTransition,
            foxCountTransition,
            extincted
        };
    }
    test() {
        const initRules = [
            new RabbitDoubleIncreaseRule(),
            new RabbitReduceRule(),
            new FoxIncreaseRule(),
            new FoxReduceRule(),
        ];
        // テスト: キツネとウサギの数が増えるルールと減るルールを適用して、数が正しいか確認
        const field = new Field(new Rabbit().create(5), new Fox().create(5), initRules);
        const rule = new FoxIncreaseRule();
        rule.apply(field);
        assert(field.getFoxes() == 6);
        console.log("test increase rule passed");
        const field2 = new Field(new Rabbit().create(5), new Fox().create(5), initRules);
        const rule2 = new RabbitReduceRule();
        rule2.apply(field2);
        rule2.apply(field2);
        assert(field2.getRabbits() == 3);
        console.log("test reduce rule passed");
        const field3 = new Field(new Rabbit().create(5), new Fox().create(5), initRules);
        const rule3 = new RabbitIncreaseRule();
        rule3.apply(field3);
        assert(field3.getRabbits() == 6);
        console.log("test rabbit increase rule passed");
        const field4 = new Field(Array(5).fill(new Rabbit("dead")), new Fox().create(5), initRules);
        const rule4 = new RabbitIncreaseRule();
        rule4.apply(field4);
        assert(field4.getRabbits() == 0);
        console.log("test dead rabbit increase rule passed");
        const field5 = new Field(new Rabbit().create(0), new Fox().create(0), initRules);
        const rule5 = new RabbitIncreaseRule();
        rule5.apply(field5);
        const rule52 = new FoxIncreaseRule();
        rule52.apply(field5);
        assert(field5.getRabbits() == 0);
        assert(field5.getFoxes() == 0);
        console.log("test no increase rule passed");
        const field6 = new Field(new Rabbit().create(5), new Fox().create(5), initRules);
        const rule6 = new FoxReduceRule();
        rule6.apply(field6);
        assert(field6.getFoxes() == 4);
        console.log("test fox reduce rule passed");
        const field7 = new Field(new Rabbit().create(5), new Fox().create(5), initRules);
        const rule7 = new FoxEatsRabbitRule();
        rule7.apply(field7);
        assert(field7.getFoxes() == 6);
        assert(field7.getRabbits() == 4);
        console.log("test fox eats rabbit rule passed");
    }
    simulation1(rabbitNum, foxNum, count, years) {
        if (!rabbitNum || !foxNum || !count || !years)
            return {
                rabbitResult: [0],
                foxResult: [0],
                extinctResult: [false]
            };
        console.log("----Simulation start----");
        console.log(`Rabbit: ${rabbitNum}, Fox: ${foxNum}, ${count} × ${years}回`);
        const rabbitResult = [];
        const foxResult = [];
        const extinctResult = [];
        for (let i = 0; i < count; i++) {
            const { rabbitCountTransition: rabbit, foxCountTransition: fox, extincted } = this.simulate(rabbitNum, foxNum, years);
            rabbitResult.push(rabbit[rabbit.length - 1]);
            foxResult.push(fox[fox.length - 1]);
            extinctResult.push(extincted);
        }
        console.log("----Result----");
        console.log(`Rabbit average: ${rabbitResult.reduce((a, b) => a + b) / rabbitResult.length}`);
        console.log(`Fox average: ${foxResult.reduce((a, b) => a + b) / foxResult.length}`);
        return { rabbitResult, foxResult, extinctResult };
    }
}
const main = new Main();
main.test();
// const { rabbitResult: rabbit, foxResult: fox, extinctResult } = main.simulation1(5, 5, 100, 10);
// console.log(rabbit);
// console.log(fox);
// console.log(extinctResult);
