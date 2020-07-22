//Возможно не понадобится
export default {
  data() {
    return {
      key: 'technicalPlaceId',
      iterationCycle: null,
      id: null,
      mixin_items: null,
      response: null,
    }
  },
  methods: {
    getItems(items, id, iterationCycle){
      this.id = id;
      this.iterationCycle = iterationCycle;
      this.mixin_items = items;

      this.recursion(items);

      return this.response;
    },
    recursion(items, iterationCycleCount = 0, nesting = []) {
      items.forEach((value, key) => {

        nesting[iterationCycleCount] = key;

        if(value[this.key] === this.id){
          let response = null;

          for(let i = 0; i < 3; i++){
            if(nesting[i] !== undefined && nesting[i] !== null){
              if(response === null) response = this.mixin_items[nesting[i]];

              //TODO обязательно переделать это
              switch (i) {
                case 0: response[this.iterationCycle[i]] = [response[this.iterationCycle[i]][nesting[i]]]; break;
                case 1:
                  response[this.iterationCycle[i - 1]][0][this.iterationCycle[i]] =
                    [[response[this.iterationCycle[i - 1]][0][this.iterationCycle[i]]][0][nesting[i]]]; break;
              }

            }
          }

          this.response = [response];
        }

        const nextTickItems = value[this.iterationCycle[iterationCycleCount]];
        if(nextTickItems) this.recursion(nextTickItems, iterationCycleCount + 1, nesting)
      })
    },
  }
}
