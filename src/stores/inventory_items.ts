// import { computed } from 'vue'
import { defineStore } from 'pinia'

export interface InventoryItem {
    id: number
    name: string
    description: string
    icon: string
    durability: number //прочность 1-100
    stack_size: number //размер стака 1
    description_full: string
    slot_size: number //размер слота 1
}

const mockInventoryItems: InventoryItem[] = [
    {
        id: 1,
        name: 'AK-47',
        description: 'AK-47 - это автоматическая винтовка, разработанная в 1947 году Михаилом Калашниковым в СССР.',
        icon: './ak47_1.png',
        durability: 39,
        stack_size: 5,
        description_full: 'скорострельность - 600 выстрелов в минуту, магазин на 30 патронов, дальность стрельбы - 300 метров',
        slot_size: 3
    },
    {
        id: 2,
        name: 'Тактический жилет',
        description: 'Тактический жилет - это бронежилет, который защищает тело от пуль и осколков.',
        icon: './bpvest_1.png',
        durability: 75,
        stack_size: 3,
        description_full: 'прочность - 75%, защита от пуль - 50%, защита от осколков - 30%',
        slot_size: 3
    },
    {
        id: 3,
        name: 'Аптечка',
        description: 'Аптечка - это медицинский инструмент, который используется для лечения ран и травм.',
        icon: './medkit_1.png',
        durability: 100,
        stack_size: 1,
        description_full: 'восстанавливает 50% здоровья',
        slot_size: 1
    }
]

export const useInventoryItemsStore = defineStore('inventoryItems', () => {
    const inventoryItems: InventoryItem[] = mockInventoryItems
    function setInventory(action: string, item: InventoryItem) {
        if (action === 'add') {
        inventoryItems.push(item)
        } else {
        const index = inventoryItems.findIndex((i) => i.id === item.id)
        inventoryItems.splice(index, 1, item)
        }
    }

    return { inventoryItems, setInventory }
})
