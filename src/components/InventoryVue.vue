<script>
export default {/* eslint-disable */
  name: 'InventoryVue',
  data() {
    return {
      sizeDrop: 1,
      sizePick: 1,
      sizeInventory: 0,
      sizeInventoryAround: 0,
      picked: 0,
      maxSlot: 7,
      maxSlotAround: 25,
      classObject: [
      ],
      inventory: [],
      inventoryAround: [

      ],
      activeItemIndex: null,
      activeItemIndexAround: null,
      slotOne: 'Пусто',
      slotTwo: 'Пусто',
      slotThree: 'Пусто',
      tempItem: {
        name: "",
        itemId: "",
        idcounter: '',
        itsize: '',
        needsize: ''
      }
    };
  },
  methods: {
    updateSizeAround() {
      this.sizeInventoryAround = 1;
      for (let i = 0; i < this.inventoryAround.length; i++) {
        const item = this.inventoryAround[i];
        if (item.stackable > 1) {
          // Если стакается
          this.sizeInventoryAround += Math.ceil(item.itsize / item.stackable) * item.slotable;
        } else {
          // Если не стакается
          this.sizeInventoryAround += item.itsize * item.slotable;
        }
      }
    },
    updateSize() {
      this.sizeInventory = 1;
      for (let i = 0; i < this.inventory.length; i++) {
        const item = this.inventory[i];
        if (item.stackable > 1) {
          // Если стакается
          this.sizeInventory += Math.ceil(item.itsize / item.stackable) * item.slotable;
        } else {
          // Если не стакается
          this.sizeInventory += item.itsize * item.slotable;
        }
      }
    },
    formatName(name) {
      return name.replace(/[-_]/g, ' ');
    },
    addToInventoryAround(inventoryDataAround, maxslotaround) {
      try {
        const inventoryAroundData = JSON.parse(inventoryDataAround);
        this.maxSlotAround = maxslotaround
        if (Array.isArray(inventoryAroundData)) {
          inventoryAroundData.forEach((item, index) => {
            this.inventoryAround.push({
              name: item.itemName,
              itemId: item.itemCategory,
              idcounter: item.idcounter,
              itsize: item.itsize,
              needsize: item.needsize,
              health: item.health,
              stackable: item.stackable,
              slotable: item.slotable,
              weight: item.weight,
              dtext1: item.dtext1,
              dtext2: item.dtext2,
              dtext3: item.dtext3,
              dtext4: item.dtext4
            });
            // this.sizeInventoryAround++;
          });
          this.updateSizeAround();
        } else {
          console.error('Parsed data is not an array.');
        }
      } catch (e) {
        console.error('Failed to parse inventory data:', e);
      }
    },
    initSlots(slotone, slottwo, slotthree) {
      this.slotOne = slotone ? slotone : 'Клавиша 1';
      this.slotTwo = slottwo ? slottwo : 'Клавиша 2';
      this.slotThree = slotthree ? slotthree : 'Клавиша 3';
    },
    addToInventory(inventoryData) {
      try {
        const inventoryPlayerData = JSON.parse(inventoryData);
        if (Array.isArray(inventoryPlayerData)) {
          inventoryPlayerData.forEach((item, index) => {
            this.inventory.push({
              name: item.itemName,
              itemId: item.itemCategory,
              idcounter: item.idcounter,
              itsize: item.itsize,
              needsize: item.needsize,
              health: item.health,
              stackable: item.stackable,
              slotable: item.slotable,
              weight: item.weight,
              dtext1: item.dtext1,
              dtext2: item.dtext2,
              dtext3: item.dtext3,
              dtext4: item.dtext4
            });
            //  this.sizeInventory++;

          });
          this.updateSize();
          for (let i = 0; i < this.sizeInventory; i++) { this.checkBackpacks(i); }
        } else {
          console.error('Parsed data is not an array.');
        }
      } catch (e) {
        console.error('Failed to parse inventory data:', e);
      }
    },
    checkWeapon(index) {
      let arrayWeapon = ["АК-47", "Каменный-топор", "Разводной-ключ", "Бензин-канистра", "Керамический-пистолет", "Пос",
        "Пистолет", "Винтажный-пистолет", "Помповый-Дробаш", "Снайперская-винтовка", "Гольф-клюшка", "Молоток", "Автомат-Винтовка",
        "Фонарь", "Кий", "Улучшенная-винтовка", "Боевой-топор", "Тяжелый-пистолет", "Кастет", "Малый-пп",
        "Штурмовой-ПП", "Топорик", "Бутылка", "Парашют", "Автоматич-Дробаш", "Микро-пп", "Боевой-пистолет",
        "ПП-Гузенберга", "Полиц-Дубинка", "Дробовик-обрез", "Карманный-МК2", "Фомка", "Пиратский-нож", "Бита", "Пистолет.50", "Мушкет", "Мини-пп"
        , "Пистоль", "Выкидной-нож", "Штурмовой-дробаш", "Двуствольный-обрез", "Тяжежлая-Снайперская", "Бронебойный-пистолет",
        "ПП", "Тяжелый-Дробовик", "Укороченный-АК47", "Буллпап", "БуллпапМК2", "Флотский-револьвер", "Особый-КарабинМК2", "Нож",
        , "Пулемет", "Дробовик-Буллпап", "Карманный-пест", "ПистолетМК2", "Автомат-Винтовка", "Тяжелый-револьвер", "Тяж-СнайперскаяМК2",
        "АК-47(PRO)", "ДробашМК2", "ВысокоточнаяМК2", "ПП.МК2", "Мачете", "Тяжелый-пулемет", "Голд-Револьвер", "Высокоточная-снайпа", "Тяж-РевольверМК2",
        "Тяж-ПулеметМК2", "Мини-Гранотомет", "Шокер", "Гранатомет", "Карабин",

        "Рюкзак-XS", "Рюкзак-L", "Сумка-XS", "Сумка-S", "Рюкзак-Зеленый", "Сумка-XXL", "Сумка-Пучи", "Шарф-красный", "Галстук-черный", "Галстук-синий", "Повязка-красная", "Бронежилет(100%)", "Бронежилет(75%)", "Бронежилет(50%)", "Джинсы",
        "Штаны-Черные", "Штаны-Зеленые", "Шорты-Черные", "Штаны-Красные", "Брюки-Черные", "Штаны-Серые", "Штаны-Военные", "Штаны-Камуфляж", "Штаны-Пижамные", "Штаны-Кожанные", "Штаны-Люци", "Штаны-Элитные",
        "Штаны-Пучи", "Штаны-Пожарника", "Штаны-Болотные", "Пиджак-Черный", "Рубашка-Белая", "Пиджак-Белый", "Пиджак-Зеленый", "Рубашка-Синяя", "Футболка-Красная", "Толстовка-Зеленая", "Кофта-ЗСУ", "Рубашка-Цыганская"
        , "Пальто-Черное", "Кофта-Пучи", "Пальто-Бежевое", "Американка-Красная", "Кожанка", "Пуховик-Красный", "Анорак", "Кофта-Новогодняя", "Анорак(VIP)", "Кофта-Элитная", "Куртка-ЗСУ", "Куртка-Пожарного", "Куртка-SWAT",
        "Кофта-Работяги", "Куртка-Люци", "Маска-потрошителя", "Маска-бибизяны", "Маска-Деда_Мороза", "Маска-Летчика", "Шлем-Рейдера", "Маска-Рейдера", "Противогаз", "Бандана-черная", "Балаклава", "Маска-бандита", "Маска-Люцифера",
        "Маска-клоуна", "Маска-киборга", "Маска-шахида", "Маска-BrickBazuka", "Маска-Элитная", "ПНВ", "Маска-Доктора", "Маска-зайца", "Кеды-Черные", "Туфли-Черные", "Тимбирленды", "Кеды-Синие", "Берцы", "Рибуки-болотные", "Аирмакс"
        , "Макасины-красные", "Ботинки(военные)", "Ботинки-НАТО", "Кроссовки(белые)", "Ботинки-Люци", "Ботинки(Элитные)", "Кеды-Зеленые",

        "AK-47_Обойма", "Керамический-пистолет_Обойма", "Пос_Обойма", "Пистолет_Обойма", "Помповый-Дробаш_ПТ",
        "Снайперская-винтовка_Обойма", "Винтажный-пистолет_Обойма", "Автомат-Винтовка_Обойма",
        "Улучшенная-винтовка_Обойма", "Тяжелый-пистолет_Обойма", "Малый-пп_Обойма", "Штурмовой-ПП_Обойма",
        "Автоматич-Дробаш_Обойма", "Микро-пп_Обойма", "Боевой-пистолет_Обойма", "ПП-Гузенберга_Обойма",
        "Дробовик-обрез_пт", "Карманный-МК2_Обойма", "Пистолет.50_Обойма", "Мушкет_пт", "Мини-пп_Обойма",
        "Пистоль_пт", "Штурмовой-дробаш_Обойма", "Двуствольный-обрез_пт", "Тяжежлая-Снайперская_Обойма",
        "Бронебойный-пистолет_Обойма", "ПП_Обойма", "Тяжелый-Дробовик_Обойма", "Укороченный-АК47_Обойма", "Буллпап_Обойма",
        "БуллпапМК2_Обойма", "Флотский-револьвер_Барабан", "Особый-КарабинМК2_Обойма", "Пулемет_БК", "Дробовик-Буллпап_Обойма",
        "Карманный-пест_Обойма", "ПистолетМК2_Обойма", "Автомат-Винтовка_Обойма", "Тяжелый-револьвер_ПТ", "Тяж-СнайперскаяМК2_Обойма",
        "АК-47(PRO)_Обойма", "ДробашМК2_пт", "ВысокоточнаяМК2_Обойма", "ПП.МК2_Обойма", "Тяжелый-пулемет_БК", "Голд-Револьвер_пт",
        "Высокоточная-снайпа_Обойма", "Тяж-РевольверМК2_пт", "Тяж-ПулеметМК2_БК", "Мини-Гранотомет_граната", "Гранатомет_бк", "Карабин_Обойма", "Bzgas-граната", "Фальшфейер", "Граната", "Молотов", "Бобовка-Самодельная", "Смок-граната", "Бомба-липучка",
        "Рюкзак-Берген", "Рюкзак-Городской", "Рюкзак-Койот", "Рюкзак-Тактик", "Рюкзак-Тортила", "Рюкзак-Бореалес", "Сумка-Спортивная", "Рюкзак-Калифорния", "Сумка-Талун", "Сумка-Оружейная", "Рюкзак-Камуфляжный"
        , "Шлем-Рысь", "Шлем_TOR-D", "Каска", "Нож-Сталкера", "C4", "5.56x45", "7.62x39", "7.62x54", "7.92x57", "8.6x70", "9mm", "9x19mm", "12.7x99", "12x76", "40MM", "40MM(Smoke)", "45.ACP",
        "Desert-Eagle", "Glock-17", "Сигнальный-Пистолет", "Макаров", "Револьвер", "Сигнальный-Патрон",
        "MP5", "P90", "UMP", "UZI", "Vector", "Benelli", "Сайга",
        "АК-74М",
        "АКС-74У",
        "AKM",
        "AR-15",
        "AUG",
        "KAC",
        "M16A1",
        "SCAR-L",
        "M338",
        "MG-42",
        "MK9",
        "PKM",
        "AS-50",
        "M107A1",
        "SIG-550",
        "СВД",
        "VSS",
        "XMR",


      ];
      for (let x in arrayWeapon) {
        if (this.inventory[index].name === arrayWeapon[x]) {
          return false;
        }
      }
      return true;
    },
    useItem(activeItemIndex) {
      if (this.activeItemIndex != null) {
        mp.trigger("remoteCallServer", "useCallServer", String(activeItemIndex));
        if (this.inventory[activeItemIndex].name == "Доллар" ||
          this.inventory[activeItemIndex].name == "Колесо" ||
          this.inventory[activeItemIndex].name == "Бензобак" ||
          this.inventory[activeItemIndex].name == "Двигатель" ||
          this.inventory[activeItemIndex].name == "Аккумулятор" ||
          this.inventory[activeItemIndex].name == "Магнитола") {
          return;
        }
        if (this.checkWeapon(activeItemIndex)) {
          if (this.inventory[activeItemIndex].itsize > 1) {
            this.inventory[activeItemIndex].itsize -= 1;
          } else {
            this.inventory.splice(activeItemIndex, 1);
          }
          //  --this.sizeInventory;
          this.updateSize();
          this.activeItemIndex = null;
        } else {
          let arrayCl = ["Рюкзак-XS", "Рюкзак-L", "Сумка-XS", "Сумка-S", "Рюкзак-Зеленый", "Сумка-XXL", "Сумка-Пучи", "Шарф-красный", "Галстук-черный", "Галстук-синий", "Повязка-красная", "Бронежилет(100%)", "Бронежилет(75%)", "Бронежилет(50%)", "Джинсы",
            "Штаны-Черные", "Штаны-Зеленые", "Шорты-Черные", "Штаны-Красные", "Брюки-Черные", "Штаны-Серые", "Штаны-Военные", "Штаны-Камуфляж", "Штаны-Пижамные", "Штаны-Кожанные", "Штаны-Люци", "Штаны-Элитные",
            "Штаны-Пучи", "Штаны-Пожарника", "Штаны-Болотные", "Пиджак-Черный", "Рубашка-Белая", "Пиджак-Белый", "Пиджак-Зеленый", "Рубашка-Синяя", "Футболка-Красная", "Толстовка-Зеленая", "Кофта-ЗСУ", "Рубашка-Цыганская"
            , "Пальто-Черное", "Кофта-Пучи", "Пальто-Бежевое", "Американка-Красная", "Кожанка", "Пуховик-Красный", "Анорак", "Кофта-Новогодняя", "Анорак(VIP)", "Кофта-Элитная", "Куртка-ЗСУ", "Куртка-Пожарного", "Куртка-SWAT",
            "Кофта-Работяги", "Куртка-Люци", "Маска-потрошителя", "Маска-бибизяны", "Маска-Деда_Мороза", "Маска-Летчика", "Шлем-Рейдера", "Маска-Рейдера", "Противогаз", "Бандана-черная", "Балаклава", "Маска-бандита", "Маска-Люцифера",
            "Маска-клоуна", "Маска-киборга", "Маска-шахида", "Маска-BrickBazuka", "Маска-Элитная", "ПНВ", "Маска-Доктора", "Маска-зайца", "Кеды-Черные", "Туфли-Черные", "Тимбирленды", "Кеды-Синие", "Берцы", "Рибуки-болотные", "Аирмакс"
            , "Макасины-красные", "Ботинки(военные)", "Ботинки-НАТО", "Кроссовки(белые)", "Ботинки-Люци", "Ботинки(Элитные)", "Кеды-Зеленые", "AK-47_Обойма", "Керамический-пистолет_Обойма", "Пос_Обойма", "Пистолет_Обойма", "Помповый-Дробаш_ПТ",
            "Снайперская-винтовка_Обойма", "Винтажный-пистолет_Обойма", "Автомат-Винтовка_Обойма",
            "Улучшенная-винтовка_Обойма", "Тяжелый-пистолет_Обойма", "Малый-пп_Обойма", "Штурмовой-ПП_Обойма",
            "Автоматич-Дробаш_Обойма", "Микро-пп_Обойма", "Боевой-пистолет_Обойма", "ПП-Гузенберга_Обойма",
            "Дробовик-обрез_пт", "Карманный-МК2_Обойма", "Пистолет.50_Обойма", "Мушкет_пт", "Мини-пп_Обойма",
            "Пистоль_пт", "Штурмовой-дробаш_Обойма", "Двуствольный-обрез_пт", "Тяжежлая-Снайперская_Обойма",
            "Бронебойный-пистолет_Обойма", "ПП_Обойма", "Тяжелый-Дробовик_Обойма", "Укороченный-АК47_Обойма", "Буллпап_Обойма",
            "БуллпапМК2_Обойма", "Флотский-револьвер_Барабан", "Особый-КарабинМК2_Обойма", "Пулемет_БК", "Дробовик-Буллпап_Обойма",
            "Карманный-пест_Обойма", "ПистолетМК2_Обойма", "Автомат-Винтовка_Обойма", "Тяжелый-револьвер_ПТ", "Тяж-СнайперскаяМК2_Обойма",
            "АК-47(PRO)_Обойма", "ДробашМК2_пт", "ВысокоточнаяМК2_Обойма", "ПП.МК2_Обойма", "Тяжелый-пулемет_БК", "Голд-Револьвер_пт",
            "Высокоточная-снайпа_Обойма", "Тяж-РевольверМК2_пт", "Тяж-ПулеметМК2_БК", "Мини-Гранотомет_граната", "Гранатомет_бк", "Карабин_Обойма", "Парашют", "Фонарь", "Каменный-топор", "Разводной-ключ", "Кий",
            "Боевой-топор", "Кастет", "Топорик", "Бутылка", "Полиц-Дубинка", "Фомка", "Бита", "Нож", "Мачете", "Бензин-канистра", "Bzgas-граната", "Фальшфейер", "Граната", "Молотов", "Бобовка-Самодельная", "Смок-граната", "Бомба-липучка"
            , "Рюкзак-Берген", "Рюкзак-Городской", "Рюкзак-Койот", "Рюкзак-Тактик", "Рюкзак-Тортила", "Рюкзак-Бореалес", "Сумка-Спортивная", "Рюкзак-Калифорния", "Сумка-Талун", "Сумка-Оружейная", "Рюкзак-Камуфляжный",
            "Шлем-Рысь", "Шлем_TOR-D", "Каска", "Нож-Сталкера", "C4", "5.56x45", "7.62x39", "7.62x54", "7.92x57", "8.6x70", "9mm", "9x19mm", "12.7x99", "12x76", "40MM", "40MM(Smoke)", "45.ACP",
            "Desert-Eagle", "Glock-17", "Сигнальный-Пистолет", "Макаров", "Револьвер", "Сигнальный-Патрон",
            "MP5", "P90", "UMP", "UZI", "Vector", "Benelli", "Сайга",
            "АК-74М",
            "АКС-74У",
            "AKM",
            "AR-15",
            "AUG",
            "KAC",
            "M16A1",
            "SCAR-L",
            "M338",
            "MG-42",
            "MK9",
            "PKM",
            "AS-50",
            "M107A1",
            "SIG-550",
            "СВД",
            "VSS",
            "XMR",

          ];

          for (let i in arrayCl) {
            if (this.inventory[activeItemIndex].name == arrayCl[i]) {
              this.activeItemIndex = null;
              mp.trigger("eat:shit", String(777));
              return;
            }
          }
          mp.trigger("closeInventory");
          mp.trigger("eat:shit", String(123123));
          this.activeItemIndex = null;
        }
      }
    },


    //перед тем как брать рюкзак надо проверить нет ли его, будем разрешать 1 иметь 
    checkBackpacks(index) {
      let arrayBackpacks = [
        "Рюкзак-XS", "Рюкзак-L", "Сумка-XS", "Сумка-S", "Рюкзак-Зеленый", "Сумка-XXL", "Сумка-Пучи",
        "Рюкзак-Берген", "Рюкзак-Городской", "Рюкзак-Койот", "Рюкзак-Тактик",
        "Рюкзак-Тортила", "Рюкзак-Бореалес", "Сумка-Спортивная", "Рюкзак-Калифорния",
        "Сумка-Талун", "Сумка-Оружейная", "Рюкзак-Камуфляжный"
      ];

      for (let x in arrayBackpacks) {
        if (this.inventory[index].name === arrayBackpacks[x]) {
          // Слоты для каждого рюкзака
          if (this.inventory[index].name === "Рюкзак-XS") {
            this.maxSlot = this.maxSlot < 10 ? 10 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-L" || this.inventory[index].name === "Рюкзак-Зеленый") {
            this.maxSlot = this.maxSlot < 12 ? 12 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-XS") {
            this.maxSlot = this.maxSlot < 14 ? 14 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-S") {
            this.maxSlot = this.maxSlot < 16 ? 16 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-XXL") {
            this.maxSlot = this.maxSlot < 19 ? 19 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-Пучи") {
            this.maxSlot = this.maxSlot < 20 ? 20 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Берген") {
            this.maxSlot = this.maxSlot < 73 ? 73 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Городской") {
            this.maxSlot = this.maxSlot < 35 ? 35 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Койот") {
            this.maxSlot = this.maxSlot < 40 ? 40 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Тактик") {
            this.maxSlot = this.maxSlot < 56 ? 56 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Тортила") {
            this.maxSlot = this.maxSlot < 43 ? 43 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Бореалес") {
            this.maxSlot = this.maxSlot < 38 ? 38 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-Спортивная") {
            this.maxSlot = this.maxSlot < 30 ? 30 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Калифорния") {
            this.maxSlot = this.maxSlot < 45 ? 45 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-Талун") {
            this.maxSlot = this.maxSlot < 15 ? 15 : this.maxSlot;
          } else if (this.inventory[index].name === "Сумка-Оружейная") {
            this.maxSlot = this.maxSlot < 20 ? 20 : this.maxSlot;
          } else if (this.inventory[index].name === "Рюкзак-Камуфляжный") {
            this.maxSlot = this.maxSlot < 28 ? 28 : this.maxSlot;
          }

          return true;
        }
      }
      return false;
    },
    removeItem(index, event) {

      if (this.maxSlotAround >= this.sizeInventoryAround) {
        let item = this.inventory[index];
        // Проверяем, если это патроны
        if (item.itemId === 'weaponMags') {
          let sizeDrop = this.sizeDrop || item.needsize; // Если не указано, берем минимальный размер
          if (item.itsize >= sizeDrop) {
            let remainingSize = item.itsize - sizeDrop;

            // Выполняем выброс "sizeDrop" раз
            for (let i = 0; i < sizeDrop; i++) {
              // Если maxSlotAround == 20, всегда создаем новую строку
              if (this.maxSlotAround === 999) {
                this.inventoryAround.push({
                  name: item.name,
                  itemId: item.itemId,
                  idcounter: item.idcounter,
                  itsize: 1, // Выбрасываем по 1 за раз
                  needsize: item.needsize,
                  health: item.health,
                  stackable: item.stackable,
                  slotable: item.slotable,
                  weight: item.weight,
                  dtext1: item.dtext1,
                  dtext2: item.dtext2,
                  dtext3: item.dtext3,
                  dtext4: item.dtext4
                });
                // ++this.sizeInventoryAround;
                this.updateSizeAround();
              } else {
                // Пытаемся найти аналогичную пачку патронов
                let existingAmmoIndex = this.inventoryAround.findIndex(
                  aroundItem => aroundItem.itemId === 'weaponMags' && aroundItem.name === item.name
                );

                if (existingAmmoIndex !== -1) {
                  // Если такая пачка уже есть, увеличиваем её размер
                  this.inventoryAround[existingAmmoIndex].itsize += 1; // Добавляем один патрон
                } else {
                  // Если аналогичной пачки нет, добавляем новую строку
                  this.inventoryAround.push({
                    name: item.name,
                    itemId: item.itemId,
                    idcounter: item.idcounter,
                    itsize: 1, // Один патрон
                    needsize: item.needsize,
                    health: item.health,
                    stackable: item.stackable,
                    slotable: item.slotable,
                    weight: item.weight,
                    dtext1: item.dtext1,
                    dtext2: item.dtext2,
                    dtext3: item.dtext3,
                    dtext4: item.dtext4
                  });
                  //  ++this.sizeInventoryAround;
                }
                this.updateSizeAround();
              }
              // Вызываем триггер для каждой единицы
              mp.trigger("dropCallRemote", "dropCallServer", String(index));
              this.updateSizeAround();
            }

            this.updateSize();
            // Если остаются патроны, обновляем количество в инвентаре
            if (remainingSize > 0) {
              this.inventory[index].itsize = remainingSize;
              this.updateSize();
            } else {
              // Если все патроны выброшены, удаляем строку из инвентаря
              this.inventory.splice(index, 1);
              //  --this.sizeInventory;
              this.updateSize();
            }
          } else {
            return; // Недостаточно патронов для выброса
          }
        } else {
          // Логика для остальных предметов
          let sizeDrop = this.sizeDrop || item.needsize; // Указанное количество для выброса
          if (item.itsize >= sizeDrop) {



            let remainingSize = item.itsize - sizeDrop;

            // Выполняем выброс "sizeDrop" раз
            for (let i = 0; i < sizeDrop; i++) {
              let existingItemIndex = this.inventoryAround.findIndex(
                aroundItem => aroundItem.name === item.name && aroundItem.health == item.health
              );

              if (existingItemIndex !== -1) {
                // Если такой предмет уже есть, увеличиваем количество
                this.inventoryAround[existingItemIndex].itsize += 1;
              } else {
                // Если аналогичного предмета нет, создаем новую строку
                if (this.inventory[index].health >= 100) {
                  this.inventoryAround.push({
                    name: item.name,
                    itemId: item.itemId,
                    idcounter: item.idcounter,
                    itsize: 1,
                    needsize: item.needsize,
                    health: item.health,
                    stackable: item.stackable,
                    slotable: item.slotable,
                    weight: item.weight,
                    dtext1: item.dtext1,
                    dtext2: item.dtext2,
                    dtext3: item.dtext3,
                    dtext4: item.dtext4
                  });
                }
                // ++this.sizeInventoryAround;
                this.updateSizeAround();
              }
              this.updateSizeAround();
              // Вызываем триггер
              mp.trigger("dropCallRemote", "dropCallServer", String(index));
            }

            // Обновляем количество предметов в инвентаре или удаляем предмет
            if (remainingSize > 0) {
              this.inventory[index].itsize = remainingSize;
            } else {
              this.inventory.splice(index, 1);
              // --this.sizeInventory;
              this.updateSize();
            }
          } else {
            return; // Недостаточно предметов для выброса
          }
        }

        // Сбрасываем активные индексы
        this.activeItemIndex = null;
        this.activeItemIndexAround = null;

        // Проверяем рюкзаки
        this.maxSlot = 8;
        for (let i = 0; i < this.sizeInventory; i++) {
          this.checkBackpacks(i);
        }
        this.updateSizeAround();
        this.updateSize();
      }
    },

    collapseTent() {
      mp.trigger("remoteCallServer", "ExecuteTentAction", String("collapseTent"));
      mp.trigger("closeInventory");
    },
    setSlot(i, numberSlot, event) {

      if (numberSlot == 1) {
        this.slotOne = this.inventory[i].name;
        mp.trigger("remoteCallServer", "setSlotOne", String(i));
      } else if (numberSlot == 2) {
        this.slotTwo = this.inventory[i].name;
        mp.trigger("remoteCallServer", "setSlotTwo", String(i));
      } else if (numberSlot == 3) {
        this.slotThree = this.inventory[i].name;
        mp.trigger("remoteCallServer", "setSlotThree", String(i));
      }
      mp.trigger("eat:shit", String(777));
      this.activeItemIndex = null;
    },

    pickItem(i, event) {
      if (this.maxSlot >= this.sizeInventory || this.inventoryAround[i].name == 'Доллар') {
        let itemAround = this.inventoryAround[i];

        // Проверяем, является ли предмет обоймой для патронов
        if (true) {
          let sizeDrop = this.sizePick || itemAround.needsize; // Количество, которое пользователь хочет поднять
          if (itemAround.itsize >= sizeDrop) {
            // Ищем обойму с такими же патронами в инвентаре
            let existingAmmoIndex = this.inventory.findIndex(
              item => item.name === itemAround.name && item.health === itemAround.health
            );

            if (existingAmmoIndex !== -1) {
              // Если такая обойма уже есть, увеличиваем количество патронов
              this.inventory[existingAmmoIndex].itsize += sizeDrop;
            } else {
              // Если обоймы с такими патронами нет, добавляем новую строку
              this.inventory.push({
                name: itemAround.name,
                itemId: itemAround.itemId,
                idcounter: itemAround.idcounter,
                itsize: sizeDrop, // Добавляем ровно столько, сколько подняли
                needsize: itemAround.needsize,
                health: itemAround.health,
                stackable: itemAround.stackable,
                slotable: itemAround.slotable,
                weight: itemAround.weight,
                dtext1: itemAround.dtext1,
                dtext2: itemAround.dtext2,
                dtext3: itemAround.dtext3,
                dtext4: itemAround.dtext4
              });
              //  ++this.sizeInventory;
              this.updateSize();
            }

            // Уменьшаем количество патронов в окружающем инвентаре
            itemAround.itsize -= sizeDrop;

            // Если все патроны подняты, удаляем объект из inventoryAround
            if (itemAround.itsize <= 0) {
              this.inventoryAround.splice(i, 1);
              // --this.sizeInventoryAround;
              this.updateSizeAround();
            }
            this.updateSizeAround();
            this.updateSize();

            // Вызываем серверное событие для каждого поднятого патрона

            for (let j = 0; j < sizeDrop; j++) {
              mp.trigger("pickRemoteCallClient", "pickRemoteCall", String(i));
            }

          } else {
            return; // Если в окружающем инвентаре меньше патронов, чем нужно поднять
          }
        } else {
          // Логика для остальных предметов
          this.inventory.push({
            name: itemAround.name,
            itemId: itemAround.itemId,
            idcounter: itemAround.idcounter,
            itsize: itemAround.itsize,
            needsize: itemAround.needsize,
            health: itemAround.health,
            stackable: itemAround.stackable,
            slotable: itemAround.slotable,
            weight: itemAround.weight,
            dtext1: itemAround.dtext1,
            dtext2: itemAround.dtext2,
            dtext3: itemAround.dtext3,
            dtext4: itemAround.dtext4
          });
          //  ++this.sizeInventory;
          this.updateSize();
          // Удаляем предмет из окружающего инвентаря
          this.inventoryAround.splice(i, 1);
          //  --this.sizeInventoryAround;
          this.updateSizeAround();

          // Вызываем серверное событие для поднятия
          mp.trigger("pickRemoteCallClient", "pickRemoteCall", String(i));

        }

        // Обнуляем активные индексы
        this.activeItemIndex = null;
        this.activeItemIndexAround = null;

        // Перепроверка рюкзаков
        for (let i = 0; i < this.sizeInventory; i++) {
          this.checkBackpacks(i);
        }
      }
      this.updateSizeAround();
      this.updateSize();
    },
    clearLastInventory() {
      this.sizeDrop = 1;
      this.sizePick = 1;
      this.activeItemIndex = null;
      this.activeItemIndexAround = null;
      this.sizeInventory = 1;
      this.sizeInventoryAround = 1;
      this.inventory = [];
      this.inventoryAround = [];
      this.maxSlot = 8;
    },
    toggleActive(id) {
      this.classObject[id].isActive = !this.classObject[id].isActive;
      // this.isActive = !this.isActive;
    },
  },
  mounted() {
    mp.events.add("initSlots", this.initSlots);
    mp.events.add("openVueInventory", this.addToInventory);
    mp.events.add("openVueInventoryAround", this.addToInventoryAround);
    mp.events.add("clearLastInventory", this.clearLastInventory);
  },
  watch: {

  }
}
</script>

