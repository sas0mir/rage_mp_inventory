<template>
    <div v-if="visible" :style="menuStyles" class="context-menu">
        <button @click="useItem">Использовать</button>
        <button @click="dropItem">Выбросить</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from "vue";
import { useInventoryItemsStore, type InventoryItem } from "../stores/inventory_items";

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
        const { setAround } = inventoryItemsStore;

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
            if (props.from === 'around' || !props.item) return
            setAround('add', [props.item])
            //for delete search for lowest quantity item index and delete
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