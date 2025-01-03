// import { computed } from 'vue'
import { defineStore } from 'pinia'

export interface InventoryItem {
    id: number
    name: string
    description: string
    icon: string
    health: number //прочность 1-100
    size: number //размер стака 1
    description_full: string
    slotable: number //сколько слотов занимает
    stackable: number //сколько помещается в один стак
    type?: string
}

export interface EquippedItems {
    weapons?: InventoryItem[],
    head?: InventoryItem | null,
    vest?: InventoryItem | null,
    clothesUp?: InventoryItem | null,
    clothesDown?: InventoryItem | null,
    shoes?: InventoryItem | null,
    accesories?: InventoryItem[],
    food?: InventoryItem[],
    medicine?: InventoryItem[],
}

const mockStackItems: InventoryItem[] = [
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
        type: 'weapon'
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
        stackable: 2
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
        stackable: 5
    }
]
const mockInventoryItems: InventoryItem[] = [
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
        type: 'weapon'
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
        stackable: 2
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
        stackable: 5
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
        type: 'weapon'
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
        stackable: 2
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
        stackable: 5
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
        type: 'weapon'
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
        stackable: 2
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
        stackable: 5
    },
]

const mockEquippedItems: EquippedItems = {
    weapons: [
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
            type: 'weapon'
        }
    ],
    vest: {
        id: 2,
        name: 'Тактический жилет',
        description: 'Тактический жилет - это бронежилет, который защищает тело от пуль и осколков.',
        icon: './bpvest_1.png',
        health: 75,
        size: 1,
        description_full: 'прочность - 75%, защита от пуль - 50%, защита от осколков - 30%',
        slotable: 3,
        stackable: 2
    },
    medicine: [
        {
            id: 3,
            name: 'Аптечка',
            description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
            icon: './medkit_1.png',
            health: 100,
            size: 1,
            description_full: 'восстанавливает 50% здоровья',
            slotable: 1,
            stackable: 5
        },
    ]
}

export const useInventoryItemsStore = defineStore('inventoryItems', () => {
    const stackItems: InventoryItem[] = mockStackItems
    const inventoryItems: InventoryItem[] = mockInventoryItems
    const equippedItems: EquippedItems = mockEquippedItems
    function setRealData(data: InventoryItem[]) {
        console.log('REAL-DATA->', data);
        //удаляем мок данные
        stackItems.splice(0, stackItems.length)
        inventoryItems.splice(0, inventoryItems.length)
        // stackItems = data.stackItems
        // inventoryItems = data.inventoryItems
        // equippedItems = data.equippedItems
    }
    function setStack(action: string, item: InventoryItem) {
        if (action === 'add') {
            stackItems.push(item)
        } else {
            const index = stackItems.findIndex((i) => i.id === item.id)
            stackItems.splice(index, 1, item)
        }
    }
    function setInventory(action: string, item: InventoryItem) {
        if (action === 'add') {
            inventoryItems.push(item)
        } else {
            const index = inventoryItems.findIndex((i) => i.id === item.id)
            inventoryItems.splice(index, 1, item)
        }
    }
    function setEquippedItems(action: string, position: keyof EquippedItems, item: InventoryItem) {
        if (action === 'add') {
            if( ['weapons', 'accesories', 'food', 'medicine'].includes(position) ) {
                (equippedItems[position] as InventoryItem[]).push(item)
            } else {
                (equippedItems[position] as InventoryItem) = item
            }
        } else {
            if( ['weapons', 'accesories', 'food', 'medicine'].includes(position) ) {
                const index = (equippedItems[position] as InventoryItem[]).findIndex((i) => i.id === item.id);
                (equippedItems[position] as InventoryItem[]).splice(index, 1, item)
            } else {
                (equippedItems[position] as InventoryItem | null) = null;
            }
        }
    }

    return {
        stackItems,
        inventoryItems,
        equippedItems,
        setRealData,
        setStack,
        setInventory,
        setEquippedItems
    }
})