<template>
  <div class="container unselectable">
    <div class="leftcontainer">
      <p class="text">Окружение</p>
      <div class="left">
        <div class="list">
          <hr class="whitehr" />
          <ul class="blackbackground">

            <ul class="textcategory">
              - Основное оружие
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'firstWeapon'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Второстепенное оружие
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'secondWeapon'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Специальное оружие
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'specialWeapon'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Боеприпасы
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'weaponMags'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Еда / Напитки
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'food'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Одежда / Рюкзаки
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'clothesBackpacks'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Другое
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'another'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Инструменты
              <div v-for="(it, index) in inventoryAround">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'tools'">
                    <li @:click="activeItemIndexAround = index; sizePick = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndexAround }">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

          </ul>
        </div>
      </div>
      <p class="slots">Слоты: {{ sizeInventoryAround - 1 }}/{{ maxSlotAround }}</p>
    </div>

    <button @click="pickItem(activeItemIndexAround, $event)" class="btnstyle leftbtn">&gt;</button>
    <button @click="setSlot(activeItemIndex, 1, $event)" class="slot1">{{ slotOne }}</button>
    <button @click="setSlot(activeItemIndex, 2, $event)" class="slot2">{{ slotTwo }}</button>
    <button @click="setSlot(activeItemIndex, 3, $event)" class="slot3">{{ slotThree }}</button>
    <div v-if="maxSlotAround == 50">
      <button @click="collapseTent()" class="showtent">Свернуть
        палатку</button>
    </div>
    <form class="formpick">
      <input type="number" v-model="sizePick" class="sizepickdrop">
    </form>
    <div class="opisanie">
      <b> {{ this.activeItemIndex != null && this.inventory[activeItemIndex].itemId == "clothesBackpacks" ? "Прочность: "
        + this.inventory[this.activeItemIndex].health : "" }} </b> <br>
      <b> {{ this.activeItemIndex != null ? this.inventory[this.activeItemIndex].dtext1 : "" }} </b> <br>
      <b> {{ this.activeItemIndex != null ? this.inventory[this.activeItemIndex].dtext2 : "" }} </b><br>
      <b> {{ this.activeItemIndex != null ? this.inventory[this.activeItemIndex].dtext3 : "" }} </b><br>
      <b> {{ this.activeItemIndex != null ? this.inventory[this.activeItemIndex].dtext4 : "" }} </b><br>

    </div>
    <form class="formdrop">
      <input type="number" v-model="sizeDrop" class="sizepickdrop">
    </form>
    <button @click="removeItem(activeItemIndex, $event)" class="btnstyle rightbtn">&lt;</button>

    <div class="rightcontainer">
      <p class="text">Инвентарь</p>
      <div class="right">
        <div class="list">
          <hr class="whitehr" />
          <ul class="blackbackground">

            <ul class="textcategory">
              - Основное оружие
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'firstWeapon'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Второстепенное оружие
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'secondWeapon'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Специальное оружие
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'specialWeapon'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Боеприпасы
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'weaponMags'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Еда / Напитки
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'food'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Одежда / Рюкзаки
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'clothesBackpacks'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>



            <ul class="textcategory">
              - Другое
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'another'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

            <ul class="textcategory">
              - Инструменты
              <div v-for="(it, index) in inventory">
                <div v-if="it.name">
                  <div v-if="it.itemId == 'tools'">
                    <li @:click="activeItemIndex = index; sizeDrop = it.itsize"
                      :class="{ 'visibleactive': index === activeItemIndex }" @click.right="useItem(index)">
                      <p class="textitem">{{ it.name.replace(/[-_]/g, ' ') }} [{{ it.itsize }}]</p>
                    </li>
                  </div>
                </div>
              </div>
            </ul>

          </ul>
        </div>
      </div>
      <p class="slots right62">Слоты: {{ sizeInventory - 1 }}/{{ maxSlot }}</p>
    </div>

  </div>
