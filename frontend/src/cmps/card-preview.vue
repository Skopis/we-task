<template>
    <section class="card-preview">
        <p>{{ card.title }}</p>

        <button @click="openEditModal">✎</button>
        <card-edit v-if="isEditModalOpen" @save="saveCard" :card="card"/>

        <div v-for="member in card.members" :key="member._id" :v-if="card.members">
            <img :src="member.imgUrl" alt="member-img" @click="openMemberModal">
            <member-preview v-if="isMemberModalOpen" @removeMemberFromCard="removeMemberFromCard"/>
        </div>
        <div class="btn-container">
            <button>👁</button><!-- v-if logged in member = member assigned to card-->
            <button v-if="card.comments">🗨 {{ card.comments.length }}</button>
        </div>
    </section>
</template>

<script>
import cardEdit from './card-edit.vue'
import memberPreview from './member-preview.vue'

export default {
    name: 'card-preview',
    props: ['card'],
    data() {
        return {
            isEditModalOpen: false,
            isMemberModalOpen: false,
            // card: {
                //         "id": "c104",
            //         "title": "Help me",
            //         "description": "description",
            //         "comments": [
                //             {
                    //                 "id": "ZdPnm",
            //                 "txt": "also @yaronb please CR this",
            //                 "createdAt": 1590999817436.0,
            //                 "byMember": {
                //                     "_id": "u101",
            //                     "fullname": "Tal Tarablus",
            //                     "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
            //                 }
            //             }
            //         ]
            // }
        }
    },
    //TODO: when click on window anywhere but the modal - modal closes
    methods:{//dispatch or another emit? is this a smart or dumb component?
        openMemberModal(){
            this.isMemberModalOpen = true
        },
        openEditModal(){
            this.isEditModalOpen = true
        },
        saveCard(cardToSave){
            this.isEditModalOpen = false
        },
        removeMemberFromCard(member){
            
        }
    },
    components: { 
        cardEdit,
        memberPreview
        },
}
</script>
