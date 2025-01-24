import type { InventoryItem, EquippedItems } from "@/stores/inventory_items";

export const mockAroundItems: InventoryItem[] = [
    {
        id: 1,
        name: 'AK-47',
        description: 'AK-47 - это автоматическая винтовка, разработанная в 1947 году Михаилом Калашниковым в СССР.',
        icon: './items/akm.png',
        health: 39,
        size: 1,
        description_full: 'скорострельность - 600 выстрелов в минуту, магазин на 30 патронов, дальность стрельбы - 300 метров',
        slotable: 3,
        stackable: 1,
        category: 'weapons_first'
    },
    {
        id: 1,
        name: 'AK-47',
        description: 'AK-47 - это автоматическая винтовка, разработанная в 1947 году Михаилом Калашниковым в СССР.',
        icon: './items/akm.png',
        health: 39,
        size: 1,
        description_full: 'скорострельность - 600 выстрелов в минуту, магазин на 30 патронов, дальность стрельбы - 300 метров',
        slotable: 3,
        stackable: 1,
        category: 'weapons_first'
    },
    {
        id: 2,
        name: 'Тактический жилет',
        description: 'Тактический жилет - это бронежилет, который защищает тело от пуль и осколков.',
        icon: './bpvest_1.png',
        health: 75,
        size: 1,
        description_full: 'прочность - 75%, защита от пуль - 50%, защита от осколков - 30%',
        slotable: 3,
        stackable: 2,
        category: 'vest'
    },
    {
        id: 3,
        name: 'Аптечка',
        description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
        icon: './medkit_1.png',
        health: 100,
        size: 1,
        description_full: 'восстанавливает 50% здоровья',
        slotable: 1,
        stackable: 5,
        category: 'medicine'
    },
    {
        id: 4,
        name: 'Обезболивающее',
        description: 'Таблетки восстанавливающие выносливость, но не здоровье',
        icon: './items/pain.png',
        health: 100,
        size: 1,
        description_full: 'восстанавливает 50% выносливости',
        slotable: 1,
        stackable: 5,
        category: 'medicine'
    },
    {
        id: 17,
        name: 'Сумка-XXL',
        icon: './items/bag-czech.png',
        description: 'Самая большая сумка. Вместимость - 19 слотов',
        health: 100,
        size: 19,
        slotable: 1,
        stackable: 19,
        category: 'other'
    },
    {
        id: 49,
        name: '45mm ACP боеприпас',
        description: 'хз что писать, вроде автоматный патрон',
        icon: './items/45acp.png',
        health: 100,
        size: 1,
        description_full: 'Категория: боеприпас. Начальная скорость пули, 500…550м/с Энергия пули, 600-840Дж',
        slotable: 1,
        stackable: 3,
        category: 'other'
    },
    {
        id: 49,
        name: '45mm ACP боеприпас',
        description: 'хз что писать, вроде автоматный патрон',
        icon: './items/45acp.png',
        health: 100,
        size: 1,
        description_full: 'Категория: боеприпас. Начальная скорость пули, 500…550м/с Энергия пули, 600-840Дж',
        slotable: 1,
        stackable: 3,
        category: 'other'
    },
    {
        id: 16,
        name: 'Бекон',
        description: 'Категория: еда. Консерва объемом 0.8л',
        icon: './items/bacon.png',
        health: 100,
        size: 1,
        description_full: 'Вкусная тушенка из свинины',
        slotable: 1,
        stackable: 3,
        category: 'food'
    },
    {
        id: 16,
        name: 'Бекон',
        description: 'Категория: еда. Консерва объемом 0.8л',
        icon: './items/bacon.png',
        health: 100,
        size: 1,
        description_full: 'Вкусная тушенка из свинины',
        slotable: 1,
        stackable: 3,
        category: 'food'
    },
]
export const mockInventoryItems: InventoryItem[] = [
    {
        id: 1,
        name: 'AK-47',
        description: 'AK-47 - это автоматическая винтовка, разработанная в 1947 году Михаилом Калашниковым в СССР.',
        icon: './items/akm.png',
        health: 39,
        size: 1,
        description_full: 'скорострельность - 600 выстрелов в минуту, магазин на 30 патронов, дальность стрельбы - 300 метров',
        slotable: 3,
        stackable: 1,
        category: 'weapons_first'
    },
    {
        id: 54,
        name: 'Коктейль Молотова',
        description: 'Лучший друг партизана, бутылка с зажигательной смесью.',
        icon: './items/molotov.png',
        health: 100,
        size: 2,
        description_full: 'радиус поражения - 10м',
        slotable: 1,
        stackable: 2,
        category: 'weapons_special'
    },
    {
        id: 35,
        name: 'Револьвер Магнум',
        description: 'Ревоьвер с мощным магнум патроном.',
        icon: './items/magnum.png',
        health: 100,
        size: 1,
        description_full: 'радиус поражения - 10м',
        slotable: 2,
        stackable: 1,
        category: 'weapons_second'
    },
    {
        id: 3,
        name: 'Аптечка',
        description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
        icon: './medkit_1.png',
        health: 100,
        size: 1,
        description_full: 'восстанавливает 50% здоровья',
        slotable: 1,
        stackable: 5,
        category: 'medicine'
    },
    {
        id: 2,
        name: 'Тактический жилет',
        description: 'Тактический жилет - это бронежилет, который защищает тело от пуль и осколков.',
        icon: './bpvest_1.png',
        health: 75,
        size: 1,
        description_full: 'прочность - 75%, защита от пуль - 50%, защита от осколков - 30%',
        slotable: 3,
        stackable: 2,
        category: 'vest'
    },
    {
        id: 3,
        name: 'Аптечка',
        description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
        icon: './medkit_1.png',
        health: 100,
        size: 1,
        description_full: 'восстанавливает 50% здоровья',
        slotable: 1,
        stackable: 5,
        category: 'medicine'
    },
    {
        id: 66,
        name: 'AWP',
        description: 'AWP - снайперская винтовка Британского производства, разработанная в компании Accuracy International.',
        icon: './items/awp.png',
        health: 69,
        size: 1,
        description_full: 'скорострельность - 10 выстрелов в минуту, магазин на 5 | 10 патронов, дальность стрельбы - 1500 метров',
        slotable: 3,
        stackable: 1,
        category: 'weapons_first'
    },
    {
        id: 14,
        name: 'Рюкзак-Койот',
        icon: './items/backpack.png',
        description: 'Рюкзак Койот. Тактический рюкзак средней вместимости, вместимость - 40 слотов',
        health: 100,
        size: 40,
        slotable: 1,
        stackable: 40,
        category: 'other'
    },
    {
        id: 48,
        name: '9mm боеприпас',
        description: 'Пистолетный унитарный патрон с бесфланцевой гильзой цилиндрической формы с небольшой конусностью',
        icon: './items/9mm.png',
        health: 100,
        size: 1,
        description_full: 'Категория: боеприпас. Начальная скорость пули, 350…380м/с Энергия пули, 480-617Дж',
        slotable: 1,
        stackable: 3,
        category: 'other'
    },
    {
        id: 2,
        name: 'Тактический жилет',
        description: 'Тактический жилет - это бронежилет, который защищает тело от пуль и осколков.',
        icon: './bpvest_1.png',
        health: 75,
        size: 1,
        description_full: 'прочность - 75%, защита от пуль - 50%, защита от осколков - 30%',
        slotable: 3,
        stackable: 2,
        category: 'vest'
    },
    {
        id: 3,
        name: 'Аптечка',
        description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
        icon: './medkit_1.png',
        health: 100,
        size: 1,
        description_full: 'восстанавливает 50% здоровья',
        slotable: 1,
        stackable: 5,
        category: 'medicine'
    },
    {
        id: 15,
        name: 'Банка колы',
        description: 'Категория: еда. Сладкий газированный напиток объемом 0.5л',
        icon: './items/cola.png',
        health: 100,
        size: 1,
        description_full: 'Газированный безалкогольный напиток, название напитка относится к двум его оригинальным ингредиентам: листьям коки и орехам кола (источник кофеина)',
        slotable: 1,
        stackable: 3,
        category: 'food'
    },
    {
        id: 15,
        name: 'Банка колы',
        description: 'Категория: еда. Сладкий газированный напиток объемом 0.5л',
        icon: './items/cola.png',
        health: 100,
        size: 1,
        description_full: 'Газированный безалкогольный напиток, название напитка относится к двум его оригинальным ингредиентам: листьям коки и орехам кола (источник кофеина)',
        slotable: 1,
        stackable: 3,
        category: 'food'
    },
    {
        id: 15,
        name: 'Банка колы',
        description: 'Категория: еда. Сладкий газированный напиток объемом 0.5л',
        icon: './items/cola.png',
        health: 100,
        size: 1,
        description_full: 'Газированный безалкогольный напиток, название напитка относится к двум его оригинальным ингредиентам: листьям коки и орехам кола (источник кофеина)',
        slotable: 1,
        stackable: 3,
        category: 'food'
    }
]

