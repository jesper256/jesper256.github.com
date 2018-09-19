<template>
  <div class="phone-input">
    <div class="current-flag">
      <select id="country-select" v-model="currentCountryId">
        <option
          v-for="option in options"
          :value="option.id"
          :key="option.id"
        >
          <span class="flag" :class="option.id"></span>
          {{ option.code }}
        </option>
      </select>
      <div class="select-overlay">
        <div class="flag" :class="currentCountry.id"></div>
        {{ currentCountry.code }}
      </div>
    </div>

    <input type="text" @change="inputChanged" @keyup="inputChanged" />
  </div>
</template>

<script>
export default {
  data(){
    return {
      currentCountryId: 'se',
      options: [{ code: '+46', id: 'se' }, { code: '+45', id: 'dk' }]
    }
  },
  computed:{
    currentCountry(){
      return this.options.find(x => x.id === this.currentCountryId)
    }
  },
  methods:{
    inputChanged(event){
      let option = this.options.find(x => event.target.value.startsWith(x.code))

      if(option)
        this.currentCountryId = option.id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/phone-input/flags.css';

.phone-input{
    display: inline-flex;
    border: 1px solid #000;
    position: relative;
    height: 30px;

    select{
        opacity: 0;
        min-width: 40px;
        height: 30px;
        width: 100%;
    }

    input{
        border: none;
        border-left: 1px solid #000;
        padding: 5px 7px;
    }

    .current-flag{
      min-width: 65px;
      position: relative;

      .select-overlay{
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
        padding: 0 5px;
      }
    }
}
</style>

