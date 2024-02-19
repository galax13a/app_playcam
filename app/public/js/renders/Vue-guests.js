//vue-guests.js
document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        data: {
            guests: 100,
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
            nick : 'shine_chanel',
            ghost : 0,
            ghost_limit : 200,
            ghost_confirm : false,
        },
        methods: {
            handleSubmit() {
                // Lógica para manejar el envío del formulario
                console.log('Submit handleSubmit');
            },
            getGuestIconClass(index) {  
                return index === this.visitedUsers.length - 1 ? 'bx bxs-ghost bx-fade-right text-warning' : 'bx bxs-ghost';
            },
            handleGuestsChange() {
                // Si se selecciona la opción de bots ilimitados, establecer el valor de ilimitValue en 10000
                if (this.guests === 'ilimit') {
                    this.ilimitValue = 100;
                } else {
                    this.ilimitValue = 0;
                }
            },

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
                            console.log(`Visited Nick ${this.nick} -  ${this.visitedUsers.length}`);
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
