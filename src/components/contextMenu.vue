<template>
    <div v-if="visible" :style="menuStyles" class="context-menu">
        <button @click="useItem">Использовать</button>
        <button v-if="['food', 'medicine', 'other'].indexOf($props.from) < 0" @click="dropItem">Выбросить</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from "vue";
import { useInventoryItemsStore, type InventoryItem, type EquippedItemsKeys } from "../stores/inventory_items";

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
        const { setAround, setInventory, setEquippedItems } = inventoryItemsStore;

        // Вычисляемый стиль для позиции меню
        const menuStyles = computed(() => ({
        top: props.position.top,
        left: props.position.left,
        }));

        // Методы кнопок
        const useItem = () => {
            //mp use item todo
        };

        const dropItem = () => {
            if (!props.item) return
            if (props.from === 'around') {
                setAround('delete', [props.item]);
            }
            if (props.from === 'inventory') {
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
                props.from === 'food' ||
                props.from === 'medicine' ||
                props.from === 'other') && props.item.category
            ) {
                setEquippedItems('delete', [props.item], props.item.category as EquippedItemsKeys);
            }
        };

        return {
            menuStyles,
            useItem,
            dropItem,
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
</style>