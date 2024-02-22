//vue-guests.js
document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        data: {
            limit_top_stat_guest : 100,
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
            nick: 'shine_chanel',
            ghost: 0,
            ghost_limit: 200,
            ghost_confirm: false,
            stripchatModels: [],
            botStatsResults: [] // Datos de los bots obtenidos de la API
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
            },
            formatNumber(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            fetchBotStatsChatur() {
                console.log('fetchBotStatsChatur');
                fetch(`https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=gQ4iQ&client_ip=request_ip&limit=${this.limit_top_stat_guest}`)
                    .then(response => response.json())
                    .then(data => {
                       this.botStatsResults = [];
                        this.botStatsResults = data.results;
                        this.botStatsResults.sort((a, b) => b.num_users - a.num_users);
                        /*
                            data.results.forEach(result => {
                                this.botStatsResults.push(result);
                                console.log('Username:', result.username);
                            // console.log('Number of users:', result.num_users);
                            });
                            */
                        // this.$forceUpdate();
                    })
                    .catch(error => {
                        console.error('Error fetching bot stats:', error);
                    });
            },
            getBotStripchat() {
                fetch(`https://go.rmhfrtnd.com/api/models?limit=${this.limit_top_stat_guest}`)
                    .then(response => response.json())
                    .then(data => {
                        this.stripchatModels = data.models;
                        this.stripchatModels.sort((a, b) => b.viewersCount - a.viewersCount);
                    })
                    .catch(error => {
                        console.error('Error fetching Stripchat models:', error);
                    });
            },
            openPlayer(url, mobil) {          
                window.PlaycamAPI.OpenPlayerStripchat(url, mobil);
              },
        
            openPlayerChaturbate(nick){
                window.PlaycamAPI.openPlayerChaturbate(nick);
            },

        },
        watch: {
            idcam(newVal) {
                if (newVal === 'chaturbate') {
                    this.fetchBotStatsChatur();
                } else if (newVal === 'stripchat') {
                    this.getBotStripchat();
                }
            },
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
            //this.fetchBotStats();
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

    const botStatsTopButton = document.getElementById('botStatsTop');
    botStatsTopButton.addEventListener('click', () => {
         app.fetchBotStatsChatur(); // 
    });


});
