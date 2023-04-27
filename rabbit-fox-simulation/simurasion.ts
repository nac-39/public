type State = "alive" | "dead";
interface Creature {
    state: State;
    die(): Creature;
    create(n: number): Creature[];
}

class Rabbit implements Creature {
    constructor(public state: State = "alive") { }
    die() {
        return new Rabbit("dead");
    }
    create(n: number) {
        if (typeof n !== "number") throw new Error("Rabbit.create(): n is not a number");
        return Array(n).fill(new Rabbit("alive"));
    }
}

class Fox implements Creature {
    constructor(public state: State = "alive") { }
    die() {
        return new Fox("dead");
    }
    create(n: number) {
        if (typeof n !== "number") throw new Error("Fox.create(): n is not a number");
        return Array(n).fill(new Fox("alive"));
    }
}

class Field {
    public creatures: Creature[];
    constructor(private rabbits: Rabbit[], private foxes: Fox[], private rules: Rule[]) {
        this.creatures = [...rabbits, ...foxes];
    }
    getRabbits() {
        return this.countCreature(this.rabbits);
    }
    getFoxes() {
        return this.countCreature(this.foxes);
    }
    setRabbits(rabbits: Rabbit[]) {
        this.rabbits = rabbits;
        this.creatures = [...rabbits, ...this.foxes];
    }
    setFoxes(foxes: Fox[]) {
        this.foxes = foxes;
        this.creatures = [...this.rabbits, ...foxes];
    }
    addRabbits(rabbits: Rabbit[]) {
        this.rabbits.push(...rabbits);
        this.creatures = [...this.rabbits, ...this.foxes];
    }
    addFoxes(foxes: Fox[]) {
        this.foxes.push(...foxes);
        this.creatures = [...this.rabbits, ...this.foxes];
    }
    killRabbits(n: number) {
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
    killFoxes(n: number) {
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
            return rule.isExecutable(this)
        });
    }
    // 生きているcreatureの数を数える
    countCreature(creatures: Creature[]): number {
        let count = 0
        for (const creature of creatures) {
            if (creature.state == "alive") {
                count += 1;
            }
        }
        return count;
    }
}


// ルールたち
interface Rule {
    apply(field: Field): Field;
    isExecutable(field: Field): boolean;
}

class RabbitIncreaseRule implements Rule {
    apply(field: Field) {
        // ウサギがいない場合は何もしない
        if (this.isExecutable(field))
            field.addRabbits(Array(1).fill(new Rabbit("alive")));
        return field
    }
    isExecutable(field: Field): boolean {
        return field.getRabbits() > 0;
    }
}

class RabbitDoubleIncreaseRule implements Rule {
    apply(field: Field) {
        // ウサギがいない場合は何もしない
        if (this.isExecutable(field))
            field.addRabbits(Array(2).fill(new Rabbit("alive")));
        return field
    }
    isExecutable(field: Field): boolean {
        return field.getRabbits() > 0
    }
}

class RabbitReduceRule implements Rule {
    apply(field: Field) {
        if (this.isExecutable(field))
            field.killRabbits(1);
        return field
    }
    isExecutable(field: Field): boolean {
        return field.getRabbits() > 0
    }
}

class FoxReduceRule implements Rule {
    apply(field: Field) {
        field.killFoxes(1);
        return field
    }
    isExecutable(field: Field): boolean {
        return field.getFoxes() > 0
    }
}

class FoxIncreaseRule implements Rule {
    apply(field: Field) {
        // キツネがいない場合は何もしない
        if (this.isExecutable(field))
            field.addFoxes(Array(1).fill(new Fox("alive")));
        return field
    }
    isExecutable(field: Field): boolean {
        return field.getFoxes() > 0 && field.getRabbits() > 0
    }
}

class FoxEatsRabbitRule implements Rule {
    apply(field: Field) {
        // キツネがいない場合は何もしない
        if (this.isExecutable(field))
            field.killRabbits(1);
        field.addFoxes(Array(1).fill(new Fox("alive")));
        return field
    }
    isExecutable(field: Field): boolean {
        return field.getFoxes() > 0 && field.getRabbits() > 0
    }
}

// テスト用assert関数
const assert = (condition: boolean, message: string = "") => {
    if (!condition) {
        console.error("Assertion failed: ", message);
        throw new Error("Assertion failed");
    }
};

class Main {
    // 一回シミュレーションを行う
    simulate(rabbitNum: number, foxNum: number, count: number) {
        // console.log("----Simulation start----")
        // initRulesをいじることで、最初のルールの発生割合を変えられる。
        const initRules: Rule[] = [
            new RabbitIncreaseRule(), // ウサギ→ウサギ、ウサギ
            new FoxIncreaseRule(),    // キツネ→キツネ、キツネ
            new FoxEatsRabbitRule(),  // ウサギ、キツネ→キツネ、キツネ
            new RabbitReduceRule(),   // ウサギ→
            new FoxReduceRule(),      // キツネ→
        ];
        const rabbitCountTransition: number[] = [rabbitNum];
        const foxCountTransition: number[] = [foxNum];
        let field = new Field(new Rabbit().create(rabbitNum), new Fox().create(foxNum), initRules);
        let extincted = false;
        // console.log(`Rabbit: ${field.getRabbits()}, Fox: ${(field.getFoxes())}`);
        for (let i = 0; i < count; i++) {
            // ランダムにルールを適用する。適用できないルールは除外される。
            const rules = field.getExecutableRules()
            if (rules.length == 0) {
                console.log("No executable rules")
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
        } as {
            rabbitCountTransition: number[],
            foxCountTransition: number[],
            extincted: boolean
        }
    }


    // 何回もシミュレーションを回す
    simulation1(rabbitNum: number, foxNum: number, count: number, years: number): {
        rabbitResult: number[], foxResult: number[], extinctResult: boolean[]
    } {
        if (!rabbitNum || !foxNum || !count || !years) return {
            rabbitResult: [0],
            foxResult: [0],
            extinctResult: [false]
        };
        console.log("----Simulation start----")
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
        console.log("----Result----")
        console.log(`Rabbit average: ${rabbitResult.reduce((a, b) => a + b) / rabbitResult.length}`);
        console.log(`Fox average: ${foxResult.reduce((a, b) => a + b) / foxResult.length}`);
        return { rabbitResult, foxResult, extinctResult }
    }

    test() {
        const initRules: Rule[] = [
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
}

const main = new Main();
main.test();
// const { rabbitResult: rabbit, foxResult: fox, extinctResult } = main.simulation1(5, 5, 100, 10);
// console.log(rabbit);
// console.log(fox);
// console.log(extinctResult);
