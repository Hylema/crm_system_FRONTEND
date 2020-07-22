export default {
  data(){
    return {
      url: this.$route.name,
      key: 'technicalPlaceId',

      header: {
        routes: [
          {
            text: 'id',
            align: 'center',
            value: 'id'
          },
          {
            text: 'description',
            align: 'center',
            value: 'description'
          },
          {
            text: 'personnelId',
            align: 'center',
            value: 'personnelId'
          },
          {
            text: 'factoryLocationId',
            align: 'center',
            value: 'factoryLocationId'
          },
          {
            text: 'workCenterId',
            align: 'center',
            value: 'workCenterId'
          },
          {
            text: 'technicalPlaceId',
            align: 'center',
            value: 'technicalPlaceId'
          },
          {
            text: 'measureRequired',
            align: 'center',
            value: 'measureRequired'
          },
        ],
        orders: [
          {
            text: 'reservationId',
            align: 'center',
            value: 'reservationId'
          },
          {
            text: 'reservationPositionId',
            align: 'center',
            value: 'reservationPositionId'
          },
          {
            text: 'name',
            align: 'center',
            value: 'name'
          },
          {
            text: 'available',
            align: 'center',
            value: 'available'
          },
          {
            text: 'unit',
            align: 'center',
            value: 'unit'
          },
        ]
      }
    }
  },
  computed: {
    ['$_data']: {
      get () {
        return {
          items: this.getItems(),
          key: this.getKey(),
          header: this.getHeader(),
        };
      },
    },
    urlId() {
      return this.$route.params.id;
    },
  },
  methods: {
    getItems(){
      const items = this.$store.getters[`data/${ this.url }`](this.urlId);

      if(items) return items;
      else this.$_snackbar({
        type: 'warning',
        text: 'По вашему запросу ничего не найдено'
      });

      return []
    },
    getKey(){
      switch (this.url) {
        case 'routes': return 'subOperations';
        case 'orders': return 'components';
      }
    },
    getHeader(){
      return this.header[this.url];
    }
  }
}
