<template>
  <div class="about">
    <h1>This is an about page. Login: {{ appData.isLogin }}</h1>
    <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
    </select>
  </div>
  </div>
</template>

<script>

import appData from '../modules/appData';

export default {
  name: 'Home',
  data: () => ({ 
    langs: ['iw', 'en'],
    appData
  })
}
</script>