export const mockEquippedItems: EquippedItems = {
    weapons_first: {
        id: 1,
        name: 'AK-47',
        description: 'AK-47 - это автоматическая винтовка, разработанная в 1947 году Михаилом Калашниковым в СССР.',
        icon: './items/akm.png',
        health: 74,
        size: 1,
        description_full: 'скорострельность - 600 выстрелов в минуту, магазин на 30 патронов, дальность стрельбы - 300 метров',
        slotable: 3,
        stackable: 1,
        category: 'weapons_first'
    },
    weapons_second: null,
    weapons_special: null,
    head: null,
    vest: {
        id: 2,
        name: 'Тактический жилет',
        description: 'Тактический жилет - это бронежилет, который защищает тело от пуль и осколков.',
        icon: './bpvest_1.png',
        health: 75,
        size: 1,
        description_full: 'прочность - 75%, защита от пуль - 50%, защита от осколков - 30%',
        slotable: 3,
        stackable: 2,
        category: 'vest'
    },
    clothesUp: null,
    clothesDown: null,
    shoes: null,
    food: [null, null, null, null, null, null, null],
    medicine: [
        null, null, null, null, null, null,
        {
            item: {
                id: 3,
                name: 'Аптечка',
                description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
                icon: './medkit_1.png',
                health: 100,
                size: 1,
                description_full: 'восстанавливает 50% здоровья',
                slotable: 1,
                stackable: 5,
                category: 'medicine'
            },
            quantity: 1
        }
    ],
    other: [null, null, null, null, null, null]
}