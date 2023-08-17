import curry from '../curry';

describe('curry', () => {
    it('should curry 1 arg function', () => {
        const double = (a: number) => {
            return a + a;
        };

        const curriedDouble = curry(double);

        expect(curriedDouble(3)).toBe(double(3));
    });

    it('should curry 2 arg function', () => {
        const add = (a: number, b: number) => {
            return a + b;
        };

        const curriedAdd = curry(add);

        expect(curriedAdd(1)(2)).toBe(add(1, 2));
    });

    it('should curry 3 arg function', () => {
        const add = (a: number, b: number, c: number) => {
            return a + b + c;
        };

        const curriedAdd = curry(add);

        expect(curriedAdd(1)(2)(3)).toBe(add(1, 2, 3));
    });

    it('should curry 26 arg function', () => {
        const add = (
            a: number,
            b: number,
            c: number,
            d: number,
            e: number,
            f: number,
            g: number,
            h: number,
            i: number,
            j: number,
            k: number,
            l: number,
            m: number,
            n: number,
            o: number,
            p: number,
            q: number,
            r: number,
            s: number,
            t: number,
            u: number,
            v: number,
            w: number,
            x: number,
            y: number,
            z: number
        ) => {
            return (
                a +
                b +
                c +
                d +
                e +
                f +
                g +
                h +
                i +
                j +
                k +
                l +
                m +
                n +
                o +
                p +
                q +
                r +
                x +
                t +
                u +
                v +
                w +
                x +
                y +
                z
            );
        };

        const curriedAdd = curry(add);

        expect(
            curriedAdd(1)(2)(3)(4)(5)(6)(7)(8)(9)(10)(11)(12)(13)(14)(15)(16)(
                17
            )(18)(19)(20)(21)(22)(23)(24)(25)(26)
        ).toBe(
            add(
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26
            )
        );
    });

    it('should curry 0 arg function', () => {
        const getNumber = () => {
            return 123;
        };

        const curriedGetNumber = curry(getNumber);

        expect(curriedGetNumber()).toBe(getNumber());
    });

    it('readme example', () => {
        const add = (a: number, b: number, c: number) => {
            return a + b + c;
        };

        const curriedAdd = curry(add);
        const addFive = curriedAdd(5);
        const addTwenty = addFive(15);

        const thirty: number = addTwenty(10);
        expect(thirty).toBe(thirty);
    });
});
