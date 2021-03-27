<template>
    <section class="bg-image">
        <div class="img-container">
            <img src="../../assets/Pictures/bg/ani.jpg" alt=""  @click="chooseBg($event)">
        </div>
        <div class="img-container">
            <img src="../../assets/Pictures/bg/ast.jpg" alt=""  @click="chooseBg($event)">
        </div>
        <div class="img-container">
            <img src="../../assets/Pictures/bg/dan.jpg" alt="" @click="chooseBg($event)">
        </div>
        <div class="img-container">
            <img src="../../assets/Pictures/bg/fog.jpg" alt="" @click="chooseBg($event)">
        </div>
        <div class="img-container">
            <img src="../../assets/Pictures/bg/rou.jpg" alt="" @click="chooseBg($event)">
        </div>
        <div class="img-container">
            <img src="../../assets/Pictures/bg/sea.jpg" alt="" @click="chooseBg($event)">
        </div>
    </section>
</template>

<script>

export default{
    name: 'bg-image',
    methods:{
        chooseBg(ev){
            // http://localhost:8080/img/dan.f32d1a80.jpg
            var fullPath = ev.path[0].src.toString()
            const shortPath = fullPath.substring(fullPath.length-16, fullPath.length)
            // const format = shortPath.substring(shortPath.length-4, shortPath.length)
            // const photoName = shortPath.substring(shortPath.length-16, shortPath.length-13)
            // const photoPath = photoName + format
            console.log('shortPath ', shortPath)
            this.$emit('setImageAsBg', shortPath)
        }
    }
}
</script>