</template>

<style scoped>
.unselectable {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                                  not supported by any browser */
}

* {
  box-sizing: border-box;
}

.opisanie {
  position: absolute;
  margin-left: 31.7vw;
  margin-top: 12vh;
  width: 8.3vw;
  height: 4vh;
  font-size: 0.8em;
  color: rgb(228, 228, 228);
  font-family: Tahoma, Geneva, Verdana, sans-serif;
}

.slot1 {
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  height: 400px;
  width: 75px;
  color: white;
  border: 1px solid black;
  cursor: pointer;

  position: absolute;
  margin-left: 26vw;
  margin-top: 0.1vh;
  width: 4vw;
  height: 4vh;
}

.slot2 {
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  height: 400px;
  width: 75px;
  color: white;
  border: 1px solid black;
  cursor: pointer;
  position: absolute;
  margin-left: 32.6vw;
  margin-top: 0.1vh;
  width: 4vw;
  height: 4vh;
}

.slot3 {
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  height: 400px;
  width: 75px;
  color: white;
  border: 1px solid black;
  cursor: pointer;
  position: absolute;
  margin-left: 39.5vw;
  margin-top: 0.1vh;
  width: 4vw;
  height: 4vh;
}

.showtent {
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  height: 400px;
  width: 75px;
  color: white;
  border: 1px solid black;
  cursor: pointer;

  position: absolute;
  margin-left: -17.9vw;
  margin-top: 6vh;
  width: 3.3vw;
  height: 4vh;
  color: rgb(255, 0, 0);
}

