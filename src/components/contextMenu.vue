<template>
    <div v-if="visible" :style="menuStyles" class="context-menu">
        <button v-if="isUsable" @click="useItem">Использовать</button>
        <button :disabled="isBackpack || $props.from === 'around'" @click="dropItem">Выбросить</button>
        <button v-if="isWearable" @click="equip">Надеть</button>
        <button v-if="isArmor" :disabled="isBackpack" @click="unEquip">Освободить слот</button>
        <button v-if="$props.from === 'around'" @click="moveToInventory">В инвентарь</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from "vue";
import { useInventoryItemsStore, type InventoryItem, type EquippedItemsKeys } from "../stores/inventory_items";
import { useLogger } from "../stores/logger";

export default defineComponent({
    name: "ContextMenu",
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        position: {
            type: Object as () => { top: string; left: string },
            required: true,
        },
        from: { type: String, required: true },
        item: { type: Object as PropType<InventoryItem>, required: true }
    },
    setup(props) {

        const inventoryItemsStore = useInventoryItemsStore();
        const logger = useLogger();
        const { setLog } = logger;
        const { setAround, setInventory, setEquippedItems } = inventoryItemsStore;

        const isArmor = computed(() => {
            const isProperFrom = props.from !== 'inventory' && props.from !== 'around';
            return isProperFrom && ['head', 'vest', 'clothesUp', 'clothesDown', 'shoes', 'backpack'].indexOf(props.item.category) >= 0;
        });
        const isWearable = computed(() => {
            const isProperFrom = props.from === 'inventory' || props.from === 'around';
            return isProperFrom &&
                ['weapons_first', 'weapons_second', 'weapons_special', 'head', 'vest', 'clothesUp', 'clothesDown', 'shoes', 'backpack'].indexOf(props.item.category) >= 0;
        })
        const isBackpack = computed(() => {
            return props.item.category === 'backpack';
        })
        const isUsable = computed(() => {
            return ['food', 'medicine', 'other', 'ammo'].indexOf(props.item.category) >= 0;
        })

        // Вычисляемый стиль для позиции меню
        const menuStyles = computed(() => ({
        top: props.position.top,
        left: props.position.left,
        }));

        // Методы кнопок
        const useItem = () => {
            //mp use item todo
            setLog(`Использован ${props.item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        };

        const dropItem = () => {
            if (!props.item) return
            if (props.from === 'around') {
                setAround('delete', [props.item]);
            }
            if (props.from === 'inventory') {
                setAround('add', [props.item]);
                setInventory('delete', [props.item]);
            }
            if (
                (props.from === 'weapons_first' ||
                props.from === 'weapons_second' ||
                props.from === 'weapons_special' ||
                props.from === 'head' ||
                props.from === 'vest' ||
                props.from === 'clothesUp' ||
                props.from === 'clothesDown' ||
                props.from === 'shoes' ||
                props.from === 'backpack' ||
                props.from === 'food' ||
                props.from === 'medicine' ||
                props.from === 'other') && props.item.category
            ) {
                setEquippedItems('delete', [props.item], props.item.category as EquippedItemsKeys);
                setAround('add', [props.item]);
                setInventory('delete', [props.item]);
            }
            setLog(`Выкинут ${props.item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        };

        const equip = () => {
            if (!props.item) return
            setEquippedItems('add', [props.item], props.item.category as EquippedItemsKeys);
            if (props.from === 'around') {
                setInventory('add', [props.item]);
                setAround('delete', [props.item]);
            }
            setLog(`Надет ${props.item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        }

        const unEquip = () => {
            if (!props.item) return
            setEquippedItems('delete', [props.item], props.item.category as EquippedItemsKeys);
            setLog(`Снят ${props.item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        }

        const moveToInventory = () => {
            if (!props.item) return
            setInventory('add', [props.item]);
            setAround('delete', [props.item]);
            setLog(`Перемещен ${props.item?.name} в инвентарь ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        }

        return {
            menuStyles,
            useItem,
            dropItem,
            equip,
            unEquip,
            moveToInventory,
            isArmor,
            isWearable,
            isBackpack,
            isUsable
        };
    },
});
</script>

<style scoped>
.context-menu {
    position: absolute;
    z-index: 1000;
    background: rgba(116, 130, 121, 0.791);
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.context-menu button {
    background: #f0f0f0;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-family: "Roboto", serif;
    text-transform: uppercase;
}

.context-menu button:hover {
    background: #ddd;
}

.context-menu button:disabled {
    cursor: not-allowed;
    color: rgb(209, 92, 92);
}
</style>