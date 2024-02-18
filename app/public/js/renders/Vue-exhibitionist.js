
document.addEventListener('DOMContentLoaded', () => {

    new Vue({
        el: '#app',
        data: {
            rooms:6,
            exhibitionists: [],
            filterBy: 'num_users',
            filteredExhibitionists: [],
            sortOrder: 'desc',
            visitedUsers: [], // Lista para almacenar los nombres de usuario visitados 
            isLoading: false,
            selectedInterval: 5,
            selectedCloseWin: 120, // 2 minutos
            finalCounter: 0,
        },
        mounted() {
            this.loadExhibitionists();
        },
        methods: {
            async loadExhibitionists() {                      
                const limit = this.rooms;
                let url = `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=gQ4iQ&client_ip=request_ip&exhibitionist=true&limit=${limit}`;
                const response = await fetch(url);
                const data = await response.json();
                this.exhibitionists = data.results;
                this.filteredExhibitionists = this.exhibitionists.map(exhibitionist => ({
                    ...exhibitionist,
                    showProgress: false,
                    progress: 0
                }));
                this.filteredExhibitionists.sort((b, a) => a.num_users - b.num_users);                       
            },
            async submitForm() {                    
                this.applyFilters();
            },
            applyFilters() {                        
                switch (this.filterBy) {                            
                    case 'num_users':
                        this.filteredExhibitionists.sort((a, b) => (this.sortOrder === 'asc' ? a.num_users - b.num_users : b.num_users - a.num_users));
                        break;
                    case 'num_followers':
                        this.filteredExhibitionists.sort((a, b) => (this.sortOrder === 'asc' ? a.num_followers - b.num_followers : b.num_followers - a.num_followers));
                        break;
                    case 'seconds_online':
                        this.filteredExhibitionists.sort((a, b) => (this.sortOrder === 'asc' ? a.seconds_online - b.seconds_online : b.seconds_online - a.seconds_online));
                        break;
                    default:
                        break;
                }
            },     
           
            startTraffic() {
                console.log('StartTraffic');
                this.visitedUsers = [];
                let index = 0;
                this.isLoading = true;
                const intervalId = setInterval(() => {
                    if (index < this.filteredExhibitionists.length) {
                        const exhibitionist = this.filteredExhibitionists[index];
                        let progress = 0;
                        exhibitionist.progress = 0;
                        exhibitionist.showProgress = true;
                        const progressInterval = setInterval(() => {
                            if (progress < 100) {
                                exhibitionist.progress = progress;
                                progress += 1;
                            } else {
                                exhibitionist.progress = 100;
                                this.finalCounter += 1; // Incrementar finalCounter correctamente
                                clearInterval(progressInterval);
                                setTimeout(() => {
                                    exhibitionist.showProgress = false;
                                    //console.log(`Exhibitionist ${exhibitionist.username} finished.`);
                                    window.PlaycamAPI.OpenWinRoom(exhibitionist.username, this.selectedCloseWin);
                                    this.visitedUsers.push(exhibitionist.username);

                                }, 1000);
                            }
                        }, this.selectedInterval * 10);
                        index++;
                    } else {
                        clearInterval(intervalId);
                        this.isLoading = false;
                        this.finalCounter = -1;
                    }
                }, this.selectedInterval * 1000);
            },               
            convertToSeconds(value) {
                return value * 60;
            },

            getUserImage(username) {
                const exhibitionist = this.filteredExhibitionists.find(exhibitionist => exhibitionist.username === username);
                return exhibitionist ? exhibitionist.image_url : ''; 
            },                                                                  
                     
            calculateTime(seconds) {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const remainingSeconds = seconds % 60;
                return `${hours} Hrs, ${minutes} Min, ${remainingSeconds} seconds`;
            },
            OpenCB(){
                console.log("Se hizo clic en el botón de inicio de sesión.");
                window.PlaycamAPI.OpenWinCB();
            }
        }
    });
});