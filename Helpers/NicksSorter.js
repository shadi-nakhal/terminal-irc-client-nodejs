
let chars = '@%&+_.()#`\'^-=01234567989abcdefghijklmnopqrstuvwxyz'
function NickSorter(list){
    let array = list.map(obj => {
        if(obj.prefix){
            let prefix = obj.prefix.sort((a, b) => method(a,b))[0]
            return prefix+obj.nickname
        } return obj.nickname
    })
        function method(a,b){
            a = a.toLowerCase()
            b = b.toLowerCase()
            let index_a = chars.indexOf(a[0])
            let index_b = chars.indexOf(b[0])
            if(index_a === index_b){
                if(a < b) return -1
                if(a > b) return 1
                return 0
            }
            return index_a - index_b;
        }
    return array.sort((arr_a,arr_b) => method(arr_a,arr_b)).join("\n")
}


module.exports = { NickSorter }