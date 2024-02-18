document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        data: {
            guests: 3,
            isLoading: false,
            selectedInterval: 3,
            selectedCloseWin: 600,
            startTraffic: false,
            visitedUsers: [],
            num_guests: 1 // Variable para mantener el número consecutivo de invitados
        },
        methods: {
            handleSubmit() {
                // Lógica para manejar el envío del formulario
            }
        },
        watch: {
            guests(newVal) {
                if (newVal === '3' || newVal === '5' || newVal === '10') {
                    // Lógica para manejar la selección de 3, 5 o 10 invitados
                    this.visitedUsers = [];
                    this.num_guests = newVal;
                    for (let i = 0; i < parseInt(newVal); i++) {
                        this.visitedUsers.push(`Bot ${this.num_guests}`);
                       // this.num_guests++; // Incrementar el número consecutivo de invitados
                    }
                }
            }
        },
        mounted() {
            // Cargar las primeras 3 invitados por defecto
            for (let i = 0; i < this.guests; i++) {
                this.visitedUsers.push(`Bot ${this.num_guests}`);
                this.num_guests++; // Incrementar el número consecutivo de invitados
            }
        }
    });
});