.formpick {
  position: absolute;
  margin-left: 24.15vw;
  margin-top: 49vh;
}

.formdrop {
  position: absolute;
  margin-left: 42vw;
  margin-top: 49vh;
}

.sizepickdrop {
  width: 3.34vw;
  height: 6vh;
  font-size: 1.5em;
  appearance: none;
  outline: none;
  border: none;
  box-shadow: none;
  padding: auto;
}

li {
  cursor: pointer;
  padding: 5px 5px 5px 5px;
}

/* li:active .textitem {
  border-radius: 2px;
  background-color: rgba(108, 105, 145, 0.6);
  cursor: pointer;
} */
ul {
  z-index: 1;
}

.visibleactive p {
  z-index: 0;
  border-radius: 1px;
  background-color: rgba(62, 76, 150, 0.5);
}

.errorClass {
  border-radius: 2px;
  background-color: rgba(255, 0, 0, 1);
  color: red;
}

body {
  background-color: transparent;
}

.slots {
  position: fixed;
  color: white;
  text-align: center;
  bottom: 7%;
  left: 20%;
  font-size: 12px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.right62 {
  left: 62%;
}

.btnstyle {
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  height: 400px;
  width: 75px;
  color: white;
  border: 1px solid black;
  cursor: pointer;
}

.btnstyle:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.btnstyle:active {
  background-color: rgba(0, 0, 0, 0.9);
}

button:focus {
  outline: none;
}

.leftbtn {
  margin: 8% 20% 0% 0%;
}

.rightbtn {
  margin: 8% 0% 0% 0%;
}

.container {
  margin: 18% 20% 0% 20%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  height: 100%;
  border-radius: 2px;
  border: 1px solid grey;
}

.whitehr {
  background-color: white;
  font-size: 1px;
  border: none;
  height: 1px;
}

.lefthr {
  position: relative;
  right: 11%;
}

.rightcontainer .right .list .blackbackground li {
  list-style-type: none;
  margin-left: 1%;
}

.leftcontainer .left .list .blackbackground li {
  list-style-type: none;
  margin-right: 5%;
}

overflow-y {
  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(0, 0, 0, 0.5);
}

/* Create two equal columns that floats next to each other */
.leftcontainer {
  overflow-y: auto;
  float: left;
  width: 29%;
  padding: 10px;
  height: 550px;
  /* Should be removed. Only for demonstration */
  background-color: rgba(10, 10, 10, 0.952);
  margin: 3% 0% 3% 6%;
  border-radius: 2px;
  border: 1px solid black;
}

.rightcontainer {
  overflow-y: auto;
  float: right;
  margin-right: 10%;
  width: 29%;
  padding: 10px;
  height: 550px;
  /* Should be removed. Only for demonstration */
  background-color: rgba(10, 10, 10, 0.952);
  margin: 3% 6% 3% 0%;
  border-radius: 2px;
  border: 1px solid black;
}

.text {
  text-align: center;
  color: rgb(218, 218, 217);
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 12px;
}

.textcategory {
  margin-left: -29%;
  color: rgb(218, 218, 217);
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 11px;
}

.textitem {
  margin: 0px 0px 0px 2%;
  color: rgb(255, 240, 245);
  /* Цвет розового белого */


  font-size: 8px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}


/* Вертикальный скроллбар */
::-webkit-scrollbar {
  width: 0.7vw;
  /* Ширина скроллбара в процентах от ширины экрана */
}

/* Фон скроллбара */
::-webkit-scrollbar-track {
  background: rgb(218, 218, 217);
  /* Цвет фона дорожки скроллбара */
  border-radius: 1vw;
  /* Закругленные углы дорожки */
}

/* Ползунок скроллбара */
::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Цвет ползунка */
  border-radius: 1vw;
  /* Закругленные углы ползунка */
  border: 0.1vw solid #f0f0f0;
  /* Отступы и цвет фона вокруг ползунка */
}

