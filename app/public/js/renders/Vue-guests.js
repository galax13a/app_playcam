//vue-guests.js
document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        data: {
            guests: 3,
            isLoading: false,
            selectedInterval: 3,
            selectedCloseWin: 600,
            visitedUsers: [],
            num_guests: 1, // Variable para mantener el número consecutivo de invitados
            idcam: 'chaturbate',
            num_traffic_guests: 0, //
            showGhostIcon: true,
            showBurstIcon: false,
            lastProcessedIndex: 0,
        },
        methods: {
            handleSubmit() {
                // Lógica para manejar el envío del formulario
                console.log('Submit handleSubmit');
            },
            getGuestIconClass(index) {
                // Si el índice es igual al último invitado, devolvemos la clase 'bx bxs-ghost bx-fade-right'
                // De lo contrario, devolvemos la clase 'bx bxs-ghost'
                return index === this.visitedUsers.length - 1 ? 'bx bxs-ghost bx-fade-right' : 'bx bxs-ghost';
            }
            
            ,

            startTraffic() {
                this.visitedUsers = [];
                if (!this.isLoading) {
                    this.isLoading = true;
                    let count = 0;
                    const timer = setInterval(() => {
                        if (count < this.guests) {
                            this.visitedUsers.push(`Bot ${this.num_guests}`);
                            this.num_guests++;
                            count++;
                            this.num_traffic_guests++;
                        } else {
                            clearInterval(timer);
                            this.isLoading = false;
                        }
                    }, this.selectedInterval * 1000);
                }
            }
        },
        watch: {
            guests(newVal) {
                if (newVal === '3' || newVal === '5' || newVal === '10') {
                    // Lógica para manejar la selección de 3, 5 o 10 invitados
                    this.visitedUsers = [];
                    this.num_guests = 1;
                    for (let i = 0; i < parseInt(newVal); i++) {
                        this.visitedUsers.push(`Bot ${this.num_guests}`);
                        // this.num_guests++;
                    }
                }
            }
        },
        mounted() {
            // Cargar automáticamente los primeros tres invitados al inicio
            for (let i = 0; i < this.guests; i++) {
                this.visitedUsers.push(`Bot ${this.num_guests}`);
                this.num_guests++;
            }
        }
    });

    const button = document.querySelector("#trafico > button");
    button.addEventListener('click', () => {
        app.startTraffic();
    });
});
