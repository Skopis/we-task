<template>
    <section class="board-preview-menu">
    <header>
        <p>Actions</p>
    </header>
    <div class="menu-content"  @click.stop="archiveBoard">
        <button class="btn" @click.stop="archiveBoard">Delete</button>
    </div>
    </section>
</template>

<script>
import Swal from 'sweetalert2'
export default {
    name: "board-preview-menu",
    props: ["board"],
    methods: {
        archiveBoard() {
            Swal.fire({
                title: "Are you sure?",
                text: "",
                // icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, keep it",
            }).then((result) => {
            if (result.value) {
                this.$emit("archiveBoard", this.board);
                Swal.fire(
                "Deleted!",
                "Your Board has been deleted",
                "success"
            );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Your Board is Safe!");
                return
            }
            });
        },
    },
};
</script>