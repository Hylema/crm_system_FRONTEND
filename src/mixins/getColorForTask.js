export default {
    methods: {
        getColorDate(date){
            const dueDate = new Date(date)

            let currentDate = new Date()
            currentDate = new Date(Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth(),
                currentDate.getDate(),
                currentDate.getUTCHours(),
                currentDate.getUTCMinutes(),
                currentDate.getUTCSeconds())
            )

            if(currentDate > dueDate){
                return 'error'
            } else if(
                currentDate.getUTCFullYear() === dueDate.getUTCFullYear() &&
                currentDate.getUTCMonth() === dueDate.getUTCMonth() &&
                dueDate.getDate() - currentDate.getDate() <= 3
            ){
                return 'warning'
            } else {
                return 'success'
            }
        }
    }
}