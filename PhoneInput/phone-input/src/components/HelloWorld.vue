<template>
  <div>
    <PhoneInput />
  </div>
</template>

<script>

import PhoneInput from '@/components/PhoneInput'

export default {
  name: 'HelloWorld',
  components: {
    PhoneInput
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }

}
</script>