/* Ползунок при наведении */
::-webkit-scrollbar-thumb:hover {
  background-color: #555;

  /* Более темный цвет при наведении */
}

/* Горизонтальный скроллбар (если требуется) */
::-webkit-scrollbar-horizontal {
  height: 0.5vh;
  /* Высота горизонтального скроллбара в процентах от высоты экрана */
}

::-webkit-scrollbar-track-horizontal {
  background: #f0f0f0;
  border-radius: 1vh;
}

::-webkit-scrollbar-thumb-horizontal {
  background-color: #888;
  border-radius: 1vh;
  border: 0.1vh solid #f0f0f0;
}

::-webkit-scrollbar-thumb-horizontal:hover {
  background-color: #555;
}

@media (max-width: 3840px) {
  .opisanie {
    margin-left: 35vw;
  }

  .slot1 {
    margin-left: 29vw;
    font-size: 17px;
  }

  .slot2 {
    margin-left: 36vw;
    font-size: 17px;
  }

  .slot3 {
    margin-left: 43vw;
    font-size: 17px;
  }

  .showtent {
    width: 2.2vw;
    margin-left: -20.4vw;
  }

  .formpick {
    margin-top: 46.4vh;
    margin-left: 26.5vw;
  }

  .formdrop {
    margin-top: 46.4vh;
    margin-left: 45.8vw;
  }

  .sizepickdrop {}

  .slots {
    bottom: 13%;
    margin: 19.5% 0% 0% 7%;
    font-size: 23px;
  }

  .leftcontainer {
    height: 1050px;
  }

  .rightcontainer {
    height: 1050px;
  }

  .text {
    font-size: 21px;
  }

  .textcategory {
    font-size: 20px;
    margin-left: -8%;
  }

  .textitem {
    margin: 1px 0px 0px 3%;
    font-size: 21px;
    font-weight: normal;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  .li {
    margin: 0% 0% 0% 0%;
  }

  .btnstyle {
    height: 750px;
    width: 85px;
  }

  .rightbtn {
    margin: 8% 0% 0% 0%;
  }

  .leftbtn {
    margin: 8% 24% 0% 0%;
  }

  .container {
    margin: 18% 12% 0% 12%;
  }
}

@media (max-width: 3820px) {
  .slots {
    bottom: 7%;
  }
}


@media (max-width: 2560px) {
  .opisanie {
    margin-left: 31.7vw;
  }

  .slot1 {
    margin-left: 26vw;
    margin-top: 0.1vh;
    font-size: 11px;
  }

  .slot2 {
    margin-left: 32.6vw;
    margin-top: 0.1vh;
    font-size: 11px;
  }

  .slot3 {
    margin-left: 39.5vw;
    margin-top: 0.1vh;
    font-size: 11px;
  }

  .showtent {
    width: 3.3vw;
    margin-left: -17.9vw;
  }

  .formpick {
    margin-left: 24.15vw;
    margin-top: 49.6vh;
  }

  .formdrop {
    margin-left: 42vw;
    margin-top: 49.6vh;
  }

  .sizepickdrop {}


  .slots {
    bottom: 8.6%;
    margin: 19% 0% 0% 7%;
    font-size: 15px;
  }

  .leftcontainer {
    height: 750px;
  }

  .rightcontainer {
    height: 750px;
  }

  .text {
    font-size: 17px;
  }

  .textcategory {
    font-size: 16px;
    margin-left: -18%;
  }

  .textitem {
    margin: 0px 0px 0px 3%;
    font-size: 16px;
    font-weight: normal;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  .btnstyle {
    height: 550px;
  }

  .rightbtn {
    margin: 8% 0% 0% 0%;
  }

  .leftbtn {
    margin: 8% 21% 0% 0%;
  }

  .container {
    margin: 18% 15% 0% 15%;
  }
}


@media (max-width: 2048px) {
  .opisanie {
    margin-left: 31.7vw;
  }

  .slot1 {
    margin-left: 26vw;
    margin-top: 0.1vh;
    font-size: 9px;
  }

  .slot2 {
    margin-left: 32.6vw;
    margin-top: 0.1vh;
    font-size: 9px;
  }

  .slot3 {
    margin-left: 39.5vw;
    margin-top: 0.1vh;
    font-size: 9px;
  }

  .showtent {
    width: 3.4vw;
    margin-left: -18vw;
  }

  .formpick {
    margin-left: 24.15vw;
    margin-top: 45.6vh;
  }

  .formdrop {
    margin-left: 42vw;
    margin-top: 45.6vh;
  }

  .sizepickdrop {}


  .slots {
    bottom: 22%;
    font-size: 15px;
  }

  .btnstyle {
    height: 550px;
    width: 70px;
  }

  .rightbtn {
    margin-top: 11%;
  }

  .leftbtn {
    margin-top: 11%;
  }
}

@media (max-width: 1920px) {

  .opisanie {
    margin-left: 29vw;
    font-size: 0.7em;
  }

  .slot1 {
    margin-left: 24vw;
    margin-top: 0.1vh;
    font-size: 8px;
  }

  .slot2 {
    margin-left: 31vw;
    margin-top: 0.1vh;
    font-size: 8px;
  }

  .slot3 {
    margin-left: 38vw;
    margin-top: 0.1vh;
    font-size: 8px;
  }

  .showtent {
    width: 3.12vw;
    margin-left: -16.25vw;
    font-size: 10px;
  }

  .formpick {
    margin-left: 22.95vw;
    margin-top: 53vh;
  }

  .formdrop {
    margin-left: 39.3vw;
    margin-top: 53vh;
  }

  .sizepickdrop {
    width: 3.1vw;
  }

  .slots {
    bottom: 13%;
    margin: 18% 0% 0% 7%;
    font-size: 14px;
  }

  .leftcontainer {
    height: 600px;
  }

  .rightcontainer {
    height: 600px;
  }

  .text {
    font-size: 15px;
  }

  .textcategory {
    margin-left: -28%;
    font-size: 14px;
  }

  .textitem {
    font-size: 14px;
  }

  .btnstyle {
    height: 460px;
  }

  .rightbtn {
    margin: 8.6% 0% 0% 0%;
  }

  .leftbtn {
    margin: 8.6% 20% 0% 0%;
  }

  .btnstyle {
    width: 60px;
  }

  .container {
    margin: 14% 17% 0% 17%;
  }
}

@media (max-width: 1680px) {

  .opisanie {
    margin-left: 32vw;
    font-size: 0.7em;
  }

  .slot1 {
    margin-left: 26.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .slot2 {
    margin-left: 33.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .slot3 {
    margin-left: 40.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .showtent {
    width: 3.2vw;
    margin-left: -17.8vw;
    font-size: 10px;
  }

  .formpick {
    margin-left: 25vw;
    margin-top: 54.3vh;
  }

  .formdrop {
    margin-left: 43.1vw;
    margin-top: 54.3vh;
  }

  .sizepickdrop {
    width: 3.1vw;
  }

  .slots {
    bottom: 8%;
    margin: 22.2% 0% 0% 7%;
    font-size: 14px;
  }

  .leftcontainer {
    height: 600px;
  }

  .rightcontainer {
    height: 600px;
  }

  .text {
    font-size: 14px;
  }

  .textcategory {
    font-size: 13px;
    margin-left: -30%;
  }

  .textitem {
    font-size: 13px;
    margin-left: 2%;
  }

  .btnstyle {
    height: 420px;
  }

  .rightbtn {
    margin: 9% 0% 0% 0%;
  }

  .leftbtn {
    margin: 9% 20.2% 0% 0%;
  }

  .btnstyle {
    width: 55px;
  }

  .container {
    margin: 18% 14% 0% 14%;
  }
}

@media (max-width: 1600px) {

  .opisanie {
    margin-left: 32vw;
    font-size: 0.7em;
  }

  .slot1 {
    margin-left: 26.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .slot2 {
    margin-left: 33.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .slot3 {
    margin-left: 40.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .showtent {
    width: 3.2vw;
    margin-left: -18.1vw;
    font-size: 10px;
  }

  .formpick {
    margin-left: 24.8vw;
    margin-top: 53.3vh;
  }

  .formdrop {
    margin-left: 43.1vw;
    margin-top: 53.3vh;
  }

  .sizepickdrop {
    width: 3.1vw;
  }

  .slots {
    bottom: 8%;
    margin: 22.2% 0% 0% 7%;
    font-size: 13px;
  }

  .leftcontainer {
    height: 500px;
  }

  .rightcontainer {
    height: 500px;
  }

  .text {
    font-size: 13px;
  }

  .textcategory {
    font-size: 12px;
    margin-left: -31%;
  }

  .textitem {
    font-size: 12px;
    margin-left: 2%;
  }

  .btnstyle {
    height: 370px;
  }

  .rightbtn {
    margin: 8% 0% 0% 0%;
  }

  .leftbtn {
    margin: 8% 21% 0% 0%;
  }

  .btnstyle {
    width: 50px;
  }

  .container {
    margin: 18% 14% 0% 14%;
  }
}

@media (max-width: 1440px) {
  .slots {
    bottom: 5%;
    margin: 23% 0% 0% 7%;
  }

  .btnstyle {
    width: 45px;
  }

  .leftcontainer {
    height: 550px;
    width: 34%;
  }

  .rightcontainer {
    height: 550px;
    width: 34%;
  }

  .text {
    font-size: 13px;
  }

  .textcategory {
    font-size: 12px;
    margin-left: -35%;
  }

  .textitem {
    font-size: 12px;
    margin-left: 2%;
  }

  .container {
    margin: 18% 13% 0% 13%;
  }
}

@media (max-width: 1368px) {
  .opisanie {
    margin-left: 33.5vw;
    font-size: 0.7em;
  }

  .slot1 {
    margin-left: 26.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .slot2 {
    margin-left: 33.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .slot3 {
    margin-left: 40.5vw;
    margin-top: 0.1vh;
    font-size: 7px;
  }

  .showtent {
    width: 3vw;
    margin-left: -11.8vw;
    font-size: 8px;
  }

  .formpick {
    margin-left: 29.2vw;
    margin-top: 55.9vh;
  }

  .formdrop {
    margin-left: 40.65vw;
    margin-top: 55.9vh;
  }

  .sizepickdrop {
    width: 3.1vw;
  }

  .slots {
    bottom: 4%;
    margin: 18.5% 0% 0% 7%;
    font-size: 8px;
  }

  .btnstyle {
    height: 340px;
    width: 40px;
  }

  .leftcontainer {
    height: 450px;
    width: 34%;
  }

  .rightcontainer {
    height: 450px;
    width: 34%;
  }

  .text {
    font-size: 8px;
  }

  .textcategory {
    font-size: 11px;
    margin-left: -28%;
  }

  .textitem {
    font-size: 11px;
    margin-left: 2%;
  }

  .container {
    margin: 11% 15% 0% 15%;
  }

  .rightbtn {
    margin: 8% 0% 0% 0%;
  }

  .leftbtn {
    margin: 8% 12% 0% 0%;
  }

  .container {
    margin: 18% 13% 0% 13%;
  }
}

@media (max-width: 1024px) {
  .slots {
    margin: 23% 0% 0% 7%;
  }
}
</style>
