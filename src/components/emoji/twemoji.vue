<template>
  <twemoji-picker
      :pickerWidth="500"
      v-model="emojiPicker"
      :emojiData="emojiDataAll"
      :emojiGroups="emojiGroups"
      :skinsSelection="true"
      :searchEmojisFeat="true"
      searchEmojiPlaceholder="Поиск"
      searchEmojiNotFound="Не найдено"
      isLoadingLabel="Загрузка"
      @emojiUnicodeAdded="emojiImgAdded"
  >
    <template v-slot:twemoji-picker-button>
      <v-icon @click="emojiPicker = true">mdi-emoticon-happy-outline</v-icon>
    </template>
  </twemoji-picker>
</template>
<script>
import {
  TwemojiPicker
} from '@kevinfaguiar/vue-twemoji-picker';
import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ru/emoji-all-groups.json';
import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
export default {
  name: "twemoji",
  components: {
    'twemoji-picker': TwemojiPicker
  },
  data(){
    return {
      emojiPicker: false
    }
  },
  computed: {
    emojiDataAll() {
      return EmojiAllData;
    },
    emojiGroups() {
      return EmojiGroups;
    },
  },
  methods: {
    emojiImgAdded(emoji){
      this.$emit('emojiAdded', emoji)
    },
  }
}
</script>

<style scoped>

</style>