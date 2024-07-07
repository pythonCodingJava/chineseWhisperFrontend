export const processTime = (date1, date2)=>{
    const o = {
     years : date1.getFullYear() - date2.getFullYear(),
     months : date1.getMonth() - date2.getMonth(),
     days : date1.getDate() - date2.getDate(),
     hours : date1.getHours() - date2.getHours(),
     minutes : date1.getMinutes() - date2.getMinutes(),
     seconds : date1.getSeconds() - date2.getSeconds(),}

    for(const prop in o){
        if(o[prop]){
            return `${o[prop]} ${prop} ago`
        }
    }

    return '1 seconds ago'
}