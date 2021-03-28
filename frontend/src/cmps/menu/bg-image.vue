<template>
    <section class="bg-image flex">
        <div>
            <div class="img-container">
                <img src="../../assets/Pictures/bg/ani.jpg" alt=""  @click="chooseBg($event)">
            </div>
            <div class="img-container">
                <img src="../../assets/Pictures/bg/ast.jpg" alt=""  @click="chooseBg($event)">
            </div>
            <div class="img-container">
                <img src="../../assets/Pictures/bg/dan.jpg" alt="" @click="chooseBg($event)">
            </div>
        </div>
        <div>
            <div class="img-container">
                <img src="../../assets/Pictures/bg/fog.jpg" alt="" @click="chooseBg($event)">
            </div>
            <div class="img-container">
                <img src="../../assets/Pictures/bg/rou.jpg" alt="" @click="chooseBg($event)">
            </div>
            <div class="img-container">
                <img src="../../assets/Pictures/bg/sea.jpg" alt="" @click="chooseBg($event)">
            </div>
        </div>
    </section>
</template>

<script>

export default{
    name: 'bg-image',
    methods:{
        chooseBg(ev){
            var fullPath = ev.path[0].src.toString()
            const shortPath = fullPath.substring(fullPath.length-16, fullPath.length)
            this.$emit('setImageAsBg', shortPath)
        }
    }
}
</script>
