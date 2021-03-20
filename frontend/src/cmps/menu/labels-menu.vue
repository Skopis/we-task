<template>
  <div class="task-lable-menu">
  <header>
  Labels
  <button class="btn" >+</button>
  </header>
    <div class="label green" @click="addLabel('green')">klafb <button>X</button></div>
    <div class="label yellow" @click="addLabel('yellow')" >klafb <button>X</button></div>
    <div class="label orange" @click="addLabel('orange')"> <button>X</button></div>
    <div class="label red" @click="addLabel('red')">klafb <button>X</button></div>
    <div class="label purple" @click="addLabel('purple')"><button>X</button></div>
    <div class="label blue" @click="addLabel('blue')"><button>X</button></div>
  </div>
</template>

<script>
export default {
methods:{
    addLabel(color){  
        const lable = {title:'', color}
        this.$emit('setLabel', lable)
          
    }
}

}
</script>

<style>

</style>